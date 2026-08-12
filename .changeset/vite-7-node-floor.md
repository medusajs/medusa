---
"@medusajs/medusa": minor
---

feat(medusa): require node 20.19 or newer

**Breaking:** the minimum Node version is now **20.19.0** (or 22.12.0+), raised from 20.0.0 to match Vite 7's requirement. Node 20.0–20.18 and 22.0–22.11 are no longer supported for `medusa develop`, `medusa build` or `medusa plugin:build`.
