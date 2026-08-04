---
"@medusajs/medusa": patch
---

perf(medusa): avoid O(n²) matching in the translations batch endpoint by using Sets for created/updated id lookups
