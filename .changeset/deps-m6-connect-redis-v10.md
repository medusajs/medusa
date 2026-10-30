---
"@medusajs/framework": minor
"@medusajs/types": minor
"@medusajs/utils": minor
---

chore(framework,types,utils): update connect-redis to v10 and use node-redis for the Redis session store. `projectConfig.redisOptions` now takes `redis` (node-redis) client options instead of `ioredis` options.
