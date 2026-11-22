
# Smart Campus Room Availability Checker

A React and TypeScript web application for checking
room availability using fictional booking data.

## Technologies

- React 18
- TypeScript
- Vite
- Vitest
- ESLint

## Requirements

- Node.js
- npm

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Aidanagit666/smart-campus.git
cd smart-campus
npm ci
```

## Run Locally

```bash
npm run dev
```

Open the local address displayed in the terminal.

## Quality Checks

Run the automated tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Check TypeScript:

```bash
npm run typecheck
```

Build the application:

```bash
npm run build
```

## Project Structure

- `src/App.tsx` — main application
- `src/components/` — UI components
- `src/lib/` — validation and filtering logic
- `src/data/` — fictional room and booking data
- `AGENTS.md` — AI agent instructions

## Project Rules

- Booking duration cannot exceed 120 minutes.
- Blocked rooms cannot be booked.
- Overlapping bookings are rejected.
- Booking data is not modified.
- The application uses fictional booking data.

## AI-Assisted Risk Audit

Assignment 05 includes:

- Risk identification and verification
- Risk register
- Agent-readiness assessment
- Human review
- Release-readiness decision
- Final reflection

See the corresponding Markdown documents in this repository.

## Source Code

https://github.com/Aidanagit666/smart-campus
