---
"@medusajs/core-flows": patch
---

fix(core-flows): only emit RETURN_RECEIVED from createAndCompleteReturnOrderWorkflow when receive_now is true, so requested-only returns no longer trigger the received event
