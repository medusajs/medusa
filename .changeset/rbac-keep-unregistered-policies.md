---
"@medusajs/rbac": patch
---

fix(rbac): stop archiving policies that were never declared in code, and cascade grant archival

The startup sync soft-deleted every `rbac_policy` row whose key was missing from the in-process `Policy` registry, without logging anything. That meant a policy created through `POST /admin/rbac/policies` never survived a restart, since API-created policies are not in the registry by definition.

`rbac_policy` now carries `is_registered`, set by the sync for policies declared through `definePolicies`. Only those are reconciled against the registry, so removing a declaration from code still archives the policy (unchanged), while API-created policies are left alone. Archiving also logs a warning listing the affected keys instead of happening silently.

Archiving a policy used to leave its `rbac_role_policy` rows active, so the grant table reported permissions that resolved to 403. `rbac_policy` now cascades soft delete and restore to its role grants.
