---
"@medusajs/types": patch
"@medusajs/auth": patch
"@medusajs/medusa": patch
"@medusajs/js-sdk": patch
"@medusajs/dashboard": patch
---

fix(medusa,auth,types,js-sdk,dashboard): read MFA state from the database on token refresh and session creation, and require a current MFA code to replace recovery codes
