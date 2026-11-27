---
"@medusajs/auth": patch
---

fix(auth): count failed MFA code checks per auth identity across challenges, so a new login doesn't reset the attempt limit
