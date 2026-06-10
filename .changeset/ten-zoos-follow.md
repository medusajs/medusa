---
"@medusajs/medusa": patch
---

fix(medusa): clear session cookie on DELETE /auth/session

The logout route now sends a `Set-Cookie` header to clear the session cookie on the client after destroying the server-side session. Previously, `req.session.destroy()` was called fire-and-forget and no clearing header was emitted, leaving a stale cookie in the browser after logout (contradicting the documented behavior). The cookie name and options are sourced from the project config so customized session names continue to work.
