# USER_INTERVIEWS.md

## Interview 1 — Tarun, Full Stack Developer @ Trizen Ventures

**Name:** Tarun
**Role:** Full Stack Developer
**Company:** Trizen Ventures
**Interview duration:** ~12 minutes
**Company stage:** Early-stage startup

---

### Background

Tarun has been using Cursor for about four months. He's on the $20/month Pro plan and pays out of pocket — his company doesn't cover AI tooling costs. Alongside Cursor, he uses OpenRouter ($10/month) through the Roo Code extension in VS Code, giving him access to free and low-cost models for lighter tasks.

His typical stack: Cursor for hard problems, Qwen (via OpenRouter) for small changes, and stronger Chinese models like DeepSeek or Kimi for mid-difficulty coding when he doesn't want to burn Cursor credits.

**Total monthly spend: ~$30**

---

### Direct Quotes

> "I have to use it carefully for my entire month. I was spending every token like I used to spend money."

> "If I ask some random question or a vague prompt, it does shitty work and burns all my credits."

> "I just Google: is Kimi K2 as good as Opus 4.5? And Google answers with benchmark comparisons. I only look at: is it good enough or not. Then I use it."

> "Most devs on social media are saying this model outperforms that model on benchmark X and Y. I don't always know what those benchmarks measure, but the model providers release them too, so I trust them — somewhat."

---

### The Most Surprising Thing He Said

Tarun's benchmark trust was more nuanced than expected. He doesn't blindly trust benchmark numbers — he estimated he trusts them about 60–80% of the way. He acknowledged models rarely perform in real-world tasks exactly as benchmarks suggest, but still uses them as a directional signal because they're the best available proxy. What was surprising: even a developer who is cost-conscious and skeptical by nature still defaults to benchmarks as the decision framework. He doesn't have a better system, and neither does most of the industry.

---

### What It Changed About the Design

This interview forced a rethink of how SpendSmart recommends alternative models.

The naive approach — "you're spending $150/month on Claude Opus, switch to this $20/month model and save $130" — is wrong. A cheaper model that can't handle the user's actual workload isn't a saving; it's a downgrade that creates invisible costs (rework, slower output, worse quality).

The correct framing is a **constrained optimization problem**:

$$\text{Minimize } \text{Cost}(m) \quad \text{subject to} \quad \text{Capability}(m) \geq \text{Required Capability}$$

Where $m$ is the candidate replacement model, and capability is evaluated against the user's declared primary use case (coding, writing, research, data, or mixed).

This pushed me to research which benchmarks are actually meaningful per use case:

- **SWE-bench** — coding agents; measures real GitHub issue resolution rate (0–100%)
- **EQ-Bench** — creative writing and emotional reasoning; uses Elo ratings
- **MMLU-Pro** — research and general reasoning; measures accuracy across expert-level questions (0–100%)

This immediately surfaced a structural problem: **these benchmarks are not on the same scale.** SWE-bench reports a percentage. EQ-Bench reports an Elo rating with no ceiling. Comparing `82.4%` and `2045 Elo` directly is meaningless — they measure different things in different units.

The design consequence: SpendSmart cannot recommend a model substitution by raw score comparison across benchmarks. Instead, recommendations are scoped — a model is only compared against other models on the *same benchmark, for the relevant use case*. Within that constraint, the cheapest model above a defined capability threshold (e.g., top 30% of SWE-bench for a coding-primary user) is surfaced as the recommendation. Cross-benchmark ranking is explicitly avoided.

---

## Interview 2 — Shiva, Full Stack Developer @ AI Planet

**Name:** Shiva
**Role:** Full Stack Developer
**Company:** AI Planet
**Interview duration:** ~11 minutes
**Company stage:** Startup

---

### Background

Shiva is on the Claude Max $200/month plan, covered entirely by his company. He believes they may also be on an Enterprise plan — he isn't sure, and doesn't track it. His only relationship with the subscription is a single variable: weekly token limits. As long as he hasn't hit the ceiling, he codes. When he does, he stops for the week.

For product building, AI Planet uses both the GPT and Claude APIs. Cost per token is treated as secondary — shipping fast is the priority. The team is under constant pressure to deliver, and that pressure has crowded out any incentive to audit or optimize spend.

**Monthly spend (personal tooling):** ~$200 — company-paid
**Monthly spend (product APIs):** Unknown to Shiva; managed elsewhere

---

### Direct Quotes

> "I almost forgot how to write code. I just ask Claude for every task and I don't care about tokens — I have higher limits."

> "All I need to do is: use Claude, do nothing."

> "I became a prompt engineer. Sometimes it irritates me — I say something, it does something else."

> "We're not strict about token consumption for API calls. We want the work done. Tokens are secondary."

> "Since we're a startup, we keep getting pushed to ship. So we're not that strict about costs."

> "I mostly use Google and LLM responses to make decisions — that's how I found out which models are good for which tasks."

---

### The Most Surprising Thing He Said

Shiva's relationship with cost is the polar opposite of Tarun's — yet his decision-making process for choosing models is nearly identical: defer to Google and social media consensus. The surprise wasn't that Shiva doesn't personally track spend (that was expected from a company-paid plan). It was that even at a company actively building AI-powered products and burning real API budget, no one on the engineering team owns that cost line. Spend is invisible because it's everyone's problem, and therefore no one's.

---

### What It Changed About the Design

This interview revealed a second distinct user segment the initial design had underserved.

Tarun is **cost-constrained**: every dollar matters, and the tool's value for him is surfacing cheaper capable alternatives. Shiva is **limit-constrained**: money isn't his variable — headroom is. He's not asking "how do I spend less?" He's asking "am I getting the most out of what I have?" and implicitly, "is my company's API spend being used efficiently?"

These are different problems. An audit that leads with "you could save $X/month" is irrelevant to Shiva — the bill isn't his. What is relevant: whether the plan is sized correctly for the team's usage patterns, and whether API calls on the product side are being routed to appropriately-capable (not just default-to-Opus) models.

This sharpened the segmentation logic in the audit engine. When the user indicates their company pays for AI tooling, the audit reframes — away from personal cost savings and toward **plan efficiency and usage fit**. The Credex CTA also shifts: instead of "book a consultation to cut your bill," it becomes "you may be able to get the same limits for less — here's how Credex credits work." A softer pitch, but a more honest one for this persona.

It also confirmed that the API spend section of the audit (GPT / Claude / Anthropic API direct) is where significant organizational money flows — and where, at companies like AI Planet, no one is currently watching.

---

## Interview 3 — Venkatesh, Full Stack Developer (Freelance / Unemployed)

**Name:** Venkatesh
**Role:** Full Stack Developer (self-directed, between jobs)
**Company:** N/A — building independently
**Interview duration:** ~13 minutes
**Company stage:** Pre-revenue, solo builder

---

### Background

Venkatesh is currently unemployed and building projects to grow his skills and strengthen his resume. He has no paid subscriptions — he uses the free tiers of ChatGPT and Claude for chat, and the Gemini free API tier for his applications. Cost is his primary constraint on every decision.

His current obsession is agentic AI — specifically multi-agent swarms, where dozens or hundreds of agents run in parallel, each handling a small subtask. He follows the space closely: technical blogs, research papers, and product launches from companies like Kimi and Cursor. He came into the interview with more model-selection sophistication than either of the previous two interviewees.

**Monthly spend:** ~$0 (free tiers only)

---

### Direct Quotes

> "I'm so obsessed with AI agents — their capabilities. I read a lot of blogs and tech news about agents and follow them regularly."

> "Each agent gets a sub-task — a small task. So each agent doesn't have to be as good as Opus 4.5 or need a huge context window. You can use a smaller Qwen model for task X to complete it fast and cheaper."

> "Cost is my main priority. I'm unemployed. I have very little money. I'm building this for knowledge and for my resume."

> "For smaller tasks, I probably need only a 4K context window. In agent swarms, tasks are mostly tiny — as far as I know from what I've read."

> "Chinese models are definitely my first option. I research good, cheap, and capable models constantly."

> "When I choose a model for task X, I definitely look at trusted benchmarks — especially tool-calling benchmarks, since the models have to be good at calling tools in an agentic workflow."

---

### The Most Surprising Thing He Said

Venkatesh arrived with a specific, technically grounded model selection framework — more structured than either Tarun or Shiva — and he arrived at it entirely through self-directed research while unemployed and spending nothing. The surprising detail wasn't his cost sensitivity (obvious given his situation), but his insight about context window sizing in agent swarms: that smaller context windows are not a limitation but an intentional fit for subtask-level agents. Most users treat a larger context window as straightforwardly better. Venkatesh understood that over-provisioning context for a small task means paying for tokens you won't use, and that in a swarm architecture, the right model is often the smallest one that clears the capability and context bar for that specific subtask — not the most powerful one available.

---

### What It Changed About the Design

Venkatesh introduced a third optimization variable that the first two interviews hadn't raised: **context window as a constraint, not just a feature**.

Tarun optimizes for: capability ≥ threshold, then minimize cost.
Shiva optimizes for: nothing (company pays, ship fast).
Venkatesh optimizes for: capability ≥ threshold AND context window fits task size, then minimize cost.

This is a tighter constraint, and it's the right one for agentic use cases. A model with a 1M token context window costs more per token than one with a 32K window — and for a subtask that will never exceed 4K tokens, that extra capacity is pure waste.

The design consequence: the audit form needs an optional **context window range field** — minimum required context for the user's tasks. When provided, the recommendation engine filters out models whose context window falls below the floor, but also surfaces the cost premium being paid for excess context headroom. For most users this field will be left blank; for power users building agentic systems, it's the most important filter in the whole tool.

This also introduced a new audit finding type: **context window mismatch** — cases where a user is paying for a model with a 200K context window but their declared use case (e.g., short agentic subtasks, simple code completions) would be fully served by a 16K or 32K model at a fraction of the cost. This finding doesn't appear in any existing AI spend tool and is directly actionable.

---

## Cross-Interview Conclusion

All three interviews pointed to the same primary user: **developers**.

Not finance teams. Not CTOs reading dashboards. Developers — the people who actually choose which model to call, which plan to stay on, and which tools to open every morning. Even at AI Planet, where a company budget covers the bill, the developer (Shiva) is the one with hands on the tooling. Even in the most cost-conscious scenario (Tarun), the person making daily optimization decisions is a developer. Even the zero-spend builder (Venkatesh) is a developer doing more model research than most paid teams.

This matters for distribution. Developer trust doesn't stay with one developer — it spreads. Developers talk to other developers in Slack channels, Discord servers, and GitHub threads. When a tool earns a developer's trust, they refer it internally: to their manager, to the HR team evaluating tool budgets, to the finance person asking why the API bill jumped. Most early-stage startups are founded or led by developers, and even in larger companies, purchasing decisions for developer tooling are heavily influenced by the developers using it — HR and finance teams often don't have the context to evaluate these tools independently.

The implication for SpendSmart: **win developers first, and the organizational referral follows.** The audit result page — the shareable URL, the clean breakdown, the numbers a non-technical person can read — is not just a viral loop. It's the artifact a developer sends to their finance lead to justify a switch.