---
"@medusajs/framework": patch
---

fix(@medusajs/framework): reject invalid bearer credentials on routes that allow unauthenticated access

On public routes configured with allowUnauthenticated, an Authorization header carrying a bearer token that failed verification (expired, signed with a different secret, or malformed) was silently discarded and the request continued as a guest - indistinguishable from a request that never sent credentials. Such requests are now rejected with 401, while requests without any credentials continue to work as guests.
