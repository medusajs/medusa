# Tasks: undrlla v2 — Medusa Migration + Decentralized Hybrid Hosting

<!-- Authoritative count: count `^- \[ \] T\d` lines in this file. Agent Summary table must sum to that count. -->

**Input**: Design documents from `specs/001-init/` and `specs/main/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, architecture.md, quickstart.md

**Organization**: Tasks grouped by migration phase (Weeks 1–16). Each task maps to specialist agent for domain-aware execution. Phase 6 (Multi-Tenant) is DEFERRED — no scheduled tasks, activated on business trigger.

## Format: `[ID] [AGENT] [Story?] Description`

- **[AGENT]**: Specialist agent responsible for the task (see Agent Tags below)
- **[Story]**: Which user story this task belongs to (US1–US7)
- Include exact file paths in descriptions
- Parallelism derived from Dependency Graph — tasks with no dependencies can run in parallel

## Agent Tags

| Tag | Agent | Domain |
|-----|-------|--------|
| `[SETUP]` | orchestrator | Project init, shared config, scaffolding, shared dependency installs |
| `[DB]` | database-architect | Schema, migrations, seeds, indexes, RLS policies |
| `[BE]` | backend-specialist | API routes, services, middleware, workflows, Medusa modules + unit tests |
| `[FE]` | frontend-specialist | Components, pages, styles, client state, UI design + unit tests |
| `[OPS]` | devops-engineer | Docker, CI/CD, infra, Akash SDL, deployment configs |
| `[E2E]` | test-engineer | Cross-boundary integration/E2E tests only |
| `[SEC]` | security-auditor | Security audit, vulnerability review, secret-scan |

**Assignment rules:**

- By file path: `prisma/`, `migrations/` → `[DB]`; `api/`, `services/`, `middleware/`, `workflows/`, `modules/` → `[BE]`; `components/`, `pages/`, `app/`, `styles/` → `[FE]`; `Dockerfile`, `.github/workflows/`, `infra/` → `[OPS]`; `tests/e2e/`, `tests/integration/` (cross-domain) → `[E2E]`
- By description fallback: "audit"/"security review" → `[SEC]`; "create schema"/"migration" → `[DB]`
- Phase 0 tasks without clear domain → `[SETUP]`
- `[SEC]` and `[E2E]` are conditional — included because spec.md/plan.md require them (SC-009, SC-010, SC-011, SC-012)

## Task Statuses

| Status | Meaning |
|--------|---------|
| `- [ ]` | Pending |
| `- [→]` | In progress |
| `- [X]` | Completed |
| `- [!]` | Failed |
| `- [~]` | Blocked (cascade from a failed dependency) |

## Path Conventions

- **Monorepo**: `apps/medusa/`, `apps/storefront/`, `packages/`, `infra/`
- Paths relative to repository root

---

## Phase 0 — Foundation (Weeks 1–2)

**Purpose**: Scaffold monorepo, docker dev stack, Medusa v2 + Next.js shells, CI, auth PoC, shared types, tenant middleware. All subsequent phases blocked until this completes.

**Checkpoint**: `pnpm install && pnpm build` succeeds; `docker compose up -d` → all healthy; `curl localhost:9000/health` → `{"status":"ok"}`; `curl localhost:3000` → 200; CI green on push.

- [ ] T001 [SETUP] Scaffold pnpm monorepo: `apps/medusa/`, `apps/storefront/`, `apps/admin/`, `packages/`, `infra/`, `pnpm-workspace.yaml`, `tsconfig.base.json`, root `package.json`, `.env.example`. Acceptance: after creating `infra/docker-compose/docker-compose.yml`, create a symlink `./docker-compose.yml → infra/docker-compose/docker-compose.yml` at repository root. This satisfies Constitution V ("any Linux VPS via `docker-compose.yml` at repository root") without duplicating the file. Verification: `ls -la docker-compose.yml` shows symlink target.
- [ ] T002a [DB] Design DML entities for 5 Medusa Custom Modules in `apps/medusa/src/modules/` — TenantModule (tenant, workspace, brand_config), VPNModule (vpn_server, vpn_peer, vpn_ip_pool), AIMeteringModule (ai_usage_event, ai_key_vault, ai_tier_config), FederationModule (federation_instance, federation_catalog_entry); per data-model.md; Medusa DML syntax (`model.define`); migrations via `medusa db:migrate`
- [ ] T002b [DB] Design Prisma schema for standalone packages — `packages/migration-tool/prisma/schema.prisma` (migration_journal, migration_checkpoint); per data-model.md standalone section; migrations via Prisma Migrate
- [ ] T003 [BE] Initialize Medusa v2 app at `apps/medusa/` with `medusa-config.ts`, custom module registration stubs (tenant, vpn, ai-metering, payment-btcpay, federation) with DML model definitions per T002a, `/health` endpoint, basic Medusa migrations
- [ ] T004 [FE] Initialize Next.js 16 App Router storefront at `apps/storefront/` with route groups `(global)/` + `(eu)/`, Tailwind CSS v4, `src/lib/medusa-sdk.ts` SDK wrapper, region routing stub, SSR for SEO-critical pages
- [ ] T005 [BE] Create `packages/shared-types/` with typed interfaces: `tenant.ts` (Tenant, Workspace, BrandConfig), `vpn.ts` (VPNServer, VPNPeer, VPNIPPool), `ai.ts` (AIUsageEvent, AIKeyVault, AITierConfig), `order.ts` (Order, PaymentTransaction extensions), `federation.ts` (FederationInstance, catalog types)
- [ ] T006 [OPS] Create `infra/docker-compose/docker-compose.yml` dev stack: Postgres 16, Redis 7, MinIO, BTCPay Server (testnet), Langfuse, OmniRoute sidecar (`:20128`), Hatchet engine — all with health checks and persistent volumes. Acceptance: `OmniRoute reachable at http://omniroute:20128/v1/health (curl returns HTTP 200).`
- [ ] T007 [OPS] Create CI pipeline at `infra/ci/ci-pipeline.yml`: lint (eslint), typecheck (`tsc --noEmit`), unit tests (vitest), build, secret-scan (gitleaks) — triggered on push to `001-init` branch
- [ ] T008 [SEC] Better-Auth integration with Medusa auth provider at `apps/medusa/src/api/middleware/auth.ts` — PoC: credential login, session creation, JWT issuance with tenant_id claims, token refresh; contract per `contracts/auth-better-auth.md`
- [ ] T008b [SEC] **RESERVED FALLBACK SLOT** — Custom JWT auth design + Tenant/Workspace model re-adaptation. Activated only if T008 (Better-Auth + Medusa adapter PoC) fails the Phase 0 gate. Est. 3 weeks. Acceptance: NOT marked complete unless T008 fails; if activated, design doc at `specs/main/auth-fallback.md` (sketch already written; T008b execution refines and codes against this sketch), all tasks downstream of T008 are re-pointed at custom JWT primitives, Tenant/Workspace model loses dependency on Better-Auth org plugin (re-modeled as native Medusa entities).
- [ ] T009 [DB] Create Postgres RLS policies for all custom tables (DML entities from T002a + Prisma tables from T002b) in `packages/tenant-middleware/src/rls-policy.ts`: tenant-scoped isolation, operator-only tables (VPNServer, VPNIPPool, MigrationJournal), restricted tables (AIKeyVault requires `app.is_ai_service`); RLS is ORM-agnostic defense-in-depth layer
- [ ] T010 [E2E] Smoke tests for scaffolded stack: backend health, storefront renders, Postgres connectivity, Redis ping, OmniRoute health, MinIO health — in `apps/medusa/tests/e2e/smoke.test.ts`
- [ ] T011 [BE] Create `packages/tenant-middleware/` — dual enforcement: (1) MikroORM Subscriber (`mikro-orm-tenant-subscriber.ts`) injecting `tenant_id` filter into all Medusa Module DML queries via MikroORM event hooks; (2) Prisma Client extension (`prisma-extension.ts`) for standalone packages using AsyncLocalStorage; (3) Medusa middleware (`medusa-middleware.ts`) extracting tenant context from JWT and setting AsyncLocalStorage; RLS policy generator per data-model.md
- [ ] T013a [BE] Design dual-write reconciliation algorithm. Specify discrepancy buckets (missing-in-v2, missing-in-legacy, amount-mismatch, status-mismatch, schema-mismatch), resolution policy (v2 source-of-truth post-cutover, legacy read-only Day 1+), operator SLA (24h ack / 72h resolve / escalate). Add `reconciliation_journal` table to data-model.md. Document in `specs/main/reconciliation-algorithm.md`. Acceptance: doc exists, T060 references it, T059 dependency arrow drawn. **Blocks T059, T060.**

---

## Phase 1 — Core Commerce Parity (Weeks 3–6)

**Purpose**: Catalog, cart, checkout, payments (Stripe + PayPal + BTCPay + bank transfer), VPN provisioning, customer migration, i18n (GLOBAL + EU), observability foundation. Staging must pass legacy regression tests.

**Checkpoint**: 10 representative orders (per payment method × PC-build/VPN/mixed) complete successfully on staging. Legacy customer logs into v2 via password-reset link, sees full order history.

- [ ] T012 [BE] [US1] Medusa catalog setup + product import pipeline from legacy in `packages/migration-tool/` — extractors for legacy products, transformers to Medusa Product + Variant schema, loaders with dry-run/resumable/verify modes; assign to tenant Sales Channels (FR-001, FR-004)
- [ ] T013 [BE] [US1] Medusa cart + checkout workflows at `apps/medusa/src/workflows/checkout/` — cart → payment capture → fulfillment (physical) or VPN provisioning (digital); Medusa workflow steps with error handling for payment provider outage (order held in `pending_payment`, resumable) (FR-001)
- [ ] T014 [BE] [US1] Stripe payment provider integration — Medusa v2 native payment provider module configuration, webhook handler, card payments; also Stripe Metered for AI billing; webhook handler dedupes by Stripe event.id with Redis TTL ≥ 3 days; integration test: duplicate event.id returns 200 without double-processing (FR-003)
- [ ] T015 [BE] [US1] PayPal payment provider integration — Medusa v2 native payment provider module, PayPal checkout flow, webhook handler; webhook handler dedupes by PayPal transmission_id with Redis TTL ≥ 3 days; uses PayPal REST API v2 + Webhooks (not IPN), pinned API version in config (FR-003)
- [ ] T016 [BE] [US1] BTCPay custom Payment Provider Module at `apps/medusa/src/modules/payment-btcpay/` — implements `AbstractPaymentProvider` from Medusa; invoice creation, webhook settlement (InvoiceSettled/Expired/Invalid), refund via payout, late settlement edge case, idempotency via Redis; contract per `contracts/payment-btcpay.md` (FR-003)
- [ ] T017 [BE] [US1] Manual bank transfer payment method — admin-side reconciliation flow; operator marks order as paid; order state machine transitions correctly (FR-003)
- [ ] T018 [BE] [US1] VPN Module at `apps/medusa/src/modules/vpn/` — VPNServer + VPNPeer + VPNIPPool models, CRUD service layer, capacity-aware server selection, peer lifecycle management (FR-018, FR-019, FR-020)
- [ ] T019 [BE] [US1] VPN Provisioner package at `packages/vpn-provisioner/` — SSH client wrapper (`ssh2`), WireGuard/AmneziaWG/Xray config generation, atomic IP allocation via `FOR UPDATE SKIP LOCKED`, AES-256-GCM config encryption (FR-018, FR-020)
- [ ] T020 [BE] [US1] Hatchet VPN provisioning workflow at `apps/medusa/src/workflows/vpn-provision/` — 5-step DAG: allocate IP → generate config → SSH push → encrypt & store → notify; rollback on failure; idempotency per order; contract per `contracts/vpn-provisioning.md` (FR-018). **Per-VPNServer SSH serialization**: Hatchet step concurrency key = `vpn_server_id` enforces concurrency limit = 1 for the SSH-push step. Prevents concurrent `wg syncconf` on the same server (kernel-level race). Rejected alternative: Redis SETNX lock — works but adds dependency outside the Hatchet observability surface; see `contracts/vpn-provisioning.md` Rejected Alternatives section.
- [ ] T021 [FE] [US1] Storefront catalog pages — product listing (SSR, SEO-critical), product detail, category pages at `apps/storefront/src/app/(global)/` and `(eu)/`; Medusa SDK integration; server components for SEO
- [ ] T022 [FE] [US1] Storefront cart + checkout UI at `apps/storefront/src/components/checkout/` — cart drawer/page, checkout flow, payment method selection, order confirmation; CSR for interactive surfaces
- [ ] T023 [FE] [US1] Storefront user account pages — order history, saved addresses, profile settings at `apps/storefront/src/app/(global)/account/` and `(eu)/account/`
- [ ] T024 [FE] [US1] Storefront VPN management dashboard at `apps/storefront/src/components/vpn/` — active peers, config download (encrypted), subscription status, expiry countdown; config download via authenticated endpoint only (no pre-signed URLs); fresh auth per download; download audit log with timestamp + IP + user-agent
- [ ] T025 [FE] [US1] Storefront i18n setup — GLOBAL (USD, English) + EU (EUR, English + localized) regions; region routing via URL/subdomain; cart cleared with explicit warning on region switch; persistent region cookie (FR-027, FR-028)
- [ ] T026 [BE] [US1] Migration tool package at `packages/migration-tool/` — CLI entry (`cli.ts`) with dry-run/resumable/verify modes; per-entity extractors (customers, products, orders, payments, VPN peers, addresses); transformers for legacy → Medusa DML entity format (modules) and standalone Prisma format; loaders with idempotent writes; legacy SHKeeper transactions mapped to `'shkeeper'` provider with `metadata.legacy = true` and `metadata.migration_source = 'v1-shkeeper-export'` (read-only historical data, no active processing) (FR-004, FR-037). Acceptance: extraction follows the Migration Entity Ordering table in plan.md (Phase 4 section); any deviation fails CI. Orphan VPN peer (legacy server decommissioned, SSH unreachable) → quarantine with verification_status='orphan_server'; migration does NOT block; manual ops review post-migration via runbook (T087).
- [ ] T027 [BE] [US1] Legacy credential migration via Better-Auth — `auth_legacy_credentials` table for transparent bcrypt migration on first login; accepts all bcrypt prefixes ($2a$/$2b$/$2y$); on successful migration, re-hashes with modern cost factor (≥12); migration counter exposed via Prometheus metric `auth_legacy_migrations_total`; password-reset link flow for customers; emit `credential.migrated` event (FR-005, contract: auth-better-auth.md). Acceptance: `auth_legacy_credentials` table is created by Better-Auth's built-in migration pipeline (no separate task); table fields per data-model.md include `legacy_customer_id`, `legacy_bcrypt_hash`, `migrated_at`, `migration_attempts`. Manual identity verification flow (per FR-005 alternative path) documented in operator runbook (T087). **Synchronous batch migration**: Better-Auth pipeline runs synchronously after each Customer batch loads — every Customer row has a corresponding `auth_legacy_credentials` row before the next batch starts. Verified by integration test: 100-customer migration + 100 immediate login attempts = 100 successful logins. Pre-cutover login is gated (Phase 4 M4.4) so even if the pipeline runs eventually in practice, customers cannot hit a stale window.
- [ ] T028 [DB] [US1] Migration journal + verification — MigrationJournal + MigrationCheckpoint tables in `packages/migration-tool/prisma/schema.prisma` per T002b; populated during migration runs; SHA-256 integrity verification per record; resumable across runs (FR-004, entity: MigrationJournal)
- [ ] T029 [E2E] [US1] Legacy regression test suite — 10 representative orders (per payment method × PC-build/VPN/mixed) on staging with imported legacy data snapshot; verify order records, payment records, VPN peer configs, notifications match legacy system
- [ ] T030 [FE] [US1] Storefront payment method selection UI — multi-provider selector (Stripe, PayPal, BTCPay, bank transfer) with per-region availability; BTCPay invoice QR code / Lightning address display; bank transfer instructions
- [ ] T031 [BE] [US1] Region/currency routing middleware at `apps/medusa/src/api/middleware/region.ts` — resolve region from request (subdomain/URL), inject currency code, filter available payment providers per region; region-aware tax rules (FR-027, FR-028)
- [ ] T078 [BE] Create default Sales Channel per tenant at TenantModule init — each tenant gets a Medusa Sales Channel on creation; product import (T012) assigns products to tenant's channel; channels scoping active from day one (FR-007)
- [ ] T079 [BE] Workspace CRUD + default workspace creation on tenant setup — workspace entity wired to Tenant at `apps/medusa/src/modules/tenant/workspace-service.ts`; subdomain/path routing stub in region middleware; full multi-brand deferred to Phase 6 (FR-008)
- [ ] T080 [BE] Configure pino logger with tenant_id serialization, Loki transport, secret field stripping — structured JSON logs on every request with `tenant_id`, `request_id`, `region`; fields matching `*secret*`, `*key*`, `*password*`, `*token*` auto-redacted; Loki transport via `pino-loki` (FR-029)
- [ ] T081 [OPS] Instrument Medusa + Next.js with Prometheus metrics — `prom-client` middleware on both apps; per-tenant labels (`tenant_id`, `region`); expose `/metrics` endpoint; counter for requests, histogram for latency, gauge for active carts; alert thresholds in `infra/akash/alerting-rules.yml` (FR-031)
- [ ] T082 [SEC] Configure GlitchTip/Sentry error sink with PII scrubbing + tenant tag — DSN via Infisical; PII fields (email, phone, address, IP) stripped before emission; `tenant_id` tag on all events; source map upload in CI build step (FR-032)

---

## Phase 2 — AI Surface (Weeks 5–8, overlaps Phase 1)

**Purpose**: OmniRoute sidecar integration, 3-tier AI (dev/paid/BYOK), PC-builder advisor, multi-channel support agent, content/SEO batch, metering pipeline, Langfuse tracing, graceful degradation.

**Checkpoint**: 30 representative PC-builder briefs → ≥2 builds each, P95 ≤8s; 50 scripted support conversations → ≥60% auto-resolve; BYOK tenant uses zero platform tokens; Langfuse shows per-tenant traces.

- [ ] T032 [BE] OmniRoute client SDK at `packages/omniroute-client/` — typed client (`client.ts`), tier resolver (`tier-resolver.ts`: BYOK → paid → dev, hard no-fallback for BYOK), retry with exponential backoff + jitter (`retry.ts`), request/response types (`types.ts`), metering event emission (`metering.ts`); contract per `contracts/omniroute-sdk.md` (FR-010)
- [ ] T033 [BE] AI Metering Module at `apps/medusa/src/modules/ai-metering/` — AIUsageEvent + AIKeyVault + AITierConfig models, CRUD services, metering event ingestion, BYOK key vault with AES-256-GCM encryption (key never in logs/responses) (FR-011, FR-012)
- [ ] T034 [BE] AI tier resolution middleware — SDK resolves dev/paid/BYOK per tenant + user context: check AIKeyVault for BYOK → check AITierConfig for paid → default to dev; BYOK never falls back to platform keys (hard requirement) (FR-011)
- [ ] T035 [BE] [US2] OmniRoute SDK → OpenMeter event emission via Hatchet workflow (<1s p95 end-to-end emission latency). **Acceptance**:
  1. **Durable queue (Hatchet)**: OmniRoute SDK enqueues `omniroute.metering.recorded` events to Hatchet. Hatchet state-DB lives on hot-core Postgres (per plan.md Risk R-Hatchet-tunnel resolution) — events are durable across Akash container restarts via the existing WireGuard tunnel. **No file-based WAL** (revised per claude review v4 N1: Akash container filesystem is ephemeral and cannot remote-mount Hetzner; Hatchet event durability replaces the previously-specified file WAL).
  2. **Workflow + retry**: `omniroute-metering-emit` Hatchet workflow consumes events; Step 1 pushes to OpenMeter (`POST /v2/events`); retry 3× with exponential backoff (1s, 3s, 9s) on transport failures. OpenMeter emission MUST be idempotent — pass `event_id` as the OpenMeter idempotency key (Hatchet provides at-least-once delivery; idempotent consumer is required to avoid double-billing).
  3. **Dead-letter**: after exhausted retries, event moves to `metering_dead_letter` Postgres table on hot-core (schema added alongside `ai_usage_event` in data-model.md AIMeteringModule); paged to ops via Better-Stack within 5 min.
  4. **Daily reconciliation**: Hatchet scheduled job (02:00 UTC) compares `OmniRoute request count` (queried from Langfuse traces table for prior 24h) against `OpenMeter event count` (queried from OpenMeter API for same window). Mismatch >0.1% triggers `metering.gap_detected` alert + operator runbook reference.
  Reference: research.md B10 (OpenMeter durability + Killbill reconciliation).
- [ ] T036 [BE] Killbill integration for billing engine — subscription management, usage-based invoicing connected to OpenMeter aggregates; Killbill → Stripe/BTCPay collection at billing cycle boundary (FR-013)
- [ ] T037 [BE] [US3] PC-builder RAG advisor. **Acceptance**:
  1. **Embedding model**: `text-embedding-3-small` (OpenAI) for product description embeddings. Re-embed on product update.
  2. **Vector store**: pgvector extension on hot-core Postgres (`product_embeddings` table, column `embedding vector(1536)`, IVFFlat index, lists=100). No external vector DB.
  3. **Pre-filter**: retrieval pre-filtered by `component_category` (CPU, GPU, RAM, etc.) before vector similarity search. Cuts candidate set from 10k SKUs to ~500 per category before similarity scoring.
  4. **Retrieval budget**: ≤2s P95 (Langfuse-monitored). Budget breakdown: 200ms embedding query → 800ms vector search → 1000ms re-ranker. Leaves 6s for LLM inference within SC-006 8s P95 first-build budget.
  5. **Fallback**: if pgvector unavailable, degrade to category-filter + recency ranking (no semantic match) and emit `rag.degraded` metric.
- [ ] T038 [FE] [US2] PC-builder AI chat UI component at `apps/storefront/src/components/pc-builder/` — conversational interface, streaming responses, component swap with live compatibility checking, build cards with specs + price, "add to cart" from chat
- [ ] T039 [BE] [US3] Multi-channel support agent — Telegram bot (via grammy/telegraf), WhatsApp (via Evolution API), website widget → unified AI agent surface; intent classification (order status, VPN reset, refund, pre-sale, off-topic); RAG over order/VPN/knowledge-base; integrates OmniRoute SDK (FR-015)
- [ ] T040 [BE] [US3] Human takeover mechanism for support agent — operator joins channel mid-conversation → agent pauses; operator hands back → agent resumes; full transcript available to operator; works across all channels (Telegram, WhatsApp, widget) (FR-015)
- [ ] T041 [FE] [US3] Support chat widget component at `apps/storefront/src/components/support/` — embeddable widget, conversation UI, file attachment, human handoff indicator
- [ ] T042 [BE] undrestrator integration for content/SEO batch — scheduled or on-demand pipeline: product description generation, meta tag optimization, multi-locale translations via OmniRoute; integrates with `packages/omniroute-client/` (FR-016)
- [ ] T043 [BE] Langfuse tracing integration — every AI request traced with `tenant_id`, model, tokens, cost_usd, latency, use_case tag; OpenTelemetry spans; per-tenant project isolation in Langfuse; self-hosted Langfuse container on hot-core (FR-030)
- [ ] T044 [SEC] [US4] BYOK key validation hardened against timing oracle. **Acceptance**:
  1. **Minimal-cost upstream call**: validation uses `GET /models` (or equivalent zero-token endpoint) for the target provider — never a chat completion or embedding call.
  2. **Same TLS connection as runtime traffic**: validation traffic routes through the same OmniRoute → provider TLS session that production requests use. No separate validation endpoint, no extra-exposure path.
  3. **Encrypt-before-validate**: key is encrypted into `AIKeyVault` BEFORE the validation upstream call. Validation server-side does `decrypt → call → discard cleartext`. Cleartext never persists past the validation transaction.
  4. **Constant-time response**: validation endpoint returns after a fixed minimum delay (target: 300 ms) regardless of success/failure to neutralize timing-oracle key enumeration.
- [ ] T045 [FE] [US4] BYOK settings page at `apps/storefront/src/app/(global)/account/ai-keys/` and `(eu)/account/ai-keys/` — add/validate/remove keys, key prefix display (`sk-o...`), provider selection, per-use-case routing config, validation status indicator
- [ ] T046 [E2E] [US2] AI advisor test suite — 30 representative customer briefs (gaming / workstation / silent-build / budget / no-compromise); verify ≥2 valid builds per brief, all compatibility-validated, ≥1 benchmark citation per build, P95 first-build latency ≤8s (SC-006)
- [ ] T047 [E2E] [US3] Support agent test suite — 50 scripted conversations across Telegram + WhatsApp + widget; 5 intent buckets (status / VPN / refund / pre-sale / off-topic); verify ≥60% auto-resolve without escalation (SC-008), ≥95% escalation precision on non-routine, zero PII in error responses
- [ ] T048 [E2E] [US4] BYOK isolation test — configure BYOK key for test tenant, run 10 AI conversations, verify (a) zero platform key usage in OmniRoute logs, (b) zero billable tokens on platform account, (c) customer's provider dashboard shows matching usage (SC-012)
- [ ] T083 [BE] US7 placeholder: undrestrator ops automation scaffold — foundation wiring for ticket triage + config generation + PR proposal pipelines; full implementation deferred to post-v2 spec; this task only creates the Hatchet workflow stubs and PII redaction integration (FR-017, US7 — explicitly deferred)

---

## Phase 3 — Decentralization Activation (Weeks 9–12)

**Purpose**: Akash deployment live, hot-core hardened, GDPR jurisdiction filter enforced, provider-failure drill passed, monitoring + alerting.

**Checkpoint**: Akash deployment serves traffic; secret-scan audit: zero payment/VPN/AI secrets outside encrypted hot-core (SC-010); controlled provider-kill: failover within 5 min P95 (SC-011).

- [ ] T049 [OPS] [US5] Akash SDL manifest at `infra/akash/deploy.yml` + `deploy-staging.yml` — Medusa + Next.js + OmniRoute + Redis containers; Postgres connection to hot-core via WireGuard tunnel; persistent storage; `jurisdictions.json` for GDPR-compatible provider allow-list (FR-022, FR-025)
- [ ] T050 [OPS] [US5] GDPR jurisdiction filter for Akash — SDL placement constraints restricting to EU/EEA + UK + Switzerland + GDPR-equivalent countries; hardcoded country allow-list in `jurisdictions.json`; verified by deployment test (FR-025)
  Update process: PR-based against `infra/jurisdictions/jurisdictions.json`, reviewed by operator + SEC agent. Trigger: EU Commission adequacy-decision announcement (operator subscribes to ec.europa.eu/justice newsletter; runbook step in T085).
- [ ] T051 [OPS] Hot-core Hetzner setup scripts at `infra/hot-core/` — `setup.sh` (LUKS disk encryption, firewall, SSH hardening), `wireguard-server.conf` (tunnel config), `infisical-setup.sh` (self-hosted Infisical deployment), `backup.sh` (daily pg_dump + WAL archiving to S3); PgBouncer connection pooler configured between Akash workers and Postgres (transaction mode, max 100 connections) (FR-024)
- [ ] T052 [OPS] WireGuard tunnel: Akash ↔ hot-core — configure WireGuard tunnel between Akash compute nodes and Hetzner hot-core; mTLS/PSK authentication; verify Postgres TCP traffic from Medusa + Hatchet engine, SSH from worker steps to VPN servers, outbound webhook capture from worker steps; validate CAP_NET_ADMIN availability on Akash providers; if unavailable, fallback to Tailscale userspace networking mode (no kernel capabilities required). No persistent gRPC pinning required. **Hatchet engine startup behavior**: if state-DB connection fails on boot (tunnel down at startup), engine retries with exponential backoff (1s, 3s, 10s, 30s, 60s, then steady at 60s). Do NOT crash-loop. Alert ops via Better-Stack at 5-minute retry cycle (`hatchet.engine.tunnel_unavailable`). Workflows in queued state remain durable in Hatchet state-DB on hot-core; processing resumes on reconnect with no event loss.
- [ ] T053 [OPS] Infisical deployment for secret management — self-hosted Infisical on hot-core; KEK store for AES-256-GCM; payment provider secrets, VPN master keys, AI API keys injected at runtime via Infisical agent; never in env vars or config files on Akash (FR-024)
- [ ] T054 [OPS] [US5] Akash provider failure drill + RTO validation — controlled kill of active Akash provider; verify automatic failover to replica within 5 min P95, 15 min P99; in-flight `pending_payment` orders survive; no data loss (RPO=0) (SC-011, FR-026)
- [ ] T055 [E2E] Tenant-scope probe integration tests — auto-generate probe from registered Medusa + Next.js routes; authenticate as tenant A, assert 404 (not 403) on tenant B's resources for every discovered endpoint; CI fails if new route lacks probe coverage; also test non-Prisma paths (MinIO direct, file downloads) (FR-009, edge case)
- [ ] T056 [SEC] Secret-scan CI integration — gitleaks in CI pipeline (`infra/ci/secret-scan.yml`); zero tolerance for committed secrets; scan covers API keys, private keys, payment credentials, VPN keys, KYC data (FR-033, SC-010)
- [ ] T057 [SEC] PII redaction at error boundary + ORM log filter — all error sinks (GlitchTip/Sentry, structured logs) redact PII at the boundary before emission; ORM-level log filter strips payment_secret, api_key, private_key, vpn_config fields from all Prisma query logs and stack traces; automated red-team scan in CI verifies zero PII/secret fields in error responses and logs (FR-032, FR-033, SC-009)
- [ ] T058 [E2E] [US5] Akash deployment integration tests — full checkout on Akash deployment completes successfully; stateless compute verified (container restart = clean slate); secrets injected via Infisical agent only; latency P50 ≤300ms, P95 ≤1500ms (SC-007)

---

## Phase 4 — Cutover & Legacy Sunset (Weeks 13–15)

**Purpose**: Dual-write window for GLOBAL/EU customers, reconciliation reporting, tenant-by-tenant cutover, legacy read-only freeze, RU customer data export.

**Checkpoint**: 100 orders during dual-write; reconciliation report shows zero discrepancies. GLOBAL + EU tenants cut over independently. Legacy in read-only mode. RU customer data export available.

- [ ] T059 [BE] [US1] Phase 4 dual-write activation. **Acceptance**:
  1. **Target**: dual-write calls the **legacy application API endpoints**, NOT direct legacy DB writes. Preserves legacy validation, business rules, and side effects.
  2. **Performance**: accept +150-300ms per write during Phase 4 window (3 weeks). Documented in plan.md SLO carve-out for Phase 4.
  3. **Reconciliation**: per reconciliation-algorithm.md — buckets and SLA unchanged.
  4. **Failure handling**: legacy API 5xx for a write → record in `reconciliation_journal` as `missing-in-legacy`, do NOT fail the v2 write (v2 is authoritative going forward).
  Decision rationale: API path chosen over direct DB writes for cutover safety; per claude v3 F10.
- [ ] T060 [BE] [US1] Reconciliation reporting — daily scheduled job comparing legacy vs v2 order counts, amounts, statuses; discrepancy alert triggers manual review; reconciliation algorithm handles partial writes, payment state mismatches (FR-038)
- [ ] T061 [BE] [US1] Tenant-by-tenant cutover orchestration — per-tenant switch from legacy to v2 routing; each tenant verified independently before cutting over next; rollback capability per tenant (FR-039)
- [ ] T062 [BE] [US1] Legacy read-only mode activation — legacy undrlla switched to read-only: no new orders accepted, historical access preserved; 1-year read-only retention timer + 7-year cold archive schedule (FR-040)
- [ ] T063 [BE] [US1] RU customer data export + offboarding — GDPR-style data export endpoint for legacy RU customers; self-service account closure flow; data archive generation (orders, addresses, VPN configs) (FR-028a)
- [ ] T064 [E2E] [US1] Cutover simulation test — simulate full dual-write window on staging: place 100 orders, verify zero discrepancies in reconciliation report, perform tenant-by-tenant cutover, verify legacy read-only mode, test RU data export flow

---

## Phase 5 — Federation & Open Source (Weeks 15–16)

**Purpose**: MIT-licensed repo published, install CLI, operator docs, federation protocol, first community operators onboarded.

**Checkpoint**: Non-team developer completes install in ≤1 hour with ≤3 questions (SC-003). Two undrlla instances discover each other; data export → import succeeds. `license-checker` confirms zero non-permissive dependencies in core.

- [ ] T065 [BE] Federation protocol package at `packages/federation-protocol/` — discovery (`/.well-known/undrlla.json` handler), catalog (`/api/federation/catalog.json` feed), portability (FR-036 data export/import archive); protocol version types; contract per `contracts/federation-protocol.md` (FR-034, FR-035, FR-036)
- [ ] T066 [BE] Instance discovery + catalog endpoints — `GET /.well-known/undrlla.json` returns instance metadata; `GET /api/federation/catalog.json` returns opt-in product feed; `POST /api/federation/notify` receives federation notifications
- [ ] T067 [BE] Data export endpoint — `GET /api/tenant/:id/export` produces portable archive (orders, customers, products, payments, VPN peers) for tenant data portability; Bearer JWT auth; streamed as encrypted ZIP (FR-036)
- [ ] T068 [OPS] [US6] Install CLI package at `packages/install-cli/` — 1-command community-operator installer: schema migration runner, default data seeder, config scaffolding (env, branding), idempotent execution; `npx @undrella/install-cli` (FR-023)
  CLI asks only scale-appropriate questions: solo-operator flow skips tenant/workspace prompts; reseller-host flow asks for first tenant config + reseller onboarding bootstrap.
- [ ] T069 [OPS] Production docker-compose at `infra/docker-compose/docker-compose.prod.yml` — full stack runnable on any Linux host; excludes Postgres (runs locally on operator VPS); includes Medusa, storefront, OmniRoute, Redis, MinIO
- [ ] T070 [FE] [US6] Federation admin UI — admin routes for federation instance registry, catalog visibility toggle, data export trigger, instance health monitoring; extends Medusa admin dashboard
- [ ] T071 [E2E] [US6] Community operator install test — non-team developer performs fresh install on clean Hetzner VPS and on Akash deployment; measure time-to-first-order and questions asked; target ≤1 hour, ≤3 questions (SC-003)
- [ ] T072 [SEC] [US6] License verification + dependency audit — `license-checker` confirms zero non-permissive (non-MIT/Apache-2.0/BSD) dependencies in core packages; AGPL dependencies only in isolated infra containers (Grafana, MinIO); MIT license file in repo root; CONTRIBUTING.md with license policy (FR-034, Principle II)
- [ ] T084 [FE] [US6] Operator install guide — step-by-step install, configure, and first-order walkthrough at `docs/operator/install.md`; tested by T071 (SC-003) (FR-035)
  Include a "Concepts at a glance" table for operators: | If you... | Tenant | Workspace | Sales Channel | Notes | |---|---|---|---|---| | Run undrlla solo (one store, your own products) | You | Your store | Your catalog | Skip multi-tenant setup; install CLI defaults to single-tenant. | | Host for resellers (each reseller = isolated brand) | Each reseller | Each reseller's storefront grouping | Each reseller's catalog slice | Multi-tenant mode; install CLI prompts for first tenant + bootstrap reseller onboarding. |
- [ ] T085 [FE] [US6] Operator configuration reference — all env vars, regions, payment providers, AI tiers, federation settings at `docs/operator/config.md` (FR-035)
  Include "EU adequacy decision monitoring" SOP: subscription to ec.europa.eu/justice newsletter; PR template for jurisdictions.json updates; SLA: 30 days from announcement to merged update.
- [ ] T086 [FE] [US6] Operator upgrade + migration runbook — version upgrade steps, schema migration, data backup before upgrade at `docs/operator/upgrade.md` (FR-035)
- [ ] T087 [OPS] [US6] Operator backup/restore + incident response runbook — backup verification, restore drill, incident classification and response at `docs/operator/runbook.md` (FR-035). Acceptance: Manual identity verification SOP included: submission requirements (order number, amount, payment method), match threshold (2 of 3), audit logging, 48h SLA.

---

## Phase 6 — Multi-Tenant Activation (DEFERRED)

**Trigger**: Second commercial reseller signs. Not scheduled — activated on demand.

- [ ] T073 [BE] Activate `tenant_id` filters end-to-end — enforce MikroORM subscriber + Prisma extension + Medusa middleware + RLS policies for all endpoints; remove `default` tenant bypass; tenant-scope probe suite runs in CI (FR-009)
- [ ] T074 [BE] Per-tenant Sales Channel binding — each tenant gets own Medusa Sales Channel with scoped products, pricing, inventory, payment providers (FR-007)
- [ ] T075 [BE] Per-tenant payment provider keys — each tenant's payment provider secrets isolated in Infisical; runtime injection per tenant context (FR-024)
- [ ] T076 [BE] Subdomain routing — `<tenant>.undrlla.com` → tenant-scoped storefront; Next.js middleware resolves subdomain → tenant_id; workspace abstraction for multi-brand (FR-008)
- [ ] T077 [FE] Multi-tenant admin dashboard — tenant management UI: create/edit/suspend tenants, assign Sales Channels, configure branding, manage payment providers, view per-tenant metrics

---

## Dependency Graph

### Legend

- `→` means "unlocks" (left must complete before right can start)
- `+` means "all of these" (join point — ALL listed tasks must complete)
- Tasks not listed here have no dependencies and can start immediately within their phase

### Format Rules (STRICT)

```
# VALID formats (one per line):
T001 → T002                    # single unlock
T001 → T002, T003, T004        # fan-out (one unlocks many)
T002 + T003 → T012             # fan-in (many unlock one)

# INVALID (do NOT produce):
T001 → T002 → T003             # chaining — use two lines
T001, T002 → T003, T004        # multi-to-multi — decompose
```

### Phase 0

T001 → T002a, T002b, T003, T004, T005, T006, T007
T002a → T009, T011, T078, T079, T080
T002b → T026
T011 → T009
T003 + T008 → T012
T006 + T007 → T010

### Phase 1

T012 → T013
T013 → T014, T015, T016, T017
T005 + T011 → T018
T018 → T019
T019 → T020
T012 → T021
T021 → T022
T022 → T023, T024, T030
T021 → T025
T012 → T026
T026 → T028
T028 + T013 → T029
T027 + T031 → T029
T013 + T025 → T031
T011 → T078, T079, T080
T007 → T081
T008 → T082

### Phase 2

T005 → T032
T032 → T033
T033 → T034, T035, T036
T032 + T034 → T037, T039, T042
T037 → T038
T039 → T040, T041
T034 → T044
T044 → T045
T037 + T038 → T046
T039 + T040 + T041 → T047
T044 + T045 → T048
T043 → T083

### Phase 3

T049 → T050, T052
T051 → T053
T052 + T053 → T054, T058
T011 + T009 → T055
T007 → T056
T056 → T057

### Phase 4

T013a → T059
T013 + T020 → T059
T059 → T060
T060 → T061
T061 → T062, T063
T062 + T063 → T064

### Phase 5

T065 → T066, T067
T069 → T068
T065 + T068 → T070
T068 + T069 → T071
T071 → T072
T071 → T084, T085, T086, T087

### Self-Validation Checklist

> Verified before writing:
>
> - [X] Every task ID in Dependencies exists in the task list above
> - [X] No circular dependencies (A→B→A)
> - [X] No orphan task IDs referenced that don't exist
> - [X] Fan-in uses `+` only, fan-out uses `,` only
> - [X] No chained arrows on a single line

---

## Parallel Lanes

| Lane | Agent Flow | Tasks | Blocked By |
|------|-----------|-------|------------|
| A — BE Commerce | `[BE]` | T003 → T012 → T013 → T014/T015/T016/T017 → T026 → T029 → T031 | T002a, T002b, T008 |
| B — FE Storefront | `[FE]` | T004 → T021 → T022 → T023/T024/T030 → T025 → T038 → T045 | T012 (catalog API) |
| C — AI Surface | `[BE]` | T032 → T033 → T034/T035/T036 → T037/T039/T042 → T044 → T046/T047/T048 | T005 |
| D — Infrastructure | `[OPS]` | T006/T007 → T049 → T050/T051/T052 → T053 → T054/T058 | T010 |
| E — VPN | `[BE]` | T005 + T011 → T018 → T019 → T020 | T005, T011 |
| F — Security | `[SEC]` | T008/(T008b fallback) → T056 → T057 → T072 | T007, all US complete |
| G — E2E | `[E2E]` | T010 → T029 → T046/T047/T048 → T055/T058 → T064 → T071 | dependent lanes |

---

## Agent Summary

| Agent | Task Count | Tasks | Can Start After |
|-------|-----------|-------|-----------------|
| `[SETUP]` | 1 | T001 | immediately |
| `[DB]` | 4 | T002a, T002b, T009, T028 | T001 |
| `[BE]` | 43 | T003, T005, T011, T012–T020, T026–T027, T031–T037, T039–T040, T042–T044, T059–T063, T065–T067, T073–T076, T078–T080, T083 | T001, T002a |
| `[FE]` | 15 | T004, T021–T025, T030, T038, T041, T045, T070, T077, T084–T086 | T012 (APIs) |
| `[OPS]` | 12 | T006, T007, T049–T054, T068–T069, T081, T087 | T001 |
| `[E2E]` | 9 | T010, T029, T046–T048, T055, T058, T064, T071 | dependent BE + FE |
| `[SEC]` | 6 | T008, T008b, T056, T057, T072, T082 | T001 (T008), T007 (T056), all complete (T072) |

**Total**: 90 tasks across 7 phases (Phase 6 deferred: 5 tasks). Breakdown: 90 phase-scheduled (P0: 14, P1: 25, P2: 18, P3: 10, P4: 6, P5: 12, P6: 5). Validate via `grep -cE '^- \\[.\\] T' specs/main/tasks.md`.

---

## Agent Dispatch Plan

Format: `agent × skills × input context × files`

| Agent | Skills | Tasks | Input Context | Key Files |
|-------|--------|-------|---------------|-----------|
| **database-architect** | database-design | T002a, T002b, T009, T028 | data-model.md (DML entities, Prisma tables, RLS policies, indexes) | `apps/medusa/src/modules/*/models/`, `packages/migration-tool/prisma/schema.prisma`, `packages/tenant-middleware/src/rls-policy.ts` |
| **backend-specialist** | api-patterns, database-design, system-design-patterns | T003, T005, T011–T020, T026–T027, T031–T037, T039–T040, T042–T044, T059–T063, T065–T067, T073–T076, T078–T080, T083 | spec.md (40 FRs), plan.md (7 phases), contracts/ (5 contracts), data-model.md | `apps/medusa/src/`, `packages/` |
| **frontend-specialist** | react-patterns, nextjs-best-practices, tailwind-patterns, frontend-design | T004, T021–T025, T038, T041, T045, T070, T077, T084–T086 | spec.md (US1–US4), architecture.md (Layer 1), quickstart.md | `apps/storefront/src/` |
| **devops-engineer** | deployment-procedures, docker-expert, server-management | T006, T007, T081, T049–T054, T068–T069, T087 | plan.md (Phase 0, 3, 5), architecture.md (Layer 3, 4), quickstart.md | `infra/` |
| **test-engineer** | tdd-workflow, testing-patterns, webapp-testing | T010, T029, T046–T048, T055, T058, T064, T071 | spec.md (SC-001–SC-012), plan.md (milestones) | `apps/medusa/tests/`, `apps/storefront/tests/` |
| **security-auditor** | vulnerability-scanner, red-team-tactics | T008, T008b, T082, T056, T057, T072 | spec.md (FR-029–FR-033, SC-009, SC-010), architecture.md (Security Boundaries) | `apps/medusa/src/api/middleware/auth.ts`, `infra/ci/secret-scan.yml` |

### Agent × Phase Matrix

| Agent | P0 | P1 | P2 | P3 | P4 | P5 | P6 |
|-------|----|----|----|----|----|----|----|
| `[SETUP]` | T001 | — | — | — | — | — | — |
| `[DB]` | T002a, T002b, T009 | T028 | — | — | — | — | — |
| `[BE]` | T003, T005, T011 | T012–T020, T026–T027, T031, T078, T079, T080 | T032–T037, T039–T040, T042–T044, T083 | — | T059–T063 | T065–T067 | T073–T076 |
| `[FE]` | T004 | T021–T025, T030 | T038, T041, T045 | — | — | T070, T084, T085, T086 | T077 |
| `[OPS]` | T006, T007 | T081 | — | T049–T054 | — | T068–T069, T087 | — |
| `[E2E]` | T010 | T029 | T046–T048 | T055, T058 | T064 | T071 | — |
| `[SEC]` | T008, T008b | T082 | — | T056, T057 | — | T072 | — |

---

## MVP Scope Definition (Phase 0 + Phase 1)

**Minimum viable product for launch**: Phase 0 (Foundation) + Phase 1 (Core Commerce Parity).

### MVP delivers User Story 1 (B2C Migration Cutover) — P1

**In scope**:
- T001–T031, T078–T082 (41 tasks)
- Medusa v2 backend with catalog, cart, checkout, payments (Stripe + PayPal + BTCPay + bank transfer)
- Next.js 16 storefront with catalog, checkout, account, VPN dashboard, i18n (GLOBAL + EU)
- VPN provisioning module with Hatchet workflow
- Legacy data migration tool with integrity verification
- Better-Auth integration with legacy credential migration
- Docker dev stack + CI pipeline
- Legacy regression test suite (10 representative orders)

**Not in MVP** (Phase 2+):
- AI surface (PC-builder, support agent, BYOK) — Phase 2
- Akash deployment — Phase 3
- Federation / open-source distribution — Phase 5
- Multi-tenant activation — Phase 6 (deferred)

**MVP exit criteria**:
1. `pnpm validate` passes
2. All Phase 0 + Phase 1 E2E tests pass (T010, T029)
3. 10 representative orders complete successfully on staging
4. Legacy customer logs into v2 with password-reset link, sees full order history
5. VPN peer provisioned on BTCPay invoice settlement within 5 minutes

---

## Critical Path Analysis

```
T001 (SETUP monorepo)
  → T002a (DB DML entities)
  → T002b (DB Prisma schema)
    → T003 (BE Medusa init) + T008 (SEC auth PoC)
      → T012 (BE catalog migration)
        → T013 (BE checkout workflows)
          → T016 (BE BTCPay payment provider)
            → T020 (BE VPN Hatchet workflow)  [via T018 → T019]
              → T026 (BE migration tool)
                → T029 (E2E legacy regression)  ← MVP EXIT
```

**Critical path length**: T001 → T002a → T003 → T012 → T013 → T020 → T026 → T029 = **8 sequential tasks**

**Longest parallel branch** (blocks MVP):
```
Lane A: T001 → T002a → T003 → T008 → T012 → T013 → T014/T015/T016/T017 → T026 → T029
Lane B: T001 → T004 → T021 → T022 → T023/T024/T030 ← blocked by T012 for API
Lane E: T001 → T002a → T011 → T018 → T019 → T020 ← blocks T020 for T013
```

**Critical path bottleneck**: T003 + T008 must both complete before T012 (catalog migration). T008 (Better-Auth PoC) is the **highest-risk task** — undocumented Medusa integration pattern. Risk R1 mitigation: PoC validates or rejects in Phase 0; fallback to custom JWT auth.

**Post-MVP critical path to production**:
```
T029 (MVP exit)
  → T032 (OmniRoute SDK) → T037 (PC-builder) → T046 (AI advisor test) [Phase 2]
  → T049 (Akash SDL) → T054 (failover drill) [Phase 3]
  → T059 (dual-write) → T060 (reconciliation) → T061 (cutover) → T064 (sim test) [Phase 4]
  → T068 (install CLI) → T071 (install test) [Phase 5]
```

**Estimated critical path to production**: ~16 weeks (if all phases sequential). **Actual target**: ~12 weeks via parallel execution of Lanes A–E.

---

## Implementation Strategy

### MVP First (Phase 0 + Phase 1)

1. Complete Phase 0: Foundation (Weeks 1–2) — sync barrier
2. Start Phase 1 Lanes A, B, E in parallel (Week 3)
3. Lane A (BE Commerce): T012 → T013 → payment providers → migration tool
4. Lane B (FE Storefront): T021 → T022 → account/VPN pages (blocked by T012 APIs)
5. Lane E (VPN): T018 → T019 → T020 (independent of storefront)
6. **MVP checkpoint**: T029 (legacy regression) passes → Phase 1 complete
7. Deploy to staging for internal testing

### Incremental Delivery

1. Phase 0 + 1 → MVP (US1) → Staging validation
2. Phase 2 → AI Surface (US2, US3, US4) → overlaps Weeks 5–8
3. Phase 3 → Akash deployment (US5) → Weeks 9–12
4. Phase 4 → Cutover → Weeks 13–15 → **PRODUCTION**
5. Phase 5 → Federation (US6) → Weeks 15–16
6. Phase 6 → Multi-tenant (deferred until business trigger)

### Parallel Agent Strategy

1. **Orchestrator** completes T001 directly (scaffolding)
2. Once T001 complete (sync barrier) → dispatch parallel agents:
   - `[DB]`: T002a, T002b → T011, T009, T028
   - `[BE]`: T003, T005, T011 in parallel → then T012+ chain
   - `[FE]`: T004 (independent of BE initially)
   - `[OPS]`: T006, T007 (independent)
   - `[SEC]`: T008 (auth PoC, critical path)
   - `[E2E]`: T010 (after T006 + T007)
3. Phase 1 start → Lanes A, B, E dispatch:
   - Lane A `[BE]`: catalog → checkout → payments → migration
   - Lane B `[FE]`: storefront pages (after catalog API ready)
   - Lane E `[BE]`: VPN module (after shared-types + tenant-middleware)
4. Phase 2 start → Lane C dispatches independently:
   - `[BE]`: OmniRoute SDK → metering → AI endpoints
   - `[FE]`: PC-builder UI, support widget, BYOK page
5. Phase 3 → Lane D `[OPS]`: Akash + hot-core (independent of Lanes A–C)
6. `[SEC]` runs after relevant phase tasks complete (T056 after T007, T057 after T056, T072 after all)

### Multi-Session Strategy (Gemini / Copilot / Codex)

1. Complete Phase 0 sequentially (T001 → T006/T007 → T002a/T002b → T003/T004/T005/T008)
2. Use Agent Summary to decide role context switching
3. Optionally launch parallel sessions per agent lane manually
4. Follow Dependency Graph for correct execution order
5. Each session picks up from the last completed task in its lane

---

## Notes

- `[AGENT]` tag assigns responsibility — domain agent writes both code and unit tests
- `[E2E]` only for cross-boundary tests — unit tests stay with domain agent
- `[SEC]` runs on critical path (T008) and as cross-cutting audit (T056, T057, T072)
- Phases are sync barriers — all tasks in a phase must complete/fail/block before next phase
- Phase 2 overlaps Phase 1 (Weeks 5–8) — Lanes A and C can run in parallel on different modules
- Phase 6 is explicitly DEFERRED — 5 placeholder tasks, activated when second commercial reseller signs
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- `npm run validate` after every code change; run relevant tests after every feature
- Risk R1 (Better-Auth + Medusa incompatibility) is the #1 project risk — T008 PoC resolves or pivots early
