---
"@medusajs/test-utils": patch
---

fix(test-utils): register search index definitions before the integration test runner boots the app, so the Search Module resolved in tests has the indexes declared under `search/`
