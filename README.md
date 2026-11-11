# Apptiller MCP server

Apptiller's remote MCP server gives Claude, ChatGPT and other MCP clients the same account and data as the [Apptiller](https://apptiller.com) web app. Your assistant can then answer questions about your App Store apps with your real numbers: downloads and sales, the App Store funnel, search ranks, AI answers, ads, attribution and revenue.

This repository holds the server's public documentation and its [MCP Registry](https://registry.modelcontextprotocol.io) entry (`server.json`). The server itself is hosted by Apptiller; there is nothing to install or run.

| | |
|---|---|
| Server URL (sign-in) | `https://mcp.apptiller.com/mcp` |
| Public server (no sign-in) | `https://mcp.apptiller.com/public` |
| Transport | Streamable HTTP |
| Sign-in | OAuth 2.1 with dynamic client registration; Google, or a code sent by email |
| Tools | 56 on `/mcp`, 5 on `/public`: see [TOOLS.md](TOOLS.md) |
| Registry name | `com.apptiller/apptiller` |

## Connect

**Claude (claude.ai, Desktop, mobile):** Settings → Connectors → Add custom connector, and enter `https://mcp.apptiller.com/mcp`.

**Claude Code:**

```bash
claude mcp add --transport http apptiller https://mcp.apptiller.com/mcp
```

**ChatGPT:** Settings → Apps & Connectors → Create, with `https://mcp.apptiller.com/mcp` as the MCP server URL and OAuth as the authentication.

**Any other MCP client:** point it at `https://mcp.apptiller.com/mcp` over Streamable HTTP. The client discovers the OAuth endpoints from the server (RFC 9728 protected resource metadata, RFC 8414 authorization server metadata) and registers itself (RFC 7591).

## Signing in

Connecting needs no sign-in: the client can list the tools straight away. The first tool that reads your account asks you to sign in, and the server answers that call with `401` and the sign-in details.

- Sign in with Google, or with your email address and a code Apptiller emails you.
- A new account is made as you sign in. The free plan needs no card.
- To see your own numbers, connect your accounts in Apptiller: App Store Connect for sales, downloads and the App Store funnel, plus, if you use them, Apple Ads, Meta Ads, Google Ads, AppsFlyer, Adjust and RevenueCat. `connect_account` returns a link for this. Keys are entered on Apptiller's page, never in the chat.

The tools on `/public` need no account at all: what Apptiller does, a free read of any App Store app or website, and the Apptiller Launches board.

## What it can do

- **How an app is doing:** first-time downloads, re-downloads, proceeds and refunds from App Store Connect; impressions, page views, conversion and where people found the app; ranks in App Store search; listing changes.
- **AI answers:** how often ChatGPT, Google AI Mode and AI Overviews name your app for the questions buyers ask, which apps they name instead, and which pages they cite.
- **Ads, attribution and revenue:** spend and results from Apple Ads, Meta and Google Ads; installs from AppsFlyer, Adjust or Apple's own AdServices attribution; trials and revenue from RevenueCat. Because these sit in one place, you can ask across them, such as which campaign brought people who paid.
- **Findings and proposals:** Apptiller's analyst reviews the last 14 days of ad data every day and proposes changes (pause, bid or budget), each with its evidence.
- **Launches and website guides:** launch an app on Apptiller Launches, and read daily guides for searches where your website shows but is rarely clicked.

Example prompts:

- "How did my app's downloads and search ranks change this week, and why?"
- "Do ChatGPT and Google's AI answers name my app, and which apps do they recommend instead?"
- "Which of my Apple Ads keywords bring paying users?"

The full list, with every parameter and whether each tool reads or changes data, is in [TOOLS.md](TOOLS.md).

## Changes stay yours

Most tools only read. The ones that change something are marked in their annotations (`readOnlyHint: false`, and `destructiveHint` where a value can be overwritten or removed), so your client asks you before calling them.

- Changes inside Apptiller (an app's brief, its limits, tracked questions, a launch's details) stay in your Apptiller account.
- A change to a live ad account (`apply_proposal`) is made only for a proposal you have seen and approved. Apptiller reads the value live first and writes only if it still matches; the old value is kept, so `undo_change` can put it back.
- An app's limits (`set_app_limits`) bound every change: the largest step, the most a day's budget may grow, which levers may be used, and campaigns that must never be touched.

## Data and privacy

- Apptiller reads the accounts you connect and stores what it reads in your Apptiller account, which only your organization's members can see.
- Connection keys and tokens are stored encrypted. Disconnecting a service deletes its key and everything synced with it.
- The server doesn't keep your conversations. It receives only each tool call's arguments, and records each call in your account's audit log.
- Apptiller doesn't serve ads or promoted content through the server.

Full policy: [apptiller.com/privacy](https://apptiller.com/privacy).

## Limits

- The server reads what Apptiller has synced, so data is as fresh as the last sync. App Store Connect publishes each day's sales the next morning.
- Google Play is not supported yet.
- Some numbers need the matching connection: there are no sales without App Store Connect, and no revenue without RevenueCat or an MMP.

## Support

- Support page: [apptiller.com/support](https://apptiller.com/support)
- Email: [support@apptiller.com](mailto:support@apptiller.com)
- Product page: [apptiller.com/features/claude-chatgpt-connector](https://apptiller.com/features/claude-chatgpt-connector)
- Issues with these docs: open an issue in this repository.

## Install in Cline

```bash
cline mcp install apptiller --transport http https://mcp.apptiller.com/mcp
```

Or add it to Cline's MCP settings as a remote server (`streamable-http`, `https://mcp.apptiller.com/mcp`). Cline opens Apptiller's sign-in the first time a tool needs your account.

## Updating the tool reference

[TOOLS.md](TOOLS.md) is generated from the live servers:

```bash
node scripts/tools.mjs
```

## License

The documentation and scripts in this repository are MIT licensed. The Apptiller service itself is hosted by GPT Genius Lab LLC and governed by its [terms](https://apptiller.com/terms).
