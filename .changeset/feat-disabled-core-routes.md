---
"@medusajs/types": minor
"@medusajs/framework": minor
---

feat(framework): support disabling selected core API routes via config

Add `disabledRoutes` option to `projectConfig.http` that allows applications and plugins to disable selected built-in core API routes before route and middleware registration.

Disabled routes, their middlewares, body parser configs, and additional data validators are all filtered out and never registered with Express.

Patterns support trailing `*` wildcards (e.g. `/admin/products*`) and exact path matches.
