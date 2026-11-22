# AI-Assisted Risk Review

Project: Smart Campus Room Availability Checker
Date: November 22, 2026
AI Assistant: ChatGPT (GPT-6)
Review mode: Read-only analysis

## Review Scope

- Correctness
- Maintainability
- Dependencies
- Security
- Agent operations

## Review Rules

- Do not modify source files during risk identification.
- Verify AI suggestions using code and tests.
- Classify findings as confirmed, plausible/unverified, or unsupported.
- Record file paths and evidence.
## Finding R4 — Non-finite Interval Validation

Category: Correctness
Status: Unsupported as a demonstrated bug
Affected file: src/lib/availability.ts

AI suggestion:
The use of Number.isNaN() may allow Infinity values
to pass interval validation.

Human verification:
I inspected the validateInterval() function and added
a regression test with four non-finite input cases.

Test command:
npx vitest run src/lib/availability.test.ts

Actual result:
27 tests passed, 0 failed.

Conclusion:
The tested Infinity values are rejected by existing
range and ordering checks. The proposed bug was not
reproduced, so no production code change was needed.
## Finding R5 — Unsafe Attendee Count

Category: Correctness
Status: Confirmed
Affected file: src/lib/roomFilters.ts

AI suggestion:
The attendee parser may accept numbers outside
the JavaScript safe integer range.

Evidence:
The function converts numeric text using Number()
and only checks whether the result is at least 1.

Verification:
Added a regression test in src/lib/roomFilters.test.ts.

Command:
npx vitest run src/lib/roomFilters.test.ts

Result:
9 passed, 1 failed.

Failure:
Expected null, but received 9007199254740992.

Suggested mitigation:
Use Number.isSafeInteger() to reject unsafe numbers.

Conclusion:
The risk is confirmed and requires mitigation.
## Finding R1 — Invalid Clock Time

Category: Correctness
Status: Confirmed and mitigated
Affected file: src/lib/time.ts

Issue:
The original timeToMinutes() function accepted
invalid clock values such as 25:90 and 12:99.

Evidence:
A regression test demonstrated the incorrect behavior.

Mitigation:
Added validation for hour and minute ranges.

Verification:
8 time utility tests passed after the fix.

Commit: 87370c0

## Finding R2 — TypeScript and ESLint Compatibility

Category: Dependency
Status: Confirmed warning
Affected file: package.json

Issue:
ESLint reported that the installed TypeScript 5.6.3
version was outside its officially supported range.

Evidence:
npm run lint displayed a compatibility warning.

Impact:
The tooling may behave unexpectedly with
unsupported TypeScript versions.

Mitigation:
Review compatible dependency versions before upgrading.

## Finding R3 — Outdated Browserslist Data

Category: Dependency
Status: Confirmed warning

Issue:
The production build reported outdated caniuse-lite data.

Evidence:
npm run build displayed a Browserslist warning.

Impact:
Browser compatibility information may be outdated.

Mitigation:
Update Browserslist data after reviewing the changes.

## Finding R6 — AI Agent Operational Safety

Category: Agent Operations
Status: Confirmed and addressed
Affected file: AGENTS.md

Issue:
The original agent instructions did not explicitly
define enough restrictions for automated changes.

Evidence:
Git diff showed 54 added lines.

Mitigation:
Added allowed commands, forbidden actions,
human approval rules, and risk review instructions.

Verification:
git diff --check completed without errors.

Commit: d2a2a91

## Finding R7 — Vulnerable Dependencies

Category: Security / Dependencies
Status: Confirmed dependency audit findings

Affected files:
package.json
package-lock.json

Evidence:
npm audit reported 25 vulnerabilities:
- 2 low
- 7 moderate
- 14 high
- 2 critical

Production dependency audit:
npm audit --omit=dev reported 1 high vulnerability.

Notable packages:
- ws: High severity.
- tinypool: Critical severity in test tooling.

Verification:
npm ci completed successfully.
All 66 automated tests passed.

Risk:
Vulnerable dependencies may expose the project to
security issues under certain conditions.

Suggested mitigation:
Review dependency paths and patched versions.
Apply compatible updates in a separate change.
Run the full test suite after any dependency update.

Do not use npm audit fix --force without
reviewing breaking changes.

Conclusion:
Dependency findings are confirmed by npm audit.
Actual exploitability in this application
has not been established.
