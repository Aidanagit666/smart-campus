
# Task 07 — Mitigation and Verification Records

Project: Smart Campus Room Availability Checker
Date: November 22, 2026
Branch: assignment05-risk-audit

## Mitigation 1 — R1: Invalid Clock Time

Initial score: 6/9
Status: Mitigated

Problem:
The timeToMinutes() function accepted invalid
clock values such as 25:90 and 12:99.

File changed:
src/lib/time.ts

Fix:
Added validation for hours and minutes.
Invalid input now returns NaN.

Regression test:
src/lib/time.test.ts

Before:
The new regression test failed.

After:
8 time-helper tests passed.

Commit:
87370c0

Residual risk:
Low for the tested inputs.
Other time formats may require further testing.

## Mitigation 2 — R5: Unsafe Attendee Count

Initial score: 4/9
Status: Mitigated

Problem:
The parseAttendees() function accepted numbers
outside the JavaScript safe integer range.

File changed:
src/lib/roomFilters.ts

Fix:
Added Number.isSafeInteger() validation.

Regression test:
src/lib/roomFilters.test.ts

Before:
9 tests passed and 1 failed.

After:
10 room-filter tests passed.

Commit:
335eebb

Residual risk:
Low for the tested inputs.
Further boundary testing may still be useful.

## Final Verification

Commands executed:
- npm test
- npm run lint
- npm run typecheck
- npm run build
- npm ci

Results:
- 66/66 tests passed.
- Lint passed with a compatibility warning.
- Typecheck passed.
- Production build passed with a Browserslist warning.
- Clean dependency installation succeeded.

## Limitations

npm audit reported 25 dependency vulnerabilities.
One high-severity issue remained in the production
dependency audit.

Dependency security risks were not fixed.
The release decision remains NO-GO.

## Conclusion

Both selected code risks were mitigated
and verified using regression tests.

No production release was performed.
