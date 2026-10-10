---
"@medusajs/test-utils": patch
---

fix(test-utils): bind the http server to port 0 instead of using get-port, so test files don't stay in memory
