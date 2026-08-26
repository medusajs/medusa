---
"@medusajs/auth": patch
---

fix(auth): await the OAuth state cache write so the state is stored before the provider redirects
