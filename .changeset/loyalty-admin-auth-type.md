---
"@medusajs/loyalty-plugin": patch
---

fix(loyalty-plugin): honor the configured admin auth type in the admin SDK instead of hard-coding session auth, fixing 401s and empty pages under `ADMIN_AUTH_TYPE=jwt`
