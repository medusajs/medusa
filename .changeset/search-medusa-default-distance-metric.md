---
"@medusajs/search": patch
---

fix(search): default to cosine distance for vector fields on Medusa Cloud search, so an index whose vectors the app supplies no longer fails on its first write
