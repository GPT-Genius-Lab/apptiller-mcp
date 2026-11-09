# Tool reference

Generated from the live servers by `scripts/tools.mjs`. 50 tools on `/mcp` (sign-in) and 5 on `/public` (no sign-in).

## Public tools (`https://mcp.apptiller.com/public`, no sign-in)

### `about_apptiller` · What Apptiller does and costs

What Apptiller does for App Store apps and their websites, its plans and prices, which plan each feature needs, and how the owner connects or signs up. No sign-in needed.

- Reads only

### `free_app_check` · Free check of an app or website

A free public read of an App Store app (its link or id) or a website (its domain): the app's US listing facts (name, genre, rating), or what the site's home page shows search engines and whether it links to the App Store. Google Play is not supported. The full check (ranks for five searches, what ChatGPT names, a subtitle to try) runs once per account: the owner signs up and runs it from the returned page. One result per product is shared for 24 hours.

- Reads only
- Parameters:
  - `link` (required): App Store link or id, or a website domain or URL.

### `browse_launches` · The Apptiller Launches board

The current launch period's board on Apptiller Launches: each launch's name, tagline, category, verification tier and live rank (ranked by verified revenue added, never by votes), with its page.

- Reads only

### `start_sign_up` · Start an Apptiller account for your owner

Emails the owner a link that makes their free Apptiller account (or signs them in to theirs). Nothing is made until they press it, within 24 hours. They can also sign in with Google when they add the connector.

- Changes data; adds or updates
- Parameters:
  - `email` (required): The owner's email address.

### `submit_launch` · Submit a launch for your owner to confirm

Submits an app (its App Store link or id) or a website (its domain, plus a name) to Apptiller Launches for the owner. It is held, not public, until the owner opens the link emailed to them (within 24 hours), signs in or makes an account, and confirms it. Once confirmed it is listed as not verified; it shows as the verified owner's once they prove they own it (an App Store Connect key, or a TXT record on the website's domain), and it is ranked once its RevenueCat (app) or Stripe (website) is connected, by the revenue it adds in its launch period. A product launches once per account, and one proven by its owner can't be launched by anyone else. Launching is free; it makes the product's name, tagline and launch-period numbers public.

- Changes data; adds or updates
- Parameters:
  - `email` (required): The owner's email address.
  - `kind` (required)
  - `link` (required): App Store link or id for an app; domain or URL for a website.
  - `name`: Required for a website; an app's defaults to its App Store name.
  - `tagline` (required): What it does, in one line.
  - `category` (required)
  - `hide_amounts`: Show rank and growth only, never dollar amounts.

## Signed-in tools (`https://mcp.apptiller.com/mcp`)

### Account and connections

#### `list_connections` · List connected accounts

Shows which services (Meta Ads, App Store Connect, Apple Ads, Google Ads, RevenueCat, AppsFlyer, Adjust) are connected to this Apptiller account.

- Reads only

#### `setup_suggestions` · Suggested setup

What this Apptiller account is still missing (connections to add or repair, settings in tools already used), each with why it helps and how to do it. Steps marked optional need a change in the user's app.

- Reads only

#### `connect_account` · Connect an account

Returns a one-time link (valid 15 minutes) that the user opens in a browser to connect a service to Apptiller. The user enters any keys or passwords on that page, not in the chat.

- Reads only
- Parameters:
  - `provider` (required): The service to connect.

#### `list_domains` · Verified domains

The organization's domains with their state (pending, verified, lapsed, failed) and the TXT record each one needs. Removing a domain is done in the web app.

- Reads only

#### `verify_domain` · Verify a domain

Starts proving the organization owns a domain, or checks it again: returns the TXT record to add at the domain's DNS provider (host and value), and whether Apptiller finds it now. Apptiller also looks for it every hour for 72 hours. Calling it again for the same domain keeps the same record. A verified domain proves an app is the organization's when the app's App Store listing points to it.

- Changes data; adds or updates
- Parameters:
  - `domain` (required): The domain, e.g. damson.life. A pasted URL works too.

#### `app_ownership` · Is the app proven ours?

Whether the app is proven to be this organization's, and by what: a connected App Store Connect key that sees the app, or a verified domain that the app's App Store listing (developer website) points to. When it isn't, says what would prove it.

- Reads only
- Parameters:
  - `app` (required): App name or id, e.g. "Damson".

### Apps

#### `apps` · Apps and their accounts

Lists the apps in this Apptiller account with the ad accounts, attribution sources and revenue projects mapped to each (and which layer each one feeds), plus the connected accounts no app uses yet. Per-app performance covers mapped accounts only.

- Reads only

#### `app_map_sources` · Map accounts to an app

Creates an app (with create) and maps connected accounts to it: Meta and Apple Ads ad accounts (spend), AdServices, AppsFlyer and Adjust apps (attribution), RevenueCat projects (revenue). Name an account by source_id or provider:external_id as this account lists them (e.g. meta:act_123, revenuecat:proj1a2b, adservices:com.example.app). For an ad account shared by several apps, set campaign_name_prefix so only that app's campaigns count. remove unmaps; history stays. Also looks the app up on the App Store (name, icon, developer) from its App Store id, bundle id, or a mapped AdServices or AppsFlyer app.

- Changes data; can overwrite or remove
- Parameters:
  - `app` (required): App name or id, e.g. "Damson".
  - `create`: Create the app if it does not exist.
  - `app_store_id`
  - `bundle_id`: iOS bundle id; used to find the App Store listing when the App Store id is not known.
  - `play_package`
  - `add`
  - `remove`

#### `app_store_listing` · App Store listing and its changes

An app's App Store listing (name, icon, developer, version, genre, price, rating) and every change Apptiller has seen to it: name, icon, description, screenshots, version and release notes, price. Checked daily; set refresh to look it up now. Uses Apple's public lookup, so it needs only the App Store id or bundle id, no App Store Connect access.

- Reads only
- Parameters:
  - `app` (required): App name or id (from apps).
  - `refresh`: Look the listing up now instead of showing the last daily check.
  - `country`: Storefront, e.g. US (default: the one used before, else US).
  - `days`: How far back to list changes.

#### `app_performance` · App performance by day

One app's spend, installs, trials, revenue, ROAS and cost per install, per day and per network (with an 'all' total per day) or per campaign, joined from Apptiller's synced history. Every number names its source: spend from the ad platforms; installs from the attribution layer (Apptiller's AdServices lookup for Apple Ads, the MMP for other networks), falling back to what the network claims, then to the revenue tool's tags; revenue, and so ROAS, from the MMP from the first day it has revenue for the app (revenue from the installs it attributed, USD, by install day; zeros mean the network earned nothing), else from the revenue tool's acquisition tags, whose split then sits in revenue_elsewhere; new customers and trials from the revenue tool, whose customers with no acquisition tag form an 'untagged' row (unknown source, not organic). Apple's own counts from App Store Connect sit beside each day's total in the network breakdown: first-time downloads in installs_elsewhere and proceeds (after Apple's commission, net of refunds) in revenue_elsewhere, standing in only on days no other layer counts; appleads rows carry app_store_search, Apple's count of all App Store search downloads, organic and Apple Ads together. Meta web campaigns (aimed at leads, sales or traffic, not app installs) carry web_results: the sign-ups, purchases and purchase value Meta's pixel counted on the website, Meta's own claim; they have no installs, the MMP doesn't judge them, and Meta's purchase value is their revenue only where the revenue tool has none tagged to them. ROAS only where spend and revenue share a currency. Set per_day false for one row per network or campaign over the whole range.

- Reads only
- Parameters:
  - `app` (required): App name or id (from apps).
  - `since` (required): First day (inclusive).
  - `until` (required): Last day (inclusive).
  - `breakdown`
  - `per_day`

#### `data_coverage` · What each app's data can prove

Per app and ad channel (Apple Ads, Meta, …), over the last 30 days of synced data: what Apptiller can judge the channel's campaigns by (paying subscribers, the MMP's purchase or trial event counts, Meta's own conversion counts, installs, or only the network's own claims), the source that rests on, and what is missing, with how to fix it in tools the user already has. Also each connected account's facts in its layer (installs, MMP revenue and purchase events, customers and tags, spend). Reads synced data only; asks nothing of the app.

- Reads only

### App Store Connect

#### `app_store_sales` · App Store sales and downloads

Apple's own daily App Store numbers from App Store Connect (Sales and Trends), organic and paid alike: first-time downloads, re-downloads, updates, in-app purchases, new and renewed subscriptions, refunds and the developer's proceeds (after Apple's commission and taxes, net of refunds, in the currency Apple pays for each storefront), per app by day, storefront country or product. Days are Pacific Time, Apple's report day; each day comes out the next morning and is synced within six hours. Says nothing about which ad brought a download.

- Reads only
- Parameters:
  - `since` (required): First day (inclusive), Pacific Time.
  - `until` (required): Last day (inclusive).
  - `app`: An Apptiller app (name or id from apps) or an App Store Apple ID. All apps when left out.
  - `by`: day: one row per app and day; country: per storefront over the range; product: per in-app purchase or subscription (and the app itself) over the range.
  - `country`: Only this storefront, e.g. US.

#### `app_store_funnel` · App Store funnel by source

Apple's App Analytics for each app, from App Store Connect's analytics reports, organic and paid alike: App Store impressions and page views, first-time downloads and redownloads, the conversion rate, purchases with proceeds in USD, subscription events (trial and paid offer starts, conversions to paid, paid starts, renewals, voluntary and involuntary churn, refunds) and active subscriptions (trials, paid offers, paid plans, billing issues), per app by day, by where people found the app (App Store search, which includes Apple Ads, App Store browse, App referrer, Web referrer) or by country. Days are UTC; the last two or three are incomplete. Apple makes these reports only after an Admin asks once, which Apptiller asks nobody to do, so only apps whose reports someone started (for another tool) have them. Says nothing about which campaign brought a download.

- Reads only
- Parameters:
  - `since` (required): First day (inclusive), UTC.
  - `until` (required): Last day (inclusive).
  - `app`: An Apptiller app (name or id from apps) or an App Store Apple ID. All apps when left out.
  - `by`: day: one row per app and day; source: per source type over the range; country: per territory over the range.
  - `country`: Only this territory, as Apple names it in the reports (e.g. US).

### Ads

#### `meta_ad_accounts` · Meta ad accounts

Lists the Meta ad accounts Apptiller can read, with currency and status.

- Reads only

#### `meta_diagnose` · Diagnose the Meta connection

Shows what the connected Meta token is (system user or person), its permissions and granted account ids, and what each ad-account lookup returns. Never shows the token.

- Reads only

#### `meta_performance` · Meta ad performance

Spend, impressions, reach, clicks, CPM, CTR and key results (purchases, trials, registrations, leads, installs, checkouts…) with cost per result and ROAS, for a Meta ad account by account, campaign, ad set or ad. Use a date preset such as last_7d, or since/until dates. Set raw to get Meta's full action list.

- Reads only
- Parameters:
  - `account_id` (required): Ad account id, e.g. act_123 (from meta_ad_accounts).
  - `level`
  - `date_preset`
  - `since`
  - `until`
  - `raw`: Return every Meta action type instead of the summary.

#### `apple_ads_accounts` · Apple Ads accounts

Lists the Apple Ads ad accounts Apptiller can read, with the connected user's roles in each, straight from Apple. Accounts marked basic are Apple Ads Basic: Apple offers no reporting API for them, so there is no spend data and their results come through attribution.

- Reads only

#### `apple_ads_performance` · Apple Ads performance

Daily Apple Ads (App Store search ads) numbers from Apptiller's synced history: spend, impressions, taps, installs and every other metric Apple reports, by campaign, ad group, ad or keyword, between two dates. Synced four times a day; set raw to get Apple's full rows.

- Reads only
- Parameters:
  - `level`
  - `since` (required): First day (inclusive), in the ad account's reporting timezone.
  - `until` (required): Last day (inclusive).
  - `campaign_id`
  - `raw`

### Attribution

#### `attribution_setup` · Set up Apple Ads attribution

An optional fallback for an app with no MMP (AppsFlyer, Adjust…) and no revenue SDK that collects Apple Ads attribution; Apptiller otherwise reads attribution from the tools already connected. Creates this organization's Apptiller ingest key and returns a Swift function to add to the iOS app. The app then sends each install's Apple AdServices token to Apptiller, which resolves it with Apple: which Apple Ads campaign, ad group, keyword and ad brought the install, for Advanced and Basic accounts alike, with no third-party SDK and no tracking prompt. Calling it again replaces the key; apps with the old key stop counting until updated.

- Changes data; can overwrite or remove

#### `attribution_performance` · Attributed installs

Daily installs by attribution source from Apptiller's attribution layer (Apptiller's own Apple AdServices lookup, AppsFlyer and Adjust when connected: their rows carry every metric the MMP reports in metrics, including sessions, revenue, cost and in-app events; Adjust also has ad group rows), by network, campaign, ad group, keyword or ad, between two dates, with claim type, conversion type and country counts. These are installs as the attribution source saw them, not what the ad network claims or what the revenue tool tagged.

- Reads only
- Parameters:
  - `level`
  - `since` (required): First day (inclusive), UTC.
  - `until` (required): Last day (inclusive).

### Revenue (RevenueCat)

#### `revenuecat_projects` · RevenueCat projects

Lists the RevenueCat projects Apptiller can read, with their ids.

- Reads only

#### `revenuecat_overview` · RevenueCat overview metrics

Current subscription metrics for a RevenueCat project: active trials, active subscriptions, MRR, revenue and new customers over the last 28 days, and active users.

- Reads only
- Parameters:
  - `project_id` (required): RevenueCat project id (from revenuecat_projects).
  - `currency`

#### `revenuecat_revenue` · RevenueCat revenue

Total revenue for a RevenueCat project between two dates (inclusive): gross, net of taxes, or proceeds after store fees.

- Reads only
- Parameters:
  - `project_id` (required): RevenueCat project id (from revenuecat_projects).
  - `start_date` (required)
  - `end_date` (required)
  - `currency`
  - `revenue_type`

#### `revenuecat_chart_options` · RevenueCat chart options

The resolutions, segments (country, product, store…), filters and selectors a RevenueCat chart accepts.

- Reads only
- Parameters:
  - `project_id` (required): RevenueCat project id (from revenuecat_projects).
  - `chart_name` (required)
  - `realtime`

#### `revenuecat_chart` · RevenueCat chart

A RevenueCat chart over time: trials, trial conversion, MRR, revenue, churn, actives, retention, refunds, paywall conversion and more, optionally segmented (e.g. by country or product) and filtered.

- Reads only
- Parameters:
  - `project_id` (required): RevenueCat project id (from revenuecat_projects).
  - `chart_name` (required)
  - `start_date`
  - `end_date`
  - `resolution`: Resolution id from revenuecat_chart_options, e.g. "0" for day.
  - `segment`: Segment id from revenuecat_chart_options.
  - `limit_num_segments`
  - `filters`
  - `selectors`
  - `currency`
  - `realtime`

### Analyst, proposals and changes

#### `briefing` · The analyst's findings and proposals

What Apptiller's analyst found in each app's last 14 days of synced data: Meta campaigns and ad sets, and Apple Ads campaigns, ad groups and keywords, that spent with no results, cost far more per result than the rest of their channel, or far less. Each finding has its evidence (spend, results and their source, cost per result with a 90% range, the baseline it was compared with), how sure it is, and one proposed change (pause, bid or budget). Like is compared with like: one channel, level, objective and currency, measured in the deepest result the group has enough of (purchases, trials, sign-ups, attributed installs, then installs the network claims), from one source. Also, per group, what it was judged by or why it couldn't be, and the changes Apptiller made in the app's ad accounts over the last 30 days (with change ids), each with its effect: the 7 days before it against the 7 after, in the result and source its finding was judged by, net of how the rest of its group moved over the same days, with how sure that is and a verdict (better, worse or unclear: cheaper results after a cut, more of them after a raise). An Apple Ads change also gets `search` once the app's App Store Connect analytics are connected (search results campaigns only): all of App Store search's first-time downloads a day before and after (Apple's App Analytics, organic included), the part Apple Ads credits its search results campaigns with, and the share of Apple Ads' move that was new to search, with a 90% range set by how much organic search moved week to week before (verdict incremental, organic or unclear, once Apple's numbers for all 7 days after are in); the analyst doesn't raise again what a raise mostly took from organic search. While a change is being measured, the analyst leaves alone the entity, those above it and those inside it; their proposals wait (status 'waiting', and `waiting` says for which change and until when). After that it judges them on the days since the change only, and if the finding still holds proposes the next step, saying what the last one did. The analysis runs daily at 12:40 UTC; set refresh to run it now. Nothing in an ad account changes from this tool: a proposal changes something only once the user approves it and it is applied.

- Reads only
- Parameters:
  - `app`: App name or id (from apps). Every app when left out.
  - `refresh`: Run the analysis now instead of showing the last daily run.

#### `app_brief` · An app's goal, limits and agent memory

What Apptiller's agent works from for one app: the brief the user set (the goal, such as a target cost per paying subscriber or a ROAS, core countries, competitors, constraints such as "don't touch brand campaigns", and short facts), the limits it works inside (mode: watch only reports, ask proposes and waits for approval; the biggest step one change may take; the most a day's budget may grow; which levers it may use; campaigns it must never touch), its open plan items with their check dates, its last 14 journal entries and what past changes taught it on this app. Read-only.

- Reads only
- Parameters:
  - `app` (required): App name or id (from apps).

#### `set_app_brief` · Set an app's goal, markets and constraints

Writes the brief Apptiller's agent works from for one app. Fields left out stay as they are. goal: what a good result is, as a cost per paying subscriber, per trial or per install (with its currency) or a ROAS (revenue over spend, e.g. 1.2), or null to clear it. countries: the markets that matter most, as two-letter codes. competitors: apps the user names as competitors (names or App Store ids). constraints: plain words the agent must respect, such as a launch date or campaigns not to touch. facts: short facts by key (prices, seasonality, anything the agent should know); a null value removes one. The agent never overwrites what the user set here. These come from the user.

- Changes data; adds or updates
- Parameters:
  - `app` (required): App name or id (from apps).
  - `goal`
  - `countries`
  - `competitors`
  - `constraints`
  - `facts`

#### `set_app_limits` · Set the limits Apptiller's agent works inside

Sets, for one app, how far Apptiller's agent may go. Owners and admins only. Fields left out stay as they are. mode: watch (the agent only reports), ask (it proposes changes and a member approves each one; the default) or autopilot. autopilot: it applies its own proposals inside these limits by itself, two changes a day at most (paid plans; needs a linked ad account that is being read, an attribution source, and max_daily_increase unless the budget lever is off). max_step_pct: the biggest step one change may take, 1 to 50 percent of the current bid or budget (default 20). max_daily_increase: the most one change may add to a day's budget, in the ad account's currency (null: only the percentage applies). levers: which kinds of change the agent may propose (pause, budget, bid). protected_entities: campaign, ad set or keyword ids it must never propose to change. These limits also hold when a member applies a change, from here or the dashboard: one outside them is refused.

- Changes data; adds or updates
- Parameters:
  - `app` (required): App name or id (from apps).
  - `mode`
  - `max_step_pct`
  - `max_daily_increase`
  - `levers`
  - `protected_entities`

#### `apply_proposal` · Apply a proposal in the ad account

Makes the change a proposal the user has seen and approved describes, in the live ad account: pauses the campaign, ad group or keyword, or moves its bid or daily budget by the proposed step (at most 20%). Apple Ads, Meta and Google Ads (Meta and Google Ads move budgets and pause; they have no bids to move). Apptiller first reads the entity live from the platform and writes only if it still has the value the proposal started from; the value it replaces is kept, so the change can be undone. A proposal waits while an earlier change to the same entity, one above it or one inside it is still being measured (7 days), so what each change did can be told apart. This spends or saves real money.

- Changes data; can overwrite or remove
- Parameters:
  - `proposal_id` (required): The proposal id, from briefing.

#### `undo_change` · Undo a change Apptiller made

Puts back, at the user's request, the value an ad account had before Apptiller changed it. Only while the campaign, ad group or keyword still has the value Apptiller wrote: if it was changed since, nothing is written. It changes the live ad account.

- Changes data; can overwrite or remove
- Parameters:
  - `change_id` (required): The change id, from briefing.

#### `reject_proposal` · Reject a proposal

Marks one of the analyst's proposals as rejected. Nothing changes in the ad account; the finding stays in the briefing, and the analyst doesn't propose that change again while the finding stays open.

- Changes data; adds or updates
- Parameters:
  - `proposal_id` (required): The proposal id, from briefing.

#### `dismiss_finding` · Dismiss a finding

Dismisses one of the analyst's findings: it leaves the briefing, its pending proposal is rejected, and the analyst stays quiet about the same thing for 30 days. Nothing changes in the ad account, and changes already made stay.

- Changes data; adds or updates
- Parameters:
  - `finding_id` (required): The finding id, from briefing.

### AI answers

#### `ai_visibility_track` · Track an app in AI answers

Starts (or updates) tracking whether ChatGPT, Google AI Mode and Google AI Overviews recommend an app. Creates the project if it does not exist. Give every name the app goes by, its own domains, its App Store id or Play package, and the competitors to compare against.

- Changes data; can overwrite or remove
- Parameters:
  - `project` (required): Project name or id, e.g. "Damson".
  - `aliases` (required): Names the app goes by in answers, e.g. ["Damson", "Damson PCOS"].
  - `domains`: The app's own sites, e.g. ["damson.life"].
  - `app_store_id`
  - `play_package`
  - `competitors`
  - `country`: Where the questions are asked from, e.g. US.
  - `language`: e.g. en
  - `engines`
  - `runs_per_day`: How many times a day each question is asked on each engine (0 pauses the daily runs).

#### `ai_visibility_set_questions` · Set AI visibility questions

Adds the questions people would ask an assistant when looking for an app like this one, e.g. "best app to track PCOS symptoms". They work best in a buyer's own words, mostly without the app's name. With replace, questions not in the list stop being asked (their history is kept).

- Changes data; adds or updates
- Parameters:
  - `project` (required)
  - `questions` (required)
  - `replace`

#### `ai_visibility_tracked` · Tracked apps and questions

Lists the apps tracked in AI answers, what Apptiller looks for in each, and their active questions.

- Reads only

#### `ai_visibility_run_now` · Ask the questions now

Queues one extra round of a project's questions on its engines now, instead of waiting for the daily run (up to 150 questions × engines; each costs about $0.0012 at DataForSEO). Answers arrive within about an hour.

- Changes data; adds or updates
- Parameters:
  - `project` (required)

#### `ai_visibility_plan` · Your AI-visibility plan

The organization's AI-visibility plan (Solo $29, Pro $69 or Studio $179 a month, or none), what it allows (products, questions, runs a day) and what is used, with the page to choose or change a plan. Without a plan, tracking can be set up but the daily answers don't run.

- Reads only

#### `ai_visibility_collect` · Collect ready answers

Fetches every queued answer that is ready and scores it. Runs by itself every hour; running it fetches fresh answers sooner.

- Changes data; adds or updates

#### `ai_visibility_report` · AI visibility report

How often ChatGPT, Google AI Mode and AI Overviews named the app for its questions, with a 95% range, its average position when named, which apps they named instead, and which sites they cited (including whether the app's own site or store listing was cited).

- Reads only
- Parameters:
  - `project` (required)
  - `days`
  - `by_question`

#### `ai_referrals_setup` · Count visitors AI assistants send

Turns on counting of the people ChatGPT, Perplexity, Gemini, Copilot, Claude and other assistants send to an app's own website, and their clicks to the App Store or Google Play (tagged with an App Store campaign token per assistant) or a purchase the site reports. Returns the script tag to add to the site; calling it again keeps the same key. Domains default to the ones AI-answer tracking knows, else the project's website. Counts only, no cookies.

- Changes data; can overwrite or remove
- Parameters:
  - `project` (required)
  - `domains`

#### `ai_referrals` · Visitors from AI assistants

Whether the app's website script is installed (status), and what it counted from AI assistants over the last days (UTC): visits per assistant, clicks to the App Store or Google Play after one, purchases the site reported, by day, and the pages people landed on. Google AI Mode and AI Overviews refer from google.com and aren't counted here.

- Reads only
- Parameters:
  - `project` (required)
  - `days`

### Website guides

#### `site_guides` · Daily guides for an app's website

Daily guides for one app's website: whether they're on and what's missing to turn them on (a verified website in a connected Search Console, a paid plan), and its guides, newest first. Each guide answers one Google search that shows the site but is rarely clicked: the search and its numbers, the need behind it, the title, address slug, meta description, the guide in Markdown with its two calls to action, the sentences to add on the site's own pages to link to it, and every claim the check read with what backs it (status held: something couldn't be backed; fix it before publishing). agent_spec is the whole job for a coding agent: where the page goes, its head tags and structured data, the links to add, the checks. Published guides carry their Google clicks and impressions since. Apptiller never publishes them.

- Reads only
- Parameters:
  - `app` (required): App name or id (from apps).
  - `limit`

#### `set_site_guides` · Turn daily guides on or off

Turns daily guides on or off for one app's website. On needs the website verified, in a connected Google Search Console, and a paid plan or the trial; the error says which is missing. Each morning after that, Apptiller writes at most one guide, only when a search is worth one, and pauses while 3 wait unpublished.

- Changes data; adds or updates
- Parameters:
  - `app` (required): App name or id (from apps).
  - `enabled` (required)

#### `close_site_guide` · Mark a guide published or dismissed

Marks one guide as published, with the full https address where it went live, so Apptiller counts its Google clicks from then on; or dismissed.

- Changes data; adds or updates
- Parameters:
  - `guide_id` (required): The guide id, from site_guides.
  - `status` (required)
  - `url`

### Launches

#### `launch_product` · Launch a product on Apptiller Launches

Launches an app (from its App Store link or id) or a website (its domain, plus a name) on Apptiller Launches, the public board ranked by the revenue a launch adds in its period, verified through the product's own RevenueCat app or its Stripe account and a TXT-verified domain (websites). It goes into the first open period with a spot (the founding month first). Returns the launch with its tier: verified (ranked), owner (ownership proven: listed, not ranked) or unverified, and what would raise it. One launch per product across Apptiller. Launching is free; it makes the product's name, tagline and launch-period numbers public.

- Changes data; adds or updates
- Parameters:
  - `kind` (required)
  - `link` (required): App Store link or id for an app; domain or URL for a website.
  - `name`: Required for a website; an app's defaults to its App Store name.
  - `tagline` (required): What it does, in one line.
  - `category` (required)
  - `hide_amounts`: Show rank and growth only, never dollar amounts.

#### `list_launches` · Your launches

This organization's launches on Apptiller Launches: period, tier, proof, what would raise the tier, the latest numbers (revenue added in the period so far, growth, new customers, trials), and the public page's traffic over the last 7 days (views by where they came from, clicks out to the product, badge loads on other sites). For an app, app_store_from_launches: the App Store page views and first-time downloads Apple's App Analytics credits to apptiller.com (Web referrer) since the launch was made (since, a UTC day as App Analytics counts them), through latest, the last day Apple's reports reached. latest null: Apple's Detailed reports haven't both come in (started false: App Analytics not started; started true: still coming in). latest before since: Apple hasn't reported the launch's days yet, so the zeros aren't counts. stopped: every App Store Connect key that reads the app is revoked or broken, so latest won't move until it's replaced. Apple leaves small counts out. Each has its page in the web app. Withdrawing is done in the web app.

- Reads only

#### `check_launch` · Check a launch again

Works out a launch's tier again from what is connected now (after connecting RevenueCat, mapping its project to the app, or proving ownership).

- Changes data; adds or updates
- Parameters:
  - `launch_id` (required): From list_launches.

#### `edit_launch` · Edit a launch

Changes what the board shows of a launch: its name, tagline, category, and whether dollar amounts are hidden (rank and growth still show). Fields left out stay as they are. The address (slug) never changes.

- Changes data; adds or updates
- Parameters:
  - `launch_id` (required): From list_launches.
  - `name`
  - `tagline`
  - `category`
  - `hide_amounts`

#### `launch_ai_answers` · A launch's free AI answers

A launch's free AI answers: up to 5 questions someone who needs the product would ask (never naming it), asked on ChatGPT, Google AI Mode and AI Overviews. Pass questions to replace them; run: true starts the first check, once per launch (each question 3 times on every engine), asked as from country (US unless given). Founding launches are then asked again every day until their period ends. Returns the questions and the results so far: how often the product is named and who is named instead, per question. With raw: true it also returns the latest day's answers themselves: each engine's text (up to 1500 characters), whether and where it named the product, who else it named, and the pages it cited. Answers arrive within a few hours.

- Changes data; adds or updates
- Parameters:
  - `launch_id` (required): From list_launches.
  - `questions`
  - `run`: Start the first check (once per launch).
  - `country`: With run: the country the answers are asked from, kept for the daily runs; usually where the maker's buyers are. Defaults to US.
  - `raw`: Include the latest day's answers: text, names, cited pages.

