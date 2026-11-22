# AGENTS.md

## Project
Smart Campus Room Availability Checker. A React and TypeScript application that checks room availability using fictional booking data.

## Project Structure
- src/App.tsx: page state and UI handlers
- src/lib/availability.ts: booking validation rules
- src/lib/time.ts: time utilities
- src/data/rooms.ts: room and booking fixtures
- src/components/: UI components

## Constraints
Preserve AC1–AC6:
- Reject start >= end and past requests.
- Reject durations over 120 minutes.
- Reject blocked rooms.
- Reject overlapping bookings, but allow endpoint touching.
- Do not mutate booking data.
- Keep clear and responsive desktop/mobile feedback.

Do not add a backend, database, authentication, or booking creation.

## Engineering Rules
- Prefer pure functions and small changes.
- Avoid unnecessary design patterns.
- Keep booking rules in one place.
- Do not mutate fixture data.
- Preserve existing UI and booking behavior.

## Verification
- Run npm run build.
- Run npm run lint.
- Run npm run typecheck.
- Add focused regression tests for AC1–AC6.
- Record test commands and results.
- Report every changed file and explain why it changed.
- Run npm test.
## Local Setup

Requirements:
- Node.js and npm.
- Use the existing package-lock.json for reproducible installation.

Commands:
- npm ci
- npm run dev

The project uses fictional booking data and does not require a backend or database.

## Allowed Agent Commands

The AI agent may use these commands for inspection and verification:
- git status
- git diff
- npm test
- npm run lint
- npm run typecheck
- npm run build

The agent must explain proposed changes before modifying source files.

## Forbidden Actions

The AI agent must NOT:
- Read, copy, expose, or commit secrets or credentials.
- Access or modify production systems.
- Deploy the application without explicit human approval.
- Run destructive commands such as rm -rf or git reset --hard.
- Modify dependencies or package-lock.json without approval.
- Push commits, merge branches, or modify the main branch without approval.
- Delete tests to make failing checks pass.
- Change unrelated files without permission.

## Human Review and Approval

- Work on a separate feature branch.
- Present the proposed changes before implementation.
- Review every AI-generated code diff.
- Run tests, lint, typecheck, and build after changes.
- Record actual results, including failures and warnings.
- Require human approval before commit, merge, or deployment.
- Never claim that a test passed unless it was executed.

## Risk Review Rules

- Perform the first risk review without modifying files.
- Separate confirmed risks from unverified suggestions.
- Support confirmed findings with code or test evidence.
- Record likelihood, impact, mitigation, and residual risk.
- Prioritize minimal changes that preserve AC1–AC6.