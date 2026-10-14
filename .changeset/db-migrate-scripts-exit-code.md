---
"@medusajs/medusa": patch
---

fix(medusa): report a failed migration script instead of exiting 0

`db:migrate` forked `db:migrate:scripts` as a child process and discarded its exit code, unlike the `db:migrate:search` call a few lines above which already checks it. A migration script that threw logged the error but the parent process still exited 0, so a CI/CD pipeline or deploy step trusting `db:migrate`'s exit code carried on as if every script had succeeded.

`db:migrate` now checks the child's exit code the same way it already does for `db:migrate:search`, and returns false (non-zero exit) when a migration script fails.
