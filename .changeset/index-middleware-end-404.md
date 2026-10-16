---
"@medusajs/medusa": patch
---

fix(admin): end the 404 response when the index module is not configured

`isIndexEnabledMiddleware` called `res.status(404)` without ending the response, so a request to `/admin/index/details` or `/admin/index/sync` with the index engine flag off stayed open until the client gave up instead of receiving the 404. The middleware now sends a `not_found` body, matching the existing `ensureViewConfigurationsEnabled` middleware.
