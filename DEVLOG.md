# Day 1 — 2026-05-07

**Hours worked:** 8

## What I did

Set up the project. Backend only today. Got the HTTP server, config, and logging running.

Then figured out the input form — what fields to collect, what the Zod schema looks like, how `pricingData.json` needs to be structured for the audit to work.

Then the audit logic. Spent most of the time thinking before writing anything. Came up with an approach, implemented it, added tests.

## What I learned

The `plan` field was open text at first. That's a problem because users can type anything or make typos and then evaluation breaks. Since we already have `pricingData.json` and know exactly what tools and plans exist, just make it a dropdown. Problem solved.

Also — every record in `pricingData.json` needs a `useCases` field. Without it there's no way to know which tools support what when a user says their use case is coding.

Then I made a mistake. I put `useCases` at the tool level:

```json
"gemini": {
    "name": "Gemini",
    "url": "https://gemini.google/subscriptions/",
    "useCases": ["writing", "data", "research", "mixed"],
    "plans": {
      "Plus":  { "pricePerSeat": 7.99,   "verifiedDate": "2026-05-07" },
      "Pro":   { "pricePerSeat": 19.99,  "verifiedDate": "2026-05-07" },
      "Ultra": { "pricePerSeat": 249.99, "verifiedDate": "2026-05-07" }
    }
}
```

Wrong. Gemini Plus has no CLI, no IDE access. If I tag the whole Gemini tool as supporting coding, I might recommend Gemini Plus for a coding use case. That's completely wrong. `useCases` has to be at the plan level. So:

```json
"gemini": {
  "name": "Gemini",
  "url": "https://gemini.google/subscriptions/",
  "plans": {
    "Plus":  {
      "pricePerSeat": 7.99,
      "verifiedDate": "2026-05-07",
      "useCases": ["writing", "data", "research", "mixed"]
    },
    "Pro":   {
      "pricePerSeat": 19.99,
      "verifiedDate": "2026-05-07",
      "useCases": ["coding", "writing", "data", "research", "mixed"]
    },
    "Ultra": {
      "pricePerSeat": 249.99,
      "verifiedDate": "2026-05-07",
      "useCases": ["coding", "writing", "data", "research", "mixed"]
    }
  }
}
```

Another thing — what if someone adds the same tool three times for different tasks:

```text
claude pro $20 writing
claude pro $20 coding
claude pro $20 design
```

Same person. Same `$20` subscription. Just uses it for three things. My first instinct was to evaluate each row separately — find a cheaper writing tool, saves `$5`. Next row saves `$2`. Next saves `$0`. Total savings `$7`.

That's completely wrong. He's paying one `$20` that covers all three. If he follows that advice and moves each use case to a separate cheaper tool he ends up paying `$15 + $18 + $20`. More than before. We'd be telling him to spend more money.

The fix is already there — the `mixed` use case option. If you use one subscription for multiple tasks, add it once and pick `mixed`. One record, covers everything. No fake savings.

## Blockers / what I'm stuck on

API-based evaluation. API tools are totally different — no seats, no fixed plans, billing changes every month based on tokens. Don't know yet what to even ask the user or how the logic should work.

## Plan for tomorrow

Figure out the API evaluation approach. What to collect from the user, what recommendations are even possible when usage data is so limited.

Also need to stress-test the subscription logic more before moving on.

---

# Day 2 — 2026-05-08

**Hours worked:** 4

## What I did

Thinking day. Almost entirely about API evaluation.

First thing I hit — can't just say "this model is better at coding than yours." There's no way to back that up. It's just an opinion.

So the question became: how do you actually justify a recommendation?

API users are mostly developers. They didn't pick their model randomly — they probably already know why they're using it. The real problem is they might not know there's another model that's nearly as capable for way less money. That's literally what this app is for.

So: benchmark-based scoring. Compare capability using real data, not just price.

Spent the rest of the day looking at which benchmarks exist, which ones are trusted, and how to normalize scores across them so they're actually comparable.

## What I learned

API evaluation and subscription evaluation are completely different problems. For subscriptions, price comparison is usually enough. For APIs, you have to validate capability first — the user is paying directly for model quality. A recommendation that ignores that isn't really a recommendation.

## Blockers / what I'm stuck on

Haven't validated if the normalization idea actually works with real data yet. Also not sure how strict the capability filtering should be.

## Plan for tomorrow

Implement the scoring and recommendation logic. Check it against real benchmark and pricing data.

---

# Day 3 — 2026-05-09

**Hours worked:** 7

## What I did

Whole day thinking. Zero code. Just research and trying to get the logic right in my head.

The problem with API recommendations is that two users paying the same amount every month can have totally different usage. One sends huge prompts with short outputs. Another sends tiny prompts with huge responses. Another uses reasoning models where hidden tokens cost a lot. Monthly spend alone tells you almost nothing about actual usage.

So the question that kept coming up was — what does a defensible recommendation even look like for an API user?

Can't just find the cheapest model. If someone is using Claude Opus 4.7 and spending `$150/month`, recommending a `$20/month` model without checking if it can actually do the job is wrong. The cheaper model might completely fall apart on their actual work.

So it's a constrained problem. Not just minimize cost — minimize cost while staying above some capability floor:

$$\text{Minimize Cost}(m)$$

Subject to:

$$\text{Capability}(m) \geq \text{Required Capability}$$

Where $m$ is the candidate model and capability comes from benchmark data.

That pushed me into researching benchmarks. Needed to understand what each one measures, how scores are calculated, and whether scores from different benchmarks can even be compared.

Looked at:
- SWE-bench for coding
- EQ-Bench for creative writing / emotional reasoning
- MMLU-Pro for research and general reasoning

Found a big problem. Benchmarks use completely different scoring systems. SWE-bench gives you a percentage. EQ-Bench gives you an Elo rating. You literally cannot compare `82.4%` and `2045 Elo` — they're on different scales. Elo has no ceiling. Percentages go from 0 to 100. Meaningless to put them side by side.

So I had to design a normalization step. Bring everything to the same 0–1 scale.

For percentages it's just:

$$s_{\text{normalized}} = \frac{s}{100}$$

So `82%` becomes `0.82`.

For Elo:

$$s_{\text{normalized}} = \frac{s - s_{\min}}{s_{\max} - s_{\min}}$$

Take the model's score, subtract the lowest score in the dataset, divide by the full range. Maps everything into 0–1.

One other decision — the system shouldn't be the one deciding what "good enough" means. That has to come from the user. So instead of the app deciding a model is acceptable, the user sets how much capability drop they're okay with.

I'm defaulting to 5%. If the current model's capability score is $c_{\text{current}}$, a candidate has to satisfy:

$$c_{\text{candidate}} \geq c_{\text{current}} \times (1 - 0.05)$$

Then the pipeline is:
1. score the current model
2. score alternatives
3. filter out anything below the threshold
4. from what's left, pick the cheapest

That feels honest. The recommendation is backed by data, the user controls the tradeoff, and you can actually explain why a specific model was recommended.

One more hard thing today — most users only know their monthly spend, their provider, and their model. They don't know their token counts. So I have to infer usage from just the cost.

My approach:

$$\text{Estimated Tokens} = \frac{\text{Monthly Spend}}{\text{Weighted Average Token Price}}$$

For the weighted average I'm assuming 70% input, 30% output:

$$p_{\text{avg}} = 0.7 \cdot p_{\text{input}} + 0.3 \cdot p_{\text{output}}$$

Then:

$$\text{Estimated Monthly Tokens} = \frac{\text{Monthly Spend}}{p_{\text{avg}}}$$

Not perfect. But should be directionally right.

Didn't write any code today because the logic was still shifting throughout the day. Didn't want to implement something I'd rip out tomorrow.

## What I learned

API evaluation is not a pricing problem. It's a capability problem that also happens to involve pricing. If you skip the capability check, the recommendation is just noise.

Also — raw benchmark scores are useless for comparison without normalization. The whole point of the normalization step is to turn a bunch of incompatible scoring systems into one common scale you can actually reason about.

And the system should never be opinionated about quality. It should just say: "this model is 4.2% below your current capability and would cut your monthly cost by 68%." Let the user decide if that tradeoff is worth it.

One more thing — the benchmark you pick has to match the use case. Using SWE-bench to recommend a writing model would give garbage results. The mapping has to be:

$$\text{Use Case} \rightarrow \text{Relevant Benchmark} \rightarrow \text{Capability Score}$$

## Blockers / what I'm stuck on

The normalization looks fine in theory but I haven't tested it on real data. One thing that worries me — two different benchmarks might have really different score distributions. One might cluster all the top models between `0.92–0.97`. Another might spread them across `0.40–0.95`. Same normalized difference, completely different real-world meaning. Might need percentile normalization or z-score instead of simple min-max. Not sure yet.

The `70/30` token assumption also bothers me. Coding agents generate huge outputs. Retrieval workflows have massive inputs. Reasoning models have hidden tokens. The assumption might be way off for some workloads. Need to figure out if a static assumption is enough or if I need workload-specific heuristics.

## Plan for tomorrow

- Add test cases for the audit logic and check it more thoroughly.
- If it holds up, start on the UI.
- Design in Google Stitch AI first before touching code.

---

# Day 4 — 2026-05-10

**Hours worked:** 8

## What I did

Started with Google Stitch AI to explore designs for the audit form before writing any code. Wanted to have a clear picture in my head first. That helped — once I knew what I was building, implementation was straightforward.

Built the audit form UI. Most of the structure was already settled from the backend work so it was mostly just putting things into components.

Then moved the common types and Zod schemas into a `shared/` folder. Created the directory, pulled everything duplicated between frontend and backend into one place. Should've done this earlier.

Then the audit result UI with the benchmark comparison graphs. Getting the graphs to actually read clearly took some back and forth but it came out decent.

Also added open graph preview for shared audit URLs — so when someone shares a link you get a preview card. Works, but the preview image is rough and needs more work. Not done yet.

## What I learned

One thing came up while implementing the scoring logic — I realized the normalization step I designed on Day 3 is unnecessary.

The reason I thought I needed it: benchmarks use different scales. SWE-bench is a percentage, EQ-Bench is Elo. You can't compare them directly. So I planned to normalize everything to 0–1 before comparing.

But when I actually wrote the gate logic, I noticed the comparison never crosses benchmarks. The `useCase → benchmark` mapping is 1:1 — if the user's use case is coding, both the current model and every candidate are scored on SWE-bench. If the use case is writing, everything uses EQ-Bench. You're always comparing a number against another number on the same scale. Elo against Elo. Percentage against percentage. The incompatibility problem I was solving doesn't actually exist in this design.

The quality floor calculation confirms it:

```
minAcceptableScore = currentScore × (1 − dropCapacityBy / 100)
candidateScore >= minAcceptableScore
```

Both sides are raw scores on the same benchmark. No normalization needed. Removed it.

The rest of it was just executing on what I already had planned. When implementation goes this smoothly it usually means the thinking before it was solid.

## Blockers

None. Only thing not finished is the OG preview image but that's a polish issue, not a blocker.

## Plan for tomorrow

- Implement the mail system.
- Add more cheap/Chinese models to the API options — need better coverage for cost-effective recommendations.
- If there's time, work on the Entrepreneurial assessment files.

---

# Day 5 — 2026-05-11

**Hours worked:** 8

## What I did

Lead capture and storage. End to end.

Built the `LeadCaptureForm` with optional fields beyond email — company name, role, and team size. Optional because not everyone wants to fill those in, and a barrier at capture is worse than an incomplete record.

Chose Supabase for storage. Simple to set up, Postgres underneath, and free tier is more than enough for now. Backend runs on Render. Resend handles transactional email — the confirmation goes out immediately on submit, and the copy notes that Credex will follow up on high-savings cases. That framing matters: it's not just a receipt, it's a reason to open it.

For abuse protection went with rate limiting. 5 lead submissions per IP per 15 minutes (audit endpoint allows 30). Simple, no friction for real users, stops automated spam. Documented the choice in the code — didn't want to add hCaptcha friction at this stage and honeypots felt like false confidence without a real rate limit underneath anyway.

Then deployed. Frontend on Vercel, backend on Render. Both live.

## What I learned

Nothing surprising today. Supabase + Render + Resend is a well-worn stack and it behaved exactly as expected. Rate limiting at the edge is fast enough that it doesn't need its own service — middleware on the Render backend is fine at this scale.

One thing worth noting — keeping the optional fields truly optional (not just visually) meant being careful in the DB schema too. Made them nullable columns, not empty-string defaults. Better for querying later.

## Blockers

None.

## Plan for tomorrow

Application is almost done. Main thing left is going back through the audit engine and stress-testing it against edge cases — unusual pricing structures, API users with extreme token ratios, subscription entries with mixed use cases. Want to make sure the logic holds before calling it finished.

---

# Day 6 — 2026-05-13

**Hours worked:** 5

## What I did

Polish and hardening day. No new architecture — just making what exists more correct and more complete.

First thing: the email report was sending a flat text summary with no visual structure. Added `BenchmarkChart.tsx` as a proper email component — a threshold-marker bar chart that renders inline in the email. The idea is that when someone forwards their audit report internally or re-reads it a week later, the numbers should be as clear as they were on screen. Also refactored `FullAuditReport` to use it and cleaned out the `clsx` and Iconify imports that were no longer doing anything.

Then fixed a real bug in the Resend mailer. It was swallowing errors silently — if the send failed for any reason, the controller never knew, the user never knew, and the lead was stored in the DB as if everything worked. Changed it to surface errors properly and log the Resend message ID on success. Should've caught this earlier.

Database hardening: increased the connection pool timeout from the default to 10 seconds and enabled TCP keepAlive. The backend runs on Render's free tier which spins down after inactivity. On cold start the first DB call was timing out before the connection could establish. The longer timeout gives the pool enough time to recover. TCP keepAlive stops the cloud provider from silently dropping idle connections mid-session.

Updated `ARCHITECTURE.md` with a full system diagram and proper module-level documentation. The diagram was there before but incomplete — it wasn't covering the email pipeline or the PDF service. Also documented what each module owns and why, so anyone reading it can follow the data flow without digging into the code.

Added the PDF generation service and controller using Puppeteer. This gives users a downloadable copy of their audit report — the full breakdown, AI summary, and benchmark comparisons in one file. Added `ReportPreviewModal` on the frontend so users can see what the PDF looks like before downloading. It's the bonus feature from the spec. Shipped it last because the MVP had to work first.

Added `USER_INTERVIEWS.md` with notes from three developer conversations. These informed a few decisions that are already in the product — particularly why the context window field exists as a constraint and why the audit reframes capability, not just cost, for API users.

Updated vendor pricing data and removed a stale Render services JSON artifact that was accidentally committed.

## What I learned

The Resend silent-failure bug was a reminder that error handling around third-party APIs needs to be explicit from the start, not patched in later. Swallowed errors are worse than noisy errors — you think the system works and it doesn't.

The TCP keepAlive + timeout change on the DB pool also taught me something practical: managed hosting on free tiers has real constraints that don't show up in local dev. The connection drop happens only in production after a cold start, and only under timing conditions you won't hit locally. Worth documenting the fix and the reason for the next person.

## Blockers / what I'm stuck on

None. Everything is live and working end to end. The OG preview image is still rougher than I'd like — it renders correctly but the visual design isn't as polished as the rest of the results page. Not a blocker, but it affects the shareable URL's first impression.

## Plan for tomorrow

Final pass: TESTS.md and PRICING_DATA.md need to be written out properly — they're the two documentation gaps that are still empty. After that, take screenshots of the full flow for README.md. Then the submission is complete.
