---
"@medusajs/medusa": patch
---

fix(medusa): stop setting `req.auth_context` in the login route and record who logged in as audit log metadata instead, for OAuth callbacks too
