---
"@medusajs/medusa": patch
---

`medusa build` now runs the lint step as non-blocking (`failOnError: false`), matching the documented intent of the build-time lint check (#16532).
