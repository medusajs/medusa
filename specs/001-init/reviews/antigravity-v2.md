# SpecKit Review: 001-init (Iteration 2)

**Reviewer**: Antigravity (Agent)
**Date**: 2026-05-25
**Target**: `specs/001-init` (spec.md, plan.md, tasks.md)
**Verdict**: **CRITICAL** 🛑 (Implementation is blocked)

---

## Executive Summary

This is the second review of the `001-init` artifacts. The authors have made significant progress in addressing the findings from the previous review:
- **US7 (Ops Automation)** has been explicitly deferred in both `spec.md` and `tasks.md` (T083), resolving the scope discrepancy.
- **ORM Split-Brain** has been largely mitigated by moving Medusa custom modules to use native Medusa DML and MikroORM (T002a, T011), while isolating Prisma to standalone tools like the migration CLI (T002b).

However, **Constitution VI (Hot-Secrets Boundary)** is still violated by the deployment topology. Additionally, there are lingering inconsistencies in `plan.md` regarding Prisma. 

Implementation remains **BLOCKED** until the deployment topology is adjusted to keep sensitive workers off Akash, or an explicit override is invoked.

---

## Findings

### 1. CRITICAL | Constitution VI Violation (Secrets in Akash RAM)
* **Domain**: Architecture / Security
* **Artifacts**: `tasks.md` (T049, T053), `spec.md` (FR-024)
* **Description**: The updated plan attempts to fix the secret leakage to Akash by stating secrets are "injected at runtime via Infisical agent; never in env vars or config files on Akash" (T053). However, this fundamentally misunderstands the threat model of decentralized hosting. A decentralized node provider (Akash) has root access to the physical machine and hypervisor. If a secret is injected into the container's RAM at runtime, the provider can easily dump the memory and extract the Stripe Secret Key, VPN Master Keys, and BYOK AI keys. As long as Medusa runs on Akash and processes payments or VPN configs, it violates the Constitution VI rule: "Zero payment, AI, or VPN secret appears outside the encrypted hot core".
* **Recommendation**: 
  - Option A: Split the Medusa backend. Run the storefront-facing Medusa instance on Akash (stateless, no secrets), and run a dedicated Medusa worker instance on the Hetzner hot-core that processes payment webhooks, VPN provisioning workflows, and BYOK routing.
  - Option B: Drop Akash for the Medusa backend entirely, running only the Next.js storefront on Akash, while keeping the entire Medusa backend on the hot-core.
  - Option C: Provide a formal `--override-gate` constitutional exception if you accept the risk of malicious Akash providers stealing payment secrets.

### 2. MEDIUM | Lingering Prisma Inconsistencies in `plan.md`
* **Domain**: Documentation / Architecture
* **Artifacts**: `plan.md`
* **Description**: While `tasks.md` correctly separates Medusa DML (T002a) and Prisma (T002b), `plan.md` has not been fully updated. 
  - Line 21 still lists "Prisma (custom modules ORM)" as a primary dependency.
  - Line 129 shows `apps/medusa/prisma/schema.prisma` containing "VPN peers, AI events", which contradicts T002a where these are Medusa DML models.
* **Recommendation**: Clean up `plan.md` to accurately reflect the ORM strategy defined in `tasks.md`. Remove `apps/medusa/prisma/schema.prisma` from the directory tree and update the dependency description.

### 3. RESOLVED | Missing US7 (Ops Automation)
* **Status**: ✅ The spec explicitly defers US7 and FR-017 to a post-v2 feature, and T083 implements only the foundational scaffolding.

### 4. RESOLVED | Split-Brain ORM breaks transactions
* **Status**: ✅ The data layer has been updated to use Medusa DML for Medusa workflows, isolating Prisma to external tools. (Subject to the cleanup mentioned in Finding #2).

---

## Next Steps

1. Address the **CRITICAL** deployment topology flaw regarding Akash and secret handling.
2. Fix the minor documentation drift in `plan.md`.
3. Submit for a third review or invoke a constitutional override.
