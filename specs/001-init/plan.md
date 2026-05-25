# Implementation Plan: undrlla v2 — Medusa Migration + Decentralized Hybrid Hosting

**Branch**: `001-init` | **Date**: 2026-05-24 | **Spec**: [spec.md](../001-init/spec.md)
**Input**: Feature specification from `specs/001-init/spec.md`; research from `specs/001-init/research.md`

---

## Summary

Complete rewrite of the legacy `undrlla` e-commerce platform (Next.js Pages Router, mono-tenant) onto **Medusa v2** (headless commerce backend) + **Next.js 16 App Router** (storefront) + **decentralized hybrid hosting** (Akash Network + community Federation + centralized hot-core for secrets).

The rewrite serves 7 user stories: B2C migration cutover (P1), AI-augmented PC-builder purchase flow (P2), multi-channel customer support agent (P3), BYOK customer AI path (P3), Akash primary deployment (P4), community-operator onboarding (P4), internal ops automation (P5). It migrates 62 legacy models, supports 40 functional requirements, and targets 12 measurable success criteria — including P50 checkout ≤300ms (SC-007), AI first-token P95 ≤8s (SC-006), and ≥60% compute cost reduction vs AWS (SC-002).

Technical approach: single Medusa v2 instance with `tenant_id` on every customer-scoped table + Postgres RLS for multi-tenancy; Postgres primary on dedicated Hetzner hot-core (Akash runs stateless compute only); OmniRoute sidecar for AI gateway with 3-tier resolution (dev/paid/BYOK); Hatchet workers for VPN provisioning; Better-Auth with org plugin for auth; OpenMeter + Killbill for AI token metering; lightweight REST federation protocol for community-operator instances.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node 22 LTS
**Primary Dependencies**: Medusa v2.15.4 (backend), Next.js 16 App Router (storefront), Better-Auth (auth), Hatchet (job orchestrator), OmniRoute sidecar (AI gateway), MikroORM via Medusa DML (Custom Modules) + Prisma (standalone packages only — migration tool, undrestrator), pnpm 10
**Storage**: PostgreSQL 16 (hot-core Hetzner, primary DB), Redis 7 (session JWT-jti revocation list, CSRF tokens, cache only — cart stored in Postgres per Medusa v2 default), MinIO (S3-compatible object storage)
**Testing**: Vitest (unit), integration tests against docker-compose stack, Playwright (E2E)
**Target Platform**: Linux (Akash Network, docker-compose, any Linux VPS)
**Project Type**: Web service (e-commerce platform + AI surface + VPN provisioning)
**Performance Goals**: P50 checkout ≤300ms, P95 ≤1500ms (SC-007); AI first-token P95 ≤8s (SC-006); token-metering overhead <5% (SC-005)
**Constraints**: GDPR-only jurisdictions; zero secrets outside hot-core; `tenant_id` on every customer-scoped table; Akash compute stateless only
**Scale/Scope**: 1–10 tenants initially; ≥5 community instances in 12 months (SC-004); 62 legacy models to migrate; 7 user stories; 40 FRs

### Latency Budget (Akash → Hot-Core)

| Stage | Budget P95 | Notes |
|-------|-----------|-------|
| DB roundtrip (Akash→Hetzner) | ≤40ms per query | EU-only Akash; PgBouncer on hot-core |
| DB total per checkout (15 queries) | ≤600ms | Connection pooler + query batching |
| Application logic | ≤300ms | Medusa workflow + tenant middleware |
| LLM inference (AI checkout) | ≤8s | Separate from standard checkout |
| Render (SSR) | ≤200ms | Server component hydration |
| Network (edge→Akash→Hetzner→Akash→edge) | ≤400ms | CDN terminates at edge |
| **Total standard checkout** | **≤1500ms** | SC-007 |

**Validation gate (Phase 0 M0.3)**: Measure actual Akash-EU → Hetzner-EU RTT. If P95 >40ms, activate connection pooling (PgBouncer) + query batching before Phase 1.

### Hot-Core Availability

| Metric | Target | Mechanism |
|--------|--------|----------|
| RPO (data loss) | 0 (synchronous) | Synchronous streaming replication to secondary Hetzner DC |
| RTO (recovery) | ≤15 min P95 | Automated failover via Patroni; hot-standby takes primary role |
| Backup | Daily pg_dump + WAL | Dual-write: Hetzner Storage Box (hot) + Scaleway Object Storage (off-vendor) |
| Restore drill | Quarterly | T054 extended: hot-core kill drill alongside Akash provider drill |

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | TS-Native Stack (NON-NEGOTIABLE) | ✅ PASS | Single-stack TS: Medusa v2 (Node 22), Next.js 16, Better-Auth, Hatchet, OmniRoute SDK. No Python/Ruby/Go in core runtime. **Note on infrastructure services**: Constitution Principle I (TS-Native) applies to the core application runtime. Infrastructure services (Hatchett engine, Postgres, Redis, MinIO, Grafana, Langfuse) may use non-TS runtimes when deployed as isolated containers. The rejection of Temporal in research B8 was a design choice (operational complexity, gRPC learning curve), not a constitutional violation. Hatchet was preferred for its TS-native client library and simpler self-hosting model. For community-operators (US6), the install CLI provisions Hatchet engine automatically as part of `docker-compose.prod.yml`. |
| II | MIT License Safety (NON-NEGOTIABLE) | ✅ PASS | Medusa (MIT), Better-Auth (MIT), Hatchet (MIT), Next.js (MIT), Prisma (Apache 2.0), OmniRoute (MIT). Infrastructure services (MinIO AGPL, Grafana AGPL) are isolated containers — not linked in core. Permissive licenses (MIT / Apache 2.0 / BSD / ISC) for dependencies; pure MIT for undrlla v2 output (research.md §A1). |
| III | Plan-Driven Development | ✅ PASS | This IS the plan. Spec at `specs/001-init/spec.md`. Research at `specs/001-init/research.md`. |
| IV | AI-Augmented Velocity | ✅ PASS | OmniRoute sidecar in every env; Hermes/undrestrator for code gen; degrade gracefully when AI unavailable. |
| V | Decentralization-Ready | ✅ PASS | Akash SDL in `infra/akash/`, `docker-compose.yml` at root, 1-command install script. No cloud-provider API lock-in. |
| VI | Hot-Secrets Boundary (NON-NEGOTIABLE) | ⚠️ PASS-WITH-CAVEAT | Postgres primary on dedicated Hetzner; Infisical for KEK; VPN keys on hot-core only; AES-256-GCM at rest. CI secret-scan enforced. **Caveat**: Akash container RAM exposure — see Akash Secrets Boundary subsection below. |
| VII | Cross-AI Review Gate | ⏳ PENDING | Will enforce at `/speckit.implement`. Non-negotiable for payment/VPN/auth/tenant paths. |

**No violations. No complexity tracking needed.**

---

## Project Structure

### Documentation (this feature)

```text
specs/
├── main/
│   ├── plan.md              # This file
│   ├── quickstart.md        # Developer onboarding guide
│   ├── contracts/
│   │   ├── omniroute-sdk.md # OmniRoute TS SDK API contract
│   │   ├── payment-btcpay.md # BTCPay Server payment provider contract
│   │   ├── vpn-provisioning.md # VPN provisioning worker contract
│   │   ├── federation-protocol.md # Federation REST API contract
│   │   └── auth-better-auth.md # Better-Auth + Medusa integration contract
│   ├── data-model.md        # Entity schema + relationships (16 tables)
│   ├── architecture.md      # 4-layer system architecture
│   └── tasks.md              # Task breakdown (90 tasks across 7 phases)
└── 001-init/
    ├── spec.md              # Feature specification (40 FRs, 7 stories, 12 SCs)
    ├── research.md          # Technical research (12 decisions, 3 deferred items)
    ├── decisions/
    │   ├── foundation-matrix.md     # Medusa v2 selection (8.42/10)
    │   └── decentralization-matrix.md # Hybrid model selection (8.87/10)
    ├── checklists/
    │   └── requirements.md
    └── checklists/
        └── requirements.md
```

**Note**: `plan.md` and `tasks.md` are byte-identical mirrors at both `specs/main/` (canonical) and `specs/001-init/` (feature-branch alias) for tool compatibility. Edit both or use a sync script.

### Source Code (repository root)

```text
apps/
├── medusa/                    # Medusa v2 backend application
│   ├── src/
│   │   ├── api/               # REST routes, middleware
│   │   │   ├── admin/         # Admin-scoped routes (tenants, VPN, AI config)
│   │   │   └── store/         # Storefront-scoped routes (catalog, checkout)
│   │   ├── modules/           # Custom Medusa modules (entities use MikroORM via Medusa DML)
│   │   │   ├── tenant/        # Tenant module (tenant_id enforcement, Sales Channel binding)
│   │   │   │   └── models/    # DML entities: tenant.ts, workspace.ts, brand-config.ts
│   │   │   ├── vpn/           # VPN provisioning module (WireGuard/AmneziaWG/Xray)
│   │   │   │   └── models/    # DML entities: vpn-server.ts, vpn-peer.ts, vpn-ip-pool.ts
│   │   │   ├── ai-metering/   # AI usage metering module (OpenMeter integration)
│   │   │   │   └── models/    # DML entities: ai-usage-event.ts, ai-key-vault.ts, ai-tier-config.ts
│   │   │   ├── payment-btcpay/ # BTCPay Server Payment Provider Module
│   │   │   │   └── models/    # DML entities: payment-transaction.ts
│   │   │   └── federation/    # Federation discovery + catalog + portability module
│   │   │       └── models/    # DML entities: federation-instance.ts, federation-catalog-entry.ts
│   │   ├── workflows/         # Medusa workflows
│   │   │   ├── checkout/      # Checkout workflow (cart → payment → fulfillment)
│   │   │   ├── vpn-provision/ # VPN provisioning workflow (allocate → SSH → encrypt → notify)
│   │   │   └── ai-metering/   # Metering workflow (OmniRoute → OpenMeter → Killbill)
│   │   ├── subscribers/       # Event subscribers
│   │   │   ├── order-events.ts    # order.payment_captured → trigger provisioning
│   │   │   └── ai-usage-events.ts # AI usage → metering pipeline
│   │   └── jobs/              # Scheduled jobs
│   │       ├── billing-cycle.ts   # Killbill billing cycle aggregation
│   │       └── vpn-cleanup.ts     # Expired VPN peer cleanup
│   ├── medusa-config.ts       # Medusa configuration
│   └── package.json
├── storefront/                # Next.js 16 App Router storefront
│   ├── src/
│   │   ├── app/               # App Router pages (GLOBAL/EU regions)
│   │   │   ├── (global)/      # GLOBAL region routes
│   │   │   └── (eu)/          # EU region routes
│   │   ├── components/        # React components
│   │   │   ├── pc-builder/    # AI PC-builder advisor UI
│   │   │   ├── checkout/      # Checkout flow components
│   │   │   └── vpn/           # VPN management dashboard components
│   │   ├── lib/               # Client utilities, SDK wrappers
│   │   │   ├── medusa-sdk.ts  # Medusa JS SDK wrapper
│   │   │   └── omniroute.ts   # OmniRoute client wrapper
│   │   └── styles/            # Tailwind CSS
│   ├── next.config.ts
│   └── package.json
└── admin/                     # Medusa admin customizations (if needed)

packages/
├── shared-types/              # Shared TS types between backend + frontend
│   ├── src/
│   │   ├── tenant.ts          # Tenant, Workspace types
│   │   ├── vpn.ts             # VPNServer, VPNPeer types
│   │   ├── ai.ts              # AIUsageEvent, AIKeyVault, tier types
│   │   ├── order.ts           # Order, PaymentTransaction extensions
│   │   └── federation.ts      # FederationInstance, catalog types
│   └── package.json
├── omniroute-client/          # OmniRoute TS SDK (typed, retry, tier resolution)
│   ├── src/
│   │   ├── client.ts          # Main client class
│   │   ├── tier-resolver.ts   # Dev/paid/BYOK tier resolution logic
│   │   ├── retry.ts           # Exponential backoff with jitter
│   │   ├── types.ts           # Request/response types
│   │   └── metering.ts        # Metering event emission
│   └── package.json
├── vpn-provisioner/           # SSH-based VPN provisioning library
│   ├── src/
│   │   ├── ssh-client.ts      # ssh2 wrapper for VPN server commands
│   │   ├── wireguard.ts       # WireGuard peer config generation
│   │   ├── amneziawg.ts       # AmneziaWG peer config generation
│   │   ├── xray.ts            # Xray peer config generation
│   │   ├── ip-pool.ts         # Atomic IP allocation from Postgres
│   │   └── config-encrypt.ts  # AES-256-GCM config encryption
│   └── package.json
├── tenant-middleware/         # Dual-enforcement tenant isolation (ORM + HTTP + RLS)
│   ├── src/
│   │   ├── mikro-orm-tenant-subscriber.ts # MikroORM subscriber: injects tenant_id for Medusa Custom Module DML queries
│   │   ├── prisma-extension.ts # tenant_id injection into every standalone-package Prisma query
│   │   ├── medusa-middleware.ts # Medusa module context injection (HTTP layer)
│   │   └── rls-policy.ts      # Postgres RLS policy generator
│   └── package.json
├── migration-tool/            # Legacy → v2 data migration CLI
│   ├── prisma/
│   │   └── schema.prisma      # Standalone tooling only — DO NOT use for Medusa Custom Modules
│   ├── src/
│   │   ├── cli.ts             # CLI entry (dry-run, resumable, verify modes)
│   │   ├── extractors/        # Per-entity legacy data extractors
│   │   ├── transformers/      # Legacy → Medusa schema transformers
│   │   ├── loaders/           # Medusa v2 data loaders
│   │   └── verifier.ts        # Cryptographic integrity verification
│   └── package.json
├── federation-protocol/       # Federation discovery + catalog + portability
│   ├── src/
│   │   ├── discovery.ts       # /.well-known/undrlla.json handler
│   │   ├── catalog.ts         # /api/federation/catalog.json feed
│   │   ├── portability.ts     # FR-036 data export/import archive
│   │   └── types.ts           # Protocol version types
│   └── package.json
└── install-cli/               # 1-command community-operator installer
    ├── src/
    │   ├── cli.ts             # Main install command
    │   ├── scaffold.ts        # Config scaffolding (env, branding)
    │   ├── migrate.ts         # Schema migration runner
    │   └── seed.ts            # Default data seeding
    └── package.json

infra/
├── akash/                     # Akash SDL manifests + jurisdiction config
│   ├── deploy.yml             # Production SDL manifest
│   ├── deploy-staging.yml     # Staging SDL manifest
│   └── jurisdictions.json     # GDPR-compatible provider allow-list
├── docker-compose/            # Development + production compose files
│   ├── docker-compose.yml     # Development stack (Postgres, Redis, MinIO, BTCPay, Langfuse, OmniRoute)
│   └── docker-compose.prod.yml # Production stack (excludes Postgres — runs on hot-core)
├── hot-core/                  # Hot-core setup scripts (Hetzner, WireGuard, Infisical)
│   ├── setup.sh               # Initial server hardening
│   ├── wireguard-server.conf  # WireGuard tunnel config
│   ├── infisical-setup.sh     # Infisical self-hosted deployment
│   └── backup.sh              # pg_dump + WAL archiving to S3
└── ci/                        # CI/CD pipelines
    ├── ci-pipeline.yml        # Main CI (lint, typecheck, test, build)
    ├── secret-scan.yml        # CI secret-scan (trufflehog/gitleaks)
    └── deploy-pipeline.yml    # CD: build → push → deploy (Akash or VPS)

pnpm-workspace.yaml
package.json                   # Root workspace config
tsconfig.base.json             # Shared TS config
.env.example                   # Required env vars template
```

**Structure Decision**: Web application monorepo using pnpm workspaces. `apps/` contains the three deployable applications (Medusa backend, Next.js storefront, admin). `packages/` contains shared libraries consumed by the apps. `infra/` contains deployment artifacts (Docker, Akash, CI). This follows the Medusa v2 recommended project layout extended with custom packages for VPN, tenancy, AI, federation, and migration.

---

## Architectural Decisions Summary

All decisions below are finalized. Full rationale and alternatives in `specs/001-init/research.md`.

| # | Decision | Choice | Confidence |
|---|----------|--------|:----------:|
| D1 | Commerce foundation | Medusa v2 (8.42/10 weighted score) | High |
| D2 | Hosting model | Hybrid: Akash + Federation + Hot Core (8.87/10) | High |
| D3 | Tenancy model | Hybrid: mono-tenant + `tenant_id` FK everywhere; full multi-tenant when 2nd reseller signs | High |
| D4 | AI tier model | 3-tier: dev (operator) / paid (platform-billed) / BYOK (customer key) | High |
| D5 | Multi-tenant pattern | Dual ORM strategy: MikroORM via Medusa DML for Custom Modules + Prisma for standalone packages, both enforced via tenant_id injection (MikroORM subscriber, Prisma extension) PLUS Postgres RLS as defense-in-depth | High |
| D6 | Postgres hosting | Primary on hot-core Hetzner; Akash is stateless compute only | High |
| D7 | OmniRoute integration | Sidecar container + TS SDK (`packages/omniroute-client/`) | High |
| D8 | BTCPay payment | Custom Medusa v2 Payment Provider Module | Medium |
| D9 | VPN provisioning | Hatchet worker + SSH (ssh2) + atomic IP allocation | High |
| D10 | Auth | Better-Auth with organization plugin | Medium |
| D11 | Job orchestrator | Hatchet (replaces BullMQ from legacy) | Medium |
| D12 | AI tracing | Langfuse self-hosted + OpenTelemetry | High |
| D13 | AI token metering | OpenMeter → Killbill → Stripe/BTCPay | Medium |
| D14 | Hot-core architecture | Dedicated Hetzner + WireGuard tunnel + Infisical | High |
| D15 | Federation protocol | Lightweight REST: discovery + catalog + portability | Medium |
| D16 | License | Permissive licenses (MIT / Apache 2.0 / BSD / ISC) for dependencies; pure MIT for undrlla v2 output | High |
| D17 | Akash failover RTO | 5 min P95, 15 min P99, RPO = 0 for committed transactions | Medium |
| D18 | Legacy retention | 1 year read-only + 7 year cold archive | High |
| D19 | GDPR Akash filter | SDL placement constraints + hardcoded country allow-list | High |
| D20 | i18n regions | GLOBAL + EU from day one; RU region removed (GDPR-only) | High |

---

## Migration Phases

### Phase 0 — Foundation (Weeks 1–2)

**Goal**: Medusa v2 + Next.js app scaffold + local dev docker-compose + CI green.

| Milestone | Deliverables | FR Coverage | Verification |
|-----------|-------------|-------------|-------------|
| M0.1 Repo scaffold | pnpm monorepo, `apps/medusa/`, `apps/storefront/`, `packages/shared-types/`, `pnpm-workspace.yaml`, `tsconfig.base.json` | FR-001, FR-002 | `pnpm install` succeeds; `pnpm build` succeeds |
| M0.2 Docker dev stack | `infra/docker-compose/docker-compose.yml` (Postgres 16, Redis 7, MinIO, BTCPay testnet, Langfuse, OmniRoute) | FR-021 | All containers healthy: `docker compose ps` |
| M0.3 Medusa v2 running | `apps/medusa/medusa-config.ts`, basic module registration, `/health` endpoint responds | FR-001 | `curl localhost:9000/health` → `{"status":"ok"}` |
| M0.4 Next.js 16 storefront shell | `apps/storefront/` with App Router, server components, Medusa SDK connection, region routing stub | FR-002 | `curl localhost:3000` → 200 |
| M0.5 CI pipeline | `infra/ci/ci-pipeline.yml`: lint, typecheck, unit tests, build | FR-029 | CI green on push to `001-init` |
| M0.6 Auth PoC | Better-Auth + Medusa adapter proof-of-concept | FR-005 | Login, session, token refresh working |
| M0.7 Legacy data dump | Anonymized legacy Postgres dump for staging | FR-004 | `pg_restore --list dump.sql` shows all legacy tables |

**Key risks**: Better-Auth + Medusa auth integration is undocumented — PoC in M0.6 validates or rejects early.

**AI augmentation**: Hermes/undrestrator generates Medusa module skeletons, Next.js page stubs, docker-compose configs.

---

### Phase 1 — Core Commerce Parity (Weeks 3–6)

**Goal**: Catalog, cart, checkout, payments, VPN provisioning, i18n — staging passes legacy regression tests.

| Milestone | Deliverables | FR Coverage | Verification |
|-----------|-------------|-------------|-------------|
| M1.1 Catalog migration | `packages/migration-tool/` extracts legacy products → Medusa products; `tenant_id` on all tables | FR-001, FR-004, FR-006 | Migration dry-run produces zero errors; verification mode confirms hash match on 100% of records |
| M1.2 Tenant middleware | `packages/tenant-middleware/` (MikroORM subscriber + Prisma extension + Medusa module middleware + RLS policies) | FR-006, FR-007, FR-009 | Integration test: tenant A cannot see tenant B's data (404, not 403) |
| M1.3 Payment providers — Stripe + PayPal | Medusa v2 payment provider modules for Stripe and PayPal | FR-003 | Integration test: complete checkout with each provider on staging |
| M1.4 Payment provider — BTCPay | `apps/medusa/src/modules/payment-btcpay/` custom Medusa v2 Payment Provider | FR-003 | Integration test: create invoice → webhook settle → order captured |
| M1.5 Payment provider — manual bank transfer | Admin-side reconciliation for manual bank payments | FR-003 | Admin marks order as paid; order state machine transitions correctly |
| M1.6 VPN provisioning module | `packages/vpn-provisioner/` + `apps/medusa/src/workflows/vpn-provision/` + Hatchet worker | FR-018, FR-019, FR-020 | End-to-end: paid order → VPN peer allocated → config generated → encrypted delivery |
| M1.7 Checkout workflow | Medusa workflow: cart → payment capture → fulfillment (physical) or VPN provisioning (digital) | FR-001 | 10 representative orders (per payment method × PC-build/VPN/mixed) complete successfully |
| M1.8 i18n — GLOBAL + EU | Region-aware pricing, currencies, tax rules, locale routing in storefront | FR-027, FR-028 | Switch region → correct currency/tax/locale; cart cleared with warning on region switch |
| M1.9 Customer migration | Legacy customer accounts → Medusa customers with password-reset link flow | FR-004, FR-005 | Legacy customer logs into v2 with password-reset link; sees full order history |
| M1.10 Observability foundation | Structured logging (pino/consola) with tenant context; error reporting to GlitchTip with PII redaction | FR-029, FR-032, FR-033 | Log output contains `tenant_id`; no secret appears in any log line (verified by grep) |

**Key risks**: BTCPay webhook lifecycle edge cases (late settlement after refund window); VPN SSH provisioning failures on hot-core via WireGuard tunnel.

**AI augmentation**: Hermes generates payment provider module boilerplate; migration tool extractors/transformers for each legacy entity type.

---

### Phase 2 — AI Surface (Weeks 5–8, overlaps Phase 1)

**Goal**: OmniRoute sidecar + PC-builder advisor + support agent + 3-tier metering.

| Milestone | Deliverables | FR Coverage | Verification |
|-----------|-------------|-------------|-------------|
| M2.1 OmniRoute sidecar integration | `packages/omniroute-client/` TS SDK; sidecar in docker-compose; health check | FR-010 | `curl omniroute:20128/v1/health` → healthy; SDK chatCompletion returns response |
| M2.2 Tier resolution middleware | SDK resolves dev/paid/BYOK per tenant + user context | FR-011 | Unit test: each tier selected correctly based on tenant config + BYOK presence |
| M2.3 AI metering pipeline | `apps/medusa/src/modules/ai-metering/` + OpenMeter integration | FR-012, FR-013 | Every AI request produces a metering event with all required fields; OpenMeter receives within 1s |
| M2.4 Billing integration | Killbill subscription + usage-based invoicing connected to OpenMeter | FR-013 | End-to-end: 100 AI requests → OpenMeter aggregates → Killbill generates invoice → Stripe charges |
| M2.5 PC-builder AI advisor | `apps/storefront/src/components/pc-builder/` + Medusa module for RAG over catalog | FR-014 | 30 representative briefs → ≥2 builds each; all compatibility-validated; P95 first-build ≤8s (SC-006) |
| M2.6 Compatibility engine | Component compatibility checker (socket, TDP, form factor, budget) | FR-014 | Unit test: incompatible build blocked with human-readable explanation |
| M2.7 Multi-channel support agent | Telegram + WhatsApp (Evolution API) + website widget → single AI agent surface | FR-015 | 50 scripted conversations across 3 channels; ≥60% auto-resolve (SC-008); ≥95% escalation precision |
| M2.8 Human takeover | Operator can join any channel mid-conversation; agent pauses | FR-015 | Operator joins → agent stops; operator hands back → agent resumes |
| M2.9 BYOK key vault | Encrypted key storage (`AIKeyVault` entity); decrypt only in OmniRoute request path | FR-011 | BYOK customer's AI traffic uses zero platform tokens (SC-012); key never appears in logs (SC-009) |
| M2.10 Langfuse tracing | Every AI request traced with tenant tag + cost in Langfuse | FR-030 | Langfuse dashboard shows per-tenant AI usage, cost, latency |
| M2.11 AI graceful degradation | OmniRoute exhaustion → cached/static response with "AI temporarily unavailable" label | Edge case | All 3 AI surfaces degrade gracefully; never serve stale answer as live |
| M2.12 Batch content/SEO | undrestrator pipeline for product descriptions, meta tags, translations | FR-016 | Generated content passes review; i18n coverage for all catalog products |

**Key risks**: OpenMeter throughput at scale (>1000 events/min) — load test in M2.3. Evolution API WhatsApp reconnection stability.

**AI augmentation**: Hermes generates SDK client boilerplate, metering event schemas, support agent intent classifiers.

---

### Phase 3 — Decentralization Activation (Weeks 9–12)

**Goal**: Akash deployment live; hot-core hardened; GDPR filter enforced; failover drill passed.

| Milestone | Deliverables | FR Coverage | Verification |
|-----------|-------------|-------------|-------------|
| M3.1 Akash SDL manifest | `infra/akash/deploy.yml` + `deploy-staging.yml`; GDPR jurisdiction filter | FR-022, FR-025 | SDL deploys to Akash; only GDPR-compatible providers selected |
| M3.2 Stateless Akash topology | Medusa backend + Next.js storefront + OmniRoute sidecar + Redis cache on Akash; Postgres connection → hot-core | FR-021, FR-024 | Full checkout on Akash deployment completes successfully |
| M3.2a Cart persistence | Cart state stored in Postgres (Medusa v2 default) — not Redis. Redis holds session JWT-jti + CSRF tokens + cache only. Cart survives Akash worker failover. Per claude v3 F11. | FR-001 | Cart survives Akash provider kill drill (T055) |
| M3.2b Hatchet topology | Engine on Akash (sibling to Medusa); state-DB on hot-core Postgres via WireGuard TCP; workers intra-Akash. Per claude v3 F14. | FR-018 | Hatchet engine reachable from workers; state persists across Akash provider failover |
| M3.3 Hot-core hardening | Dedicated Hetzner setup: LUKS disk encryption, WireGuard tunnel, Infisical, automated backups | FR-024 | Secret-scan audit: zero payment/VPN/AI secrets outside encrypted hot-core (SC-010) |
| M3.4 Provider-failure drill | Controlled kill of Akash provider → failover within 5 min P95 | FR-026 | In-flight `pending_payment` orders survive; no data loss (SC-011) |
| M3.5 VPS warm-standby script | Manual-activation VPS fallback for catastrophic Akash outage | FR-026 | Standby activates within 10 minutes; serves traffic from hot-core Postgres |
| M3.6 Monitoring + alerting | Prometheus/VictoriaMetrics metrics per tenant; alerting on error-rate, latency, AI-cost anomalies | FR-031 | Alert fires within 60s of simulated error-rate spike |

**Key risks**: Akash provider quality variability — rank by reputation; have VPS rollback for first 90 days. Network latency between Akash EU and Hetzner hot-core must stay within checkout budget.

**AI augmentation**: Hermes generates SDL manifest, monitoring alert rules, hot-core setup scripts.

---

### Phase 4 — Cutover & Legacy Sunset (Weeks 13–15)

**Goal**: Dual-write window; reconciliation; legacy read-only; RU customer offboarding. Extended from 2w to 3w to accommodate reconciliation discrepancy resolution and customer support spike during cutover (per claude.md re-review N15).

| Milestone | Deliverables | FR Coverage | Verification |
|-----------|-------------|-------------|-------------|
| M4.1 Dual-write activation | Every order written to both legacy and v2 simultaneously | FR-038 | 100 orders during dual-write; reconciliation report shows zero discrepancies |
| M4.2 Reconciliation reporting | Daily reconciliation: legacy vs v2 order counts, amounts, statuses | FR-038 | Reconciliation report auto-generated; discrepancy alert triggers manual review |
| M4.3 Tenant-by-tenant cutover | Per-tenant switch from legacy to v2 routing | FR-039 | GLOBAL tenant cutover; EU tenant cutover; each verified independently |
| M4.4 Legacy read-only freeze | Legacy undrlla switched to read-only mode | FR-040 | Legacy storefront shows historical orders only; no new orders accepted |
| M4.5 RU customer offboarding | GDPR-style data export offered to legacy RU customers | FR-028a | RU customer can export their data; account closure flow works |
| M4.6 Legacy retention setup | 1-year read-only retention timer; 7-year cold archive schedule | FR-040 | Archive job scheduled; SQL dump verified restorable |

**Key risks**: Dual-write performance impact on legacy system. Data reconciliation edge cases (legacy partial writes, payment state mismatches).
**Dual-write contract**: v2 writes to its own DB (authoritative), then fires async call to legacy API endpoints (not direct DB). Legacy API validates + processes as normal. Accept +150-300ms latency during 3-week cutover. See T059 acceptance criteria for full contract.

**AI augmentation**: Hermes generates reconciliation scripts, data export endpoints, cutover runbooks.

### Migration Tool Failure Matrix

| Failure Mode | Response | Recovery |
|-------------|----------|----------|
| Malformed legacy record | Quarantine → log → skip | Quarantined records reviewed manually post-migration |
| Schema drift (legacy changed mid-migration) | Abort batch → alert operator | Resume from last checkpoint after schema reconciliation |
| Partial failure (50% migrated, crash) | Resume from per-table checkpoint | Each table tracks last migrated ID; restart picks up from checkpoint |
| Conflict (v2 already has record) | Skip (idempotent) | Log conflict with both IDs for manual review |
| Referential integrity failure | Abort entity → quarantine children | Parent must succeed before children migrate |
| Aggregate mismatch (count/sum) | Fail verification phase | Full re-run required; operator must investigate discrepancy |
| Orphan VPN peer (server decommissioned) | quarantine, status='orphan_server' | Manual ops review post-migration; do NOT block batch |

**Checkpoint semantics**: per-table, per-batch (1000 records). MigrationJournal tracks each record's status.
**Aggregate verification**: customer count match, order count match, sum of order amounts within 0.01% tolerance, VPN peer count match.

### Migration Entity Ordering (FR-004 referential integrity)

The migration tool extracts entities from legacy in the order below. Every step waits for the prior step to reach `verification_status: verified` for ≥99% of records (operator override for the 1% tail) before proceeding. Order matches the foreign-key graph — any deviation will fail on FK violations.

| Step | Entity | Depends on | Notes |
|------|--------|------------|-------|
| 1 | Tenant | (none) | Root entity; one per legacy installation. |
| 2 | Workspace, BrandConfig | Tenant | Initial 1:1 with Tenant. |
| 3 | VPNServer | Tenant | Per-tenant inventory. |
| 4 | VPNIPPool | VPNServer | Address pool per server. |
| 5 | Customer | Tenant | Account holders; populates `auth_legacy_credentials` via Better-Auth migration. |
| 6 | Product, ProductVariant | Tenant (via Sales Channel) | Catalog. Medusa-native entities. |
| 7 | Order | Customer, Product | Past orders; status preserved. |
| 8 | PaymentTransaction | Order | Payment captures, refunds, legacy-shkeeper marker. |
| 9 | VPNPeer | VPNServer, Customer, Order | Live peer configs; orphan handling per Failure Matrix (F4). |
| 10 | AIKeyVault | Tenant, Customer | BYOK keys, re-encrypted with v2 KEK. |
| 11 | AITierConfig | Tenant | Per-tenant tier rules. |
| 12 | AIUsageEvent | Customer, AIKeyVault | Historical usage for billing reconciliation. |
| 13 | FederationInstance | (none) | Independent of tenant graph. |
| 14 | FederationCatalogEntry | FederationInstance | Federation catalog mirror. |
| 15 | auth_legacy_credentials | Customer | Populated by Better-Auth migration pipeline once Customer rows exist. |

**Operator override**: if step N has <99% verified after the configured retry budget, operator may force-advance via `migration-tool advance --from-step N --acknowledge-residual`. Logged to MigrationJournal.

**Parallelism**: steps with no cross-dependency (e.g., 13 and 14 are independent of 1–12 except for instance IDs) MAY run in parallel.

---

### Phase 5 — Federation & Open Source (Weeks 16–17)

**Goal**: MIT-licensed repo published; docs; install script; first community operators onboarded.

| Milestone | Deliverables | FR Coverage | Verification |
|-----------|-------------|-------------|-------------|
| M5.1 Federation protocol | `packages/federation-protocol/`: discovery, catalog, portability endpoints | FR-034, FR-036 | Two undrlla instances discover each other; data export → import succeeds |
| M5.2 Install CLI | `packages/install-cli/`: 1-command install (schema, migrations, seed, config) | FR-023 | Non-team developer completes install in ≤1 hour with ≤3 questions (SC-003) |
| M5.3 Documentation | Operator guide: install, configure, upgrade, backup/restore, incident response | FR-035 | Documentation review passes; new operator can follow guide without maintainer help |
| M5.4 MIT license + repo publish | License audit; all code under MIT; public repo with CONTRIBUTING.md | FR-034 | `license-checker` confirms zero non-permissive dependencies in core |
| M5.5 Community onboarding | Discord/Matrix channel; first 1–2 community operators onboarded | SC-004 | ≥1 community instance running and serving customers |

**Key risks**: Community-operator experience friction — install script must be truly 1-command. License audit may surface transitive AGPL dependencies.

**AI augmentation**: Hermes generates documentation first drafts, install script scaffolding, license audit report.

---

### Phase 6 — Multi-Tenant Activation (Deferred)

**Trigger**: Second commercial reseller signs.

| Milestone | Deliverables | FR Coverage |
|-----------|-------------|-------------|
| M6.1 `tenant_id` filter activation | RLS policies + MikroORM subscriber + Prisma extension enforced end-to-end | FR-009 |
| M6.2 Per-tenant Sales Channels | Each tenant gets own Sales Channel with scoped products, pricing, payment providers | FR-007 |
| M6.3 Subdomain routing | `<tenant>.undrlla.com` → tenant-scoped storefront | FR-008 |
| M6.4 Per-tenant payment keys | Each tenant's payment provider secrets isolated in Infisical | FR-024 |
| M6.5 Tenant-scope probe suite | Automated test: tenant A → 404 on tenant B's resources for every endpoint | FR-009 |

**Not scheduled.** Activated on demand when the business trigger fires.

---

## Data Model Overview

Core entities and their relationships. Full schema with column definitions in `data-model.md`.

```
Tenant 1──* Workspace 1──* Customer
  │                         │
  │                         ├──* Order ──* PaymentTransaction
  │                         │     │
  │                         │     └──* VPNPeer ──* VPNServer
  │                         │
  │                         └──* AIUsageEvent
  │                         └──1 AIKeyVault (optional, BYOK)
  │
  ├──* Product (via Sales Channel)
  └──* FederationInstance (future)

MigrationJournal (standalone, tracks legacy → v2 entity mapping)
```

### Key design rules

- **`tenant_id` on every customer-scoped table** — enforced by MikroORM subscriber (Medusa Modules) + Prisma extension (standalone packages), backed by Postgres RLS
- **Soft delete on Orders and VPNPeers** — never physical-delete commerce or VPN records
- **AES-256-GCM encryption at rest** — for AIKeyVault secrets, VPN private keys, payment provider tokens
- **Immutable audit columns** — `created_at`, `updated_at`, `created_by`, `updated_by` on all mutation tables
- **Ciphertext columns typed as `bytea`** — never store encrypted data as `text`
- **Medusa native entities extended, not replaced** — extend Medusa's `Order`, `Customer`, `Product` via custom models, don't fork core

### Custom Medusa modules (new entities)

| Module | Entity | Purpose |
|--------|--------|---------|
| `tenant` | Tenant, Workspace | Multi-tenant workspace management |
| `vpn` | VPNServer, VPNPeer, IPPool | VPN server inventory and peer lifecycle |
| `ai-metering` | AIUsageEvent, AIKeyVault, AITierConfig | AI usage tracking and BYOK key storage |
| `payment-btcpay` | BTCPayInvoice, BTCPayWebhookEvent | BTCPay Server payment lifecycle |
| `federation` | FederationInstance, FederationCatalog | Federation discovery and catalog sharing |

---

## Cross-Cutting Concerns

### Security

- **Secret boundary**: Payment secrets, VPN master keys, KYC data, AI BYOK keys — all on hot-core only. Never on Akash, never in logs, never in client bundles.
- **Tenant isolation**: Dual enforcement: MikroORM subscriber injects tenant_id for Medusa Custom Module queries; Prisma extension injects tenant_id for standalone package queries; Postgres RLS policies enforce isolation at the database layer regardless of ORM.
- **PII redaction**: All error sinks (GlitchTip, logs) redact PII at the boundary. Automated red-team scan in CI (SC-009).
- **Encryption**: AES-256-GCM at rest for all sensitive fields. WireGuard tunnel (mTLS equivalent) between Akash and hot-core.
- **CI secret-scan**: `trufflehog` or `gitleaks` runs on every push. Zero tolerance for committed secrets.

### Hot-Core Operator Access

- SSH via bastion host only (no direct hot-core SSH)
- Hardware-key MFA (FIDO2) required for bastion
- Session recording via auditd + ttyrec
- SSH key rotation: quarterly cadence
- Separate accounts: ops (maintenance), application (service accounts)
- All operator sessions logged to Loki with audit tag
- Quarterly access review: stale keys revoked, unused accounts disabled

### AI Security (Prompt Injection Defense)

- **Constrained output**: JSON schema enforcement via function calling; no raw markdown rendered from LLM
- **Input sanitization**: length limits (4000 chars), role-marker stripping (`<system>`, `[INST]`), rate-limit per conversation
- **Output validation**: prices/SKUs must exist in live catalog; no HTML/JS in rendered AI responses; structured build cards only
- **Per-tenant isolation**: system prompts scoped to tenant; no cross-tenant context bleeding in RAG
- **Regression tests**: T046/T047 include prompt-injection test cases (system prompt extraction, price manipulation, admin impersonation)

### Key Encryption Key (KEK) Rotation

- Rotation cadence: annually + on suspected compromise
- Pattern: envelope encryption — DEK (Data Encryption Key) encrypted by KEK; rotation re-encrypts DEKs with new KEK, data stays encrypted
- Procedure: background job iterates AIKeyVault + VPNPeer records; rotates DEK→KEK binding online; no downtime
- Audit: all rotations logged in Infisical audit log; retained 1 year minimum
- Phase 3 task: automate KEK rotation via Infisical API + Hatchet scheduled workflow

### Akash Secrets Boundary — Residual Risk (Principle VI caveat)

Constitution Principle VI says payment/AI/VPN secrets MUST NOT appear in Akash deployments. Plan.md T053 deploys Infisical for runtime secret injection into Akash containers. Once injected, the secret lives in container RAM — readable from RAM by a hostile Akash provider with kernel-level access. This is a known residual risk, **explicitly accepted by the project lead for v2 launch**.

**Compensating controls (mandatory):**

1. **Provider geo-filter**: Akash deployments restricted to providers in EU/US tier-1 jurisdictions (no RU/CN/IR provider whitelist).
2. **Provider reputation ranking**: prefer providers with >6 months uptime history and >95% SLA. Avoid lowest-bid providers.
3. **Quarterly KEK + secret rotation**: all payment/VPN secrets rotated quarterly (Hatchet scheduled job, see KEK Rotation section above). On rotation, immediately revoke prior values at the source-of-truth providers (Stripe, PayPal, etc.).
4. **Blast-radius limit**: tenant-scoped API keys where supported (e.g., Stripe Connect accounts per tenant) so a single-key compromise doesn't expose all tenants.
5. **Detection**: monitor source-of-truth provider audit logs for anomalous API usage (rate spikes, geo anomalies); alert ops within 15 min.

**Path to full compliance (post-v2)**: implement edge-layer pattern (thin webhook receiver on Akash forwarding signed payloads over WireGuard to secret-processor on hot-core). Tracked in tech-debt backlog as `TD-001`.

### Backup Destination

Backup destination: **dual-write**
1. Hetzner Storage Box (same provider, different physical server, cheap, GDPR-compliant) — hot copy
2. Scaleway Object Storage (different vendor, EU jurisdiction) — off-vendor durability

No AWS S3 (avoids Principle V dependency concern). Restore drill: quarterly, rotating between destinations.

### Observability

- **Logs**: Structured JSON (pino/consola) with `tenant_id` context → Loki
- **Traces**: Langfuse for AI requests (tenant tag, cost); OpenTelemetry for HTTP requests
- **Metrics**: Prometheus/VictoriaMetrics — per-tenant error-rate, latency, AI-cost
- **Alerts**: Error-rate >1% → page; latency P95 >2s → page; AI-cost anomaly → review

### i18n

- GLOBAL (USD, English) + EU (EUR, English + localized) from day one
- Region driven by URL/subdomain; persisted across sessions
- Cart cleared with explicit warning on region switch (not silent re-pricing)
- RU region removed; legacy RU customers get data export + account closure (FR-028a)

### Error handling patterns

- **Payment provider outage**: Order held in `pending_payment`; resumable when provider recovers
- **Akash provider failure**: Failover to replica within 5 min P95; no in-flight order loss
- **OmniRoute exhaustion**: Graceful degradation — "AI temporarily unavailable"; never stale-as-live
- **VPN peer race condition**: Atomic `UPDATE ... WHERE allocated = false LIMIT 1 RETURNING *`; double-assignment impossible
- **BYOK key revocation**: Session ends gracefully; no platform-key fallback
- **Community-operator schema drift**: Upstream migration detects drift; refuses to run with clear message

---

## Dependency Map

### Critical path dependencies

```
Phase 0 → Phase 1 → Phase 4 (cutover requires commerce parity)
Phase 0 → Phase 2 (AI surface requires OmniRoute sidecar from Phase 0)
Phase 1 + Phase 2 → Phase 3 (decentralization requires working app)
Phase 3 → Phase 5 (federation requires Akash deployment validated)
Phase 4 → Phase 6 trigger (multi-tenant deferred until post-cutover)
```

### Parallelization opportunities

- **Phase 1 + Phase 2** overlap (weeks 5–8): Commerce work and AI work can proceed in parallel on different modules
- **`packages/vpn-provisioner/`** and **`packages/omniroute-client/`** can be developed independently in Phase 0–1
- **`packages/migration-tool/`** and **`packages/install-cli/`** can be developed independently
- **`infra/akash/`** SDL work can start during Phase 1 (doesn't need complete app)

### External dependency risks

| Dependency | Risk | Mitigation |
|-----------|------|-----------|
| Medusa v2 modules API | Still young; breaking changes likely | Budget 1 month/year for migrations; pin exact version |
| BTCPay Server API | Version changes could break webhook handler | Pin BTCPay version in docker-compose; integration test against pinned version |
| Akash Network | Provider quality varies; scheduler behavior may change | VPS warm-standby; provider-kill drills quarterly |
| Better-Auth + Medusa | Undocumented integration pattern | PoC in Phase 0 M0.6; fallback to custom JWT auth if Better-Auth doesn't fit |
| Hatchet on Akash | Engine on Akash; state-DB on hot-core via TCP (revised per claude v3 F14 — no gRPC tunnel) | Resolved; standard TCP over WireGuard for engine→state-DB |
| OpenMeter throughput | Must handle 1000+ events/min | Load test in Phase 2 M2.3; fallback to Postgres counter table if insufficient |

---

## Risk Register

| # | Risk | Impact | Probability | Phase | Mitigation |
|---|------|--------|:-----------:|:-----:|-----------|
| R1 | Better-Auth + Medusa integration incompatibility | Blocks auth, blocks Phase 1 | Medium | 0 | **Risk R1 (Better-Auth + Medusa compatibility)**: PoC in M0.6 (T008). Gate decision: if T008 spike fails by end of Week 2, project re-plans — DO NOT absorb auth subsystem rewrite into existing Phase 0/1 schedule. Fallback slot reserved as T008b (custom JWT auth + Tenant/Workspace re-adaptation, est. 3 weeks SEC).<br><br>Phase 0 gate: Better-Auth + Medusa adapter spike (1-2 days) precedes T008. Pass criteria: organization plugin works with Medusa user model; session/cookie handling integrates without custom middleware. Fail criteria: any of those break → invoke T008b fallback path. See `specs/main/auth-fallback.md` for the activation sketch (architecture, scope bound, file impact). |
| R2 | BTCPay webhook edge cases (late settlement, refund window) | Payment reconciliation errors | Medium | 1 | Comprehensive integration tests; manual reconciliation queue |
| R3 | VPN SSH provisioning over WireGuard tunnel unreliable | VPN orders stuck in limbo | Low | 1 | Retry policy (3× exponential backoff); dead-letter queue; monitoring alert |
| R4 | OpenMeter throughput insufficient at scale | Billing gaps | Medium | 2 | Load test early; Postgres counter fallback |
| R5 | Akash provider quality — unstable first deployment | Downtime on primary instance | Medium | 3 | Provider reputation ranking; VPS warm-standby for first 90 days |
| R6 | Akash + Hetzner network latency exceeds checkout budget | SC-007 failure (P95 >1500ms) | Low | 3 | SDL jurisdiction filter ensures EU-only Akash providers; latency monitoring |
| R7 | Dual-write performance degrades legacy system | Legacy checkout slowdown during cutover | Low | 4 | Dual-write is fire-and-forget async; legacy write path unchanged |
| R8 | Transitive AGPL dependency in supply chain | MIT license violation for federation | Low | 5 | `license-checker` audit in CI; replace AGPL dependencies |
| R9 | Community-operator install friction >1 hour | SC-003 failure | Medium | 5 | Non-team developer dry-run; iterate on install script |
| R10 | Cross-tenant data leak via forgotten `tenant_id` filter | Security incident, GDPR violation | Low | 1+ | Tenant-scope probe suite in CI; RLS as safety net |

---

## Open Items (for `/speckit.tasks` resolution)

1. **data-model.md** — Full Prisma schema with column types, indexes, RLS policies. Blocks `packages/tenant-middleware/` implementation.
2. **Better-Auth ↔ Medusa adapter design** — Auth provider interface mapping. Blocks M0.6 PoC and all Phase 1 auth flows.
3. ~~**Hatchet ↔ WireGuard tunnel connectivity**~~ — RESOLVED per claude v3 F14: Hatchet engine relocated to Akash; standard TCP to hot-core state-DB replaces gRPC tunnel. No longer blocks Phase 1.
4. **OpenMeter load test plan** — 1000+ events/min benchmark. Blocks Phase 2 metering pipeline finalization.
5. **Akash provider reputation ranking criteria** — Which metrics determine "good" providers. Blocks Phase 3 SDL provider selection.
6. ✅ RESOLVED via T013a — design captured in `specs/main/reconciliation-algorithm.md`. No longer blocks Phase 4.
7. **Federation protocol versioning strategy** — v1 → v2 migration path for community operators. Blocks Phase 5 federation module.
