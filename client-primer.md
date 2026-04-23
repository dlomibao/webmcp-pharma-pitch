# A 5-minute primer on WebMCP

> A short read for anyone walking into the WebMCP conversation cold. Written to be sent ahead of the meeting or as a leave-behind.

---

## What's actually happening

Your patients, prescribers, and caregivers are increasingly asking AI assistants questions about your drug. Forty million people use ChatGPT for health questions every day. Google's AI Overview now appears on 89% of healthcare searches. People are getting answers to questions about your product — without ever clicking through to your website.

The AI is generating those answers from whatever sources it can find: forum threads, old PDFs, your competitor's footnotes, occasionally your own prescribing information. The Guardian published an investigation in January 2026 documenting cases where AI Overviews gave dangerously wrong health advice — including for cancer patients.

Meanwhile, the FDA had its biggest year of advertising enforcement in 25 years. They've publicly confirmed they use AI to monitor drug ads.

You're being talked about by AI you don't control. You're being watched by AI you can't see. That's the situation today.

---

## What WebMCP is

**WebMCP is a new way for your brand's website to publish approved answers that AI assistants can read directly — so when someone asks an AI about your drug, your answer is what the AI uses, instead of whatever the AI would have invented from scratch.**

It's a new web standard, co-authored by Google and Microsoft, published through the W3C in February 2026. It's available in Chrome's early-preview channel today.

Practically, it works like this: your website declares a small list of questions it knows how to answer ("what's the dosing?" "what are the interactions?" "what are the side effects?") and the exact, MLR-approved answer for each. Any AI assistant that gets asked one of those questions can read your declared answer and use it directly.

---

## The metaphor that helps

Today, an AI looking at your website is like a stranger walking into a kitchen and trying to figure out what to cook. WebMCP lets your website hand the AI a printed menu — *here are the questions I'll answer, and here's exactly what to say for each one.* The AI orders from the menu. Your website serves the answer. Same answer, every time, on every AI assistant.

---

## What WebMCP is *not*

- **Not a chatbot.** You're not buying a chatbot product, deploying a chatbot, or running one. WebMCP is content your website publishes; AI assistants come to it.
- **Not a new website.** It bolts onto the website you already have.
- **Not an IT/infrastructure project.** It's content work — written by the same people who already write your structured content (schema.org tags, OpenGraph metadata, ALT text). The plumbing is a few hours; the content is the work.
- **Not a single-vendor product.** It's an open standard. Any AI assistant that supports the standard can read your published answers.

---

## A note on naming — WebMCP vs MCP

You may hear the term "MCP" used elsewhere. They are different things from the same naming family:

- **MCP** (Model Context Protocol) is a protocol used by AI applications to pull data from internal company systems — backend infrastructure built by IT/engineering teams.
- **WebMCP** (Web Model Context Protocol) is the public-facing version — a standard that lets a website publish content outward for AI assistants to read. Built and owned by content/marketing teams.

They share design principles but operate in opposite directions: MCP pulls private data in; WebMCP publishes public content out.

For pharma brand work, WebMCP is the relevant one. It's a content surface, not an infrastructure project.

---

## Why this matters for compliance

This is the part that surprises most MLR teams. Today's generative AI scares compliance because the AI itself is the *author* — it writes a new sentence every time someone asks. WebMCP flips that. The AI becomes the *delivery mechanism*; your MLR-approved sentence is what gets served. Same query, same words, every time.

| Generative AI today | WebMCP-served response |
|---|---|
| Different answer every time | Same approved answer, every time |
| Hallucinates dosages, off-label suggestions | Pre-reviewed by MLR before it ever appears |
| No audit trail for the regulator | Every call logged. Every source is your site. |
| MLR spends time chasing model drift | Approve once, served until you change it |

It's the first time AI and MLR have been on the same side of the table.

---

## Why now, not in 12 months

Two reasons.

**The standard is shipping.** WebMCP is a published W3C draft co-authored by Google and Microsoft, available in Chrome today. Browser support will widen — Microsoft's co-authorship means Edge follows. Other browsers haven't announced timelines, but the pattern is established.

**Citation flywheel.** AI systems preferentially cite sources they've successfully queried before. Brands that publish during the 2026 preview window become the default citation for their therapy class as adoption widens. The same pattern played out with schema.org markup in 2011, with Google snippets in 2014, with mobile-first indexing in 2018: brands that moved during the preview window kept the share. Brands that waited didn't catch up.

---

## What it would actually look like for a brand

A typical first deployment:

- A handful of "tools" published — usually dosing, interactions, side effects, prescribing information, patient resources. Each tool is one MLR-approved response surface.
- Brand IT spends a few hours wiring up one URL on the existing website.
- Agency runs the content cycle — what to publish, what the answers say, the MLR review, updates as new data lands.
- Bolts onto the existing brand site. No replatform. No new vendor. No new contracts.

You can publish, modify, or take it down at any time. There's no lock-in: tools are simply small text files on your website. Take them down and AI behavior reverts to today's behavior.

---

## What we're proposing today

Nothing yet. This is a first conversation.

The ask is a follow-up — bring your digital lead, bring someone from MLR, and we'll walk through what WebMCP would actually look like on one of your real brands. We're not asking for budget or commitment in this meeting. We're asking for one more conversation with the right people in the room.

---

## Questions you might want to ask in the follow-up

- What does the MLR cycle look like for AI-delivered content vs. our current website content?
- What happens when an off-label question gets asked?
- How do we measure whether AI assistants are actually citing our content?
- What happens when the prescribing information gets updated?
- Which of our brands would be the right pilot candidate?
- How do we coordinate this with our existing SEO and content workflows?

---

*The brands that publish WebMCP tools in the 2026 preview window become the default citation for their therapy class as adoption widens. The brands that wait become secondary references — or invisible.*
