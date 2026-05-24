# Specification Quality Checklist: Performance

**Purpose**: Validate that performance requirements are quantified, measurable, and tied to user-facing outcomes — not vibes.
**When to use**: Any user-facing feature, data-heavy backend, hot-path change, or anything affecting Core Web Vitals.
**When to skip**: Pure refactors with no behavioral or data-volume change.

## Validation Items

### Targets & Budgets

- [ ] CHK001 - Are user-facing latency targets specified (p50, p95, p99 — not just average)? [Clarity]
- [ ] CHK002 - Are Core Web Vitals targets explicit (LCP, INP, CLS) for web features? [Completeness]
- [ ] CHK003 - Is the API latency budget defined per endpoint or category? [Coverage]
- [ ] CHK004 - Is the DB query budget specified (max queries per request, max query duration)? [Gap]
- [ ] CHK005 - Are bundle size budgets defined (initial JS, route chunk, asset cap)? [Completeness]

### Load & Scale

- [ ] CHK006 - Are concurrent-user / RPS targets specified (steady-state and peak)? [Clarity]
- [ ] CHK007 - Are growth assumptions documented (12-month projection, seasonal spikes)? [Gap]
- [ ] CHK008 - Are degradation requirements defined for above-target load (graceful fallback vs hard fail)? [Edge Case]
- [ ] CHK009 - Is cold-start / warmup behavior specified (serverless cold start, cache warming)? [Edge Case]

### Caching

- [ ] CHK010 - Is the caching strategy specified per data category (TTL, invalidation, key shape)? [Completeness]
- [ ] CHK011 - Are cache-miss requirements quantified (acceptable miss rate, fallback latency)? [Gap]
- [ ] CHK012 - Is cache invalidation specified (vs stale-data tolerance window)? [Edge Case]

### Database & Storage

- [ ] CHK013 - Are required indexes specified per planned query pattern? [Completeness]
- [ ] CHK014 - Are N+1 query risks identified and explicitly mitigated (eager loading, dataloader, joins)? [Gap]
- [ ] CHK015 - Is pagination strategy specified for any list endpoint (cursor / offset, page-size cap)? [Coverage]

### Frontend (web)

- [ ] CHK016 - Is image strategy specified (formats, responsive sizes, lazy-load policy, CDN)? [Completeness]
- [ ] CHK017 - Are render-blocking resources explicitly minimized (font display, critical CSS, deferred JS)? [Gap]
- [ ] CHK018 - Is hydration / interactivity strategy specified (SSR / RSC / partial / island)? [Clarity]

### Measurement & SLO

- [ ] CHK019 - Are metrics defined that map to user experience (not just system metrics)? [Measurability]
- [ ] CHK020 - Is the SLO documented (target + window + breach action)? [Completeness]
- [ ] CHK021 - Is performance regression detection specified (CI benchmark, prod monitoring, alert threshold)? [Gap]
- [ ] CHK022 - Is the load-testing approach specified before launch (tool, scenarios, pass criteria)? [Coverage]

### Failure & Degradation

- [ ] CHK023 - Are timeouts specified per external dependency? [Coverage]
- [ ] CHK024 - Are retry + backoff requirements specified (max attempts, jitter, idempotency)? [Completeness]
- [ ] CHK025 - Is circuit-breaker behavior specified (open threshold, half-open probe)? [Edge Case]

## Notes

- Numbers without units are findings. "Fast" is a finding. "p95 < 200ms at 1000 RPS for /api/feed" is a requirement.
- Pair with `/speckit.review` from `performance-optimizer` for hot-path features.
