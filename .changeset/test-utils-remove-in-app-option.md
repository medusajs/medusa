---
"@medusajs/test-utils": patch
---

fix(test-utils): remove the unused `inApp` option from `medusaIntegrationTestRunner`

`medusaIntegrationTestRunner` accepted an `inApp` option and stored it on the runner, but no code path ever read it, so passing it had no effect. The option and its private field are removed. TypeScript code that still passes `inApp` needs to drop it.
