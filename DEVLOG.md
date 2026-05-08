## Day 1 — 2026-05-07

**Hours worked:** 8

**What I did:**
I setup the project. Then I entirely focused on backend. I setup the HTTP server, config and logging.

Then I worked on the input form, what fields to add and what could be the Zod schema, and how my pricingData.json should look like to evaluate the auditing.

Then I worked on audit logic. Most of the time was spent thinking about how to evaluate. I came up with one approach, implemented that approach and also added tests for that logic.

**What I learned:**
Initially I was stuck because if I set the plan field as open text, then the user could type anything or give typos, so it makes it hard to evaluate. The realization was that since we already have the pricingData.json, we know exactly which tools and plans we support. So I made plan a restricted dropdown instead of open text. This way invalid inputs are impossible.

In order to evaluate the records, we need a useCases field for each record in pricingData.json. Otherwise we cannot tell if a user says useCase is coding, which tools actually support that.

Another problem I faced was where to put the useCases field. I initially thought of putting it at the tool level like this:

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

But this is wrong. Some plans within the same tool don't give coding as a feature. For example Gemini Plus has no Gemini CLI and no Antigravity IDE access. If we tag the entire Gemini tool as supporting coding, we might recommend Gemini Plus for a coding use case which is completely wrong. The realization was that useCases has to live at the plan level, not the tool level. Different plans within the same vendor support different capabilities.

so, the I finally concluded json will be following like below one

  "gemini": {
    "name": "Gemini",
    "url": "https://gemini.google/subscriptions/",
    "plans": {
      "Plus":  { "pricePerSeat": 7.99,   "verifiedDate": "2026-05-07", "useCases": [ "writing", "data", "research", "mixed"] },
      "Pro":   { "pricePerSeat": 19.99,  "verifiedDate": "2026-05-07", "useCases": ["coding", "writing", "data", "research", "mixed"] },
      "Ultra": { "pricePerSeat": 249.99, "verifiedDate": "2026-05-07", "useCases": ["coding", "writing", "data", "research", "mixed"] }
    }
  },

Another problem I faced was around how a user might add the same tool multiple times for different tasks. For example:

claude pro $20 writing
claude pro $20 coding
claude pro $20 design

Here the same person adds Claude Pro three times because he uses it for three different tasks. But he only pays one $20 subscription that covers all three.

My initial thought was to evaluate each record separately. Claude pro $20 writing, find a cheaper writing tool, saves $5. Next record saves $2. Next record saves $0. Total savings = $7.

But this is entirely wrong. In a single subscription he gets all three use cases covered. If he follows our recommendation and switches each task to a separate cheaper tool, he would end up paying $15 plus $18 plus $20 which is more than his original $20 plan. We would be telling him to spend more money while claiming he saves $7. 

The realization was that the assessment already solves this with the mixed use case option. If a user uses the same subscription for multiple tasks, they should add it once and select mixed as the use case. That way we evaluate it as one record covering all tasks, not three separate records. This prevents the false savings calculation entirely.

**Blockers / what I'm stuck on:**
API based evaluation is a blocker. API based tools work completely differently from monthly subscription tools. There are no seats, no fixed plans, and billing varies every month based on token consumption. I have to figure out what input fields make sense to ask the user and how the evaluation logic should work differently from the subscription based approach.

**Plan for tomorrow:**
Have to figure out the API based evaluation approach. What fields to collect from the user and what recommendations are actually possible given limited information about their usage patterns.

Also have to test the monthly based tool evaluation logic more thoroughly and cover more edge cases before moving forward.