---
"@medusajs/orchestration": patch
---

fix(orchestration): stop re-invoking a step that's still retrying once the transaction has moved to COMPENSATING

`TransactionStep.canInvoke()` has two ways to return true: the normal "not started yet" path, and a retry path for a step sitting in `TEMPORARY_FAILURE`. The retry path never looked at the flow's own state, only at the step's own status. So if step A hits a transient error and is waiting out its `retryInterval`, and step B (a sibling) fails permanently in the meantime, the transaction moves to `WAITING_TO_COMPENSATE` and then `COMPENSATING` - and once A's retry interval elapses, `canInvoke` still says yes and the orchestrator calls A's invoke handler again, even though the transaction is already unwinding everything else.

That's a real problem for steps with side effects: a payment capture, an inventory reservation, anything not idempotent. Nothing compensates that extra invocation, because as far as the orchestrator is concerned A never started compensating in the first place.

The fix makes the retry check phase-aware: a step still on its invoke path only retries while the flow is `INVOKING` or `WAITING_TO_COMPENSATE`, and a step that's compensating only retries while the flow is `COMPENSATING`. That second half matters - `canCompensate()` only allows a step whose compensate state is `NOT_STARTED`, so a step retrying a *failed compensation* was actually relying on this same untamed disjunct. An early version of this fix left that case out and broke an existing test ("Should fail a transaction if any step fails after retrying X time to compensate it") by letting a step's failed compensation get silently treated as complete.

Added a test that reproduces the original bug with two parallel steps - one that always fails temporarily on a 1s retry interval, one that fails permanently right away - and asserts the temporary-failure step's invoke handler is never called while the flow is COMPENSATING. Ran the full orchestration suite before and after: it was failing on the new test pre-fix (flaky's second attempt logged `flowState: "compensating"`) and is 58/58 post-fix.
