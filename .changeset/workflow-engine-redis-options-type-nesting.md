---
"@medusajs/workflow-engine-redis": patch
---

fix(workflow-engine-redis): nest RedisWorkflowsOptions under redis in the module options type

The `ModuleOptions` augmentation declared `RedisWorkflowsOptions` as the type of the whole module options object, so `{ redisUrl: "..." }` passed type-checking. The runtime loader, however, has always read the same options from a nested `options.redis` object, and every existing test configures the module that way. Passing the top-level shape the types allowed for silently produced no Redis connection, since `redisUrl`/`url` were never read from that location.

The module options type now matches the shape the loader has always required (`{ redis: { redisUrl, ... } }`), matching the docs example on the module's page. No runtime behavior changes.
