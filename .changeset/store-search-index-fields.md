---
"@medusajs/medusa": patch
---

fix(medusa): limit the `fields` of a `/store/search` query to the fields the index can return. A field the index doesn't hold is rejected instead of being hydrated from the graph
