---
"@medusajs/medusa": patch
---

fix(medusa): document the invite accept token as a query parameter

`POST /admin/invites/accept` passed its query params type as the request body type, so the API reference listed `token` as a body field. The route reads `token` from the query string and its body validator is strict, so anyone following the reference got `Unrecognized fields: 'token'` with the token in the body and `Field 'token' is required` without it. The route now types the body and the query params separately.
