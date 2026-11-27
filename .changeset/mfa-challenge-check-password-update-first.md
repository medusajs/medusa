---
"@medusajs/medusa": patch
---

fix(medusa): reject an MFA challenge token issued before a password update before checking its code, so the rejected request doesn't use up the code
