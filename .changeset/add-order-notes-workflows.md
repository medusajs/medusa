---
"@medusajs/core-flows": patch
"@medusajs/medusa": patch
"@medusajs/modules-sdk": patch
"@medusajs/utils": patch
---

feat: add note create/delete workflows and /admin/notes routes

fix: register the note module in the default module set and module
definitions registry so it loads like any other core module (it was
scaffolded but never wired into app bootstrap)
