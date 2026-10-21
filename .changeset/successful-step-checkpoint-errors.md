---
"@medusajs/orchestration": patch
---

fix(orchestration): route errors after successful step bookkeeping into compensation for active executions whose recovery checkpoint can be saved, without re-invoking completed steps or attempting an invalid status transition. Recovery after a concurrent execution has already finalized remains outside this change.
