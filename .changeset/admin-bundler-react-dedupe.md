---
"@medusajs/admin-bundler": patch
---

fix(admin-bundler): dedupe react and react-dom in the admin Vite config, so a second React copy reachable in the workspace (e.g. a React 19 storefront hoisted to the root of the same monorepo) is never pre-bundled alongside the dashboard's React — previously this crashed every admin page in `medusa develop` with "Objects are not valid as a React child"
