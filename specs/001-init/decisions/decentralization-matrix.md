# Decision Record: Decentralization & Hosting Model

**Status**: Accepted
**Date**: 2026-05-24
**Drivers**: "Anyone can help host the apps"; compute cost reduction vs. AWS; censorship resistance; distribution leverage via community-operated instances; without compromising payment-secret or VPN-master-key safety.

## Candidates evaluated

- **A — Pure Akash** (DePIN compute marketplace only) — All workloads deployed to Akash Network via SDL manifest; persistent storage via Akash; everything in the decentralized cloud.
- **B — Federation only** (Mastodon-style) — Open-source the full stack under MIT; community-operators self-deploy independent branded instances on any hosting they choose; no central infrastructure of our own.
- **C — Hybrid** (Akash + Federation + Centralized Hot Core) — Primary instance on Akash for compute; open-source for community-operators; a small centralized hardened core retains payment secrets, VPN master keys, KYC vault — never on Akash.
- **D — Status quo** (Centralized Hetzner / AWS) — Single-operator centralized infrastructure; no decentralization; no community-operator path.

## Criteria & weights

| # | Criterion | Weight | Why important |
|---|-----------|:------:|---------------|
| 1 | Production readiness | 10 | The solution must actually work in production with paying customers |
| 2 | Cost reduction vs. AWS baseline | 9 | DePIN's main material advantage; must measurably beat hyperscalers |
| 3 | "Anyone can help host" — barrier-to-entry for an external host | 10 | Direct mapping to the user's stated goal of decentralization |
| 4 | Docker / K8s compatibility (minimum stack rework) | 9 | undrlla is already containerized — avoid total rewrite |
| 5 | Compliance / jurisdiction control | 8 | GDPR (EU), ФЗ-152 (RU), and similar require provable data location |
| 6 | State persistence (Postgres / Redis durability) | 9 | E-commerce cannot tolerate state loss |
| 7 | Network / CDN performance | 7 | Customer-facing latency matters; affects conversion |
| 8 | Crypto / billing UX (do customers need wallets?) | 7 | Crypto onboarding is a real conversion-killer for B2C |
| 9 | Vendor risk (single-project shutdown risk) | 7 | Project shutdown should not kill our business |
| 10 | Community / distribution model viability | 8 | Federation is a marketing & distribution lever, not just hosting |
| 11 | Hot-secrets isolation (payment / VPN keys) | 10 | Non-negotiable security boundary |
| 12 | Documentation / onboarding burden for external operators | 6 | Lower-priority but real cost over time |

**Σ weights = 100**

## Scoring matrix (1–10 per cell)

| # | Criterion (weight) | Pure Akash | Federation only | **Hybrid** | Status quo |
|---|--------------------|:----------:|:---------------:|:----------:|:----------:|
| 1 | Production readiness (10) | 9 | 9 | 8 | **10** |
| 2 | Cost vs. AWS (9) | **10** | 5 | 9 | 5 |
| 3 | Anyone-can-host (10) | 9 | **10** | **10** | 1 |
| 4 | Docker/K8s compat (9) | **10** | **10** | **10** | **10** |
| 5 | Compliance / jurisdiction (8) | 6 | 9 | 9 | **10** |
| 6 | State persistence (9) | 7 | 9 | 9 | **10** |
| 7 | Network / CDN (7) | 6 | 6 | 8 | 8 |
| 8 | Crypto / billing UX (7) | 6 | 9 | 8 | **10** |
| 9 | Vendor risk (7) | 7 | **10** | 9 | 8 |
| 10 | Community / distribution (8) | 5 | **10** | 9 | 1 |
| 11 | Hot-secrets isolation (10) | 4 | 9 | **10** | **10** |
| 12 | Docs for operators (6) | 7 | 5 | 6 | n/a (set to 5 — no onboarding) |
| | **Σ weighted** | **766** | **853** | **887** | **735** |
| | **Average (÷100)** | 7.66 | 8.53 | **🥇 8.87** | 7.35 |

## Calculation traceability

**Pure Akash**: 9×10 + 10×9 + 9×10 + 10×9 + 6×8 + 7×9 + 6×7 + 6×7 + 7×7 + 5×8 + 4×10 + 7×6 = 90+90+90+90+48+63+42+42+49+40+40+42 = **766** → 766 ÷ 100 = **7.66**

**Federation only**: 9×10 + 5×9 + 10×10 + 10×9 + 9×8 + 9×9 + 6×7 + 9×7 + 10×7 + 10×8 + 9×10 + 5×6 = 90+45+100+90+72+81+42+63+70+80+90+30 = **853** → 853 ÷ 100 = **8.53**

**Hybrid**: 8×10 + 9×9 + 10×10 + 10×9 + 9×8 + 9×9 + 8×7 + 8×7 + 9×7 + 9×8 + 10×10 + 6×6 = 80+81+100+90+72+81+56+56+63+72+100+36 = **887** → 887 ÷ 100 = **8.87**

**Status quo**: 10×10 + 5×9 + 1×10 + 10×9 + 10×8 + 10×9 + 8×7 + 10×7 + 8×7 + 1×8 + 10×10 + 5×6 = 100+45+10+90+80+90+56+70+56+8+100+30 = **735** → 735 ÷ 100 = **7.35**

## Decision

**Hybrid (Akash + Federation + Centralized Hot Core)** selected with a 0.34-point margin over Federation-only and a 1.21-point margin over Pure Akash. Status quo finishes last because it scores a hard **1/10** on the explicit user goal (anyone-can-host).

### Why Hybrid won

- Only candidate that scores **≥9** on both "anyone-can-host" (10) and "hot-secrets isolation" (10) — the two highest-weighted critical-to-business criteria that pull in opposite directions
- Captures DePIN cost savings on compute (9/10) without paying the secret-leak risk (Pure Akash drops to 4/10 on this)
- Federation distribution channel (9/10) gives organic growth that Pure Akash cannot offer (5/10)
- State persistence (9/10) better than Pure Akash (7/10) because Postgres data lives on the centralized hardened core

### Why each candidate did not win

- **Federation only (8.53)** — strong on hot-secrets and community, but loses the Akash compute-cost win and the "we operate a flagship instance" credibility marker. Defers all infrastructure cost-savings to operators.
- **Pure Akash (7.66)** — best raw cost economics, but hot-secrets isolation at 4/10 is a deal-killer; running BTCPay merchant keys and WireGuard master keys on a stranger's hardware without TEE is unacceptable in 2026
- **Status quo (7.35)** — disqualifying on the user's primary stated goal (anyone-can-host = 1/10); also misses the cost savings and distribution lever

## Architecture summary

```
┌─────────────────────────────────────────────────────────────┐
│  L1: Open-source code (Federation-ready)                    │
│      MIT, install in 1 command, community-friendly           │
└─────────────────────────────────────────────────────────────┘
        ↓ (deploy by anyone, anywhere)
┌─────────────────────────────────────────────────────────────┐
│  L2: Deploy targets — operator choice                       │
│      • Akash Network (DePIN) — our primary instance         │
│      • Any VPS (Hetzner, OVH, …) — for conservative ops     │
│      • AWS / GCP — for enterprise community-operators       │
│      • Self-hosted on owned hardware                        │
└─────────────────────────────────────────────────────────────┘
        ↓ (our main instance + community instances)
┌─────────────────────────────────────────────────────────────┐
│  L3: Centralized "trust core" (our infra, optional layer)   │
│      • Public catalog index (cross-instance aggregator)     │
│      • Optional federation protocol (instance discovery)    │
│      • SLA-tier managed-hosting offering                    │
└─────────────────────────────────────────────────────────────┘
        ↓ (for sensitive operations)
┌─────────────────────────────────────────────────────────────┐
│  L4: Hot-state on hardened infrastructure (NOT on Akash)    │
│      • Payment provider secrets (Stripe / BTCPay / SHK …)   │
│      • VPN private master keys (WG / AmneziaWG)             │
│      • Customer PII / KYC vault                             │
│      → Owned enterprise server with HSM or TEE              │
└─────────────────────────────────────────────────────────────┘
```

## Top-3 risks

1. **Akash provider quality lottery** — first deployments may land on unstable providers. Mitigation: rank by Akash Console reputation; have VPS rollback warm-standby for the first 90 days.
2. **Federation revenue model is hard** — monetizing community-operators (SaaS-tier, dual-license, or donations) requires careful legal/license design. Mitigation: launch under pure MIT, monetize via managed-hosting offering rather than license restrictions.
3. **Compliance in decentralized infra** — GDPR / ФЗ-152 require provable data location. Mitigation: enforce jurisdiction filter at the SDL level; keep all customer PII on the centralized hot core, not on Akash.

## What this decision does NOT solve

- Operations burden — you still own incident response on the centralized hot core; Akash only removes the compute / Postgres replica
- Legal risk on VPN — VPN provisioning in any jurisdiction still requires whatever licenses apply; decentralization is not a regulatory shield
- Latency — Akash provider distance can be worse than a fixed-region VPS; jurisdiction filter narrows pool further
- Day-1 cost — bridge costs and learning curve make month 1–2 more expensive than the status quo; break-even at month 4–6 based on Akash's published $1.20-1.80/hr H100 vs AWS $4.50-5.50/hr (60-86% reduction at steady-state).

## Re-evaluation triggers

- An Akash provider with first-class TEE / SGX support reaches GA → reconsider hot-secrets isolation score for Pure Akash
- A federation interop standard emerges for e-commerce (something analogous to ActivityPub for storefronts) → re-score Federation distribution viability
- io.net / Fluence / Spheron launch a managed-DB primitive comparable to RDS → re-score state persistence for Pure Akash
- Akash's managed Credit Card API matures sufficiently to remove crypto-UX friction → re-score Pure Akash on criterion 8
