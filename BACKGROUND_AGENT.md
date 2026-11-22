
# Task 08 — Background Agent Safeguards

Project: Smart Campus Room Availability Checker
Date: November 22, 2026

## Hypothetical Agent Task

Task: Review and propose safe dependency updates
for the vulnerabilities identified by npm audit.

This is a proposed background workflow.
No autonomous background agent was executed.

## Isolated Workspace

- Use a separate branch: audit/dependency-review
- Use an isolated Git worktree.
- Keep the main branch unchanged.
- Begin with the reviewed commit.
- Do not merge changes automatically.

## Allowed Files

Read:
- package.json
- package-lock.json
- README.md
- AGENTS.md
- src/ and existing test files

Write:
- A dependency review report
- Test and build logs

Package files may be changed only after
explicit human approval.

## Allowed Commands

- git status
- git diff
- npm ls --depth=0
- npm audit
- npm audit --omit=dev
- npm test
- npm run lint
- npm run typecheck
- npm run build

## Time Limits

- Maximum task duration: 30 minutes.
- Each check should have a defined timeout.
- Stop after repeated failures.
- Report incomplete checks honestly.

These are proposed limits, not measured execution times.

## Prohibited Operations

- No access to secrets or credentials.
- No production deployments.
- No automatic merges or pushes.
- No destructive Git commands.
- No npm audit fix --force.
- No unapproved dependency changes.
- No editing unrelated source files.

## Required Output Artifacts

1. Change summary
2. Proposed Git diff
3. Actual test logs
4. Build and lint results
5. Security findings and risk notes
6. List of checks not executed

## Human Review Gate

The developer must review the proposed changes,
dependency versions, test results and risk notes.

Explicit human approval is required before:
- Modifying dependency versions
- Creating a final commit
- Merging branches
- Deploying to production

## Failure and Rollback

If checks fail:
- Stop the proposed change.
- Preserve error logs.
- Report the failure.
- Do not merge the branch.

For an approved change that later fails,
use Git history to identify and revert the
affected commit after human review.

## Conclusion

This workflow limits the agent's scope and
requires human approval for risky operations.

The agent may investigate and recommend changes,
but it cannot approve its own work.
