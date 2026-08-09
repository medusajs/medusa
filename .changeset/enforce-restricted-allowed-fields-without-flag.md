---
"@medusajs/framework": patch
---

fix(framework): enforce http.restrictedFields and query-config allowed independently of the rbac_filter_fields feature flag

`prepareListQuery` computed violations from `AllowedFieldFilter`/`RestrictedFieldFilter` (which are always active) but only stripped them from the response when `MEDUSA_FF_RBAC_FILTER_FIELDS` was enabled, so `http.restrictedFields` and route-level `allowed` query configs silently had no effect on a default install. `RBACFieldFilter` is already gated behind the flag at the point it's added to the filter list, so the enforcement step no longer needs its own flag check.
