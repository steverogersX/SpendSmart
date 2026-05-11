## Question 1 — The hardest bug you hit this week

The hardest bug wasn't a runtime error. It was a logic error that would have silently given users wrong recommendations and I almost didn't catch it.

On Day 1 I was building the audit logic and a user submitted something like this:

```
claude pro $20 writing
claude pro $20 coding
claude pro $20 design
```

My first implementation evaluated each row separately. Found a cheaper writing tool — saves $5. Found a cheaper coding tool — saves $2. Found nothing cheaper for design — saves $0. Total savings: $7.

Looked right. The tests passed. I moved on.

Then I stopped and actually read what I had built. That person is paying one $20 subscription. It covers everything. If they follow my recommendations and move each use case to a separate cheaper tool they end up paying $15 + $18 + $20 — more than before. I would have been telling users to spend more money while showing them a "savings" number. That's not a bug that crashes the app. It's a bug that gives confidently wrong advice.

My first hypothesis was that I needed to detect duplicate tool entries and merge them. I started building a deduplication step. Then I realised that was the wrong fix — it added complexity and still didn't solve the underlying problem cleanly.

The actual fix was simpler. The `mixed` use case option already existed in the schema. If you use one subscription for multiple tasks, you enter it once and select `mixed`. One record. One evaluation. No fake savings. The bug wasn't in the code — it was in how I expected users to fill the form. Fixing the mental model fixed the bug.

---

## Question 2 — A decision you reversed mid-week

On Day 1 I put the `useCases` field at the tool level in `pricingData.json`:

```json
"gemini": {
    "useCases": ["writing", "data", "research", "mixed"],
    "plans": { ... }
}
```

Made sense at the time. Gemini is a general purpose tool. Tag it once at the top level and be done with it.

I reversed this on the same day when I thought through a specific case. Gemini Plus has no CLI and no IDE integration. If `useCases` lives at the tool level and includes coding, my audit engine might recommend Gemini Plus for a developer who selected coding as their use case. That's completely wrong — Gemini Plus literally cannot do what they need.

The fix was moving `useCases` to the plan level. Each plan now declares independently what it supports. Gemini Plus only lists writing, data, research, and mixed. Gemini Pro and Ultra include coding because they actually support it.

What made me reverse it was thinking through one concrete wrong recommendation rather than the abstract schema design. As soon as I imagined the output — "switch to Gemini Plus for your coding workflow" — the problem was obvious. Abstract decisions are easy to get wrong. Concrete examples catch it fast.

---

## Question 3 — What I would build in week 2

The audit engine currently infers token usage from monthly spend using a static 70/30 input/output assumption. That assumption bothers me. Coding agents generate massive outputs. Retrieval workflows have enormous inputs. Reasoning models have hidden tokens that don't show up in the basic calculation. A static ratio is directionally useful but it's wrong for a significant portion of users.

In week 2 I would build workload-specific token heuristics. Instead of one global ratio, each use case gets its own:

- Coding: higher output ratio, account for tool call tokens in agentic workflows
- Research: higher input ratio, large context documents
- Writing: roughly balanced, moderate context

This makes the API recommendations meaningfully more accurate for the users who need them most — developers building agentic applications, which is exactly the core target user.

I would also fix the OG preview image. Right now it's rough. The shareable URL is supposed to be the viral loop — someone shares their savings number and others click to check their own. If the preview card looks bad, people won't share it. A well-designed OG image with the savings number displayed clearly could meaningfully improve organic spread.

Finally I would add more Chinese and open-source models to the API recommendation pool. DeepSeek, Kimi K2, Qwen. These are the models that create the biggest cost delta for users currently on Claude Opus or GPT-4 class models. Without them the recommendations are less interesting.

---

## Question 4 — How I used AI tools

I used Claude Code throughout the week for specific, bounded tasks — never for open-ended decisions.

What I trusted it with: boilerplate setup, HTTP server configuration, writing TypeScript types from my plain English descriptions, converting my schema designs into Zod validators, and component scaffolding on Day 4 after I already knew exactly what I was building.

What I didn't trust it with: any decision that required understanding the product. The audit logic, the normalization approach, the capability threshold, the token estimation formula — all of that I worked out myself first. If I had handed the Credex assignment to Claude Code and said "build this," it would have produced something. It might have even looked complete. But it would have had wrong logic, repeated code, and none of the reasoning that makes the recommendations defensible. A finance person reading those recommendations would not agree with them.

My mental model for using Claude Code: it is an input stream, not a decision maker. I decide what to build. I evaluate my own decisions. I use Claude to execute the parts that are mechanical once the thinking is done.

One specific time it was wrong: on Day 4 I asked Claude Code to use the shared types from the `shared/` folder when implementing UI components. It kept creating new Zod schemas that already existed in the shared folder — duplicating code I had specifically centralised to avoid duplication. It was not reading the project structure, just generating what looked locally correct. I caught it because I reviewed every file it touched before accepting changes. If I had trusted it blindly the codebase would have had the same schema defined in three different places, which would have caused silent bugs the moment any one of them drifted.

---

## Question 5 — Self ratings

**Discipline: 10/10**
I worked on 4 distinct calendar days with documented progress each day, and on Day 3 I spent 7 hours thinking without writing a single line of code because the logic wasn't ready — that takes more discipline than just shipping something broken.

**Code quality: 7/10**
The shared types architecture and Zod schemas are clean and the audit logic is well-reasoned, but the OG preview image is unfinished and the 70/30 token assumption is a known approximation I haven't resolved yet.

**Design sense: 6/10**
I used Google Stitch AI to think through the UI before touching code which showed intentionality, but I admitted myself that the OG preview card came out rough and needs more work — the most shareable surface in the product isn't polished yet.

**Problem solving: 8/10**
The duplicate tool entry bug and the useCases schema decision were both caught through concrete thinking rather than just running tests, and the normalization approach for cross-benchmark comparison is a genuinely non-obvious solution to a real problem.

**Entrepreneurial thinking: 8/10**
I understood from day one that the audit logic has to be defensible to a finance person — not just technically correct but trustworthy to a non-technical decision maker — which is a product and business insight, not just an engineering one.