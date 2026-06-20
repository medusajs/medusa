---
"@medusajs/auth-google": patch
"@medusajs/auth": patch
"@medusajs/notification": patch
"@medusajs/payment": patch
---

Add request timeouts to provider fetch() calls so a slow or unreachable upstream can't hang login, email, or payment requests. The payments provider's timeout is treated as retryable by its existing retry logic.
