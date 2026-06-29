---
"@medusajs/framework": patch
---

fix(framework): load RBAC roles for secret API key actors

When the `rbac` feature flag is enabled, a valid secret API key is rejected with
`403 Forbidden` on every policy-protected admin route. The api-key auth context
is built with an empty `app_metadata`, so `check-permissions` finds no roles and
denies the request — even though the key authenticates successfully (it works on
routes without a policy).

The docs state a secret key "performs actions as the admin user that the key was
created for", so this loads that user's RBAC roles into the api-key auth context,
mirroring how user tokens receive roles in `generateJwtTokenForAuthIdentity`. The
lookup is gated on the `rbac` flag and falls back to the previous empty metadata
when the flag is off, the key has no creator, or the lookup fails.
