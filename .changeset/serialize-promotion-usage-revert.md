---
"@medusajs/promotion": patch
---

fix(promotion): serialize revertUsage against concurrent registerUsage to prevent lost campaign budget updates

`revertUsage` read a promotion/campaign budget's `used` value, computed an absolute new value in application code, and wrote it back - with no row lock and no re-read under a lock. `registerUsage` (its increment-direction counterpart) already serializes this exact read-modify-write with a `SELECT ... FOR UPDATE` on the promotion and budget rows, re-reading under the lock before computing anything; `revertUsage` had neither.

This let a `revertUsage` call (the compensation `registerUsageStep` runs when a later step in `completeCartWorkflow` fails, e.g. payment authorization, after usage was already registered) silently overwrite a concurrent, already-committed `registerUsage` from a different checkout. `revertUsage` computes its new `used` from a stale read taken before the other registration commits, then writes that stale absolute value once the row lock it's blocked on is released - discarding the other checkout's legitimate spend from the campaign budget's counter and letting the campaign silently exceed its intended budget over time.

`revertUsage` (and `revertCampaignBudgetUsageByAttribute_`, its per-attribute counterpart) now lock the same rows `registerUsage` locks, in the same order, and re-read under the lock before computing the reverted value.
