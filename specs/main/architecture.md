# System Architecture: undrlla v2 — Medusa Migration + Decentralized Hybrid Hosting

**Spec**: `specs/001-init/spec.md` | **Plan**: `specs/main/plan.md` | **Date**: 2026-05-24 | **Status**: Phase 1 design

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [System Topology](#system-topology)
4. [Layer 1 — Presentation](#layer-1--presentation)
5. [Layer 2 — Application](#layer-2--application)
6. [Layer 3 — Infrastructure](#layer-3--infrastructure)
7. [Layer 4 — Hot-Core](#layer-4--hot-core)
8. [Data Flow](#data-flow)
9. [Source-of-Truth Tree](#source-of-truth-tree)
10. [Deployment Topologies](#deployment-topologies)
11. [Security Boundaries](#security-boundaries)
12. [Observability](#observability)
13. [Data Model Overview](#data-model-overview)
14. [Cross-Cutting Concerns](#cross-cutting-concerns)
15. [Architectural Decision Record](#architectural-decision-record)
16. [Dependency Map](#dependency-map)
17. [Risk Register](#risk-register)

---

## Overview

undrlla v2 is a **Medusa v2** headless commerce platform for custom PC builds, VPN provisioning, and IT services — rebuilt from the legacy Next.js Pages Router monolith onto a decentralized hybrid hosting model.

**Core thesis**: Stateless compute on Akash Network (DePIN), secrets on a centralized hardened hot-core (Hetzner), community distribution via MIT-licensed open-source.

| Dimension | Choice |
|-----------|--------|
| Commerce backend | Medusa v2.15.4 |
| Storefront | Next.js 16 App Router |
| Language | TypeScript 5.x / Node 22 LTS |
| Primary DB | PostgreSQL 16 (hot-core Hetzner) |
| Package manager | pnpm 10 (monorepo workspaces) |
| Auth | Better-Auth with org plugin |
| Job orchestrator | Hatchet |
| AI gateway | OmniRoute sidecar |
| AI metering | OpenMeter + Killbill |
| AI tracing | Langfuse self-hosted |
| Secret management | Infisical self-hosted |
| License | Pure MIT |

---

## Architectural Principles

| # | Principle | Scope | Enforcement |
|---|-----------|-------|-------------|
| I | TS-Native Stack | All runtime code in TypeScript. No Python/Ruby/Go in core. | CI typecheck gate |
| II | MIT License Safety | All dependencies permissive. AGPL only for isolated infra containers (Grafana, MinIO). | `license-checker` in CI |
| III | Plan-Driven Development | No code without spec + plan. | PR template requires spec link |
| IV | AI-Augmented Velocity | OmniRoute in every env; Hermes/undrestrator for code gen. | Sidecar health-check in CI |
| V | Decentralization-Ready | No cloud-provider API lock-in. Docker-compose + Akash SDL. | Install CLI integration test |
| VI | Hot-Secrets Boundary | Payment secrets, VPN keys, KYC data — hot-core only. Never on Akash. | Secret-scan + RLS policies |
| VII | Artifact Versioning | Every speckit stage tagged as `<stage>/<slug>/v<N>`. Git is history. | `snapshot-stage` in CI |

---

## System Topology

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              PUBLIC INTERNET                                 │
│                     (CDN / Traefik reverse proxy)                            │
└───────────────────────────┬──────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     LAYER 3 — AKASH COMPUTE (stateless)                      │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Next.js 16  │  │  Medusa v2  │  │  OmniRoute  │  │   Redis 7   │        │
│  │  Storefront  │  │   Backend   │  │   Sidecar   │  │   (cache)   │        │
│  └──────┬───────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘        │
│         │                 │                 │                                 │
│         └────────┬────────┘                 │                                 │
│                  │                          │                                 │
└──────────────────┼──────────────────────────┼─────────────────────────────────┘
                   │                          │
                   │  WireGuard Tunnel         │
                   │  (mTLS/PSK)               │
                   ▼                          ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 4 — HOT-CORE (Hetzner, hardened)                    │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL16 │  │  Infisical  │  │  Langfuse   │  │ OpenMeter   │        │
│  │  (primary)   │  │  (secrets)  │  │  (AI trace) │  │ + Killbill  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │  VPN Servers │  │   MinIO     │  │   Hatchet   │                         │
│  │  (WG/AWG/   │  │  (S3 files) │  │  Engine     │                         │
│  │   Xray)     │  │             │  │             │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Presentation

### Next.js 16 App Router Storefront (`apps/storefront/`)

| Aspect | Decision |
|--------|----------|
| Routing | App Router with route groups: `(global)/` for GLOBAL region, `(eu)/` for EU region |
| Rendering | SSR for SEO-critical pages (product listing, product detail, category); CSR for interactive surfaces (PC-builder, checkout, VPN dashboard) |
| Region selection | URL/subdomain-driven; persisted across sessions via cookie |
| SDK integration | `@medusajs/js-sdk` for Medusa API; `packages/omniroute-client/` for AI surface |
| Styling | Tailwind CSS v4 |
| Components | AI PC-builder advisor, checkout flow, VPN management dashboard |

### Region routing

```
undrlla.com          → GLOBAL (USD, English)
eu.undrlla.com       → EU (EUR, English + localized)
<tenant>.undrlla.com → Tenant-scoped (Phase 6, deferred)
```

Cart is cleared with an explicit warning on region switch — never silent re-pricing (edge case requirement).

### Medusa Admin (`apps/admin/` or built-in)

Medusa's built-in admin dashboard extended with custom admin routes for:

- Tenant management (TenantModule)
- VPN server inventory and peer management (VPNModule)
- AI tier configuration and BYOK key management (AIMeteringModule)
- BTCPay invoice monitoring (payment-btcpay module)
- Federation instance registry (FederationModule, Phase 5)

---

## Layer 2 — Application

### Medusa v2 Backend (`apps/medusa/`)

Medusa provides catalog, cart, checkout, orders, inventory, fulfillment, and returns as built-in primitives. Custom business logic extends Medusa via modules, workflows, subscribers, and jobs.

#### Custom Medusa Modules

| Module | Location | Entities | Purpose |
|--------|----------|----------|---------|
| **TenantModule** | `apps/medusa/src/modules/tenant/` | `Tenant`, `Workspace`, `BrandConfig` | `tenant_id` enforcement, Sales Channel binding, region scoping |
| **VPNModule** | `apps/medusa/src/modules/vpn/` | `VPNServer`, `VPNPeer`, `VPNIPPool` | VPN server inventory, peer lifecycle, IP allocation |
| **AIMeteringModule** | `apps/medusa/src/modules/ai-metering/` | `AIUsageEvent`, `AIKeyVault`, `AITierConfig` | Usage tracking, BYOK key vault (AES-256-GCM), tier config |
| **PaymentBTCPayModule** | `apps/medusa/src/modules/payment-btcpay/` | `BTCPayInvoice`, `BTCPayWebhookEvent` | BTCPay Server payment lifecycle (custom Medusa v2 Payment Provider) |
| **FederationModule** | `apps/medusa/src/modules/federation/` | `FederationInstance`, `FederationCatalogEntry` | Instance discovery, catalog sharing, data export (Phase 5) |

#### Medusa Workflows

| Workflow | Location | Steps |
|----------|----------|-------|
| **Checkout** | `apps/medusa/src/workflows/checkout/` | Cart → payment capture → fulfillment (physical) or VPN provisioning (digital) |
| **VPN Provision** | `apps/medusa/src/workflows/vpn-provision/` | Allocate IP → generate config → SSH push → encrypt → notify → update order |
| **AI Metering** | `apps/medusa/src/workflows/ai-metering/` | OmniRoute event → OpenMeter ingest → Killbill aggregation |

#### Event Subscribers

| Subscriber | Trigger | Action |
|------------|---------|--------|
| `order-events.ts` | `order.payment_captured` | Trigger VPN provisioning workflow (if order contains VPN items) |
| `ai-usage-events.ts` | AI request complete | Emit metering event to OpenMeter pipeline |

#### Scheduled Jobs

| Job | Schedule | Action |
|-----|----------|--------|
| `billing-cycle.ts` | Daily | Killbill billing cycle aggregation |
| `vpn-cleanup.ts` | Daily | Expired VPN peer cleanup + IP release |

### Authentication — Better-Auth

Better-Auth with the organization plugin provides:

- Credential login (bcrypt migration from legacy NextAuth.js)
- Token versioning (legacy feature, ported)
- SAML via Jackson integration
- Organization/team hierarchy mapping to `Tenant` / `Workspace`
- Session management with tenant context

Better-Auth integrates with Medusa via a custom auth provider in `apps/medusa/src/api/middleware/auth.ts`.

### Background Jobs — Hatchet

Hatchet replaces BullMQ from the legacy stack. All durable workflows run through Hatchet:

| Worker | Trigger | Criticality |
|--------|---------|-------------|
| VPN provisioning | `order.payment_captured` | P1 — revenue-impacting |
| Payment webhook processing | Stripe/PayPal/BTCPay webhook | P1 — revenue-impacting |
| AI content/SEO batch | Schedule or on-demand | P3 — marketing |
| Migration dual-write reconciliation | During cutover window | P1 — data integrity |
| Notification dispatch | Various events | P2 — customer experience |

Hatchet workers run on Akash compute but execute SSH commands to VPN servers on the hot-core via the WireGuard tunnel.

### AI Tier Resolution

Three tiers per tenant, resolved by the OmniRoute TS SDK:

| Tier | Key Source | Billing | Use Case |
|------|-----------|---------|----------|
| **dev** | Operator's own keys | No billing (internal) | undrestrator automation, content gen |
| **paid** | Platform-managed keys | OpenMeter → Killbill → Stripe | Customer-facing AI (PC-builder, support agent) |
| **BYOK** | Customer-supplied keys | Zero platform cost | Privacy/power users |

Resolution order: check `AIKeyVault` for BYOK → check `AITierConfig` for paid → default to dev. BYOK customers never fall back to platform keys (hard requirement).

---

## Layer 3 — Infrastructure

### Docker Containers

All application services are containerized. Docker Compose for dev/prod-local; Akash SDL for production on Akash.

| Container | Image | Purpose |
|-----------|-------|---------|
| `medusa` | Custom (Node 22) | Medusa v2 backend |
| `storefront` | Custom (Node 22) | Next.js 16 storefront |
| `omniroute` | `underhelpers/omniroute` | AI gateway sidecar |
| `redis` | `redis:7-alpine` | Sessions, cache, Hatchet queues |
| `minio` | `minio/minio` | S3-compatible file storage |
| `btcpay` | `btcpayserver/btcpayserver` | BTCPay Server (dev/testnet + prod) |

### OmniRoute Sidecar

OmniRoute is the AI gateway, deployed as a sidecar container in every topology:

- **Endpoint**: `http://omniroute:20128` (Docker network) or `http://localhost:20128` (local dev)
- **SDK**: `packages/omniroute-client/` — typed request/response, retry logic, tenant-aware tier resolution
- **Health check**: `GET /health` — automatic container restart on failure
- **Graceful degradation**: On exhaustion, returns a labeled "AI temporarily unavailable" response; never serves stale answers as live

### Redis

- Sessions (Better-Auth session store)
- HTTP cache (Medusa cache module)
- Hatchet task queues

### MinIO

S3-compatible object storage for:

- Product images
- VPN configuration archives (encrypted, AES-256-GCM)
- Customer uploads
- Static assets

---

## Layer 4 — Hot-Core

The hot-core is a **dedicated Hetzner server** in an EU GDPR-compliant data center. It is NOT accessible from the public internet — only via WireGuard VPN tunnel from authenticated Akash compute nodes.

### Components

| Component | Purpose | Data Classification |
|-----------|---------|---------------------|
| **PostgreSQL 16** | Primary database — all customer data, orders, VPN peers, AI usage events | Confidential (PII, financial) |
| **Infisical** | Secret management — KEK store, payment provider secrets, VPN master keys | Top Secret |
| **Langfuse** | AI tracing — per-tenant project isolation, cost attribution | Confidential (may contain PII in prompts) |
| **OpenMeter + Killbill** | AI token metering + billing engine | Confidential (financial) |
| **Hatchet Engine** | Job orchestrator — gRPC endpoint for Akash workers | Internal |
| **VPN Servers** | WireGuard / AmneziaWG / Xray — master keys, peer provisioning | Top Secret |
| **MinIO** | S3-compatible storage (prod) | Confidential |

### Hardening

- **Disk**: LUKS full-disk encryption
- **Network**: WireGuard tunnel (mTLS/PSK) — no public internet access
- **Key storage**: Infisical with optional YubiHSM2 hardware key store
- **Backups**: Daily `pg_dump` + WAL archiving to S3-compatible cold storage
- **DR**: Hot-standby replication to secondary Hetzner server in different DC (manual activation within RTO)

### Backup & Recovery

| Component | Strategy | RPO | RTO |
|-----------|----------|-----|-----|
| PostgreSQL | Daily pg_dump + continuous WAL archiving to S3 | <5 min | <30 min (restore from WAL) |
| Infisical | Encrypted backup to S3 | <1 hour | <1 hour |
| VPN configs | Version-controlled in Postgres + Infisical | <5 min | <30 min |
| Langfuse data | Shares Postgres backup | <5 min | <30 min |

---

## Data Flow

### 1. Commerce Flow (Customer → Order)

```
Customer
  → Next.js Storefront (SSR/CSR)
    → Medusa REST API (/store/*)
      → Medusa Cart Module → Medusa Payment Module → Medusa Order Module
        → PostgreSQL (hot-core)
        → Stripe/PayPal/BTCPay (payment capture)
          → Webhook → Medusa Payment Module
            → Order state: payment_captured
              → Subscriber triggers fulfillment workflow
```

### 2. AI Request Flow

```
Customer (PC-builder / Support Agent / Content Gen)
  → Next.js Storefront
    → OmniRoute SDK (tier resolution: BYOK → paid → dev)
      → OmniRoute Sidecar (http://omniroute:20128)
        → AI Provider (OpenAI/Anthropic/OpenRouter/local)
          → Response
            → OmniRoute SDK emits metering event → OpenMeter
              → Killbill aggregation at billing cycle
                → Stripe/BTCPay collection
            → Langfuse trace (tenant tag + cost)
```

### 3. AI Metering Pipeline

```
OmniRoute response
  → AIMeteringModule emits event { tenant_id, user_id, model, prompt_tokens, completion_tokens, cost_usd, use_case }
    → OpenMeter ingest (real-time, <1s latency)
      → Killbill reads aggregated usage at billing cycle boundary
        → Invoice generation
          → Stripe/BTCPay payment collection
```

### 4. VPN Provisioning Flow

```
Order payment_captured event
  → Hatchet worker (VPN Provision Workflow)
    → Step 1: Select VPNServer (capacity-aware, jurisdiction-matched)
    → Step 2: Atomic IP allocation (UPDATE vpn_ip_pool SET allocated=true WHERE allocated=false LIMIT 1 RETURNING *)
    → Step 3: Generate peer config (WireGuard/AmneziaWG/Xray)
    → Step 4: SSH push to VPN server (hot-core, via WireGuard tunnel)
    → Step 5: Encrypt config archive (AES-256-GCM)
    → Step 6: Notify customer (email + dashboard)
    → Step 7: Update order line item status
  → On failure: Rollback (release IP, mark for retry) → Dead-letter queue → Ops alert
```

### 5. Payment Flow

```
Customer checkout
  → Medusa Payment Module
    → Route to provider:
      Stripe    → Stripe API → webhook → order update
      PayPal    → PayPal API → webhook → order update
      BTCPay    → BTCPayInvoice created → customer pays on-chain → webhook settlement → order update
      Bank      → Manual: admin marks as paid in dashboard → order update
  → On provider outage: order held in pending_payment, resumable on recovery
```

### 6. Federation Flow (Phase 5)

```
Instance A (operator)                         Instance B (community)
  GET /.well-known/undrlla.json  ←───────────  Published metadata
  GET /api/federation/catalog.json ←──────────  Opt-in product feed
  POST /api/federation/export    ──────────────→ Data portability archive
```

---

## Source-of-Truth Tree

```text
apps/
├── medusa/                         # Medusa v2 backend application
│   ├── src/
│   │   ├── api/                    # REST routes + middleware
│   │   │   ├── admin/              # Admin-scoped routes (tenants, VPN, AI config)
│   │   │   └── store/              # Storefront-scoped routes (catalog, checkout)
│   │   ├── modules/                # Custom Medusa modules
│   │   │   ├── tenant/             # TenantModule — tenant_id, Sales Channel binding
│   │   │   ├── vpn/                # VPNModule — server inventory, peer lifecycle
│   │   │   ├── ai-metering/        # AIMeteringModule — usage events, key vault, tiers
│   │   │   ├── payment-btcpay/     # BTCPay Server Payment Provider Module
│   │   │   └── federation/         # FederationModule — discovery, catalog, portability
│   │   ├── workflows/              # Medusa workflows
│   │   │   ├── checkout/           # Cart → payment → fulfillment
│   │   │   ├── vpn-provision/      # Allocate → SSH → encrypt → notify
│   │   │   └── ai-metering/        # OmniRoute → OpenMeter → Killbill
│   │   ├── subscribers/            # Event subscribers
│   │   │   ├── order-events.ts     # order.payment_captured → provisioning
│   │   │   └── ai-usage-events.ts  # AI usage → metering pipeline
│   │   └── jobs/                   # Scheduled jobs
│   │       ├── billing-cycle.ts    # Killbill billing cycle aggregation
│   │       └── vpn-cleanup.ts      # Expired VPN peer cleanup
│   ├── medusa-config.ts            # Medusa configuration
│   └── prisma/
│       └── schema.prisma           # Extended schema (tenant_id, VPN, AI events)
│
├── storefront/                     # Next.js 16 App Router storefront
│   ├── src/
│   │   ├── app/                    # App Router pages
│   │   │   ├── (global)/           # GLOBAL region routes (USD, English)
│   │   │   └── (eu)/               # EU region routes (EUR, localized)
│   │   ├── components/             # React components
│   │   │   ├── pc-builder/         # AI PC-builder advisor UI
│   │   │   ├── checkout/           # Checkout flow components
│   │   │   └── vpn/                # VPN management dashboard
│   │   ├── lib/                    # Client utilities
│   │   │   ├── medusa-sdk.ts       # Medusa JS SDK wrapper
│   │   │   └── omniroute.ts        # OmniRoute client wrapper
│   │   └── styles/                 # Tailwind CSS
│   └── next.config.ts
│
└── admin/                          # Medusa admin customizations (if needed)

packages/
├── shared-types/                   # Shared TS interfaces (single source of truth for types)
│   └── src/
│       ├── tenant.ts               # Tenant, Workspace, BrandConfig
│       ├── vpn.ts                  # VPNServer, VPNPeer, VPNIPPool
│       ├── ai.ts                   # AIUsageEvent, AIKeyVault, AITierConfig
│       ├── order.ts                # Order, PaymentTransaction extensions
│       └── federation.ts           # FederationInstance, catalog types
│
├── omniroute-client/               # AI gateway SDK
│   └── src/
│       ├── client.ts               # Main client class
│       ├── tier-resolver.ts        # Dev/paid/BYOK tier resolution
│       ├── retry.ts                # Exponential backoff with jitter
│       ├── types.ts                # Request/response types
│       └── metering.ts             # Metering event emission
│
├── vpn-provisioner/                # VPN provisioning library
│   └── src/
│       ├── ssh-client.ts           # ssh2 wrapper for VPN server commands
│       ├── wireguard.ts            # WireGuard peer config generation
│       ├── amneziawg.ts            # AmneziaWG peer config generation
│       ├── xray.ts                 # Xray peer config generation
│       ├── ip-pool.ts              # Atomic IP allocation from Postgres
│       └── config-encrypt.ts       # AES-256-GCM config encryption
│
├── tenant-middleware/              # tenant_id enforcement
│   └── src/
│       ├── prisma-extension.ts     # tenant_id injection into every query
│       ├── medusa-middleware.ts    # Medusa module context injection
│       └── rls-policy.ts           # Postgres RLS policy generator
│
├── migration-tool/                 # Legacy → v2 migration CLI
│   └── src/
│       ├── cli.ts                  # CLI entry (dry-run, resumable, verify)
│       ├── extractors/             # Per-entity legacy data extractors
│       ├── transformers/           # Legacy → Medusa schema transformers
│       ├── loaders/                # Medusa v2 data loaders
│       └── verifier.ts             # Cryptographic integrity verification
│
├── federation-protocol/            # Federation REST server
│   └── src/
│       ├── discovery.ts            # /.well-known/undrlla.json handler
│       ├── catalog.ts              # /api/federation/catalog.json feed
│       ├── portability.ts          # FR-036 data export/import archive
│       └── types.ts                # Protocol version types
│
└── install-cli/                    # Community operator installer
    └── src/
        ├── cli.ts                  # Main install command
        ├── scaffold.ts             # Config scaffolding (env, branding)
        ├── migrate.ts              # Schema migration runner
        └── seed.ts                 # Default data seeding

infra/
├── akash/                          # Akash SDL manifests
│   ├── deploy.yml                  # Production SDL manifest
│   ├── deploy-staging.yml          # Staging SDL manifest
│   └── jurisdictions.json          # GDPR-compatible provider allow-list
├── docker-compose/                 # Development + production compose files
│   ├── docker-compose.yml          # Dev stack (Postgres, Redis, MinIO, BTCPay, Langfuse, OmniRoute)
│   └── docker-compose.prod.yml     # Prod stack (excludes Postgres — runs on hot-core)
├── hot-core/                       # Hetzner setup scripts
│   ├── setup.sh                    # Initial server hardening
│   ├── wireguard-server.conf       # WireGuard tunnel config
│   ├── infisical-setup.sh          # Infisical self-hosted deployment
│   └── backup.sh                   # pg_dump + WAL archiving to S3
└── ci/                             # CI/CD pipelines
    ├── ci-pipeline.yml             # Main CI (lint, typecheck, test, build)
    ├── secret-scan.yml             # CI secret-scan (trufflehog/gitleaks)
    └── deploy-pipeline.yml         # CD: build → push → deploy (Akash or VPS)
```

---

## Deployment Topologies

### 1. Local Development (`docker-compose`)

```bash
cd infra/docker-compose/
docker compose up -d
# Starts: Postgres, Redis, MinIO, BTCPay (testnet), Langfuse, OmniRoute, Hatchet
# Medusa backend:  http://localhost:9000
# Next.js storefront: http://localhost:3000
# OmniRoute sidecar: http://localhost:20128
```

All services on localhost. Postgres runs locally in the compose stack. Full parity with production.

### 2. Akash Production (SDL)

```
Akash SDL (infra/akash/deploy.yml)
  ├── Medusa backend container (stateless)
  ├── Next.js storefront container (stateless)
  ├── OmniRoute sidecar container (stateless)
  ├── Redis container (ephemeral cache)
  └── Postgres connection → hot-core Hetzner (via WireGuard tunnel)
```

- **Jurisdiction filter**: SDL placement constraints restrict to GDPR-compatible providers (EU/EEA + UK + CH + adequacy-decision countries)
- **Failover**: Two persistent replicas in different Akash providers; 5 min P95 RTO, 15 min P99, RPO=0
- **Warm-standby**: VPS-based manual-activation fallback for catastrophic Akash outage (activated within 10 min)

### 3. Community VPS (`install-cli`)

```bash
npx @undrella/install-cli
# Bootstraps: database, migrations, seed data, env config
# Runs: docker-compose.prod.yml on any Linux host
```

Community operators run the full stack on any Linux VPS. Postgres runs locally on their VPS. No hot-core dependency — they manage their own secrets.

---

## Security Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY BOUNDARIES                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           HOT-CORE (Trust Level: MAXIMUM)            │    │
│  │                                                      │    │
│  │  • PostgreSQL primary (all customer data)            │    │
│  │  • Infisical (KEK, payment secrets, VPN master keys) │    │
│  │  • VPN servers (WireGuard/AmneziaWG/Xray)            │    │
│  │  • Langfuse (AI traces with potential PII)           │    │
│  │  • OpenMeter + Killbill (billing data)               │    │
│  │  • KYC vault data                                    │    │
│  │                                                      │    │
│  │  Encryption: LUKS (disk), AES-256-GCM (secrets)      │    │
│  │  Access: WireGuard tunnel only (mTLS/PSK)            │    │
│  │  No public internet exposure                          │    │
│  └──────────────────────────┬──────────────────────────┘    │
│                              │ WireGuard Tunnel              │
│                              │ (encrypted, authenticated)    │
│  ┌──────────────────────────┴──────────────────────────┐    │
│  │         AKASH COMPUTE (Trust Level: LOW)             │    │
│  │                                                      │    │
│  │  • Medusa backend (stateless containers)              │    │
│  │  • Next.js storefront (stateless containers)         │    │
│  │  • OmniRoute sidecar (stateless)                     │    │
│  │  • Redis cache (ephemeral)                           │    │
│  │                                                      │    │
│  │  Contains: No secrets, no PII at rest                │    │
│  │  Secrets injected at runtime via Infisical agent     │    │
│  │  Container restart = clean slate                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │          PUBLIC INTERNET (Trust Level: ZERO)          │    │
│  │                                                      │    │
│  │  • CDN / Traefik → Akash storefront/backend          │    │
│  │  • Customer browsers, bots, API clients              │    │
│  │                                                      │    │
│  │  All inbound traffic through Traefik with TLS        │    │
│  │  Rate limiting on public endpoints                   │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Security rules

| Rule | Enforcement |
|------|-------------|
| No secret in logs, stack traces, or error responses | CI secret-scan (trufflehog/gitleaks); structured logging with PII redaction |
| No payment secret, AI key, VPN key, or KYC document outside hot-core | Infisical agent injects at runtime; never in env vars or config files on Akash |
| Tenant isolation: tenant A cannot see tenant B's data | 3-layer: Prisma extension → Medusa middleware → Postgres RLS. Returns 404 (not 403) to avoid existence leaks |
| BYOK key never serialized in logs or API responses | Decrypt only inside OmniRoute request path; `bytea` ciphertext columns |
| CI secret-scan on every push | Zero tolerance for committed secrets |

---

## Observability

### Logging

- **Structured JSON** via pino/consola with `tenant_id` context on every request
- **Destination**: Loki (Grafana stack)
- **PII redaction**: All error sinks redact PII at the boundary
- **Rule**: Never log a payment secret, AI API key, VPN private key, or KYC document (including stack traces)

### Metrics

- **System**: Prometheus / VictoriaMetrics
- **Per-tenant metrics**: Error rate, latency (P50/P95/P99), AI cost, checkout conversion
- **Alert thresholds**:
  - Error rate >1% → page
  - Latency P95 >2s → page
  - AI cost anomaly → review (not page)

### AI Tracing

- **Tool**: Langfuse self-hosted (Docker container on hot-core)
- **Integration**: OpenTelemetry spans with `tenant_id` attribute
- **Per-tenant project isolation** in Langfuse
- **Tracked per request**: Model, prompt tokens, completion tokens, cost-USD, latency, use-case tag

### Error Tracking

- **Tool**: GlitchTip (Sentry-compatible, self-hosted) or Sentry
- **PII redaction**: All PII stripped at the boundary before sending
- **Rule**: Zero PII fields in any error response (SC-009)

### Observability stack summary

| Signal | Tool | Storage | Retention |
|--------|------|---------|-----------|
| Logs | pino/consola → Loki | Hot-core | 90 days |
| Metrics | Prometheus/VictoriaMetrics | Hot-core | 1 year |
| AI Traces | Langfuse (self-hosted) | Hot-core Postgres | 90 days |
| Errors | GlitchTip/Sentry | Hot-core or SaaS | 90 days |
| Infra metrics | cAdvisor + Node Exporter | Hot-core | 1 year |

---

## Data Model Overview

Core entities and relationships. Full column-level schema in [`data-model.md`](data-model.md).

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

### Custom modules (beyond Medusa built-in)

| Module | Custom Entities | Medusa Extension Points |
|--------|----------------|------------------------|
| **TenantModule** | `Tenant`, `Workspace`, `BrandConfig` | Sales Channel binding, Region |
| **VPNModule** | `VPNServer`, `VPNPeer`, `VPNIPPool` | Fulfillment workflow hook |
| **AIMeteringModule** | `AIUsageEvent`, `AIKeyVault`, `AITierConfig` | — (sidecar integration) |
| **FederationModule** | `FederationInstance`, `FederationCatalogEntry` | — (future) |
| **MigrationModule** | `MigrationJournal`, `MigrationCheckpoint` | — (tooling only) |

### Schema conventions

| Convention | Example |
|------------|---------|
| Custom schema: `undrlla` | `undrlla.tenant`, `undrlla.vpn_server` |
| Table names: `snake_case` | `ai_usage_event`, `vpn_ip_pool` |
| Primary key: `id` (UUID v4) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign keys: `<entity>_id` | `tenant_id`, `vpn_server_id` |
| Timestamps: `created_at`, `updated_at`, `deleted_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` |
| Ciphertext columns: `bytea` | Never store encrypted data as `text` |
| Soft delete on Orders and VPNPeers | Never physical-delete commerce or VPN records |

### Tenancy enforcement

Three layers of tenant isolation:

1. **Prisma extension** (`packages/tenant-middleware/prisma-extension.ts`) — injects `tenant_id` into every query from the authenticated session
2. **Medusa module middleware** (`packages/tenant-middleware/medusa-middleware.ts`) — validates tenant context at the Medusa module boundary
3. **Postgres RLS policies** (`packages/tenant-middleware/rls-policy.ts`) — defense-in-depth at the database level

Integration test suite includes a **tenant-scope probe**: authenticate as tenant A, assert 404 on tenant B's resources for every endpoint. Runs in CI automatically.

---

## Cross-Cutting Concerns

### i18n / Multi-Region

| Region | Currency | Locales | Payment Providers | Status |
|--------|----------|---------|-------------------|--------|
| GLOBAL | USD | English | Stripe, PayPal, BTCPay, Bank | Day one |
| EU | EUR | English + localized | Stripe, PayPal, BTCPay, Bank | Day one |
| RU | — | — | — | Removed (FR-028a: data export + account closure) |

Region selection driven by URL/subdomain. Cart cleared with explicit warning on region switch.

### Error Handling

| Scenario | Response |
|----------|----------|
| Payment provider outage mid-checkout | Order held in `pending_payment`; resumable on provider recovery |
| Akash provider goes offline | Failover to replica within 5 min P95; no in-flight order loss |
| OmniRoute exhausts all providers | "AI temporarily unavailable" label; never stale-as-live |
| VPN peer creation race condition | Atomic `UPDATE ... WHERE allocated=false LIMIT 1 RETURNING *`; double-assignment impossible |
| BYOK key revocation mid-session | Graceful session end; no platform-key fallback |
| Community-operator schema drift | Migration detects drift; refuses to run with clear message |
| Cross-tenant leak attempt | 404 (not 403) to avoid existence disclosure |
| Late crypto settlement after refund window | Reconciliation handles correctly regardless of timing |

### Payment Providers

| Provider | Type | Integration |
|----------|------|-------------|
| Stripe | Medusa built-in Payment Provider | Card payments, Stripe Metered for AI billing |
| PayPal | Medusa built-in Payment Provider | PayPal checkout |
| BTCPay Server | Custom Medusa v2 Payment Provider Module | Invoice creation, webhook settlement, refund, partial payment |
| Manual bank transfer | Admin-side reconciliation | Operator marks as paid |

---

## Architectural Decision Record

All decisions finalized. Full rationale in [`specs/001-init/research.md`](../001-init/research.md).

| # | Decision | Choice | Confidence | Key Trade-off |
|---|----------|--------|:----------:|---------------|
| D1 | Commerce foundation | Medusa v2 (8.42/10) | High | Modular TS architecture vs Vendure's NestJS maturity |
| D2 | Hosting model | Hybrid: Akash + Federation + Hot Core (8.87/10) | High | Cost savings vs operational complexity |
| D3 | Tenancy model | Hybrid: mono-tenant + `tenant_id` FK everywhere | High | Schema simplicity vs premature multi-tenant overhead |
| D4 | AI tier model | 3-tier: dev / paid / BYOK | High | Flexibility vs SDK complexity |
| D5 | Multi-tenant pattern | Shared schema + `tenant_id` + Prisma ext + RLS | High | Operational simplicity vs isolation granularity |
| D6 | Postgres hosting | Primary on hot-core Hetzner; Akash stateless | High | Data safety vs network latency (mitigated by EU-only Akash) |
| D7 | OmniRoute integration | Sidecar container + TS SDK | High | Minimal latency vs sidecar failure (mitigated by health-check + graceful degradation) |
| D8 | BTCPay payment | Custom Medusa v2 Payment Provider Module | Medium | Full control vs maintenance burden |
| D9 | VPN provisioning | Hatchet worker + SSH + atomic IP alloc | High | Battle-tested SSH approach vs no native REST API |
| D10 | Auth | Better-Auth with organization plugin | Medium | TS-native + org support vs project maturity (v1.x) |
| D11 | Job orchestrator | Hatchet (replaces BullMQ) | Medium | DAG workflows + observability vs smaller ecosystem |
| D12 | AI tracing | Langfuse self-hosted + OTel | High | Feature-complete vs additional Postgres schema |
| D13 | AI token metering | OpenMeter → Killbill → Stripe/BTCPay | Medium | Separation of concerns vs 3-layer integration surface |
| D14 | Hot-core architecture | Dedicated Hetzner + WireGuard tunnel + Infisical | High | Full control vs single-server SPOF (mitigated by replication) |
| D15 | Federation protocol | Lightweight REST: discovery + catalog + portability | Medium | Simplicity vs limited integration depth |
| D16 | License | Pure MIT | High | Maximum adoption vs no license revenue |
| D17 | Akash failover RTO | 5 min P95, 15 min P99, RPO=0 | Medium | Cost-efficient vs not sub-second |
| D18 | Legacy retention | 1 year read-only + 7 year cold archive | High | Compliance coverage vs storage cost |
| D19 | GDPR Akash filter | SDL placement + hardcoded country allow-list | High | Preventive vs reactive |
| D20 | i18n regions | GLOBAL + EU from day one; RU removed | High | GDPR compliance vs RU market exit |

---

## Dependency Map

### Critical path

```
Phase 0 (Foundation)
  ├── Phase 1 (Core Commerce) ──── Phase 4 (Cutover)
  └── Phase 2 (AI Surface) ───────┘
          └── Phase 3 (Decentralization)
                  └── Phase 5 (Federation)
Phase 4 ──── Phase 6 trigger (Multi-tenant, deferred)
```

### Package dependency graph

```
apps/medusa
  ├── packages/shared-types
  ├── packages/omniroute-client
  ├── packages/vpn-provisioner
  ├── packages/tenant-middleware
  └── packages/federation-protocol (Phase 5)

apps/storefront
  ├── packages/shared-types
  └── packages/omniroute-client

packages/vpn-provisioner
  └── packages/shared-types

packages/omniroute-client
  └── packages/shared-types

packages/tenant-middleware
  └── packages/shared-types

packages/migration-tool (standalone CLI)
packages/install-cli (standalone CLI)
packages/federation-protocol (standalone REST server)
```

### External dependency risks

| Dependency | Risk | Mitigation |
|-----------|------|-----------|
| Medusa v2 modules API | Breaking changes in minor versions | Pin exact version; budget 1 month/year for upgrades |
| BTCPay Server API | Version changes break webhook handler | Pin BTCPay version in docker-compose; integration test against pinned version |
| Akash Network | Provider quality varies; scheduler behavior may change | Provider reputation ranking; VPS warm-standby; quarterly provider-kill drills |
| Better-Auth + Medusa | Undocumented integration pattern | PoC in Phase 0 M0.6; fallback to custom JWT auth |
| Hatchet on Akash | gRPC over WireGuard tunnel must work | PoC in Phase 0; fallback to BullMQ if needed |
| OpenMeter throughput | Must handle 1000+ events/min | Load test in Phase 2; Postgres counter fallback |

---

## Risk Register

| # | Risk | Impact | Prob | Phase | Mitigation |
|---|------|--------|:----:|:-----:|-----------|
| R1 | Better-Auth + Medusa integration incompatibility | Blocks auth | Med | 0 | PoC in M0.6; custom JWT fallback |
| R2 | BTCPay webhook edge cases (late settlement) | Payment reconciliation errors | Med | 1 | Integration tests; manual recon queue |
| R3 | VPN SSH over WireGuard unreliable | VPN orders stuck | Low | 1 | Retry (3× backoff); dead-letter queue; monitoring |
| R4 | OpenMeter throughput insufficient | Billing gaps | Med | 2 | Load test early; Postgres counter fallback |
| R5 | Akash provider quality — unstable first deploy | Downtime | Med | 3 | Provider reputation ranking; VPS warm-standby 90 days |
| R6 | Akash + Hetzner latency exceeds checkout budget | SC-007 failure | Low | 3 | EU-only Akash providers; latency monitoring |
| R7 | Dual-write degrades legacy performance | Legacy checkout slowdown | Low | 4 | Async fire-and-forget; legacy write path unchanged |
| R8 | Transitive AGPL dependency in supply chain | MIT license violation | Low | 5 | `license-checker` in CI; replace AGPL deps |
| R9 | Community-operator install friction >1 hour | SC-003 failure | Med | 5 | Non-team developer dry-run; iterate |
| R10 | Cross-tenant leak via forgotten `tenant_id` filter | Security incident | Low | 1+ | Tenant-scope probe in CI; RLS safety net |

---

## Related Documents

| Document | Location |
|----------|----------|
| Feature Specification | [`specs/001-init/spec.md`](../001-init/spec.md) |
| Technical Research & Decisions | [`specs/001-init/research.md`](../001-init/research.md) |
| Foundation Decision Matrix | [`specs/001-init/decisions/foundation-matrix.md`](../001-init/decisions/foundation-matrix.md) |
| Decentralization Decision Matrix | [`specs/001-init/decisions/decentralization-matrix.md`](../001-init/decisions/decentralization-matrix.md) |
| Implementation Plan | [`specs/main/plan.md`](plan.md) |
| Data Model | [`specs/main/data-model.md`](data-model.md) |
| Quickstart Guide | [`specs/main/quickstart.md`](quickstart.md) |
| OmniRoute SDK Contract | [`specs/main/contracts/omniroute-sdk.md`](contracts/omniroute-sdk.md) |
| Auth Contract | [`specs/main/contracts/auth-better-auth.md`](contracts/auth-better-auth.md) |
| VPN Provisioning Contract | [`specs/main/contracts/vpn-provisioning.md`](contracts/vpn-provisioning.md) |
| BTCPay Payment Contract | [`specs/main/contracts/payment-btcpay.md`](contracts/payment-btcpay.md) |
| Federation Protocol Contract | [`specs/main/contracts/federation-protocol.md`](contracts/federation-protocol.md) |
| Constitution | [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md) |
