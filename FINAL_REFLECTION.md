
# Final Reflection — Assignment 05

Project: Smart Campus Room Availability Checker
Date: November 22, 2026

## What I Learned

I used ChatGPT (GPT-6) on November 22, 2026.
I shared code examples, test results, Git changes,
and information about my Smart Campus project.

This assignment helped me understand how AI can support
software risk analysis and code review.

AI suggested possible risks, but I checked them using
source code and automated tests before making decisions.

## Confirmed Risks

I found problems with invalid clock time input and
unsafe attendee numbers.

Both problems were fixed using small validation changes.

## AI Suggestions and Human Verification

Not every AI suggestion was a real defect.

For example, I tested non-finite interval values.
The existing code rejected the tested values correctly.

This showed why AI suggestions need human verification.

## Agent Safety

I improved AGENTS.md by adding allowed commands,
forbidden actions, and human approval requirements.

I reviewed Git diffs and ran tests before committing
the changes.

AGENTS.md made the process clearer by defining
safe commands and review rules. Next, I want
to improve dependency security checks.

## Test Results

After the fixes:
- 66 automated tests passed.
- Lint completed with a compatibility warning.
- Type checking passed.
- Production build completed with a Browserslist warning.

## Remaining Improvements

I created README.md and successfully tested
dependency installation using npm ci.

All 66 automated tests passed after installation.

However, npm audit reported 25 vulnerabilities,
including 2 critical and 14 high-severity findings.

The production dependency audit reported
one high-severity vulnerability.

These dependency risks need further review
before production release.

## Conclusion

AI was useful for finding potential risks, but it did
not replace my own analysis and testing.

I learned that safe AI-assisted development requires
clear rules, real evidence, and human control.
