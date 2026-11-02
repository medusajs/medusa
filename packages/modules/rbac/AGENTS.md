# @medusajs/rbac

Role-based access control module: stores roles, policies (`resource:operation` permissions), role-to-policy assignments, and role inheritance. Registered as `Modules.RBAC` (`"rbac"`).

## Using this package

- Included in `defineConfig` (`@medusajs/medusa/rbac`) but disabled unless the `rbac` feature flag is on (`MEDUSA_FF_RBAC=true`, default `false`).
- It is a licensed module: the loader (`packages/core/modules-sdk/src/loaders/utils/load-internal.ts`, `LICENSED_MODULES`) only loads it when the license covers `LicenseFeature.RBAC`.
- No module options and no providers.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IRbacModuleService } from "@medusajs/framework/types"

const rbacModuleService: IRbacModuleService = container.resolve(Modules.RBAC)
const policies = await rbacModuleService.listPoliciesForRole("role_123")
```

- Custom policies are declared with `definePolicies` from `@medusajs/framework/utils` (`{ name, resource, operation, description? }`); they land in the global `Policy` registry and this module syncs them to the DB on startup.

### Data models (`src/models`, all exported from `src/models/index.ts`)

- `RbacRole` (`role_`): `name` (unique among non-deleted), `description`, `policies`, `parents`.
- `RbacPolicy` (`rpol_`): `key` (unique, `<resource>:<operation>`), `resource`, `operation`, `name`, `description`.
- `RbacRolePolicy` (`rlpl_`): role-to-policy join.
- `RbacRoleParent` (`rlin_`): `role` inherits from `parent`.
- `src/models/rbac-role-inheritance.ts` is not exported from the models index and is not part of the service; do not build on it.

### Service methods (`src/services/rbac-module-service.ts`)

Generated CRUD for `RbacRole`, `RbacPolicy`, `RbacRoleParent`, `RbacRolePolicy`, plus:

- `listPoliciesForRole(roleId)`: all policies of the role, including inherited ones (recursive CTE in `src/repositories/rbac.ts`); inherited rows carry `inherited_from_role_id`.
- `listRbacRoles` / `listAndCountRbacRoles` (overridden): when `relations` or `select` include `"policies"`, `role.policies` is replaced with the resolved (inherited) policies, not the raw `RbacRolePolicy` rows.
- `createRbacRoleParents` / `updateRbacRoleParents` (overridden): reject self-parenting and cycles (`checkForCycle`).

### Events and links

- Emits internal CRUD events (`rbac.<model>.created|updated|deleted|restored`) through `MedusaService`.
- Module links: `user-rbac-role` (`user_rbac_role`, User -> RbacRole) and `invite-rbac-role` (`invite_rbac_role`, Invite -> RbacRole) in `packages/modules/link-modules/src/definitions`.

## Architecture

- `src/loaders/initial-data.ts`: upserts the super admin role `role_super_admin`, policy `rpol_super_admin` (key `*:*`), and their join `rlpl_super_admin` on every load.
- `__hooks.onApplicationStart` runs `syncRegisteredPolicies()`: creates policies newly registered via `definePolicies`, restores soft-deleted ones that are registered again, updates changed `name` / `description`, and soft-deletes DB policies no longer registered. The `*:*` super admin policy is always skipped.
- `src/repositories/rbac.ts` (`RbacRepository`) uses raw SQL against `rbac_role`, `rbac_role_parent`, `rbac_role_policy`, `rbac_policy`; renaming those tables or columns requires updating these queries.

## Development

```bash
cd packages/modules/rbac
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/rbac.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

- The integration test injects `testLicense([LicenseFeature.RBAC])` and `MockEventBusService` from `@medusajs/test-utils`; keep that when adding suites, or the module won't load.

## Gotchas

- Policies created by hand that are not registered via `definePolicies` are soft-deleted on the next application start.
- Role parent validation throws plain `Error`, not `MedusaError`.
- Inheritance traversal skips soft-deleted roles and parent rows, and guards against cycles with a path array.
