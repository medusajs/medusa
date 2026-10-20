---
"@medusajs/utils": patch
"@medusajs/orchestration": patch
"@medusajs/workflows-sdk": patch
"@medusajs/framework": patch
"@medusajs/modules-sdk": patch
"@medusajs/core-flows": patch
"@medusajs/medusa": patch
"@medusajs/cli": patch
"@medusajs/admin-bundler": patch
"@medusajs/telemetry": patch
"@medusajs/test-utils": patch
---

feat(medusa,cli,framework,modules-sdk,utils): add `medusa build --bundle` (or `MEDUSA_BUILD_BUNDLE=true`), which builds the admin and backend as one app and bundles the backend into a self-contained `medusa-bundle.js` that runs `start` and `db:migrate` without `node_modules`, with a build manifest that moves file scanning, GraphQL schema merging and unused module loading out of boot. Bundles trace what still has to be on disk (native binaries, assets, dynamically required files) with @vercel/nft and copy it next to the bundle. `@medusajs/test-utils` can run integration suites against a bundled build (`MEDUSA_TEST_BUNDLE`). Adds an opt-in Vite dev server (`MEDUSA_DEV_VITE=true medusa develop`) that serves the backend and admin together.
