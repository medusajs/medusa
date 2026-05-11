---
"@medusajs/workflows-sdk": patch
"@medusajs/order": patch
---

fix(workflows-sdk): flatten WorkflowData type to remove recursive expansion that caused TS excessive stack depth errors in large consumer codebases. Add missing fields to order schema
