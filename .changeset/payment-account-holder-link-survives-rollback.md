---
"@medusajs/core-flows": patch
---

fix(core-flows): keep the customer account-holder link on a failed payment-session init

`createPaymentSessionsWorkflow` creates the payment account holder with `noCompensation`, so the holder survives a workflow rollback, but the `createRemoteLinkStep` that links it to the customer was dismissed on rollback. A failed init therefore left an orphaned account holder — present in the DB but unreachable through `customer.account_holders` — so the `existingAccountHolder` short-circuit kept missing it and every later init re-created the same provider customer, colliding on the unique `(provider_id, external_id)` index ("Account holder ... already exists", a 400 on `POST /payment-sessions`) that never self-healed. The link step now also runs with `noCompensation`, so the link survives alongside the holder and a later init reuses the existing holder.
