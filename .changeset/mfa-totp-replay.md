---
"@medusajs/auth": patch
---

fix(auth): accept a TOTP code only once, so it can't be replayed on another MFA challenge within its time window
