# Dual-Write Reconciliation Algorithm (Phase 4)

**Status**: DESIGN (closes Open Items #6 from plan.md)
**Owner**: BE
**Referenced by**: tasks.md T013a (algorithm design), T059 (dual-write activation), T060 (reconciliation reporting)

## Purpose

During Phase 4 cutover, writes flow to BOTH legacy (V1) and Medusa v2 systems. This document defines how we detect and resolve discrepancies between them.

## Discrepancy categorization

Every reconciliation pass classifies each entity-level mismatch into exactly one bucket:

| Bucket | Definition | Default action |
|---|---|---|
| `missing-in-v2` | Entity exists in legacy but not in Medusa v2 | Replay write into v2 from legacy snapshot. Log to `reconciliation_journal`. |
| `missing-in-legacy` | Entity exists in v2 but not in legacy | Treat as v2-only (post-cutover write). No action. Log informationally. |
| `amount-mismatch` | Order totals, refund amounts, or balance fields differ beyond 0.01% tolerance | Flag for operator review. Block automated resolution. |
| `status-mismatch` | Entity status differs (e.g., legacy says `paid`, v2 says `pending`) | Prefer v2 if v2 timestamp > legacy timestamp; else flag for operator. |
| `schema-mismatch` | Required field present in one system, absent in other | Flag for operator. Possible migration bug. |

## Resolution policy

**v2 is source-of-truth post-cutover.** Legacy is read-only after cutover Day 1.

Pre-cutover (Phase 4 dual-write window):
- For automated buckets (`missing-in-v2`, `missing-in-legacy`): Hatchet job runs every 15 min, applies the default action, writes to `reconciliation_journal`.
- For operator buckets (`amount-mismatch`, `status-mismatch`, `schema-mismatch`): paged to ops within 5 min via Better-Stack alert. SLA: acknowledge within 24h, resolve within 72h, or escalate to engineering lead.

Post-cutover:
- Discrepancies surfaced by retention-period audit jobs (T060) are recorded but not auto-resolved. Operator triages monthly.

## Clock synchronization requirements

The `status-mismatch` resolution above ("Prefer v2 if v2 timestamp > legacy timestamp") assumes synchronized clocks across legacy and v2 hosts. Without enforcement, clock drift causes incorrect "winning record" selection — for payment-status mismatches, this means money discrepancy.

- **NTP enforcement**: All dual-write hosts (legacy server, Akash compute nodes, Hetzner hot-core) MUST run `chrony` or `systemd-timesyncd` against a Tier-1 NTP pool (`pool.ntp.org` or stratum-1 EU source). Max acceptable drift: 100ms.
- **Skew monitoring**: Reconciliation job emits a heartbeat from each host every 15 min with `(host_id, hostname, current_time)`. If observed skew between any pair exceeds 500ms, reconciliation pauses and alerts ops (`reconciliation.clock_skew` alert). Queued entries remain pending until clocks resync.
- **Monotonic fallback**: When timestamp comparison is ambiguous (records within 100ms of each other), reconciliation falls back to monotonic event-ID — Postgres `BIGSERIAL` on `reconciliation_journal.id` and equivalent on legacy if available. Higher ID wins (assumes both writers use UTC-monotonic sequences).
- **Audit**: every status-mismatch resolution logs `(v2_ts, legacy_ts, skew_observed, resolution_method=timestamp|monotonic)` to `reconciliation_journal` for forensic review.

## Verification metrics (per data-model.md lines 1239-1247)

- Customer count match (exact).
- Order count match (exact).
- Sum of order amounts within 0.01% tolerance.
- VPN peer count match (exact).
- Refund total match (exact).
- BYOK key fingerprint count match (exact).

## Operator runbook references

- Hatchet job definitions: `apps/medusa/src/jobs/reconciliation/` (created in T013a).
- `reconciliation_journal` schema: see `data-model.md` (add table during T013a).
- Operator alerts: Better-Stack channel `#cutover-reconciliation`.
- Documented in operator runbook (T087).

## Open questions resolved

- **Which side wins on conflict?** v2 (after cutover Day 1). Pre-cutover, operator-resolved.
- **What's the operator SLA?** 24h ack, 72h resolve, escalate to eng lead otherwise.
- **What if legacy is unreachable during reconciliation?** Skip that pass; alert ops. Do NOT mark entities as `missing-in-legacy` due to system outage (would create false-positive ghost rows).
