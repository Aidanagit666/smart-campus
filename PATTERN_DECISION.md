
# Task 03 — Focused Pattern Decision

Project: Smart Campus Room Availability Checker
Date: November 22, 2026

## Maintainability Problem

The availability explanation feature depends on
an AI-like service.

Directly connecting business logic to one service
would make testing and future replacement difficult.

## Pattern Considered

Pattern: Adapter

The project already contains an LlmAdapter interface
in src/lib/mockLlmAdapter.ts.

The explainAvailability() function receives an
adapter through its parameters.

The application uses createMockLlmAdapter()
to produce deterministic explanations.

## Decision

Keep the existing lightweight Adapter approach.

No additional design pattern or large refactoring
is needed for Assignment 05.

## Before and After Comparison

Before:
The project already separated explanation logic
from its mock adapter implementation.

After:
The existing architecture was preserved.
No unnecessary new abstraction was introduced.

## Justification

The current solution supports isolated testing,
predictable behavior and replacement of the mock
adapter without rewriting explanation validation.

Adding another Strategy or Factory pattern
would increase complexity without a clear benefit.

## Acceptance Criteria

AC1–AC5 remain unchanged.

Verification:
- 66 automated tests passed.
- TypeScript type checking passed.
- The production build completed successfully.

## Conclusion

The existing Adapter approach is sufficient.
I chose to preserve it rather than introduce
an unnecessary refactoring.
