# Auth Fallback Design (T008b activation)

**Status**: RESERVED — activates only if T008 (Better-Auth + Medusa adapter PoC) fails the Phase 0 gate.
**Owner**: SEC
**Estimate**: 3 weeks (scope bound below justifies the estimate)
**Referenced by**: plan.md Risk R1, tasks.md T008 (PoC) and T008b (this fallback slot)

## When this activates

T008 runs a 1–2 day Better-Auth + Medusa adapter spike (Phase 0). Pass criteria:

1. Better-Auth `organization` plugin maps cleanly to Medusa's user model.
2. Session/cookie handling integrates without custom middleware on every route.
3. SAML via attached Jackson plugin works for an SSO E2E test.

If any fails → T008b activates → project re-plans (do NOT absorb the rewrite into existing Phase 0/1 schedule).

## Architecture sketch

### 1. JWT issuer + verifier (`jose`)

- Library: `jose` (ESM-native, minimal deps, security-audited).
- Tokens: short-lived access (15 min) + refresh (30 days). RS256. JWK rotation quarterly via Hatchet scheduled job.
- New files: `apps/medusa/src/auth/jwt-issuer.ts`, `apps/medusa/src/auth/jwt-verifier.ts`, `apps/medusa/src/auth/jwk-rotation.ts`.

### 2. Org hierarchy in TenantModule (no external auth plugin)

- TenantModule already owns `Tenant` + `Workspace` DML entities.
- Add `TenantMembership` DML entity: `(tenant_id, user_id, role)` — replaces Better-Auth `organization` plugin semantics.
- Hierarchical query: `user → memberships → tenants → workspaces`. Cached per request.
- New files: `apps/medusa/src/modules/tenant/models/tenant-membership.ts`, `apps/medusa/src/api/middleware/tenant-context.ts`.
- data-model.md: add `TenantMembership` entity definition; mark Better-Auth-managed tables as removed.

### 3. Session store (Redis)

- Redis (already deployed) keyed by JWT `jti`. Sessions = revocation list + last-used timestamp.
- Every authenticated request hits Redis `GET sess:<jti>` (~1 ms p50).
- New files: `apps/medusa/src/auth/session-store.ts`.

### 4. SAML / SSO (`@boxyhq/saml-jackson` standalone)

- Jackson runs as a separate Docker service (already on the Better-Auth fallback radar per research.md B7).
- Handles SP-init + IdP-init flows; returns signed callback to Medusa.
- New files: `apps/medusa/src/auth/saml-callback.ts`, `infra/jackson/docker-compose.yml`.

### 5. Files that DON'T change

- Tenant + Workspace + BrandConfig DML entities.
- Medusa workflows for VPN / AI metering / payments (auth context becomes a JWT claim instead of a Better-Auth session — same shape).
- BTCPay / Stripe / PayPal integrations (no auth interaction).
- Storefront SSR (cookie shape preserved; bearer-fallback added for SDK callers).

### 6. Files that DO change

- All routes under `apps/medusa/src/api/admin/` and `apps/medusa/src/api/store/` — middleware swap (~25 files).
- `apps/medusa/src/auth/` — new package (currently absent), ~8 files.
- `data-model.md` — add `TenantMembership`, remove any Better-Auth-only tables.
- `infra/jackson/` — new SAML deployment.

## Scope bound — justifying the 3-week estimate

| Week | Scope |
|------|-------|
| 1 | JWT issuer/verifier, JWK rotation job, session store, `TenantMembership` DML + migration. ~12 files. |
| 2 | Middleware swap across ~25 admin/store routes + integration tests (auth happy path, refresh, revocation). |
| 3 | SAML via Jackson + E2E SSO test + operator docs (T084 addition) + migration guide for existing tenants. |

## Pre-activation decisions (defaults)

These were "open questions" in the original draft. Defaulted now so T008b activation is "execute the plan", not "design under deadline pressure". Maintainer may override any default by logging the decision in `specs/main/auth-fallback-decisions.md` (created on activation if needed).

- **Refresh-token rotation**: Hard expiry 30 days, no sliding window. Rationale: sliding-window rotation enables long-lived hijack if a refresh token leaks; hard expiry caps blast radius at 30 days. Per-tenant config allows shorter windows for high-security tenants.
- **Multi-device session limit**: 5 active sessions per user (configurable per tenant, max 20). Excess sessions evict oldest-by-last-used. Rationale: prevents credential-stuffing fan-out while accommodating multi-device users (phone + laptop + tablet).
- **SAML attribute mapping**: OAuth-style claims — `sub` → `user.id`, `email` → `user.email`, `groups[]` → tenant memberships via `idp_group_mapping` table (group name → `tenant_id`). Rationale: matches industry default; new IdPs onboard via mapping table without code changes.
- **T008-window session compatibility**: Invalidate on T008b activation (force re-login across all users). Rationale: T008 PoC sessions used a different issuer key; preserving them risks signature-validation bugs during transition. Brief inconvenience beats silent auth failures.

## References

- Risk R1 (plan.md): Better-Auth + Medusa compatibility.
- T008 (tasks.md): Better-Auth + Medusa PoC.
- T008b (tasks.md): this fallback activation slot.
- research.md B7: Better-Auth selection rationale.
