---
"@medusajs/ui": patch
"@medusajs/dashboard": patch
---

fix(ui,dashboard): fix DataTable custom date range filters (empty filter written on pick, upper bound at midnight instead of end of day) and keep table state from the URL on first load when view configurations are enabled
