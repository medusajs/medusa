# Verifying

## What to run

The workspace was built before you started, so builds are incremental.

1. **Build:** `yarn build`. This type-checks every workspace the change touches.
2. **Lint** the source files you changed: `yarn lint:path <files>`.
3. **Unit tests** of every workspace that declares or imports the package: `yarn workspace <workspace name> test`.
4. **Integration tests** of those workspaces when they have them: `yarn workspace <workspace name> test:integration`. Postgres is running on `localhost:5432` (user `postgres`, no password).

The full integration suites run on the PR's CI. Don't run every suite in the repo here.

Before blaming the update for a failure, check whether it also fails without your changes (`git stash`, re-run the one failing test, `git stash pop`). Pre-existing failures are noted in the PR body, not fixed.

## When something fails

### Patch or minor batch

1. Find the package that breaks it: revert half of the batch (restore those manifests, then `yarn install`), re-run the failing check, and keep halving until one package is left.
2. Research that package (`research.md`) and try to fix the code within the size limits.
3. Still failing after **2** fix attempts: revert that package, mark it `dropped` with the error, and re-verify the rest of the batch.

### Major group

1. Research, fix, and re-verify. Allow up to **3** fix attempts for the group.
2. Still failing: revert the whole group, mark every package in it `dropped` (or `blocked` when an external blocker is the cause), and set the result `status` to `failed`. Never ship part of a major migration.

## Limits

Code changes, not counting `package.json`, `yarn.lock`, and `.changeset/`, must stay within:

| Group | Files | Lines |
| --- | --- | --- |
| patch | 10 | 200 |
| minor | 20 | 400 |
| major | 80 | 2000 |

A package whose fix needs more is dropped with the reason `needs more changes than the workflow allows`.
