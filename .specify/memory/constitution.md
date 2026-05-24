# undrlla v2 Constitution

## Core Principles

### I. TS-Native Stack (NON-NEGOTIABLE)

Single-stack TypeScript across backend (Medusa v2, Node 22 LTS), frontend (Next.js 16 App
Router), tooling (Hermes / undrestrator / OmniRoute). No Python, Ruby, or Go in the core
runtime. Shared types between back and front via `packages/shared-types/`. Infrastructure
services (MinIO, Grafana, Loki) may run non-TS processes but are not part of the core
application code.

Violation examples: adding a Django service, writing migration scripts in Python, using
Go for a sidecar. All prohibited without constitutional amendment.

### II. MIT License Safety (NON-NEGOTIABLE)

Every direct runtime dependency must be MIT / Apache 2.0 / BSD / ISC / similar permissive
license. AGPL / BSL / SSPL / custom proprietary restrictions are prohibited in core
application code. Infrastructure-only services (MinIO AGPL, Grafana AGPL) are acceptable
when deployed as isolated containers and not embedded as library dependencies in the TS
application.

Before adding any dependency: verify license via `license-checker` or `npm info <pkg>
license`. If license is AGPL or unknown — block and escalate to maintainer.

### III. Plan-Driven Development

Every feature — no matter how small — uses the speckit pipeline before implementation:
`/speckit.start -> .specify -> .clarify -> .plan -> .tasks -> .analyze -> .implement`.
No "just-do-it" code in `src/` or `apps/` without a corresponding spec in `specs/<slug>/`.

The only exceptions are: hotfixes for P0 production incidents (document after the fact in
a `hotfix/` spec within 48 hours) and dependency version bumps.

### IV. AI-Augmented Velocity

Hermes + OmniRoute + undrestrator are first-class development tools, not afterthoughts.
Code generation via undrestrator ensemble, test scaffolding via Hermes, review-loops via
cross-AI gate are all expected and encouraged. AI-generated code must pass the same review
and quality gates as human-written code — AI authorship is never an excuse for skipping
tests or code review.

OmniRoute sidecar must be running in every dev environment. If it is not running, the AI
advisor and BYOK paths degrade gracefully but this must be a monitored degraded state, not
a silent failure.

### V. Decentralization-Ready

Every component must be deployable to:
  (a) Akash Network via an SDL manifest in `infra/akash/`,
  (b) any Linux VPS via `docker-compose.yml` at repository root,
  (c) community-operator self-hosted via the 1-command install script.

No assumed dependency on a specific cloud provider API (no AWS SDK calls in core, no
GCP-specific primitives). Object storage must use S3-compatible interface (MinIO locally,
any S3-compatible provider in production).

Exception: the centralized hot-core services (payment vault, VPN key store, KYC vault)
are intentionally NOT deployable to Akash — this is by design per Decision 2.

### VI. Hot-Secrets Boundary (NON-NEGOTIABLE)

Payment-provider secrets (Stripe secret key, PayPal client secret, BTCPay webhook secret),
VPN master keys (WireGuard private keys, AmneziaWG PSK, Xray UUID secrets), and KYC vault
data (identity documents, tax IDs) MUST reside exclusively on the centralized hardened
hot-core infrastructure.

They MUST NOT appear in:
  - Akash SDL manifests or environment variables passed to Akash deployments
  - Community-operator configuration files or docker-compose files
  - Logs, stack traces, or error responses
  - Git commits or CI environment variables

Enforced by: CI secret-scan (gitleaks), ORM-level log filtering, quarterly production
probes. Any violation is a P0 incident requiring immediate key rotation.

AES-256-GCM encryption at rest is mandatory for all secrets stored in the database.
Key Encryption Keys (KEK) must be sourced from Infisical or a hardware HSM — never
hardcoded in application config files.

### VII. Cross-AI Review Gate

`/speckit.implement` blocks until:
  1. `/speckit.analyze` produces a PASS verdict on the implementation plan.
  2. At least 2 external reviewer PASSes from distinct AI providers (Codex / Gemini /
     Copilot / Antigravity / OpenCode).

Override is permitted only with a logged justification in `specs/<slug>/reviews/override.md`
signed by the maintainer. The justification must state: which gate is bypassed, why, and
what compensating controls apply.

This gate is non-negotiable for all features that touch: payment processing, VPN
provisioning, authentication, tenant isolation, or any path that handles secrets.

## Additional Constraints

### Performance Budgets
- P50 checkout latency ≤ 300ms; P95 ≤ 1500ms (SC-007)
- AI advisor first-token P95 ≤ 8s for PC-builder briefs (SC-006)
- Token-metering pipeline overhead < 5% of upstream provider cost (SC-005)
- Akash provider-failure RTO: 5 minutes P95 (resolved in research.md)

### Security Posture
- Zero PII in logs or error responses (SC-009)
- Zero secrets outside hot-core (SC-010)
- Tenant-scope isolation: 404 on cross-tenant access attempts, never 403 (spec edge case)
- RLS policies at Postgres level as defense-in-depth beyond ORM tenant filter

### Compliance Scope
- GDPR (EU/EEA + UK + Switzerland + EU-adequacy countries) — mandatory
- RU market: out of scope; FR-028a provides legacy customer offboarding
- Akash providers: GDPR-compatible jurisdictions only (SDL geo-filter enforced)

## Development Workflow

### Quality Gates (per PR)
1. `pnpm validate` passes (typecheck + lint + unit tests)
2. Integration tests green (docker-compose test environment)
3. Secret scan (gitleaks) zero findings
4. No new AGPL/BSL dependencies introduced
5. Spec exists for any new feature (Constitution Principle III)

### Review Process
- All PRs require: author self-review + at least 1 human review
- Features touching payment/VPN/auth: additional Cross-AI Review Gate (Principle VII)
- Architecture changes: update `specs/main/architecture.md` in the same PR

### Deployment Gates
- Staging must pass 100% of legacy regression tests (Phase 1 milestone)
- Production cutover requires dual-write window (FR-038) + reconciliation report

## Governance

This Constitution supersedes all other project conventions. Amendments require:
  1. A documented proposal in `specs/constitution-amendment/spec.md`
  2. Maintainer approval (signed commit)
  3. Migration plan for any teams or tooling affected

All PRs and reviews must verify compliance with applicable principles. Complexity
violations (e.g., adding a 4th runtime language) must be justified in the feature spec's
Complexity Tracking section.

**Version**: 1.0.0 | **Ratified**: 2026-05-24 | **Last Amended**: 2026-05-24
