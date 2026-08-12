---
"@medusajs/draft-order": patch
"@medusajs/loyalty-plugin": patch
---

chore(plugins): widen the react-router-dom peer range to v6 and v7

The optional `react-router-dom` peer is now `^6.30.4 || ^7.0.0`, so these plugins install cleanly whether the host project is on react-router 6 or 7.
