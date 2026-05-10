---
"@medusajs/workflows-sdk": patch
---

fix(workflows-sdk): flatten WorkflowData type to remove recursive expansion that caused TS excessive stack depth errors in large consumer codebases
