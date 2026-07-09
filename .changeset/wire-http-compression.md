---
"@medusajs/framework": patch
---

fix(framework): wire the compression middleware into the Express app so `projectConfig.http.compression` is honored

The `shouldCompressResponse` and `compressionOptions` helpers existed but were never registered in `express-loader.ts`, so enabling `http.compression` had no effect. The compression middleware is now registered when compression is enabled, using the resolved level/memLevel/threshold and the existing filter (with a guard for requests that have no request-scoped container).
