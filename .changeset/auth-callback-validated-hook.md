---
"@medusajs/types": patch
"@medusajs/auth": patch
"@medusajs/auth-github": patch
"@medusajs/auth-google": patch
"@medusajs/auth-oidc": patch
"@medusajs/core-flows": patch
"@medusajs/medusa": patch
---

feat(core-flows,auth): add validateAuthCallbackWorkflow with an authCallbackValidated hook that receives what the provider got back, and a storeTokens option to keep GitHub tokens out of provider_metadata
