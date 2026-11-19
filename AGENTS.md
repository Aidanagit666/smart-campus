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
