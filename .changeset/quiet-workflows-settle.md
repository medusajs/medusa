---
"@medusajs/test-utils": patch
---

fix(test-utils): wait for a settle window in waitWorkflowExecutions so background event-triggered workflows don't race the per-test database reset
