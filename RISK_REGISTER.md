# Risk Register — Assignment 05

Project: Smart Campus Room Availability Checker
Date: November 22, 2026

Scoring:
- Likelihood: 1 = Low, 2 = Medium, 3 = High
- Impact: 1 = Low, 2 = Medium, 3 = High
- Risk Score = Likelihood × Impact

| ID | Risk | L | I | Score | Status |
|---|---|---|---|---|---|
| R1 | Invalid clock time | 2 | 3 | 6 | Mitigated |
| R2 | TypeScript/ESLint incompatibility warning | 2 | 2 | 4 | Open |
| R3 | Outdated Browserslist data | 2 | 1 | 2 | Open |
| R4 | Non-finite interval validation | 1 | 1 | 1 | Unsupported |
| R5 | Unsafe attendee count | 2 | 2 | 4 | Mitigated |
| R6 | Insufficient AI agent safety rules | 2 | 3 | 6 | Mitigated |
| R7 | Vulnerable dependencies | 3 | 3 | 9 | Open |
## Risk Mitigation and Residual Risk

### R1 — Invalid Clock Time
Evidence: Invalid values such as 25:90 were accepted.
Mitigation: Validate hours and minutes before conversion.
Owner: Developer
Residual risk: Low. Additional input formats may need testing.

### R2 — TypeScript and ESLint Compatibility
Evidence: npm run lint reported an unsupported TypeScript version.
Mitigation: Check the compatibility of installed versions.
Owner: Developer
Residual risk: Medium until dependency compatibility is verified.

### R3 — Outdated Browserslist Data
Evidence: npm run build reported outdated caniuse-lite data.
Mitigation: Review and update browser compatibility data.
Owner: Developer
Residual risk: Low.

### R4 — Non-finite Interval Validation
Evidence: All 27 tests passed, including the new regression test.
Mitigation: No production fix required for the tested cases.
Owner: Developer
Residual risk: Low for the tested inputs.


### R5 — Unsafe Attendee Count

Evidence before fix:
The regression test failed because parseAttendees()
accepted 9007199254740992 instead of returning null.

Mitigation:
Added Number.isSafeInteger() validation in
src/lib/roomFilters.ts.

Evidence after fix:
10 room-filter tests passed.
The full test suite passed: 66/66 tests.

Quality checks:
- npm test: passed
- npm run lint: passed with a compatibility warning
- npm run typecheck: passed
- npm run build: passed with a Browserslist warning

Owner: Developer
Status: Mitigated
Residual risk: Low for the tested cases.


### R6 — AI Agent Operational Safety
Evidence: The original AGENTS.md lacked explicit safety rules.
Mitigation: Add forbidden actions and human approval requirements.
Owner: Developer
Residual risk: Low if the instructions are followed.
## Risk Score Justification

R1 (6): Invalid time inputs were accepted before the fix.
This can affect booking calculations.

R2 (4): A compatibility warning was reproduced.
The current checks passed, but tooling compatibility
is not guaranteed.

R3 (2): Browserslist data is outdated.
The production build still completes successfully.

R4 (1): The proposed Infinity bug was not reproduced.
The tested non-finite inputs were rejected.

R5 (4): A regression test failed for an unsafe integer.
This may produce incorrect room filtering results.

R6 (6): Missing agent restrictions could allow
unapproved changes. Explicit safety rules were added.

### R7 — Vulnerable Dependencies

Category: Security / Dependencies

Evidence:
npm audit reported 25 vulnerabilities:
2 low, 7 moderate, 14 high, and 2 critical.

npm audit --omit=dev reported 1 high vulnerability
in the ws dependency.

Likelihood: 3 — High
Impact: 3 — High
Risk score: 9/9

Justification:
Multiple vulnerabilities are present in the
dependency tree, including one in the production
dependency audit. Actual exploitability has not
been verified.

Mitigation:
- Identify vulnerable dependency paths.
- Review patched versions and compatibility.
- Update dependencies in a separate branch.
- Run npm ci, tests, lint, typecheck, build,
  and npm audit after updating.
- Avoid forced breaking upgrades without review.

Owner: Developer
Status: Open
Residual risk: High until dependency risks
are evaluated and addressed.

## Risk Details and Verification Plans

### R1 — Invalid Clock Time
Category: Correctness
Component: src/lib/time.ts
Cause: Missing hour and minute range validation.
Event: An invalid clock value is converted.
Consequence: Incorrect time calculations.
Verification: Run time.test.ts and check invalid inputs.
Residual risk: Low after the tested fix.

### R2 — TypeScript and ESLint Compatibility
Category: Dependencies
Component: package.json
Cause: Installed TypeScript version is outside
the supported range of the ESLint parser.
Event: The lint tool runs with unsupported versions.
Consequence: Lint results may be unreliable.
Verification: Review versions and rerun npm run lint.
Residual risk: Medium until versions are reviewed.

### R3 — Outdated Browserslist Data
Category: Dependencies
Component: Build tooling and package-lock.json
Cause: Outdated browser compatibility data.
Event: The build uses outdated compatibility data.
Consequence: Browser support decisions may be outdated.
Verification: Update data and rerun npm run build.
Residual risk: Low.

### R4 — Non-finite Interval Validation
Category: Correctness
Component: src/lib/availability.ts
Cause: Potential weakness suggested by AI.
Event: Infinity is passed to interval validation.
Consequence: Incorrect booking result if accepted.
Verification: Four non-finite cases were tested.
Result: All 27 availability tests passed.
Residual risk: Low for the tested inputs.

### R5 — Unsafe Attendee Count
Category: Correctness
Component: src/lib/roomFilters.ts
Cause: Missing safe integer validation.
Event: A number above MAX_SAFE_INTEGER is accepted.
Consequence: Incorrect attendee count or filtering.
Verification: Run roomFilters.test.ts and full suite.
Result: 10 tests and 66 total tests passed.
Residual risk: Low for the tested cases.

### R6 — AI Agent Operational Safety
Category: Agent Operations
Component: AGENTS.md
Cause: Missing explicit agent restrictions.
Event: An agent proposes or performs unsafe actions.
Consequence: Unapproved code or deployment changes.
Verification: Inspect AGENTS.md and its Git diff.
Residual risk: Low if review gates are enforced.

### R7 — Vulnerable Dependencies
Category: Security / Dependencies
Component: package-lock.json and installed packages
Cause: Vulnerable dependency versions.
Event: A vulnerable code path is reached.
Consequence: Possible security exposure or disruption.
Verification: Run npm audit and npm audit --omit=dev.
Result: 25 total findings, including one high
in the production dependency audit.
Residual risk: High until investigated.

## Top Two Selected Corrective Actions

### Priority 1 — R1: Invalid Clock Time

Initial risk score: 6/9
Status: Mitigated

Reason for selection:
Invalid time values could affect booking calculations.
The defect was reproducible and a small fix was possible.

Action:
Added hour and minute validation in src/lib/time.ts.

Evidence:
Commit 87370c0.
The targeted time tests passed after the change.

Residual risk:
Low for the tested cases.

### Priority 2 — R5: Unsafe Attendee Count

Initial risk score: 4/9
Status: Mitigated

Reason for selection:
Unsafe integer input was accepted by the parser.
A regression test reproduced the defect.

Action:
Added Number.isSafeInteger() in src/lib/roomFilters.ts.

Evidence:
Commit 335eebb.
10 room-filter tests and 66 total tests passed.

Residual risk:
Low for the tested cases.

### Why R7 Was Not Fixed in This Assignment

R7 has the highest assessment score: 9/9.

It requires dependency-path analysis and may involve
breaking dependency updates.

R1 and R5 were selected for small, verifiable code
mitigations. R7 remains open and has higher priority
for security review before a production release.

No claim is made that the R7 vulnerabilities are
exploitable in this application.
