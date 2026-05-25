# SpecKit Review: 001-init

**Reviewer**: antigravity
**Reviewed at**: 2026-05-24T19:25:00Z
**Commit**: HEAD
**Artifacts reviewed**: spec.md, plan.md, tasks.md, constitution.md

## Summary

The specification and plan are extremely detailed and well-structured, providing a clear path for the rewrite. However, there is a severe architectural disconnect regarding the database ORM choice which will break transaction integrity, and a critical security flaw where the decentralized deployment model contradicts the strict "Hot-Secrets Boundary" defined in the constitution. Additionally, User Story 7 is entirely missing from the implementation plan.

## Findings

| ID | Severity | Area | Finding | Recommendation |
|---|---|---|---|---|
| F1 | CRITICAL | Architecture | **Split-brain ORM breaks transactions**: `plan.md` specifies Medusa v2 but mandates Prisma for custom modules (T002, T011). Medusa v2 uses its own DML and MikroORM/Knex. Using Prisma alongside Medusa core means two separate DB connection pools and disjoint transaction contexts. A Medusa workflow cannot atomically commit a Medusa `Order` and a Prisma `VPNPeer`. This will lead to data corruption. | Drop Prisma. Use Medusa v2's native DML (Data Modeling Language) and module data access patterns for all custom entities (Tenant, VPN, AI) to ensure cross-module transaction integrity. |
| F2 | CRITICAL | Security | **Constitution VI Violation via Akash**: FR-024 and Principle VI mandate that payment secrets and VPN keys reside *exclusively* on the hot-core. T053 and T069 deploy Medusa/Hatchet to Akash and inject these secrets into Akash memory via Infisical. A malicious decentralized provider can dump RAM and steal the keys, violating the security perimeter. | Medusa workers handling sensitive operations (payment capture, VPN SSH) MUST run on the hot-core. Akash should only run the Next.js storefront and a stateless/secretless Medusa API, OR build a secure proxy on the hot-core that Akash calls to execute sensitive actions. |
| F3 | HIGH | Completeness | **Missing US7 (Ops Automation)**: `spec.md` defines US7 and FR-017 (undrestrator pipelines for ticket triage). However, this user story is completely omitted from `plan.md` milestones and `tasks.md`. | Add milestones and tasks for US7 (likely to Phase 2 or a new Phase), or explicitly document it as deferred to a post-MVP phase. |
| F4 | HIGH | Edge Case / Ops | **WireGuard `NET_ADMIN` on Akash**: The plan relies on a WireGuard tunnel between Akash and Hetzner (T049, T052). Running WireGuard in a container requires `CAP_NET_ADMIN`. Akash providers may restrict this capability, breaking the entire database connection. | Validate `NET_ADMIN` availability on Akash. If unavailable, pivot to a userspace tunnel (e.g., Tailscale userspace routing, Cloudflare Tunnels) or application-level mTLS that doesn't require kernel network capabilities. |
| F5 | MEDIUM | Edge Case | **Legacy SHKeeper Migration**: `spec.md` defers SHKeeper support, but FR-004 requires 100% of legacy payments to be migrated. T026 doesn't specify how to map legacy SHKeeper transactions, risking migration crashes. | Create a dummy `legacy-shkeeper` payment provider module in Medusa v2 purely to hold migrated historical data, ensuring referential integrity. |
| F6 | MEDIUM | Performance | **Cross-Datacenter DB Latency**: Medusa on Akash connecting to Postgres on Hetzner over a VPN will suffer connection overhead, jeopardizing the P50 ≤300ms checkout goal (SC-007). | Deploy a connection pooler (e.g., PgBouncer) on the hot-core to manage connection overhead from Akash instances. |

## Alternative approaches considered

- **Secrets Proxy vs. Split Deployment**: To solve F2, instead of running Medusa on the hot-core, you could deploy a lightweight "Secrets Execution Proxy" on the hot-core. Medusa (on Akash) sends an intent (e.g., "Provision VPN for IP X") to the proxy. The proxy holds the SSH keys and actually runs the command. This keeps Medusa fully decentralized while strictly maintaining the hot-secrets boundary.
- **Tailscale Userspace vs WireGuard**: To solve F4, Tailscale offers a userspace networking mode that doesn't require `NET_ADMIN` or `/dev/net/tun`, which is significantly more robust for decentralized, untrusted container environments like Akash compared to kernel-level WireGuard.

## VERDICT

```yaml
verdict: CRITICAL
reviewer: antigravity
reviewed_at: 2026-05-24T19:25:00Z
commit: HEAD
critical_count: 2
high_count: 2
medium_count: 2
low_count: 0
```
