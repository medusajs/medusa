# SpecKit Review: 001-init (undrlla v2 — Medusa Migration + Decentralized Hybrid Hosting)

**Reviewer**: claude
**Reviewed at**: 2026-05-25T15:30:00Z
**Commit**: c05b7f662acc03c539ef269077e16f0fa0d4f1ef (working tree includes v4 rework: auth-fallback.md, glossary.md, reconciliation-algorithm.md, plan/tasks updates)
**Review iteration**: v4 (fresh adversarial pass after v3 closure — claude v1=HIGH/14, v2=HIGH/3, v3=MEDIUM/3, antigravity v1=CRITICAL/2, v3=PASS)
**Artifacts reviewed**: spec.md, plan.md, tasks.md, data-model.md, architecture.md, quickstart.md, research.md, auth-fallback.md, glossary.md, reconciliation-algorithm.md, contracts/*.md, decisions/*-matrix.md, checklists/requirements.md, reviews/{antigravity,antigravity-v2,antigravity-v3,analyze}.md, .specify/memory/constitution.md

## v3 Findings Closure

| ID | v3 Severity | Status | Evidence |
|----|------------|--------|----------|
| v3-F1 | HIGH | ✅ RESOLVED | `specs/main/auth-fallback.md` — 5-section architecture sketch (jose JWT issuer, TenantMembership DML, Redis session store, Jackson SAML), weekly scope plan, files-that-change list. T008b acceptance + R1 mitigation reference it. |
| v3-F2 | HIGH | ✅ RESOLVED | plan.md lines 393-417 added "Migration Entity Ordering" table — 15 steps with FK dependencies, parallelism notes, operator override path. T026 acceptance enforces ordering via CI. |
| v3-F3 | HIGH | ✅ RESOLVED | T035 expanded to 4-part acceptance: local WAL → 3× exp-backoff retry → dead-letter table + 5-min ops page → daily Hatchet reconciliation vs Langfuse trace count (>0.1% mismatch alerts). See N1 below for new gap. |
| v3-F4 | MEDIUM | ✅ RESOLVED | Migration Tool Failure Matrix row added: "Orphan VPN peer (server decommissioned) → quarantine, status='orphan_server' → manual review, do NOT block batch". |
| v3-F5 | MEDIUM | ✅ RESOLVED | T044 hardened: minimal-cost upstream call, constant-time delay, encrypt-before-validate. |
| v3-F6 | MEDIUM | ✅ RESOLVED | `grep -cE '^- \[.\] T'` returns 90 = matches asserted total. Validation command embedded in tasks.md line 357. |
| v3-F7 | MEDIUM | ✅ RESOLVED | T020 specifies per-VPNServer Hatchet concurrency key = vpn_server_id OR Redis SETNX lock. See N6 below for "pick one" nit. |
| v3-F8 | MEDIUM | ✅ RESOLVED | `specs/main/glossary.md` covers Tenant/Workspace/Sales Channel + AI tiers + reconciliation terms. |
| v3-F9 | MEDIUM | ✅ RESOLVED | T037 specifies pgvector + text-embedding-3-small + IVFFlat + category pre-filter + 2s retrieval budget breakdown + degraded fallback. |
| v3-F10 | MEDIUM | ✅ RESOLVED | plan.md line 374 + T059 line 181 codify "v2 writes to own DB authoritative → async fire to legacy API (not direct DB)". Legacy 5xx → reconciliation_journal, never blocks v2 write. |
| v3-F11 | MEDIUM | ✅ RESOLVED | plan.md line 22 explicitly: "Redis 7 (session JWT-jti revocation list, CSRF tokens, cache only — **cart stored in Postgres per Medusa v2 default**)". Cart survives Akash failover. |
| v3-F12 | LOW | ✅ RESOLVED | CLAUDE.md project root now references constitution v1.0.0 (matches `.specify/memory/constitution.md`). |
| v3-F13 | LOW | ✅ RESOLVED | T050 line 209: "EU adequacy decision monitoring SOP — ec.europa.eu/justice newsletter subscription, PR template for jurisdictions.json, 30-day SLA from announcement to merged update". |
| v3-F14 | LOW | ✅ RESOLVED | plan.md line 606 explicitly adopted the alternative: "Engine on Akash; state-DB on hot-core via TCP (revised per claude v3 F14 — no gRPC tunnel)". |
| v3-F15 | LOW | ✅ RESOLVED | Phase 5 header now "Weeks 16–17" (plan.md line 421); Phase 4 extended to 3 weeks. |

**v3 score: 15/15 fully resolved (100%).** All HIGH findings from prior reviews closed.

## New Findings (v4 — fresh adversarial pass)

The v3-rework fixes were good but introduced one structural gap and a few open-decision deferrals worth flagging.

| ID | Severity | Area | Finding | Recommendation |
|---|---|---|---|---|
| N1 | HIGH | Failure mode | **OpenMeter WAL on Akash containers is a structurally-broken durability claim.** T035 acceptance #1 (tasks.md line 120) says "every metering event is appended to a local file-based WAL (`apps/medusa/data/metering-wal/YYYYMMDD.log`) — durable on hot-core volume." But `apps/medusa/` runs on Akash, not hot-core (per plan.md M3.2 stateless Akash topology, architecture.md Layer 3). The path is local to the Medusa container. Akash containers are ephemeral — Akash does NOT support remote-mounting Hetzner filesystems. So the WAL is one of: (a) on Akash ephemeral storage → lost on container restart, defeats the purpose; (b) on Akash persistent volume → durable on the Akash provider only, lost if provider dies (which is the exact failover scenario v3-F3 was trying to protect against); (c) requires an undocumented remote-write mechanism. The "durable on hot-core volume" phrasing implies a topology that doesn't exist in the current architecture. **The v3-F3 fix is a paper fix that won't survive contact with the deployment topology.** | Pick one of: (1) **Redis WAL** — push metering events to Redis Stream (`omniroute:metering-wal`) on hot-core BEFORE attempting OpenMeter emission; OpenMeter retries replay from the stream; replaces file-based WAL entirely. (2) **Hot-core metering worker** — Medusa emits to a Hatchet workflow that runs on hot-core (engine is already there per v3-F14); worker owns WAL + retry + OpenMeter call. (3) **Akash persistent volume + cross-provider replica** — works but doubles cost and Akash persistent volumes have their own durability story. Option 1 is the lightest touch; updates T035 acceptance #1 + 1 line in architecture.md. |
| N2 | MEDIUM | Failure mode | **auth-fallback.md "Open questions" deferred to activation time, but activation time is 3 weeks of pressure-cooker.** auth-fallback.md lines 68-73 list four open questions: refresh-token rotation policy (sliding-window vs hard-expiry), multi-device session limit, SAML attribute mapping, backwards compat with T008-window sessions. Each carries security implications (sliding-window enables session hijack persistence; no multi-device limit is a credential-stuffing window; SAML attribute mapping varies per IdP). If T008b activates, the team has 3 weeks to design + implement everything in the file PLUS resolve these 4 questions PLUS pass integration tests. The questions should be pre-decided (or at least pre-debated) so activation is "execute the plan", not "design under deadline pressure". | Move the 4 open questions to a "Pre-activation decisions" section in auth-fallback.md with recommended defaults: (1) refresh-token rotation = hard expiry 30d, no sliding (simpler, prevents long-lived hijack), (2) multi-device limit = 5 sessions per user (configurable per tenant), (3) SAML attribute mapping = OAuth-style claims convention (`sub` → user.id, `email` → user.email, `groups[]` → tenant memberships), (4) T008-window sessions: invalidate on T008b activation (force re-login). Stakeholders can disagree and adjust, but a default-baseline cuts week-1 activation friction. |
| N3 | MEDIUM | Hidden assumption | **Reconciliation algorithm assumes clock-sync between legacy and v2 systems but doesn't specify NTP enforcement.** reconciliation-algorithm.md line 20: "Prefer v2 if v2 timestamp > legacy timestamp" for `status-mismatch` resolution. Legacy and v2 run on different hosts (legacy on existing infra, v2 Medusa on Akash + Hetzner). If clocks drift by >1 second (common without strict NTP), reconciliation may pick the wrong "winning" record. For payment-status mismatches during dual-write, an incorrect choice means money discrepancy. The plan does not mandate NTP synchronization, max-allowed clock skew, or use of monotonic event-IDs as a fallback. | Add to reconciliation-algorithm.md: (1) "NTP sync required — all dual-write hosts run chrony or systemd-timesyncd against a Tier-1 NTP pool; max drift 100ms"; (2) "If clock skew between systems exceeds 500ms (detected via heartbeat), reconciliation pauses and alerts ops"; (3) "Fall back to monotonic event-ID (Postgres bigserial) when timestamp comparison is ambiguous (within 100ms)". |
| N4 | MEDIUM | Stakeholder clarity | **F25 (Platform AI Provisioning) remains acknowledged-but-unresolved.** glossary.md line 31 says "paid tier: Platform-managed keys with metered billing (markup model TBD — see deferred N11)." But N11 was my prior MEDIUM finding flagged in claude v2 — explicit deferral doesn't resolve the operational unknowns: which providers does the platform pre-fund (OpenAI? Anthropic? OpenRouter?), what's the markup policy (cost-plus? fixed % per token? per-tier flat rate?), what happens when platform exhausts upstream provider credit, what's the low-balance alert mechanism. These are blocking for Phase 2 launch — the billing pipeline (Killbill) needs to know the markup rule, customers need to see a quota math, ops needs to know when to top up providers. | Add a "Platform AI Provisioning" subsection to spec.md under FR-011 with: (1) supported providers for paid tier (list); (2) markup model (recommendation: cost-plus 20% with floor of $0.0001 per request to cover overhead); (3) per-tenant monthly soft cap (notify at 80%, hard cap at 100% with degraded-tier fallback OR pay-as-you-go upgrade); (4) operator runbook entry for low-balance alerts (T087). Even rough numbers unblock Killbill schema design. |
| N5 | MEDIUM | Failure mode | **Hatchet engine startup behavior with WireGuard tunnel down is unspecified.** plan.md line 606 adopted "engine on Akash; state-DB on hot-core via TCP over WireGuard". This solves the gRPC-tunnel concern but introduces a startup-ordering risk: if WireGuard tunnel is down when the Hatchet engine container starts (e.g., after Akash provider restart), the engine cannot reach its state DB. Does it crash-loop (workflows blocked until tunnel recovery) or start in degraded mode (workflows queued locally, sync on tunnel recovery)? The contract is silent. Worst case: every VPN provisioning order is stuck until WireGuard heals. | Add to T052 acceptance OR a new Hatchet operational subsection: "Engine startup: if state-DB connection fails on boot, retry with exponential backoff (1s/3s/10s/30s/60s, then steady at 60s). Do not crash-loop — alert ops via Better-Stack at 5 min retry-cycle. Workflows in queued state remain in Postgres (durable); resume on reconnect." Reference Hatchet's documented behavior or pin a version where it's known. |
| N6 | LOW | Design clarity | **T020 lists two alternative SSH-locking mechanisms — implementer will pick one arbitrarily.** tasks.md line 90: "Per-VPNServer Hatchet concurrency limit = 1 for the SSH-push step (use Hatchet step concurrency key = vpn_server_id). Alternative implementation: Redis distributed lock SETNX/EXPIRE keyed on vpn_server_id, TTL 60s, acquired before SSH session." Both work, but if one developer picks Hatchet-key and another picks Redis-SETNX in a follow-up task, you have two locking layers (or worse, neither). | Pick one in the task description (recommend Hatchet step concurrency — already in the infra stack, no extra dep, integrates with workflow observability). Demote the alternative to a footnote or a contracts/vpn-provisioning.md "rejected alternatives" note. |
| N7 | LOW | Logical consistency | **Migration ordering Step 15 (auth_legacy_credentials) timing is ambiguous.** plan.md line 413 says "Populated by Better-Auth migration pipeline once Customer rows exist." T027 (line 97) says "auth_legacy_credentials table is created by Better-Auth's built-in migration pipeline (no separate task)." But: when does Better-Auth's pipeline run relative to Customer migration (Step 5)? Same transaction? Eventual? If eventual, there's a window where Customer rows exist but auth_legacy_credentials don't — first-login attempts during that window fail silently or return generic "invalid credentials". | Add to T027 acceptance: "Better-Auth migration pipeline runs synchronously after each Customer batch loads — every Customer row has a corresponding auth_legacy_credentials row before the next batch starts. Verified by integration test: 100 customer migration + 100 login attempts immediately after = 100 successful logins." OR clarify that customer-facing login is gated behind cutover Day 1 (Phase 4 M4.4) so pre-cutover the timing doesn't matter. |

## Alternative approaches considered

Two from prior reviews are now in the artifact set (v3-F11 cart-in-Postgres, v3-F14 Hatchet-engine-on-Akash). One new one worth flagging:

1. **Redis Stream for metering WAL (N1 recommendation).** Rather than file-based WAL, use Redis Streams on hot-core: producer (Medusa on Akash) pushes events with `XADD omniroute:metering-wal * tenant_id ... cost_usd ...`. Consumer (OpenMeter ingester or a dedicated worker) reads with consumer-group semantics for at-least-once delivery. Trade-offs vs file-WAL: (+) durable across Akash container restarts, (+) replicable across replicas, (+) backed by Postgres if Redis is persistent, (-) Redis is on hot-core — adds 1 cross-tunnel RTT per metering event (acceptable for non-critical-path billing events). This is the lightest-touch fix for N1.

## VERDICT

```yaml
verdict: MEDIUM
reviewer: claude
reviewed_at: 2026-05-25T15:30:00Z
commit: c05b7f662acc03c539ef269077e16f0fa0d4f1ef
critical_count: 0
high_count: 1
medium_count: 4
low_count: 2
v3_resolution_rate: 15/15 (100%)
v4_total_new_findings: 7
gate_decision: ONE_HIGH_AWAY_FROM_PASS
notes: |
  The v3-rework was exceptionally thorough — all 15 prior findings resolved,
  including the three HIGHs (Better-Auth fallback design, migration ordering,
  OpenMeter event-loss handling). The artifact set is now genuinely strong.

  Single remaining HIGH (N1) is the v3-F3 fix introducing its own gap: the
  OpenMeter WAL is specified as "local file-based, durable on hot-core volume"
  but Medusa runs on stateless Akash containers — no remote-mount mechanism
  exists. The WAL design assumes a topology that the deployment doesn't have.

  Recommended fix is small (T035 acceptance #1 update + 1-line architecture.md
  note): replace file-based WAL with Redis Stream on hot-core. ~30 min edit.

  After N1 is closed, the four MEDIUMs (auth-fallback open questions, clock
  skew, Platform AI Provisioning, Hatchet startup) are all "add a sentence
  or two" fixes — none are architectural.

  Gate state (per Constitution Principle VI: analyze PASS + ≥2 external PASS):
  - analyze.md: PASS ✓
  - antigravity v3: PASS ✓
  - claude v4: MEDIUM (this review) — 1 HIGH from PASS

  After v5 rework on N1: claude should clear to PASS, gate unlocks for
  /speckit.implement.

  This is the final review iteration that's worth running before implement —
  the artifact set has reached a quality plateau where remaining findings
  are operational rather than architectural.

recommended_v5_actions:
  - "[30min] T035 acceptance #1: replace 'local file-based WAL durable on hot-core volume' with 'Redis Stream `omniroute:metering-wal` on hot-core, consumer-group at-least-once delivery'. Update architecture.md Layer 4 to add the Stream as a hot-core durability primitive. (resolves N1)"
  - "[15min] auth-fallback.md: add Pre-activation decisions section with default answers for the 4 open questions. (resolves N2)"
  - "[10min] reconciliation-algorithm.md: add NTP requirement + max-skew + monotonic event-ID fallback. (resolves N3)"
  - "[20min] spec.md FR-011: add Platform AI Provisioning subsection with providers + markup model + low-balance behavior. (resolves N4)"
  - "[10min] T052 or new Hatchet section: specify engine boot-with-tunnel-down behavior. (resolves N5)"
  - "[5min] T020: pick Hatchet step concurrency, demote Redis SETNX alternative to footnote. (resolves N6)"
  - "[5min] T027 acceptance: clarify Better-Auth migration pipeline runs synchronously per Customer batch. (resolves N7)"
```
