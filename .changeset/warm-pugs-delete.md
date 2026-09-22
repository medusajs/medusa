---
"@medusajs/medusa": patch
"@medusajs/search": patch
"@medusajs/core-flows": patch
"@medusajs/types": patch
"@medusajs/js-sdk": patch
"@medusajs/dashboard": patch
---

feat(medusa,search,core-flows,types,js-sdk,dashboard): delete a search index and everything built for it

`DELETE /admin/search-indexes/:id` drops every physical index ever built for an
index, along with its versions and sync history, so the next migration recreates
it from scratch at version 1. Useful when an index' physical state has drifted
past what a reindex can repair.

Available as `searchModuleService.deleteIndex`, `deleteSearchIndexWorkflow`,
`sdk.admin.search.deleteIndex`, and a confirmed action in the admin dashboard.
