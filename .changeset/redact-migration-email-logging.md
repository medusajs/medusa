---
"@medusajs/medusa": patch
---

fix(medusa): redact plain user emails in create-super-admin migration script

Redacts plain user emails from `create-super-admin-role.ts` migration script logs to avoid exposing PII to log aggregators, using `user.id` instead.
