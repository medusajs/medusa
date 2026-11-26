---
"@medusajs/medusa": minor
"@medusajs/types": patch
---

fix(medusa): refuse actor types the app doesn't know on the /auth routes. Custom actor types now need an entry in `projectConfig.http.authMethodsPerActor`
