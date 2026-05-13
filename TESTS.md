# Test Suite

## How to run

```bash
# From repo root
cd backend && npm test

# With watch mode
cd backend && npm test -- --watch

# Single test file
cd backend && npm test -- auditService
```

CI runs the same command on every push/PR to `main` via `.github/workflows/ci.yml` (the `backend` job, `npm test` step).

---

## Audit engine tests

All 8 tests live in one suite file that drives the audit engine through structured JSON fixtures.

### File: `backend/src/__tests__/auditService.test.ts`

Calls `auditService({ tools: [input] })` and compares `result.tools[0]` to `expectedOutput`. The Gemini AI-summary is not asserted — only `result.tools` is checked, so no external API credentials are needed.

Fixture data: `backend/src/__tests__/data/`

---

### API audit — `data/api_test_cases.json` (6 tests)

| # | Description | What it covers |
|---|---|---|
| 1 | Candidate passes all gates → recommendation | Happy path. `claude-opus-4-5` / `research` / $1 000/month. `gpt-5-4` clears all 7 gates (Chinese gate skipped — not Chinese; use case match; score within 5 % tolerance; cheaper weighted price; savings ≥ 30%; no ctx req). Asserts full `bestRecommendation` shape, `otherOptions` order (savings desc), and `summary` string. |
| 2 | Quality gate excludes low-score models | `claude-opus-4-5` / `agentic` / `dropCapacityBy=5`. `claude-haiku-4-5` (score 45.4) and `gpt-5-4-nano` (49.2) fall below `minAcceptable=60.515` → dropped at Gate 3. Only `gpt-5-4` and `claude-sonnet-4-6` survive. |
| 3 | Savings gate drops marginally cheaper model | `claude-sonnet-4-6` / `coding` / `dropCapacityBy=20`. `gpt-5-4` is cheaper but saves only ~5.3 % < the 30 % threshold → dropped at Gate 5. `claude-haiku-4-5` (~66.7 % savings) is the only recommendation. |
| 4 | No model supports the requested use case → optimal | `claude-sonnet-4-6` / `data`. No API model lists `data` in its `useCases`. Every candidate drops at Gate 2. `status = 'optimal'`, `bestRecommendation = null`, `currentModelScore = null`. |
| 5 | Context window requirement eliminates cheapest model | `claude-opus-4-5` / `coding` / `contextWindow=500000`. `claude-haiku-4-5` would save the most but its 200 k context < 500 k → dropped at Gate 6. `gpt-5-4` (1.05 M tokens) becomes best recommendation. |
| 6 | Current model is already cheapest → optimal | `claude-haiku-4-5` / `coding`. Weighted price 2.2 is the lowest tracked. Every other model fails Gate 4. `status = 'optimal'`. |

---

### Subscription audit — `data/subscription_test_cases.json` (2 tests)

| # | Description | What it covers |
|---|---|---|
| 7 | Cheaper plan exists → recommendation | `cursor/ultra` (1 seat, $200/seat, `agentic`). All vendor plans supporting `agentic` that cost < $200 surface as candidates. `github_copilot/pro` ($10, saves $190) is `bestRecommendation`; 15 other cheaper plans fill `otherOptions` sorted by savings desc. |
| 8 | Current plan is already cheapest → optimal | `chatgpt/go` (1 seat, $8/seat, `coding`). No `coding`-capable plan costs less than $8 across all vendors. `status = 'optimal'`, `bestRecommendation = null`. |

---

## CI configuration

`.github/workflows/ci.yml` — `backend` job:

```yaml
- name: Test
  run: npm test
  env:
    DB_HOST: localhost
    DB_PASSWORD: test
```

Tests require no live database or Gemini key — the env vars above exist only to satisfy `dotenv` validation at startup.
