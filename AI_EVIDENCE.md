
# AI Evidence Appendix — Assignment 05

Project: Smart Campus Room Availability Checker
Date: November 22, 2026

## AI Assistant

Tool: ChatGPT
Model: GPT-6

Purpose:
Help with repository inspection, risk analysis,
test design, documentation, and verification.

AI suggestions were checked using source code,
terminal commands, tests, and Git diffs.

## AI Use Record

| Activity | Prompt Summary | AI Output | Human Decision |
|---|---|---|---|
| Repository audit | Identify weaknesses in the project | Suggested input and dependency risks | Reviewed code and tests |
| Clock validation | Check invalid clock values | Suggested range validation | Added a regression test and fixed R1 |
| Interval validation | Investigate Infinity values | Suggested possible validation weakness | Tested four cases; no demonstrated bug |
| Attendee validation | Check large attendee values | Suggested safe-integer validation | Reproduced the issue and fixed R5 |
| Agent instructions | Improve safe AI operations | Suggested allowed commands and restrictions | Reviewed changes and updated AGENTS.md |
| Dependency security | Analyze npm audit findings | Highlighted dependency risks | Recorded R7 without forced updates |
| Release review | Assess release readiness | Recommended delaying production release | Selected NO-GO based on audit evidence |

## Useful AI Suggestion

The suggestion to validate attendee numbers
using Number.isSafeInteger() was useful.

The original parser accepted an unsafe number.
A regression test reproduced the problem.

After the change, all 10 room-filter tests passed.

## Unverified AI Suggestion

AI suggested that non-finite interval values
might bypass validation.

I tested four cases using Infinity and -Infinity.
All tested values were rejected.

The proposed defect was not reproduced.
No production code change was needed for R4.

## Human Verification

Verification included:
- Source code inspection
- Regression tests
- Git diff review
- npm test
- npm run lint
- npm run typecheck
- npm run build
- npm ci
- npm audit

Final test result: 66/66 passed.

## AI Limitations and Decisions

AI-generated risk suggestions were not treated
as facts without supporting evidence.

The dependency findings were confirmed by npm audit,
but application exploitability was not established.

No automatic production deployment was performed.

## Evidence Sources

- RISK_REVIEW.md
- RISK_REGISTER.md
- MITIGATION_RECORDS.md
- AGENTS.md
- AGENT_READINESS.md
- HUMAN_REVIEW.md
- Git commits: 87370c0, d2a2a91, 335eebb
- Terminal screenshots from November 22, 2026
