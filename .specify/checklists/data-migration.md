# Specification Quality Checklist: Data Migration

**Purpose**: Validate that schema or data-shape changes have a safe rollout path, a rollback path, and a verification step. Migrations are the leading cause of preventable production outages.
**When to use**: Any change to a database schema (DDL), large-scale data transformation, breaking change to event-payload shape, or move between storage backends.
**When to skip**: Pure additive changes to internal fixtures, dev-only seed data.

## Validation Items

### Migration Strategy

- [ ] CHK001 - Is the migration approach specified (in-place online, expand-and-contract, dual-write, blue/green)? [Clarity]
- [ ] CHK002 - Is the expected downtime explicit (zero-downtime / planned-window / acceptable-degradation)? [Completeness]
- [ ] CHK003 - Are migration phases enumerated (deploy code that handles both shapes → backfill → switch reads → drop old)? [Completeness]
- [ ] CHK004 - Is per-phase rollback path specified for each phase? [Coverage]

### Schema Changes (DDL)

- [ ] CHK005 - Are schema changes split into reversible atomic steps (each step deployable independently)? [Clarity]
- [ ] CHK006 - Are NOT-NULL-without-default additions explicitly avoided (or replaced with: nullable → backfill → set NOT-NULL)? [Edge Case]
- [ ] CHK007 - Are type changes specified safely (add new column → backfill → switch reads → drop old, never `ALTER TYPE` on a hot table)? [Coverage]
- [ ] CHK008 - Are foreign-key constraints added without locking the referencing table (concurrent index where required)? [Edge Case]
- [ ] CHK009 - Are index-creation requirements specified to use the concurrent / online path? [Completeness]
- [ ] CHK010 - Are large-table operations specified to be batched (chunked backfill, not single-transaction)? [Performance]

### Data Backfill

- [ ] CHK011 - Is the backfill strategy specified (single-pass batch / incremental / event-driven)? [Clarity]
- [ ] CHK012 - Are backfill batch-size and rate explicit (rows/sec, sleep between batches)? [Completeness]
- [ ] CHK013 - Is backfill-progress tracking specified (resumable from interruption, observable progress metric)? [Gap]
- [ ] CHK014 - Are concurrent-write conflicts during backfill addressed (UPSERT semantics, last-writer-wins, optimistic lock)? [Edge Case]
- [ ] CHK015 - Is backfill-failure recovery specified (skip-and-log vs halt-and-page)? [Exception Flow]

### Dual-Write & Cutover

- [ ] CHK016 - If using dual-write, is the consistency model specified (eventual / strong / quorum, time-to-consistency target)? [Clarity]
- [ ] CHK017 - Are read-from-old / read-from-new traffic-split requirements specified (gradual %, by user cohort, by region)? [Completeness]
- [ ] CHK018 - Is the cutover criterion specified (when reads switch — by date, metric threshold, manual approval)? [Measurability]
- [ ] CHK019 - Is the post-cutover monitoring window specified (how long both systems stay alive before old is dropped)? [Coverage]

### Verification & Validation

- [ ] CHK020 - Are pre-migration validation checks specified (current state matches assumed shape, row counts, integrity)? [Completeness]
- [ ] CHK021 - Are during-migration health checks specified (replication lag, error rate, write latency)? [Coverage]
- [ ] CHK022 - Are post-migration verification queries specified (parity check, sampled deep-comparison)? [Completeness]
- [ ] CHK023 - Are application-level smoke tests specified to run against the new shape? [Gap]
- [ ] CHK024 - Is the success criterion quantified (parity %, error rate threshold, p95 latency unchanged)? [Measurability]

### Rollback

- [ ] CHK025 - Is a rollback plan specified for EVERY migration phase (not just for "if it fails on day one")? [Coverage]
- [ ] CHK026 - Is the rollback-decision authority specified (who calls it, what evidence triggers it)? [Gap]
- [ ] CHK027 - Is the rollback-time budget specified (how long can we tolerate the problem before forcing rollback)? [Clarity]
- [ ] CHK028 - For destructive migrations, is the recovery path documented (PITR window, backup restore time, data-loss bound)? [Edge Case]

### Performance & Capacity

- [ ] CHK029 - Are migration-period resource requirements specified (extra disk for dual-table, replication-lag budget, write-IOPS impact)? [Completeness]
- [ ] CHK030 - Is the migration-time estimate quantified, including backfill on production-size data? [Measurability]
- [ ] CHK031 - Is the maintenance-window requirement specified (off-peak, traffic shape, customer comms)? [Gap]

### External Communication

- [ ] CHK032 - Is consumer notification specified for breaking changes (which consumers, notice period, migration support)? [Coverage]
- [ ] CHK033 - Is the API-deprecation timeline aligned with the data-migration timeline? [Consistency]

### Audit & Compliance

- [ ] CHK034 - Are data-residency / compliance requirements specified (GDPR / data-locality / encryption-at-rest preserved through migration)? [Coverage]
- [ ] CHK035 - Are audit-log requirements specified for the migration itself (who ran it, when, with what params)? [Gap]

## Notes

- Reference: Database Reliability Engineering (Campbell & Majors), expand-and-contract pattern, online schema changes (gh-ost / pt-online-schema-change for MySQL, native concurrent DDL for Postgres).
- The most expensive migration mistakes: NOT-NULL-without-default on a big table, locking DDL on a hot table, no rollback path, cutover after a long backfill that may have silently drifted.
- Pair with `database-architect`. For high-stakes migrations, also `/speckit.review` from `devops-engineer` on the rollout plan.
