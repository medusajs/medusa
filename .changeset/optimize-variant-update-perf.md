---
"@medusajs/medusa": patch
---

Optimize admin variant update responses by using a lightweight product field set that excludes heavy variant and sales channel expansions, reducing latency for products with many variants.
