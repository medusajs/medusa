# @medusajs/rbac

Role-based access control module: stores roles, policies (`resource:operation` permissions), role-to-policy assignments, and role assignments. Registered as `Modules.RBAC` (`"rbac"`).

## Using this package

- Not registered by default: applications add `{ resolve: "@medusajs/medusa/rbac" }` to `modules` in `medusa-config.ts`. Everything RBAC (the `authorize` middleware, the `/rbac/*` routes, role assignment on users and invites, response field filtering) switches on when the module is installed and is a no-op otherwise.
- It is a licensed module: the loader (`packages/core/modules-sdk/src/loaders/utils/load-internal.ts`, `LICENSED_MODULES`) only loads it when the license covers `LicenseFeature.RBAC`.
- One module option, `actors`, says how each authenticated actor type reaches the entities that can hold role assignments for it (its grantees), and no providers. `user` always keeps `{ entity: "user", path: "id" }` as a grantee; configured grantees are added to it. Secret API keys authenticate as `api-key` and by default act with the roles of the user that created them. Set `actor_entity` when the actor type is not the name of a `query.graph` entity.

```ts
// medusa-config.ts
{
  resolve: "@medusajs/medusa/rbac",
  options: {
    actors: {
      user: { grantees: [{ entity: "team", path: "teams.id" }] },
      // Give each secret key its own role assignments (reference: "api_key")
      // instead of inheriting its creator's roles:
      "api-key": {
        actor_entity: "api_key",
        grantees: [{ entity: "api_key", path: "id" }],
      },
    },
  },
}
```

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IRbacModuleService } from "@medusajs/framework/types"

const rbacModuleService: IRbacModuleService = container.resolve(Modules.RBAC)
const policies = await rbacModuleService.listPoliciesForRole("role_123")
```

- Custom policies are created at runtime, for example with `createRbacPoliciesWorkflow` from `@medusajs/core-flows` and payloads from `buildPolicies({ resource, operation? })` (`@medusajs/framework/utils`), which expands each resource into one policy per operation (`read`, `create`, `update`, `delete` by default).

### Data models (`src/models`, all exported from `src/models/index.ts`)

- `RbacRole` (`role_`): `name` (unique among non-deleted), `description`, `policies`, `assignments`. Deleting a role cascades to both.
- `RbacPolicy` (`rpol_`): `key` (unique, `<resource>:<operation>`), `resource`, `operation`, `name`, `description`.
- `RbacRolePolicy` (`rlpl_`): role-to-policy join, unique per `(role_id, policy_id)`.
- `RbacRoleAssignment` (`rasgn_`): grants `role_id` to a grantee identified by `reference` (e.g. `"user"`) and `reference_id`, optionally narrowed by `scope` / `scope_id`. Unique partial indexes allow one assignment per `(role_id, scope, scope_id, reference, reference_id)` and one unscoped assignment per `(role_id, reference, reference_id)`, among non-deleted rows.

### Service methods (`src/services/rbac-module-service.ts`)

Generated CRUD for `RbacRole`, `RbacPolicy`, `RbacRolePolicy`, `RbacRoleAssignment`, plus:

- `listPoliciesForRole(roleId)`: the policies assigned directly to the role (raw SQL join in `src/repositories/rbac.ts`), as `RbacPolicy` rows.
- `listRbacRoles` / `listAndCountRbacRoles` (overridden): when `relations` or `select` include `"policies"`, `role.policies` is replaced with the role's `RbacPolicy` rows, not the raw `RbacRolePolicy` join rows.
- `retrieveActorAuthzContextConfig(actorType)`: the resolved `actors` option entry for an actor type (`user` and `api-key` always have one).

### Events and links

- Emits internal CRUD events (`rbac.<model>.created|updated|deleted|restored`) through `MedusaService`.
- Read-only links in `packages/modules/link-modules/src/definitions` expose assignments on users (`user-rbac-role-assignment.ts`, `user_role_assignments`) and invites (`invite-rbac-role-assignment.ts`, `invite_role_assignments`), matching `reference_id` to the user or invite `id`. The legacy `user-rbac-role` / `invite-rbac-role` table links are kept only until a migration script copies their rows into `rbac_role_assignment`.

## Architecture

- Two loaders run on every module load, in this order (`src/index.ts`):
  - `src/loaders/initial-data.ts` upserts the super admin role (`RBAC_SUPER_ADMIN_ROLE_ID`, `role_super_admin`), its `*:*` policy (`RBAC_SUPER_ADMIN_POLICY_ID`, `rpol_super_admin`), and their join `rlpl_super_admin`. Both constants come from `@medusajs/framework/utils`.
  - `src/loaders/core-policies.ts` syncs `CORE_POLICY_DEFINITIONS` (`src/loaders/core-policy-definitions.ts`: `buildPolicies` over `CORE_POLICY_RESOURCES`, one policy per core resource and operation). Rows are matched by `key`: missing ones are created, soft-deleted ones restored, and drifted `name` / `description` updated. Policies it doesn't define are never touched, and it never deletes.
- `src/repositories/rbac.ts` (`RbacRepository`) uses raw SQL against `rbac_role`, `rbac_role_policy`, `rbac_policy`; renaming those tables or columns requires updating these queries.

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

- A policy's `key`, `resource` and `operation` cannot be changed through `POST /rbac/policies/:id` (only `name`, `description` and `metadata` can). Every role holding the policy would silently gain the new permission, so an actor with `rbac_policy:update` could widen a policy they hold into `*:*`. Create a new policy, or change them from a migration script you control.
- The super admin role and policy can't be deleted (`deleteRbacRolesStep` / `deleteRbacPoliciesStep` in `@medusajs/core-flows` throw `NOT_ALLOWED`), and the last user holding the unscoped super admin role can't be unassigned from it or deleted (`ensureSuperAdminRemainsStep`). Calling the module service directly bypasses these checks.
- Deleting a core policy only lasts until the next boot: `core-policies.ts` restores it.
- The framework caches each role's resolved permissions (`packages/core/framework/src/policies/has-permission.ts`) through the caching module, tagged with `RBAC_CACHE_TAGS` from `@medusajs/framework/utils`. The caching module invalidates those tags from this module's CRUD events, so writes that skip `MedusaService` (raw SQL, events not emitted) leave stale permissions until the entries expire.
