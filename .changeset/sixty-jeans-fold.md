---
"@medusajs/admin-ui": patch
"@medusajs/medusa": patch
"@medusajs/admin": patch
---

feat(medusa,admin,admin-ui): Add new plugin to serve the admin dashboard from the server. Adds a new plugin injection step `setup`, code placed in the `setup` folder of a plugin will be run before any code from a plugin is injected into the Medusa server.
