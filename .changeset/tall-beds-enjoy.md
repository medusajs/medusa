---
"@medusajs/medusa": minor
---

Feat: allow customers to claim orders

BREAKING CHANGE: `customerService.retrieveByEmail` is being deprecated in favor of two methods: `customerService.retrieveRegisteredByEmail` and `customerService.retrieveUnRegisteredByEmail`. Please use `customerService.list({ email: <customer email> })` in the future
