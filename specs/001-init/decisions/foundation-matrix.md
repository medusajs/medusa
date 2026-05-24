# Decision Record: Commerce Foundation Selection

**Status**: Accepted
**Date**: 2026-05-24
**Drivers**: Single-stack TypeScript continuity with OmniRoute / undrestrator; multi-tenant-readiness; license safety for white-label distribution; production-grade e-commerce primitives out of the box.

## Candidates evaluated

- **A — Medusa v2** (TypeScript, modular monolith, MIT, ~25k★) — Headless commerce backend. Modular core (cart, order, inventory, region — every module swappable). Medusa Admin React UI, separate Next.js storefront. v2 GA in 2024.
- **B — Vendure** (NestJS + TypeScript, GraphQL+REST, MIT, ~6k★) — Headless commerce on NestJS, GraphQL-first. Channels = regions/brands, sellers = marketplace. Angular admin UI.
- **C — Saleor** (Python + Django + GraphQL, BSD-3, ~21k★) — Enterprise-tier headless commerce, GraphQL-only. Channels for multi-region/brand. Best admin UI in the category.
- **D — Nextacular + custom commerce** (Next.js multi-tenant SaaS template, MIT) — Ready multi-tenant shell (workspaces, auth, Stripe SaaS billing). E-commerce functionality must be written from scratch.

## Criteria & weights

| # | Criterion | Weight | Why important |
|---|-----------|:------:|---------------|
| 1 | TS-native (single-stack continuity) | 10 | undrestrator / OmniRoute are TS — mixed-language stack doubles operational load |
| 2 | Multi-tenant readiness | 10 | Hybrid → full multi-tenant migration path must be tractable |
| 3 | License safety (for white-label) | 10 | AGPL / BSL / custom restrictions block commercial redistribution |
| 4 | AI integration ease (hooks, modules) | 9 | RAG, agent surfaces, BYOK gateway must plug in cleanly |
| 5 | Custom verticals (VPN / IT-services / crypto) | 9 | Out-of-the-box e-commerce covers ~50% of undrlla — rest is custom |
| 6 | Payment provider coverage (Stripe / PayPal / BTCPay / SHKeeper / manual) | 8 | Crypto + manual rails are critical and rarely first-class in OSS |
| 7 | i18n + multi-region (GLOBAL / RU / ...) | 8 | Currency, locale, region-aware tax/shipping logic |
| 8 | Production maturity (prod cases, release cadence) | 7 | No appetite for being a beta-tester in production |
| 9 | Ready admin UI (catalog / orders) | 6 | Building from scratch = 2–3 months of work |
| 10 | Time-to-prod (junior+mid team) | 7 | Realistic horizon for migration |
| 11 | Headless / frontend freedom | 8 | Custom UX is mandatory (brand, regions, white-label) |
| 12 | Self-host ops complexity | 7 | Every additional service is operational debt |

**Σ weights = 99**

## Scoring matrix (1–10 per cell)

| # | Criterion (weight) | Medusa v2 | Vendure | Saleor | Nextacular+custom |
|---|--------------------|:---------:|:-------:|:------:|:-----------------:|
| 1 | TS-native (10) | **10** | **10** | 3 | **10** |
| 2 | Multi-tenant (10) | 6 | 7 | 7 | **10** |
| 3 | License (10) | **10** | **10** | 9 | **10** |
| 4 | AI integration (9) | 7 | 6 | 6 | **9** |
| 5 | Custom verticals (9) | 8 | 7 | 6 | **10** |
| 6 | Payment coverage (8) | **9** | 7 | **9** | 6 |
| 7 | i18n+region (8) | **9** | 7 | **9** | 5 |
| 8 | Maturity (7) | 8 | 8 | **10** | 6 |
| 9 | Admin UI (6) | 9 | 9 | **10** | 4 |
| 10 | Time-to-prod (7) | **8** | 7 | 6 | 4 |
| 11 | Headless (8) | **10** | **10** | **10** | 7 |
| 12 | Self-host ops (7) | 7 | 7 | 6 | **9** |
| | **Σ weighted** | **834** | **787** | **736** | **772** |
| | **Average (÷99)** | **🥇 8.42** | **🥈 7.95** | 🥉 7.43 | **🏅 7.80** |

## Calculation traceability

**Medusa v2**: 10×10 + 6×10 + 10×10 + 7×9 + 8×9 + 9×8 + 9×8 + 8×7 + 9×6 + 8×7 + 10×8 + 7×7 = 100+60+100+63+72+72+72+56+54+56+80+49 = **834** → 834 ÷ 99 = **8.42**

**Vendure**: 10×10 + 7×10 + 10×10 + 6×9 + 7×9 + 7×8 + 7×8 + 8×7 + 9×6 + 7×7 + 10×8 + 7×7 = 100+70+100+54+63+56+56+56+54+49+80+49 = **787** → 787 ÷ 99 = **7.95**

**Saleor**: 3×10 + 7×10 + 9×10 + 6×9 + 6×9 + 9×8 + 9×8 + 10×7 + 10×6 + 6×7 + 10×8 + 6×7 = 30+70+90+54+54+72+72+70+60+42+80+42 = **736** → 736 ÷ 99 = **7.43**

**Nextacular + custom commerce**: 10×10 + 10×10 + 10×10 + 9×9 + 10×9 + 6×8 + 5×8 + 6×7 + 4×6 + 4×7 + 7×8 + 9×7 = 100+100+100+81+90+48+40+42+24+28+56+63 = **772** → 772 ÷ 99 = **7.80**

## Decision

**Medusa v2** selected with an 0.47-point margin over Vendure (the next strongest TS-native candidate).

### Why Medusa won

- Covers ~80% of undrlla's e-commerce features out of the box (regions, payments, inventory, orders) — minimal reinvention
- Modular architecture lets VPN-module, IT-services-module, AI-advisor-module slot in as Medusa Modules without forking core
- TS-native means shared types with OmniRoute / undrestrator and a single mental model
- MIT license safe for white-label redistribution
- Hybrid tenancy (`tenant_id` + Sales Channels per tenant) covers 95% of cases up to ~10 resellers

### Why each candidate did not win

- **Vendure (7.95)** — NestJS learning curve, smaller community, marginally weaker payment / region story than Medusa for our exact stack of providers
- **Saleor (7.43)** — Python breaks the single-stack thesis, adding Django+Celery+GraphQL gateway complexity for no proportional gain; admin UI excellence does not compensate for the language split
- **Nextacular + custom (7.80)** — strongest on tenancy/AI/customization but requires writing catalog/cart/order/inventory/fulfillment from scratch (3–6 months of pure rebuild before the first sale)

## Tuning for undrlla profile

- **Multi-tenant layer** — add `tenant_id` via Medusa `customModuleService` + Prisma middleware; workspace routing in Next.js (`/[workspace]/...` or `<tenant>.undrlla.com`)
- **BTCPay / SHKeeper** — Medusa community plugin for BTCPay is the starting point; SHKeeper requires a custom Payment Provider Module (~1 week given Medusa's payment provider spec)
- **VPN module** — separate Medusa Module + worker (BullMQ or Hatchet) reacting to `order.payment_captured` for WG/AmneziaWG/Xray provisioning
- **AI layer** — OmniRoute as sidecar (port 20128); Next.js Server Actions proxy to it; per-tenant key resolver middleware
- **Admin** — Medusa Admin for catalog/orders/inventory; Refine-based custom admin for AI models / tenants / BTCPay config

## Top-3 risks

1. **Medusa v2 modules API is still young** (GA 2024, breaking changes likely until ~2027) — budget one month per year for migrations
2. **BTCPay / SHKeeper plugin quality** — community-grade, likely requires forks/fixes; plan 2–3 weeks for payment-provider hardening
3. **Multi-tenant layer is hand-rolled** — validate the `tenant_id` + Sales Channels strategy against 2–3 real-world resellers before committing to it as the final answer

## Re-evaluation triggers

- Medusa v2 announces an upstream multi-tenant primitive → revisit Decision 3
- Vendure announces channels-as-tenants first-class → revisit Decision 1 with new weights
- A new TS-native commerce candidate emerges with strong v1.0+ release → add as candidate E and re-score
