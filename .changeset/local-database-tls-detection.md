---
"@medusajs/utils": patch
"@medusajs/framework": patch
"@medusajs/test-utils": patch
---

fix(utils,framework,test-utils): detect local databases by host, including `[::1]`, and fail fast when TLS is requested from a server without it
