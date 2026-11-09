// Rewrites TOOLS.md from the live servers' tool lists, so the reference always matches what Claude and ChatGPT see.
//   node scripts/tools.mjs
import { writeFileSync } from 'node:fs';

const BASE = 'https://mcp.apptiller.com';
const GROUPS = [
  ['Account and connections', ['list_connections', 'setup_suggestions', 'connect_account', 'list_domains', 'verify_domain', 'app_ownership']],
  ['Apps', ['apps', 'app_map_sources', 'app_store_listing', 'app_performance', 'data_coverage']],
  ['App Store Connect', ['app_store_sales', 'app_store_funnel']],
  ['Ads', ['meta_ad_accounts', 'meta_diagnose', 'meta_performance', 'apple_ads_accounts', 'apple_ads_performance']],
  ['Attribution', ['attribution_setup', 'attribution_performance']],
  ['Revenue (RevenueCat)', ['revenuecat_projects', 'revenuecat_overview', 'revenuecat_revenue', 'revenuecat_chart_options', 'revenuecat_chart']],
  ['Analyst, proposals and changes', ['briefing', 'app_brief', 'set_app_brief', 'set_app_limits', 'apply_proposal', 'undo_change', 'reject_proposal', 'dismiss_finding']],
  ['AI answers', ['ai_visibility_track', 'ai_visibility_set_questions', 'ai_visibility_tracked', 'ai_visibility_run_now', 'ai_visibility_plan', 'ai_visibility_collect', 'ai_visibility_report', 'ai_referrals_setup', 'ai_referrals']],
  ['Website guides', ['site_guides', 'set_site_guides', 'close_site_guide']],
  ['Launches', ['launch_product', 'list_launches', 'check_launch', 'edit_launch', 'launch_ai_answers']],
];

async function list(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  });
  const text = await res.text();
  const json = text.startsWith('{') ? text : text.split('\n').find((l) => l.startsWith('data: ')).slice(6);
  return JSON.parse(json).result.tools;
}

const effect = (a = {}) =>
  a.readOnlyHint ? 'Reads only' : a.destructiveHint ? 'Changes data; can overwrite or remove' : 'Changes data; adds or updates';
const params = (t) => {
  const props = t.inputSchema?.properties ?? {};
  const required = new Set(t.inputSchema?.required ?? []);
  const rows = Object.entries(props).map(([k, v]) => `  - \`${k}\`${required.has(k) ? ' (required)' : ''}${v.description ? `: ${v.description}` : ''}`);
  return rows.length ? `\n- Parameters:\n${rows.join('\n')}` : '';
};
const entry = (t) => `### \`${t.name}\` · ${t.annotations?.title ?? t.title ?? ''}\n\n${t.description}\n\n- ${effect(t.annotations)}${params(t)}\n`;

const signedIn = await list('/mcp');
const pub = await list('/public');
const byName = new Map(signedIn.map((t) => [t.name, t]));
const grouped = new Set(GROUPS.flatMap(([, names]) => names));
const other = signedIn.filter((t) => !grouped.has(t.name));

let md = `# Tool reference\n\nGenerated from the live servers by \`scripts/tools.mjs\`. ${signedIn.length} tools on \`/mcp\` (sign-in) and ${pub.length} on \`/public\` (no sign-in).\n\n`;
md += `## Public tools (\`https://mcp.apptiller.com/public\`, no sign-in)\n\n${pub.map(entry).join('\n')}\n`;
md += `## Signed-in tools (\`https://mcp.apptiller.com/mcp\`)\n\n`;
for (const [title, names] of GROUPS) {
  const tools = names.map((n) => byName.get(n)).filter(Boolean);
  if (tools.length) md += `### ${title}\n\n${tools.map((t) => entry(t).replace(/^### /, '#### ')).join('\n')}\n`;
}
if (other.length) md += `### Other\n\n${other.map((t) => entry(t).replace(/^### /, '#### ')).join('\n')}\n`;
writeFileSync(new URL('../TOOLS.md', import.meta.url), md);
console.log(`TOOLS.md: ${signedIn.length} signed-in, ${pub.length} public tools`);
