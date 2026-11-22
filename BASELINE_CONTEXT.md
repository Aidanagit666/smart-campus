
# Task 01 — Baseline and Context

Project: Smart Campus Room Availability Checker
Date: November 22, 2026

## Baseline

Baseline commit: 1bd7dc2
Baseline tag: assignment05-baseline

The project is a React and TypeScript application
that checks room availability using fictional data.

## Repository Map

- src/main.tsx — application entry point
- src/App.tsx — application state and UI
- src/components/ — interface components
- src/lib/availability.ts — booking validation
- src/lib/time.ts — time utilities
- src/lib/roomFilters.ts — room filtering
- src/lib/explainAvailability.ts — AI explanation logic
- src/data/rooms.ts — fictional room data
- src/*.test.tsx — application tests
- src/lib/*.test.ts — unit tests
- package.json — dependencies and scripts
- package-lock.json — locked dependencies

## Technologies

React, TypeScript, Vite, Vitest and ESLint.

## Baseline Verification

Commands:
- npm test
- npm run lint
- npm run typecheck
- npm run build

Recorded baseline results:
- 63 tests passed in 5 test files.
- Lint completed with a TypeScript compatibility warning.
- Typecheck passed.
- Production build passed with a Browserslist warning.

## Acceptance Criteria

AC1: Invalid or past booking intervals are rejected.
AC2: Booking duration cannot exceed 120 minutes.
AC3: Blocked rooms are rejected.
AC4: Overlapping bookings are rejected,
but endpoint touching is allowed.
AC5: Existing booking data is not modified.

## Initial Weaknesses

1. src/lib/time.ts accepted invalid clock times.
   This was reproduced with a regression test.

2. src/lib/roomFilters.ts accepted unsafe integers.
   This was reproduced with a failing regression test.

3. The project did not initially include README.md.
   This was verified during the documentation audit.

## Evidence Classification

The input validation issues were confirmed through tests.
The missing README was confirmed through file inspection.

Other AI suggestions were evaluated separately in
RISK_REVIEW.md. They were not automatically treated
as confirmed defects.
