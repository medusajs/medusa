# undrlla v2 Glossary

> Terms used across spec.md, plan.md, tasks.md, architecture.md, contracts/, and reviews/. Update this file when introducing new domain terms.

## Architecture & Infrastructure

- **hot-core**: Hetzner-hosted control plane — Postgres primary + Patroni standby + Hatchet workers handling sensitive operations (payments, VPN provisioning, BYOK key management). The "trusted boundary" where Principle VI applies.
- **edge layer** (post-v2): Optional pattern where Akash hosts thin HTTP receivers that forward signed payloads over WireGuard to hot-core processors. Currently NOT implemented — see Akash Secrets Boundary caveat in plan.md. Tracked as TD-001.
- **hot-secrets boundary**: Constitution VI rule — payment/AI/VPN secrets must not leave the hot-core. See plan.md Cross-Cutting Security for current compliance status (PASS-WITH-CAVEAT for v2 launch).
- **decentralized hosting**: Akash Network deployment of the storefront and stateless Medusa frontend instances. NOT used for secret-handling workloads.

## Services & Tooling

- **OmniRoute**: AI gateway sidecar (port `:20128`) that routes LLM requests across providers (OpenAI, Anthropic, OpenRouter, BYOK customer keys). Handles model selection, fallback, rate-limiting, and per-tenant quota enforcement. SDK contract: `specs/main/contracts/omniroute-sdk.md`.
- **undrestrator**: Internal orchestration layer for ops automation pipelines (US7, deferred to post-v2). Will handle ticket triage, customer-support routing, and operator alert grouping.
- **Hermes**: CLI agent used by the project for repo-code research and bulk file edits. Distinct from project runtime (Hermes is dev tooling).
- **Hatchet**: Job/workflow engine for background tasks (payment capture, VPN provisioning, reconciliation, scheduled rotations). Runs on hot-core.
- **Better-Auth**: Auth library for sessions/cookies/organization-plugin. PoC in T008; fallback to custom JWT reserved as T008b.
- **MikroORM via Medusa DML**: The ORM Medusa v2 Custom Modules MUST use (per Medusa architecture constraint). Used for all entities living inside a Medusa Module (Tenant, Workspace, VPNPeer, AIEvent, etc.).
- **Prisma**: Used for standalone packages only (`packages/migration-tool/`, `packages/undrestrator/`). NOT used inside Medusa Custom Modules.
- **Infisical**: Secret manager that injects runtime secrets into deployed containers. See Akash Secrets Boundary caveat for residual-risk discussion.

## Tenancy & Multi-tenancy

- **Tenant**: Top-level organization entity. Maps to Better-Auth organization (or custom JWT subject if T008b activated). Holds billing relationship + tenant-scoped resources.
- **Workspace**: Sub-tenant grouping (initial state: 1:1 with Tenant). Reserved for future hierarchical org structures. See data-model.md Workspace section.

## AI tiers (FR-011)

- **dev tier**: Free / heavily-rate-limited; uses pooled provider keys with strict per-tenant quota. For evaluation and low-volume use.
- **paid tier**: Platform-managed keys with metered billing (markup model TBD — see deferred N11). Customer pays platform; platform pays providers.
- **BYOK tier**: Customer brings their own provider keys. Platform stores encrypted (KEK + envelope encryption), routes via OmniRoute. Platform takes no markup but charges hosting/routing fee.

## Migration & Operations

- **dual-write window**: Phase 4 period where writes flow to both legacy V1 and Medusa v2. Reconciliation runs every 15 min via Hatchet. See `reconciliation-algorithm.md`.
- **cutover**: Phase 4 final step — v2 becomes source-of-truth; legacy goes read-only. Day 1+ discrepancies surface via monthly audit jobs.
- **reconciliation_journal**: Database table logging every dual-write reconciliation pass (entity ID, bucket, action taken, operator if manual). See `reconciliation-algorithm.md`.
- **legacy-shkeeper**: Sentinel marker (in payment metadata, NOT a separate enum value) flagging V1-imported SHKeeper transactions as historical/read-only. See T026 + data-model.md PaymentTransaction.

## Federation (post-v2 vision)

- **federation**: Multi-instance undrlla deployments cooperating over WireGuard + signed protocol. See `specs/main/contracts/federation-protocol.md`. Out-of-scope for v2 launch.
