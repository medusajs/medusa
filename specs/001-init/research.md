# Research: undrlla v2 — Migration + Decentralized Hybrid Hosting
**Branch**: `001-init` | **Date**: 2026-05-24 | **Spec**: spec.md

---

This document resolves all deferred items and technical unknowns identified in `spec.md` Phase 2. Each topic carries a concrete decision — no "it depends" without a definitive recommendation.

**Source-of-truth inputs**:
- `spec.md` — 40 FRs (FR-001..FR-040 + FR-028a), 7 user stories, 12 entities, 12 SCs, 10 edge cases
- `decisions/foundation-matrix.md` — Medusa v2 chosen (8.42/10)
- `decisions/decentralization-matrix.md` — Hybrid chosen (8.87/10)
- `.specify/memory/constitution.md` — 7 principles, non-negotiables documented

---

## A) Deferred Item Resolution

### 1. Federation license model (FR-034)

**Decision**: Pure MIT license for the entire codebase, including the storefront, Medusa modules, and install tooling. Monetize via managed-hosting tier, professional support, and SLA-backed offerings — never via license restrictions.

**Rationale**: Constitution Principle II mandates permissive-only dependencies. BSL or SSPL would violate the spirit of that principle for our own output and create legal friction for community-operators who want to build on top. Pure MIT maximizes adoption velocity: the faster operators clone and deploy, the faster the ecosystem grows. Revenue comes from the centralized hot-core services we alone operate (VPN provisioning, managed payments, AI gateway) and from a paid managed-hosting tier where we run their instance for them. This mirrors the Medusa / Next.js / Postgres model: permissive core, monetize managed services.

**Alternatives considered**:
- **BSL 1.1 (MariaDB/HashiCorp model)**: Source-available, non-compete for 3–4 years. Would block commercial hosters for the embargo period, killing the community-operator story (User Story 6) before it starts. Also contradicts Constitution Principle II's spirit even if technically our own code.
- **SSPL (MongoDB model)**: Requires anyone offering the service commercially to open-source their entire surrounding stack. Hostile to community-operators who may use proprietary payment gateways or custom VPN backends. Discourages adoption.
- **Open-core (MIT core + commercial add-ons)**: Requires drawing a line between "core" and "premium" features that will drift over time. Creates incentive to withhold useful features behind a paywall, poisoning community trust. Operational complexity of dual-repo or feature-flag management for a small team.
- **AGPL**: Constitution Principle II explicitly blocks AGPL dependencies; shipping AGPL ourselves would be hypocritical and would scare away operators who integrate with proprietary services.

**Risk**: A community-operator could offer a competing managed-hosting service on our own code with zero revenue flowing back. Mitigation: our competitive moat is the hot-core (VPN keys, payment secrets, AI gateway) and operational expertise — not the license. First-mover advantage and brand trust matter more than legal restrictions at this stage.

**Confidence level**: High

---

### 2. Akash provider-failure RTO target

**Decision**: **5 minutes P95 RTO**, 15 minutes P99 RTO, zero data loss (RPO = 0 for committed transactions). The SDL manifest runs two persistent replicas in different Akash providers behind the Akash SDL `expose` load-balancer directive; on provider failure, the surviving replica serves traffic while Akash re-schedules the failed lease.

**Rationale**: Akash lease failover is not instantaneous — the scheduler must detect provider failure, close the lease, open a new bid, and re-deploy the container. Observed community reports show 2–8 minute recovery depending on provider availability and bid pricing. Sub-30-second RTO would require a hot warm-standby VPS running in parallel (doubling compute cost, undermining the 60%+ cost-reduction target in SC-002). 5 minutes is the sweet spot: long enough for Akash's native recovery, short enough that in-flight orders held in `pending_payment` survive (BTCPay invoice windows are 15 minutes; Stripe/PayPal webhook retries start at 1 minute with exponential backoff). No in-flight order is lost because the order state machine persists to Postgres on the hot-core, not on the Akash compute node.

**Alternatives considered**:
- **30 seconds P95**: Requires a persistent hot-standby VPS alongside Akash at all times. This defeats the cost-reduction thesis (you're paying Akash + a VPS simultaneously). Only justified if we had sub-second SLA commitments to enterprise customers — we don't.
- **1 hour P95**: Acceptable for batch workloads but not for a customer-facing storefront where checkout is time-sensitive. Customers will abandon carts after ~2 minutes of unresponsiveness. Also exceeds BTCPay invoice settlement windows.
- **No explicit RTO (best-effort)**: Fails SC-011 and provides no operational accountability. Unacceptable for a commerce platform handling real payments.

**Risk**: If both Akash providers fail simultaneously (region-wide outage), RTO extends until a third provider bids. Mitigation: SDL geo-diversity constraint requiring providers in at least 2 distinct datacenter operators; VPS-based warm-standby script that can be activated manually within 10 minutes for catastrophic Akash outage. The hot-core (Postgres primary) remains on dedicated Hetzner, unaffected by Akash failures.

**Confidence level**: Medium — relies on Akash's scheduler behavior which may change; validate with controlled provider-kill drills in Phase 3.

---

### 3. Legacy retention period (FR-040)

**Decision**: **1 year read-only** for the legacy `undrlla` deployment post-cutover. After 1 year, produce a final archive (SQL dump + static HTML export of customer order history) and shut down the legacy server. The archive is retained in cold storage for 7 years to satisfy potential tax/legal discovery obligations.

**Rationale**: GDPR does not mandate a minimum retention period for customer data, but tax regulations in operating jurisdictions typically require 3–7 years of financial records. 1 year of read-only access covers the vast majority of customer inquiries about historical orders. The 7-year cold archive covers legal discovery without keeping a running server. The v2 migration tool (FR-037) imports all historical data into Medusa, so the read-only legacy is a convenience layer, not the system of record.

**Alternatives considered**:
- **6 months**: Too short for tax audits and customer disputes that reference legacy order numbers. Some payment dispute windows (chargebacks) extend to 6 months; having the legacy available through that period prevents data-gap incidents.
- **Forever (indefinite read-only)**: Operational burden of maintaining a running Next.js + Prisma + Postgres stack indefinitely. Security patches, dependency rot, server costs. Not sustainable for a small team.
- **Immediate shutdown after migration**: Reckless. No fallback if the migration tool has a gap discovered post-cutover. Would require re-importing from database backups — possible but slow and stressful during an incident.

**Risk**: A legal hold or regulatory inquiry could require access to the live legacy system beyond 1 year (e.g., a tax audit referencing the exact legacy schema). Mitigation: the SQL dump preserves the full schema; a read-only Postgres instance can be spun up from the dump within 30 minutes if needed. The 7-year cold retention covers this.

**Confidence level**: High

---

## B) Technical Research

### 1. Medusa v2 multi-tenant pattern

**Decision**: Use a **single Medusa instance with `tenant_id` column on every customer-scoped table**, enforced at two layers: (1) a MikroORM Subscriber that injects `tenant_id` into every query context for Medusa Custom Modules (DML is mandatory in Medusa v2 modules — Prisma cannot be used inside them), and (2) a Prisma Client extension for standalone packages (migration-tool, vpn-provisioner, install-cli, federation-protocol) that are not Medusa modules. Postgres Row-Level Security (RLS) policies serve as a defense-in-depth layer. Medusa Sales Channels map 1:1 to tenants for product visibility, pricing, and payment-provider scoping.

**Rationale**: Schema-per-tenant adds massive operational complexity (N migration runs per deploy, cross-tenant analytics require federated queries). Database-per-tenant is even worse for a small team. Shared-schema with `tenant_id` is the industry-standard pattern used by Shopify, BigCommerce, and Medusa's own recommended multi-tenant guidance. RLS at the Postgres level provides the safety net required by FR-009 (no route handler may bypass the tenant filter). Medusa v2 Custom Modules use DML (Data Model Language) backed by MikroORM — Prisma cannot be used inside Medusa module code, making a MikroORM Subscriber the only viable enforcement mechanism at the module level. Standalone packages (migration-tool, vpn-provisioner, install-cli, federation-protocol) remain Prisma-based and use a Prisma Client extension for tenant scoping.

**Alternatives considered**:
- **Schema-per-tenant**: Each tenant gets their own Postgres schema. Clean isolation but N× migration complexity. Unmanageable beyond ~20 tenants. Rejected for the hybrid tenancy model where we expect 1–10 tenants for the foreseeable future.
- **Database-per-tenant**: Maximum isolation. Requires connection pooling per tenant, cross-tenant admin queries are painful. Only justified for enterprise compliance requirements we don't have.
- **Medusa native multi-store** (if it ships): Medusa has discussed multi-store support. When/if it ships, we migrate the `tenant_id` layer to the native primitive. Our pattern is designed to be forward-compatible with that migration.

**Risk**: A developer adds a new module or endpoint and forgets the `tenant_id` filter, causing a cross-tenant data leak. Mitigation: integration test suite includes a "tenant-scope probe" that authenticates as tenant A and asserts 404 on tenant B's resources for every endpoint. CI runs this probe automatically.

---

### 2. Akash SDL with Postgres persistent volumes

**Decision**: **Postgres primary runs on the centralized hot-core (dedicated Hetzner)**, NOT on Akash. The Akash deployment runs only stateless application containers (Medusa backend, Next.js storefront, OmniRoute sidecar, Redis cache). Postgres connection strings point to the hot-core primary. This eliminates the persistent-volume reliability problem entirely — Akash providers are ephemeral by design, and betting e-commerce state on Akash persistent volumes is irresponsible.

**Rationale**: Akash persistent volumes have improved but remain provider-dependent — a provider going offline means the volume may not be re-attachable to a different provider in a timely way. For a commerce platform where every order is money, this is an unacceptable risk. The hot-core Hetzner server has NVMe RAID, automated backups (pg_dump + WAL archiving to S3), and is under our full control. Akash compute is stateless and disposable — exactly what it's good at. This aligns with the Hybrid architecture's L4 layer (hot-state on hardened infrastructure).

**Alternatives considered**:
- **Postgres on Akash with persistent volumes**: Possible via Akash's persistent storage SDL declarations. Risky because volume migration between providers is not guaranteed. A provider failure could mean data loss or extended downtime waiting for volume re-attachment.
- **Postgres on Akash with Patroni streaming replication**: Adds operational complexity for a problem we've already solved with dedicated hardware. Two replicas on two providers doubles cost and adds cross-provider replication latency.
- **Managed Postgres (Supabase / Neon) as primary**: Viable but introduces a third-party dependency for the most critical data store. Also, keeping VPN master keys and payment data on a third-party DB requires additional encryption layers. The hot-core approach keeps everything under direct control.

**Risk**: Network latency between Akash compute nodes and the hot-core Postgres. If Akash deploys to a US provider while Hetzner is in EU, query latency could exceed the SC-007 budget (P95 ≤1500ms checkout). Mitigation: SDL jurisdiction filter ensures Akash compute also runs in EU (GDPR-compatible providers), keeping network hops within Europe.

---

### 3. OmniRoute integration mode

**Decision**: Deploy OmniRoute as a **sidecar container** in every deployment topology (Akash, docker-compose, VPS). The Medusa backend and Next.js storefront communicate with OmniRoute via `http://omniroute:20128` (Docker network) or `http://localhost:20128` (local dev). A thin TS SDK (`packages/omniroute-client/`) wraps the HTTP API, providing typed request/response, retry logic, and tenant-aware key resolution. The SDK resolves which AI tier (dev/paid/BYOK) to use per-request based on the authenticated tenant and user context.

**Rationale**: OmniRoute already lives in the monorepo at `underhelpers/under-ai-helpers/`. Sidecar deployment is the simplest topology — no external gateway dependency, no network egress cost, co-located with the application for minimal latency. The SDK ensures type safety and centralizes the tier-resolution logic (checking if a customer has a BYOK key vault entry, falling back to platform-paid tier if not). Constitution Principle I (TS-native) mandates a TS SDK, not raw HTTP calls scattered across modules.

**Alternatives considered**:
- **OmniRoute as external hosted service**: Adds a network hop, egress cost, and a single point of failure outside our control. Defeats the "sidecar" design that OmniRoute was built for.
- **Direct provider calls (OpenAI/Anthropic SDK) without OmniRoute**: Loses the unified gateway benefits — no fallback routing, no unified metering, no BYOK key injection. Would require reimplementing what OmniRoute already provides.
- **OmniRoute as a Medusa Module**: Possible but overly coupled. OmniRoute serves both the Medusa backend and the Next.js storefront; embedding it in Medusa would make storefront access awkward.

**Risk**: OmniRoute sidecar crash leaves the AI surface unavailable. Mitigation: health-check endpoint with automatic container restart (Docker restart policy `unless-stopped`). Degrade gracefully: PC-builder advisor shows "AI temporarily unavailable" (edge case requirement), support agent falls back to static FAQ responses, content/SEO batch retries on next schedule.

---

### 4. BTCPay Server Medusa plugin

**Decision**: Build a **custom Medusa v2 Payment Provider Module** for BTCPay Server, starting from the existing community `medusa-payment-btcpay` plugin as a reference but rewriting for Medusa v2's payment provider interface (`AbstractPaymentProvider`). The module supports: invoice creation, webhook-based settlement confirmation, refund initiation, and partial payment handling. Integration tested against a self-hosted BTCPay Server instance in the dev docker-compose stack.

**Rationale**: BTCPay is critical for crypto-native customers and is a first-class payment rail in FR-003. The community plugin targets Medusa v1 and is unmaintained for v2. Rather than forking a stale plugin, writing a fresh v2 Payment Provider Module gives us full control over the webhook lifecycle, error handling, and the edge case where a crypto payment confirms after the refund window (spec edge case #10). Medusa v2's payment provider interface is well-documented and a single provider takes ~1 week to implement.

**Alternatives considered**:
- **Fork and upgrade the community plugin**: The v1→v2 API surface changed significantly (workflow engine, payment session model). Forking would mean rewriting 70% anyway while carrying stale abstractions. Clean-slate is faster.
- **Manual payment method (mark-as-paid via admin)**: Already supported for bank transfers. Not acceptable for crypto where customers expect automatic confirmation.
- **Third-party crypto payment processor (Coinbase Commerce / NOWPayments)**: Introduces custody risk and additional KYC requirements. BTCPay is self-hosted and non-custodial — aligned with the decentralization thesis.

**Risk**: BTCPay Server API changes between versions could break the webhook handler. Mitigation: pin BTCPay Server version in docker-compose; version-lock the plugin against tested BTCPay versions; integration tests run against the pinned version in CI.

---

### 5. WireGuard/AmneziaWG/Xray provisioning patterns

**Decision**: Port the legacy SSH-based provisioning to a **worker-based pattern using Hatchet** (see topic 8). The VPN provisioning worker subscribes to `order.payment_captured` events, selects a VPNServer from the pool (capacity-aware, jurisdiction-matched), allocates a peer IP from the pool via an atomic Postgres `UPDATE ... WHERE allocated = false LIMIT 1 RETURNING *` (race-safe per FR-020), generates the peer config, pushes it to the VPN server via SSH (ssh2 library, ported from legacy), and stores the peer record. On failure, the worker rolls back (releases the IP, marks the order line item for retry). Config encryption uses AES-256-GCM as in legacy.

**Rationale**: The legacy provisioning is battle-tested but tightly coupled to BullMQ and the legacy Next.js monolith. Porting the SSH+ssh2 logic cleanly into a Hatchet worker gives us retry policies, DAG orchestration (provision → encrypt → notify are sequential steps), and observability out of the box. The atomic IP allocation SQL is the correct primitive for race-safe pool management — it was validated in the legacy codebase and handles concurrent orders for the same server.

**Alternatives considered**:
- **API-based provisioning (WireGuard REST API / AmneziaWG API)**: WireGuard has no native REST API. AmneziaWG and Xray can be managed via their respective APIs, but SSH remains the universal control plane. SSH also lets us push config files directly, which is simpler than maintaining API client libraries for 3 different VPN technologies.
- **Agent-based provisioning (install a daemon on each VPN server)**: Adds a deployment artifact to every VPN server. SSH is already running and requires zero additional software on the server side. Simpler operational model.
- **Keep BullMQ workers unchanged**: BullMQ works but lacks the DAG orchestration and built-in observability of Hatchet. The port is a clean-rewrite opportunity.

**Risk**: SSH connection failures to VPN servers during provisioning leave the order in a limbo state. Mitigation: Hatchet retry policy (3 attempts with exponential backoff) + dead-letter queue for manual ops intervention + monitoring alert on stuck orders.

---

### 6. GDPR-jurisdiction Akash provider filter

**Decision**: Use **Akash SDL placement constraints** with the `x-akash` extension to filter providers by geographic attributes. Maintain a **hardcoded allow-list of Akash provider attributes** (country codes corresponding to EU/EEA + UK + Switzerland + countries with EU adequacy decisions). The SDL manifest includes an `attributes` constraint matching these jurisdictions. Additionally, a startup validation script in the Medusa backend cross-checks the deployed provider's reported jurisdiction against the allow-list and refuses to start if the constraint is not met.

**Rationale**: Akash SDL supports `placement.constraints` that match against provider attributes including geographic location. This is the native mechanism for jurisdiction control. A hardcoded allow-list (checked into `infra/akash/jurisdictions.ts`) is auditable, version-controlled, and can be updated when new adequacy decisions are granted. The startup validation prevents a misconfigured SDL from silently accepting a non-GDPR provider.

**Alternatives considered**:
- **Dynamic jurisdiction lookup via external API**: Adds a runtime dependency and a potential failure point. The list of GDPR-equivalent jurisdictions changes slowly (years between new adequacy decisions). Hardcoded is simpler and more reliable.
- **Manual provider selection by operator**: Error-prone; operator could accidentally select a US-based provider. Automation is safer than trust.
- **Post-deployment audit (check after deployment)**: Reactive rather than preventive. If a non-GDPR provider is selected, customer data may already be processed there. Prevention via SDL constraint is the correct approach.

**Risk**: Akash provider attributes are self-reported — a provider could misreport their jurisdiction. Mitigation: supplement with IP geolocation verification of the provider's endpoint; flag discrepancies for manual review. This is a defense-in-depth measure, not a primary control.

---

### 7. Better-Auth org plugin vs SuperTokens vs Logto

**Decision**: Use **Better-Auth** with its organization plugin as the authentication layer. Better-Auth is TS-native (Constitution Principle I), MIT-licensed (Principle II), supports organization/team multi-tenancy natively, and plugs into the Medusa auth module via a custom auth provider. It handles: credential login (bcrypt migration from legacy), token versioning (legacy feature), SAML via Jackson integration, and session management.

**Rationale**: The spec requires migration of legacy NextAuth.js + bcrypt + token versioning + SAML (via Jackson). Better-Auth is the closest TS-native successor to NextAuth.js with active maintenance, first-party organization support (maps to our Tenant/Workspace model), and plugin-based extensibility. It avoids the NextAuth.js v5 / Auth.js migration pain by being a clean-slate TS-native solution. The organization plugin gives us hierarchical auth (tenant → workspace → user) that maps directly to the Tenant and Workspace entities.

**Alternatives considered**:
- **SuperTokens**: Strong multi-tenant auth, but requires a separate backend service (Java/Go core). Adds a non-TS runtime dependency, violating Principle I's spirit even if technically an infrastructure service. Also, the self-hosted version has operational overhead.
- **Logto**: OIDC-focused, good developer experience, but adds a separate .NET runtime service. Same Principle I concern as SuperTokens. Better suited for teams that want a turnkey OIDC provider, not for our tightly integrated TS-native stack.
- **Auth.js (NextAuth.js v5)**: Evolution of the legacy solution. However, the v4→v5 migration path is notoriously painful, the library is under-resourced, and multi-tenant/organization support is not first-class. Better-Auth is a forward-looking choice.
- **Clerk**: Proprietary, hosted-only. Violates decentralization-ready principle (requires external service dependency). Not self-hostable.

**Risk**: Better-Auth is a younger project (v1.x era) with potential API instability. Mitigation: pin version, write comprehensive integration tests around auth flows, budget migration time if breaking changes occur. The auth layer is thin enough that swapping is feasible (~1–2 weeks).

---

### 8. Hatchet vs BullMQ vs Trigger.dev

**Decision**: Adopt **Hatchet** as the background job orchestrator, replacing BullMQ from the legacy stack. Use Hatchet for all durable workflows: VPN provisioning, payment webhook processing, AI content/SEO batch generation, migration dual-write reconciliation, and notification dispatch. Simple fire-and-forget tasks (log persistence, metrics emission) can use lightweight `async` handlers since Hatchet's value is in durable, retry-aware DAG workflows.

**Rationale**: The legacy BullMQ stack works for simple queue processing but lacks native DAG orchestration (VPN provisioning is a multi-step sequential workflow: allocate IP → generate config → push to server → encrypt → notify → update order). BullMQ requires hand-rolling step chains with parent-child job relationships. Hatchet provides first-class DAG workflows with retry policies, timeout management, and a visual dashboard for observability. Hatchet is TS-native, MIT-licensed, and self-hostable (aligns with Constitution Principles I and II). Trigger.dev was also evaluated but is more SaaS-oriented and heavier for our use case.

**Alternatives considered**:
- **BullMQ (keep legacy)**: Familiar, no migration cost, but DAG orchestration is manual. Each multi-step workflow requires custom retry/recovery logic. The team already knows BullMQ's pain points from the legacy VPN provisioning chain.
- **Trigger.dev v3**: Strong DX, TS-native, but designed for event-driven integrations with third-party APIs (Slack, GitHub, etc.). Heavier than needed for internal workflows. Self-hosted mode exists but is less mature than Hatchet's.
- **Temporal**: Industry-standard durable workflow engine. However, it requires a Go runtime for the server and uses gRPC — violates Principle I (TS-native stack) for the infrastructure service. Would also add significant operational complexity.
- **Inngest**: TS-native event-driven orchestration. Good DX but less mature for long-running workflows. Hatchet's durability guarantees are stronger for workflows that take minutes (VPN SSH provisioning).

**Risk**: Hatchet is younger than BullMQ; community and ecosystem are smaller. If Hatchet development stalls, migration back to BullMQ or to another orchestrator is required. Mitigation: workflow definitions are declarative JSON/YAML — portable enough to re-implement. The interface boundary (Hatchet client → application code) is thin, so the swap cost is bounded.

---

### 9. Langfuse self-hosted multi-tenant tracing

**Decision**: Deploy **Langfuse self-hosted** (Docker container) as part of the docker-compose stack, behind the hot-core network boundary. Configure per-tenant projects in Langfuse so AI traces are isolated by tenant. The OmniRoute SDK emits OpenTelemetry spans with `tenant_id` as an attribute; a Langfuse OTel collector sidecar ingests these and routes them to the correct project.

**Rationale**: FR-030 mandates per-tenant AI tracing with cost attribution. Langfuse is the de facto open-source LLM observability tool with first-class support for multi-project isolation, cost tracking per trace, and evaluation workflows. Self-hosted deployment keeps all AI trace data (which may contain customer prompts with PII) within the hot-core boundary — never sent to an external SaaS. The OTel integration means we're not coupled to Langfuse-specific SDK calls; switching observability backends requires only changing the collector config.

**Alternatives considered**:
- **Langfuse Cloud (hosted)**: Offloads operational burden but sends customer AI traces (potentially containing PII from PC-builder prompts) to a third party. Violates the hot-secrets boundary principle.
- **Phoenix (Arize AI)**: Open-source LLM observability, good for experimentation but weaker on multi-tenant project isolation and cost tracking. Less mature than Langfuse for production use.
- **Custom tracing (pino + Loki + Grafana)**: We already have structured logs going to Loki. But building LLM-specific observability (token counts, latency per model, cost tracking, prompt/completion inspection) from scratch is months of work. Langfuse gives this out of the box.
- **Weights & Biases Weave**: Strong ML observability but overkill for LLM tracing and not designed for multi-tenant SaaS use cases.

**Risk**: Langfuse self-hosted requires its own Postgres database (or schema on the hot-core Postgres). This adds operational surface area. Mitigation: Langfuse's resource footprint is modest; it shares the hot-core Postgres with a separate schema.

---

### 10. OpenMeter + Killbill for AI-token metering

**Decision**: Use **OpenMeter** as the real-time event ingestion layer and **Killbill** as the billing engine. OmniRoute SDK emits a metering event to OpenMeter for every AI request (tenant, user, model, prompt-tokens, completion-tokens, cost-USD, use-case tag — per FR-012). OpenMeter aggregates these into per-tenant usage buckets. Killbill reads the aggregated usage at billing cycle boundaries and generates invoices (or reports usage to Stripe Metered as the payment collector).

**Rationale**: FR-013 requires a usage-event pipeline compatible with both OpenMeter and Killbill. OpenMeter is purpose-built for high-throughput metering with sub-second ingestion latency — it handles the "every AI request is a billable event" pattern efficiently. Killbill provides the billing engine (recurring subscriptions, usage-based tiers, invoicing) that OpenMeter lacks. Stripe Metered is the payment collection mechanism (the customer's card is charged), while Killbill owns the rating and invoice logic. This separation (OpenMeter for metering, Killbill for billing, Stripe for payment) keeps each layer simple and replaceable.

**Alternatives considered**:
- **Stripe Metered only (no OpenMeter/Killbill)**: Stripe's usage-based billing can handle metering directly. However, it locks billing logic into Stripe, which doesn't cover BTCPay or PayPal customers. Killbill is provider-agnostic.
- **Custom metering (Postgres counter table)**: Simple for low volume but doesn't scale to real-time aggregation across thousands of AI requests per minute. No built-in subscription management or invoicing.
- **Lago (open-source billing)**: Strong alternative to Killbill for usage-based billing. Evaluated but Killbill has more mature invoicing, multi-currency support, and payment-plugin architecture. Lago is younger and less proven for complex billing scenarios.
- **OpenMeter → Stripe Metered (skip Killbill)**: Viable for Stripe-only customers but doesn't generalize. Killbill abstracts the payment provider, which aligns with our multi-provider payment strategy.

**Risk**: The three-layer pipeline (OpenMeter → Killbill → Stripe/BTCPay) has integration surface area. A failure in any layer could cause billing gaps. Mitigation: OpenMeter events are immutable and replayable; Killbill reconciliation job runs daily to detect gaps; billing discrepancy alerts trigger manual ops review.

---

### 11. Hot-Core architecture

**Decision**: The hot-core is a **dedicated Hetzner server** (or OVH equivalent) running: (1) Postgres primary (all customer data, orders, VPN peer records, AI usage events), (2) Redis for session/cache, (3) Infisical self-hosted for secret management (KEK store), (4) Langfuse, (5) OpenMeter + Killbill. The hot-core is accessed via WireGuard VPN tunnel from the Akash compute nodes. All connections are mutually authenticated (mTLS or WireGuard PSK). The hot-core is NOT accessible from the public internet — only via the VPN tunnel from authenticated compute nodes.

**Rationale**: Constitution Principle VI mandates that payment secrets, VPN master keys, and KYC data reside exclusively on hardened infrastructure under direct operator control. A dedicated server provides: physical isolation, full disk encryption (LUKS), HSM-grade key storage (via Infisical + potential YubiHSM2), and predictable performance (no noisy-neighbor problem). Hetzner's EU data centers are GDPR-compliant and offer DDoS protection. The WireGuard tunnel ensures that even if an Akash compute node is compromised, the attacker cannot reach the hot-core without the tunnel credentials.

**Alternatives considered**:
- **Hot-core on Akash with TEE (SGX)**: Theoretically possible but Akash does not currently offer SGX/TEE instances in production. Even if it did, TEE adds latency and complexity. Dedicated hardware is simpler and more auditable.
- **Hot-core on AWS (RDS + Secrets Manager)**: Introduces AWS as a dependency, violating Constitution Principle V (decentralization-ready, no cloud-provider API lock-in). Also more expensive for the same performance.
- **Hot-core as a set of managed services (Supabase + Infisical Cloud + Stripe Metered)**: Fragments the trust boundary across multiple third parties. Each service is a potential leak vector for secrets. Consolidating on a single dedicated server under our control is simpler and more secure.

**Risk**: The hot-core is a single point of failure — if the Hetzner server goes down, all services lose database access. Mitigation: Hetzner automated backups (daily pg_dump + WAL archiving to S3-compatible storage), hot-standby replication to a secondary Hetzner server in a different data center (activated manually within RTO), monitoring with automatic alert on connectivity loss.

---

### 12. Federation interop protocol

**Decision**: Implement a **lightweight REST-based federation protocol** with three capabilities: (1) **Instance discovery** — each instance exposes `/.well-known/undrlla.json` with metadata (domain, operator contact, supported regions, catalog opt-in flag); (2) **Catalog sharing** — opted-in instances publish a read-only product feed via a public `/api/federation/catalog.json` endpoint (no auth required, rate-limited); (3) **Data portability** — the FR-036 data export endpoint produces a standardized JSON archive that any undrlla instance can import. No shared database, no cross-instance auth, no real-time sync. Federation is "loosely coupled by design."

**Rationale**: Full ActivityPub-style federation (like Mastodon) requires complex state synchronization, cross-instance authentication, and conflict resolution — months of engineering for unclear business value at this stage. The lightweight approach provides the three things that matter: operators can find each other (discovery), customers can browse a broader catalog (if operators opt in), and no one is locked in (data portability). This is the minimum viable federation that enables User Story 6 (community-operator onboarding) and the SC-004 target (≥5 community instances within 12 months).

**Alternatives considered**:
- **ActivityPub federation**: Industry standard for decentralized social. But ActivityPub's actor model, inbox/outbox protocol, and eventual-consistency semantics are designed for social feeds, not e-commerce. Adapting it for product catalogs and order flows would be a research project in itself.
- **Shared Postgres with cross-instance replication**: Maximum data consistency but requires shared trust and network connectivity between operators. Violates the independence principle (each operator owns their instance).
- **No federation protocol at all**: Each instance is fully standalone. Simple but misses the network-effect benefit (cross-instance catalog visibility, shared brand recognition). SC-004 becomes harder to achieve.
- **GraphQL federation (Apollo Federation style)**: Interesting but adds a runtime dependency (Apollo Gateway) and requires schema coordination across instances. Over-engineered for the "loosely coupled" goal.

**Risk**: The lightweight protocol may prove insufficient if community-operators want deeper integration (shared inventory, cross-instance orders). Mitigation: the protocol is versioned (`protocol_version: 1` in the well-known JSON). v1 ships with discovery + catalog + portability. v2 can add richer capabilities when demand emerges. The schema is designed to be backward-compatible.

---

## Summary Matrix

| # | Topic | Decision | Confidence |
|---|-------|----------|:----------:|
| A1 | Federation license (FR-034) | Pure MIT; monetize via managed hosting | High |
| A2 | Akash RTO target | 5 min P95, 15 min P99, RPO=0 | Medium |
| A3 | Legacy retention (FR-040) | 1 year read-only + 7 year cold archive | High |
| B1 | Medusa multi-tenant pattern | Shared schema + `tenant_id` + MikroORM Subscriber (Modules) + Prisma ext (standalone) + RLS | High |
| B2 | Akash Postgres strategy | Primary on hot-core; Akash is stateless | High |
| B3 | OmniRoute integration | Sidecar container + TS SDK | High |
| B4 | BTCPay Medusa plugin | Custom v2 Payment Provider Module | Medium |
| B5 | VPN provisioning pattern | Hatchet worker + SSH + atomic IP alloc | High |
| B6 | GDPR Akash provider filter | SDL placement + hardcoded allow-list | High |
| B7 | Auth layer | Better-Auth with org plugin | Medium |
| B8 | Job orchestrator | Hatchet (replaces BullMQ) | Medium |
| B9 | AI tracing | Langfuse self-hosted + OTel | High |
| B10 | AI token metering | OpenMeter + Killbill + Stripe | Medium |
| B11 | Hot-core architecture | Dedicated Hetzner + WireGuard tunnel | High |
| B12 | Federation protocol | Lightweight REST (discovery + catalog + portability) | Medium |

---

## Cross-Cutting Concerns

### Decisions that chain together

1. **Auth → Tenancy → ORM filter → RLS**: Better-Auth org plugin provides the tenant context → MikroORM Subscriber injects `tenant_id` for Medusa Modules (DML entities) + Prisma extension injects for standalone packages → Postgres RLS enforces at the DB level. These layers must be tested as a unit.

2. **Hatchet → VPN provisioning → Hot-core**: Hatchet engine and workers run on Akash (revised per claude v3 F14); engine state-DB on hot-core Postgres via standard TCP over WireGuard. Workers SSH into VPN servers on the hot-core. The WireGuard tunnel between Akash and hot-core carries Postgres TCP + SSH — no gRPC tunnel complexity.

3. **OmniRoute → OpenMeter → Killbill → Stripe**: Every AI request flows through OmniRoute → emits a metering event to OpenMeter → Killbill aggregates at billing cycle → Stripe collects payment. End-to-end integration test must verify the full chain.

4. **SDL jurisdiction → Akash compute → Hot-core Postgres**: GDPR filter ensures Akash compute is in EU → low-latency connection to Hetzner hot-core → SC-007 checkout latency budget is met.

### Open items for Phase 1 validation

- **Better-Auth + Medusa auth provider integration**: Not a documented pattern. Requires a proof-of-concept in Phase 0 to validate the adapter.
- ~~**Hatchet on Akash**~~: RESOLVED per claude v3 F14 — engine relocated to Akash; standard TCP to hot-core state-DB replaces gRPC tunnel requirement.
- **OpenMeter throughput at scale**: Validate that OpenMeter handles 1000+ events/minute without backpressure. Load test in Phase 1.
