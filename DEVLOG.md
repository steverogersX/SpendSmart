# Day 1 — 2026-05-07

**Hours worked:** 8

## What I did

I setup the project. Then I entirely focused on backend. I setup the HTTP server, config and logging.

Then I worked on the input form, what fields to add and what could be the Zod schema, and how my pricingData.json should look like to evaluate the auditing.

Then I worked on audit logic. Most of the time was spent thinking about how to evaluate. I came up with one approach, implemented that approach and also added tests for that logic.

## What I learned

Initially I was stuck because if I set the `plan` field as open text, then the user could type anything or give typos, so it makes it hard to evaluate. The realization was that since we already have the `pricingData.json`, we know exactly which tools and plans we support. So I made `plan` a restricted dropdown instead of open text. This way invalid inputs are impossible.

In order to evaluate the records, we need a `useCases` field for each record in `pricingData.json`. Otherwise we cannot tell if a user says `useCase` is coding, which tools actually support that.

Another problem I faced was where to put the `useCases` field. I initially thought of putting it at the tool level like this:

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

But this is wrong. Some plans within the same tool don't give coding as a feature. For example Gemini Plus has no Gemini CLI and no Antigravity IDE access. If we tag the entire Gemini tool as supporting coding, we might recommend Gemini Plus for a coding use case which is completely wrong. The realization was that `useCases` has to live at the plan level, not the tool level. Different plans within the same vendor support different capabilities.

so, the I finally concluded json will be following like below one

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

Another problem I faced was around how a user might add the same tool multiple times for different tasks. For example:

```text
claude pro $20 writing
claude pro $20 coding
claude pro $20 design
```

Here the same person adds Claude Pro three times because he uses it for three different tasks. But he only pays one `$20` subscription that covers all three.

My initial thought was to evaluate each record separately.

- Claude pro `$20` writing → find a cheaper writing tool → saves `$5`
- Next record saves `$2`
- Next record saves `$0`

Total savings = `$7`

But this is entirely wrong. In a single subscription he gets all three use cases covered. If he follows our recommendation and switches each task to a separate cheaper tool, he would end up paying `$15 + $18 + $20` which is more than his original `$20` plan. We would be telling him to spend more money while claiming he saves `$7`.

The realization was that the assessment already solves this with the `mixed` use case option. If a user uses the same subscription for multiple tasks, they should add it once and select `mixed` as the use case. That way we evaluate it as one record covering all tasks, not three separate records. This prevents the false savings calculation entirely.

## Blockers / what I'm stuck on

API based evaluation is a blocker. API based tools work completely differently from monthly subscription tools. There are no seats, no fixed plans, and billing varies every month based on token consumption. I have to figure out what input fields make sense to ask the user and how the evaluation logic should work differently from the subscription based approach.

## Plan for tomorrow

Have to figure out the API based evaluation approach. What fields to collect from the user and what recommendations are actually possible given limited information about their usage patterns.

Also have to test the monthly based tool evaluation logic more thoroughly and cover more edge cases before moving forward.

---

# Day 2 — 2026-05-08

**Hours worked:** 4

## What I did

I was spending most of the time thinking about how to evaluate the API based suggestions for user given inputs.

Then I got the idea that we cannot simply say okay this model is better at coding than the model the user currently uses. That would be completely wrong because we have no objective way to prove why model X is better than model Y for a specific use case.

So I started thinking about how to justify recommendations properly.

The realization was that we need some kind of scoring system that explains why we would choose model X over model Y for use case Z while also being cheaper.

I am assuming users who use APIs are mostly developers or technical users. They probably already know why they are using their current model. The problem is not that they picked randomly. The real problem is they may not know if another model exists that gives almost the same capability for a much lower price.

That is the whole point of our application.

So I concluded that we need a scoring system based on benchmark data instead of making recommendations purely from pricing.

I also spent time researching what benchmarks are trusted for different use cases and how those scores can be normalized into a common scale for comparison.

## What I learned

API based evaluation is completely different from subscription based evaluation.

For subscription tools, price comparison is enough in many cases because plans are fixed.

For APIs, capability matters much more because the user is directly paying for model quality and performance.

A recommendation without capability validation is not defensible.

Because of that, benchmark based scoring becomes necessary for API recommendations.

## Blockers / what I'm stuck on

Still need to validate whether the normalization and scoring logic actually makes sense with real benchmark data.

Also need to figure out how strict the recommendation filtering should be when comparing models with different benchmark strengths.

## Plan for tomorrow

Have to implement my scoring and recommendation logic.

Need to cross check the logic again with actual benchmark and pricing data to make sure the recommendations are reasonable before moving forward.

---


# Day 3 — 2026-05-08

**Hours worked:** 7

## What I did

Spent the entire day thinking about how to evaluate API-based tool usage. No code written today — purely research, systems thinking, and problem solving.

The main problem today was realizing that API recommendation systems are fundamentally different from subscription recommendation systems.

For subscription products, recommendations are relatively simple because plans are discrete and human-readable:

* fixed monthly price
* seat limits
* feature limits
* storage limits
* predefined tiers

You can compare two subscription tools directly because the pricing structure itself already contains the constraints.

API products do not work like this.

API pricing is continuous, usage-based, and model-dependent. Two users paying `$150/month` may have completely different usage patterns:

* one may send massive prompts with low output
* another may send tiny prompts with huge generations
* another may heavily use reasoning models with high output-token costs

This means monthly spend alone contains almost no direct information about actual usage volume or workload characteristics.

The core challenge became:

> "What is a defensible recommendation for an API user?"

A recommendation cannot simply optimize for lower cost.

If a user currently uses a high-capability model like Claude Opus 4.7 for writing tasks and spends `$150/month`, recommending a `$20/month` model without validating quality would be irresponsible. The cheaper model may completely fail the actual workload despite being cheaper.

So the recommendation problem immediately became a constrained optimization problem:

We are not minimizing cost alone.

We are minimizing cost subject to a minimum acceptable capability threshold.

Conceptually the problem became:

$$\text{Minimize Cost}(m)$$

Subject to:

$$\text{Capability}(m) \geq \text{Required Capability}$$

Where:

* $m$ = candidate model
* capability is derived from benchmark performance
* required capability is relative to the user's current model

This led to researching benchmark ecosystems across LLM providers and evaluation communities.

Spent significant time understanding:

* what each benchmark actually measures
* what tasks the benchmark represents
* how scores are computed
* whether scores are comparable across benchmarks
* whether benchmarks are trusted by developers

Benchmarks researched:

* SWE-bench for coding capability
* EQ-Bench for creative writing and emotional reasoning
* MMLU-Pro for research/general reasoning
* additional investigation into agentic and workflow benchmarks

One major realization was that benchmarks are not standardized at all.

Different benchmarks use entirely different scoring systems:

* percentage accuracy
* pass@k
* Elo systems
* pairwise voting systems
* task completion metrics

Examples:

SWE-bench:

$$\text{Score} = 82.4\%$$

EQ-Bench:

$$\text{Score} = 2045 \text{ Elo}$$

These values cannot be compared directly because they exist on completely different mathematical scales.

An Elo score is relative and open-ended.

A percentage score is bounded:

$$0 \leq p \leq 100$$

Elo has no universal upper bound.

So a major part of the day was spent designing a normalization strategy.

The idea was to transform every benchmark into a common normalized capability space:

$$0 \leq s_{\text{normalized}} \leq 1$$

For percentage-based benchmarks:

$$s_{\text{normalized}} = \frac{s}{100}$$

Example:

$$82\% \rightarrow 0.82$$

For Elo-based systems:

$$s_{\text{normalized}} = \frac{s - s_{\min}}{s_{\max} - s_{\min}}$$

Where:

* $s$ = model Elo
* $s_{\min}$ = minimum Elo in dataset
* $s_{\max}$ = maximum Elo in dataset

This converts all benchmarks into the same bounded range.

The important realization was that the system should never decide "acceptable quality" itself.

That threshold must come from the user.

So instead of asking:

> "Which model is best?"

The system asks:

> "How much capability degradation are you willing to tolerate for cost savings?"

Default assumption explored today:

$$\text{Allowed Drop} = 5\%$$

If current model capability is $c_{\text{current}}$, then acceptable candidate models must satisfy:

$$c_{\text{candidate}} \geq c_{\text{current}} \times (1 - 0.05)$$

This transforms the recommendation system into a constrained filtering pipeline instead of subjective ranking.

The recommendation then becomes:

1. estimate current model capability
2. estimate alternative model capability
3. filter alternatives below acceptable threshold
4. among remaining candidates, minimize estimated monthly cost

This felt significantly more defensible because recommendations are now:

* benchmark-backed
* mathematically explainable
* user-controlled
* not dependent on subjective opinions

Also spent time researching API pricing structures across providers.

Another difficult problem identified:

Most users know:

* monthly spend
* current provider
* current model

But they do not know:

* token volume
* input token count
* output token count
* exact request distribution

So token usage must be inferred indirectly.

Initial approximation explored:

$$\text{Estimated Tokens} = \frac{\text{Monthly Spend}}{\text{Weighted Average Token Price}}$$

But weighted average token price itself depends on input/output distribution.

Explored assuming $70\%$ input tokens and $30\%$ output tokens. So:

$$p_{\text{avg}} = 0.7 \cdot p_{\text{input}} + 0.3 \cdot p_{\text{output}}$$

Then:

$$\text{Estimated Monthly Tokens} = \frac{\text{Monthly Spend}}{p_{\text{avg}}}$$

This approximation is obviously imperfect, but it may be sufficient for directional recommendations.

A large part of today was spent validating whether the assumptions themselves are reasonable enough to produce recommendations that are useful instead of misleading.

No implementation today because the conceptual model itself was still unstable and evolving throughout the day.

The majority of the work was systems reasoning, benchmark analysis, mathematical normalization design, and defining recommendation constraints.

---

## What I learned

The biggest realization today was that API evaluation is not primarily a pricing problem.

It is a capability-constrained optimization problem.

Cost alone is meaningless without validating whether the replacement model can maintain acceptable task quality.

A cheaper model is only useful if it remains above the user's acceptable capability threshold.

Another important realization was that benchmark interpretation matters more than benchmark existence.

A benchmark score without normalization is not directly usable in a recommendation engine because different benchmarks operate on incompatible scales.

Normalization effectively converts heterogeneous evaluation systems into a unified comparison space.

Mathematically, the normalization layer becomes a transformation function:

$$f : S_{\text{raw}} \rightarrow [0,1]$$

Where:

* $S_{\text{raw}}$ is benchmark-specific score space
* output becomes standardized capability space

This creates a benchmark-agnostic recommendation pipeline.

Also learned that recommendation systems become far more explainable when framed as constraints rather than opinions.

Instead of:

> "This model is better."

The system can explain:

> "This model is 4.2% below your current capability score while reducing projected monthly cost by 68%."

That is objective and measurable.

Another major insight:

The quality of recommendations will depend heavily on benchmark selection per use case.

Using SWE-bench for writing recommendations would produce nonsensical outputs.

So use-case → benchmark mapping becomes critical.

Conceptually:

$$\text{Use Case} \rightarrow \text{Relevant Benchmark} \rightarrow \text{Capability Score}$$

The benchmark layer itself becomes domain-specific.

---

## Blockers / what I'm stuck on

The normalization approach makes sense theoretically, but it has not yet been validated against real benchmark datasets.

Need to verify whether normalized scores preserve meaningful ranking relationships across models.

Potential concern:

Two benchmarks may have very different score distributions.

Example:

* one benchmark may cluster all strong models tightly between `0.92–0.97`
* another may spread models across `0.40–0.95`

This means equal normalized differences may not correspond to equal real-world quality differences.

Need to investigate whether percentile normalization or z-score normalization would preserve relative capability better.

Another unresolved issue:

Current token estimation relies on assumed input/output ratios.

But different workloads have dramatically different token shapes:

* coding agents may generate huge outputs
* retrieval workflows may have massive inputs
* reasoning models may consume hidden reasoning tokens

So the `70/30` assumption may fail badly for some workloads.

Need to determine whether:

* static assumptions are sufficient
* workload-specific heuristics are needed
* users should optionally provide workload profiles

Still uncertain how reliable the inferred token estimation will be in production scenarios.

---

## Plan for tomorrow

* Have to add test cases for audit logic and cross check more.
* if logic work as i expected and then we're ready to implement the UI.
* have to create the ui design using google stich ai.
