# Practice #13 - Common Contract

## User Story
As a student, I want to check room availability
for a future time interval without changing
existing bookings.

## Acceptance Criteria
- AC1: Start time must be in the future.
- AC2: Duration must be greater than 0 and
  at most 120 minutes.
- AC3: Overlapping bookings are unavailable.
- AC4: A blocked room is unavailable.
- AC5: Display a clear decision without
  changing existing bookings.
- AC6: Invalid input receives clear feedback.

## Inputs
- Current time
- Start time
- Duration in minutes (or end time)
- Room blocked status
- Existing fictional bookings

## Outputs
- Availability boolean
- Reason codes
- Human-readable messages

## Shared Dataset
Room 101: unblocked
- 10:00-11:00 Algorithms Lecture
- 14:00-15:00 Faculty Meeting

Room 103: blocked, no existing bookings.

## Common Test Cases
Fixed test current time: 08:00.

| ID | Room | Start | Duration | Expected |
|---|---|---|---|---|
| T1 | 101 | 12:00 | 60 | Available |
| T2 | 101 | 10:30 | 60 | Unavailable |
| T3 | 103 | 12:00 | 60 | Unavailable |
| T4 | 101 | 12:00 | 0 | Validation error |
| T5 | 101 | 11:30 | 121 | Validation error |
| T6 | 101 | 07:00 | 30 | Validation error |
| T7 | 101 | 11:00 | 60 | Available |
| T8 | 101 | N/A | N/A | Bookings unchanged |

## Constraints
- Fictional data only.
- No production database.
- No personal data or credentials.
- No modification of existing bookings.
- Identical rules in both implementations.
- Touching intervals do not overlap.
- All intervals must remain within one day.
- No paid subscriptions.
