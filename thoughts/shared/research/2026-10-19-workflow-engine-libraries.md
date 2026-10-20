[V] marks facts from a primary source the research agent fetched. [K] marks background knowledge or secondary sources that were not verified. Research date is 2026-10-19.

# Durable workflow engine candidates for Medusa's workflow-engine rewrite

## 1. Summary
- No candidate meets every hard constraint and also gives saga compensation, external step completion, timeouts, cron and nested workflows out of the box.
- Embeddable library, Postgres and/or Redis only, permissive license: DBOS Transact TS, Absurd, pg-boss, Graphile Worker, BullMQ (Redis, and now Postgres too), and the Vercel Workflow Postgres world (partially embeddable).
- DBOS Transact TS is the closest overall fit: MIT, Postgres-only, in-process, very active. It has no saga primitive. It uses replay with required determinism, which differs from Medusa's checkpoint model.
- Absurd is the best design to borrow, and is plausible as a base. It is Apache-2.0 with a single SQL file and a ~1,400-line TS SDK. It is pre-1.0, with no cron and no partitioning.
- BullMQ, pg-boss and Graphile Worker are queue and scheduler substrates, not workflow engines.
- These fail "embeddable, Postgres/Redis only" or have license problems: Hatchet, Inngest, Trigger.dev, Restate, Temporal, Windmill, Kestra, Motia, Upstash, pg_durable.
- Partial or weak fits: Effect workflow, Mastra, LangGraph.js, xstate, pgflow (Supabase-coupled).
- Recommendation: build your own engine that keeps the `createWorkflow`/`createStep` DSL and Medusa's checkpoint semantics. Borrow the Postgres designs of Absurd and DBOS. Use pg-boss, Graphile Worker or BullMQ for cron and delayed jobs.

## 2. Candidate details

### DBOS Transact (TypeScript)
- Sources: https://github.com/dbos-inc/dbos-transact-ts, https://docs.dbos.dev/typescript/tutorials/workflow-tutorial, https://dbos.dev/blog/dbos-transact-v2-typescript
- Maturity [V]: MIT license, ~1.4k stars, latest release v5.3 on 2026-10-15 (v5.2 on 2026-09-29), pushed 2026-10-16. Company-backed by DBOS Inc. [K].
- Architecture: workflow and step results are checkpointed in Postgres, and workflows resume from the last completed step. The README says "All you need to use DBOS is Postgres... no separate workflow server."
  - Replay model with required determinism. The docs say a workflow "should invoke the same steps with the same inputs in the same order", and a mismatch raises `DBOSStepNondeterminismError`.
  - Parallel steps are allowed only if started in a fixed order. Use `Promise.allSettled`, not `Promise.all`.
- Embeddable and Postgres-only: yes.
- Features:
  - Steps with retries; queues with concurrency, rate limits, dedup and priority; cron schedules; durable sleep.
  - `send`/`recv` and `setEvent` for external signals.
  - Workflow `timeoutMS` on `startWorkflow`: cancels the workflow and its children, persists across restarts, and the clock starts at execution.
  - Child workflows via `startWorkflow` handles.
  - Idempotency via workflow ID, with `workflowIDReusePolicy: 'reject'` available.
  - Fork from a step.
  - No saga or compensation primitive was found in the docs.
  - Per-step timeouts, hooks and an event subscription API were not verified.
- Performance: DBOS claims one Postgres write per step checkpoint (~1-2ms), at https://dbos.dev/compare/dbos-vs-temporal. A secondary article reports ~30k no-op workflows/s on a Postgres queue (vendor-published): https://runtimewire.com/article/dbos-postgres-queues-30600-workflows-per-second. No independent benchmark was found.
- Risks: the replay and determinism model conflicts with Medusa semantics; compensation must be built on top; state lives in DBOS-owned tables; versioning of long-running workflows [K].

### Absurd
- Sources: https://github.com/earendil-works/absurd, https://lucumr.pocoo.org/2025/11/3/absurd-workflows/, https://lucumr.pocoo.org/2026/4/4/absurd-in-production/
- Maturity [V]: Apache-2.0, ~2.5k stars, latest release 0.5.0 on 2026-08-04 (0.4.0 on 2026-05-27). About five months in production at Earendil. The repo is titled "An experiment in durability."
- Architecture:
  - The core is one `absurd.sql` file of stored procedures, with no extension needed.
  - Pull-based workers claim tasks with `FOR UPDATE SKIP LOCKED`. No coordinator, no push, no HTTP callback.
  - Tasks are split into checkpointed steps. Replay loads cached step results, and code outside steps may be non-deterministic.
  - SDKs: TypeScript (~1,400 lines), Python (~1,900), experimental Go. Tooling: `absurdctl` CLI and the Habitat dashboard.
- Features:
  - Retries and checkpointed steps; sleep and suspend; `awaitEvent`/`emitEvent` (events cached, first emit wins); spawn and await child tasks; `beginStep`/`completeStep` for before and after hooks.
  - No built-in scheduler. The author recommends a custom loop with idempotency keys.
  - No partitioning yet, so data cleanup is expensive.
  - No saga or compensation.
- Performance: no benchmarks published.
- Risks: pre-1.0, single company, no cron, retention unsolved, pull-only.
- Worth borrowing: logic in SQL with a thin SDK; claim with lease plus watchdogs for broken workers; event cache with first-emit-wins; idempotency keys for safe multi-process cron; strong CLI and dashboard tooling.

### Vercel Workflow DevKit
- Sources: https://github.com/vercel/workflow, https://workflow-sdk.dev/worlds/postgres
- Maturity [V]: Apache-2.0, ~2.5k stars, latest `workflow@5.2.2` on 2026-10-13, with very frequent releases.
- Architecture:
  - Replayable directive functions produced by a compiler transform [K].
  - `@workflow/world-postgres` stores runs, events, steps and hooks in Postgres, and uses graphile-worker for jobs.
  - It uses LISTEN/NOTIFY for streams and run status.
  - Jobs are delivered over HTTP to a loopback route (`/.well-known/workflow/v1/flow`), so a web framework host is needed (Next.js, SvelteKit or Nitro).
- Risks:
  - The docs call the Postgres world "not optimized for scale, speed, or security."
  - No built-in auth on the flow route and no encryption.
  - The compiler model is incompatible with the existing DSL.
  - Saga support was not verified.
- Worth borrowing: an append-only event log per run; hooks and webhook tokens as the external-completion primitive; a pluggable "World" interface.

### pgflow
- Source: https://github.com/pgflow-dev/pgflow
- Maturity [V]: Apache-2.0, ~311 stars, `pgflow@0.17.2` on 2026-10-02, pre-1.0.
- Architecture: a SQL core on pgmq and pg_cron, a TypeScript DSL that compiles to SQL migrations, and an Edge Worker run as a Supabase Edge Function. Steps declare dependencies (a DAG), with per-step retry and backoff and per-item fan-out retry.
- Constraint fit: Supabase-coupled, so not Postgres-only unless the SQL core is extracted.
- Worth borrowing: the DAG model and per-item retry in fan-out.

### BullMQ (incl. FlowProducer)
- Sources: https://github.com/taskforcesh/bullmq, https://docs.bullmq.io/guide/postgresql, https://docs.bullmq.io/guide/flows/
- Maturity [V]: MIT, ~9.5k stars, pushed 2026-10-19, company-backed by Taskforce.sh.
- Architecture: Redis is the default and "most battle-tested" backend. An optional Postgres backend (BullMQ v6, PG 13+) uses `SKIP LOCKED` and LISTEN/NOTIFY. Postgres throughput is ~1.5-2x lower than Redis, per the docs. Postgres migrations are manual.
- Features: FlowProducer parent/child job trees where a parent waits for its children; delayed jobs; retries with backoff; rate limits; job schedulers (cron); QueueEvents. Flows are job-dependency trees, not saga state machines.
- Role: queue, scheduling and event substrate, not an engine.

### pg-boss
- Source: https://github.com/timgit/pg-boss
- [V]: MIT, ~4.1k stars, pushed 2026-10-17, needs Node 22.12+ and PG 13+. Features: queues, cron and RRULE scheduling, deferral, dead-letter queues with redrive, queue policies for rate limiting, debouncing and concurrency, and basic job-dependency orchestration. Substrate only.

### Graphile Worker
- Source: https://github.com/graphile/worker
- [V]: MIT, ~2.4k stars, pushed 2026-10-09. A high-performance Postgres job queue with LISTEN/NOTIFY, plus cron [K]. It is the queue under Vercel's Postgres world. Substrate only.

### Hatchet
- Sources: https://github.com/hatchet-dev/hatchet, https://hatchet.run/launch-week-01/v1-engine, https://docs.hatchet.run/self-hosting/benchmarking, https://docs.hatchet.run/guarantees-and-tradeoffs
- Maturity [V]: MIT, ~8.1k stars, pushed 2026-10-19.
- Architecture: a durable task queue on Postgres. A Go engine server is required, so it is not embeddable.
- Performance: stable at ~2,000 events/s on an 8-CPU RDS instance (database CPU ~83%), ~10k/s on a larger instance, and under 50ms average execution at 100-500 events/s. Its own guarantees page lists consistently 10k+ tasks/s as not a good fit.
- Verdict: fails embeddable. Worth borrowing: batched inserts and in-memory buffers with backpressure.

### Inngest
- Sources: https://github.com/inngest/inngest, https://inngest.com/blog/inngest-1-0-announcing-self-hosting-support
- ~6.0k stars; GitHub license field is "NOASSERTION" [V]. The server and CLI were SSPL and moved to delayed open source publication (Apache 2.0 after about 3 years). SDKs are Apache-2.0.
- It needs a separate Inngest server. Fails embeddable and has a license concern.

### Trigger.dev
- Sources: https://github.com/triggerdotdev/trigger.dev, https://trigger.dev/docs/self-hosting/docker
- [V]: Apache-2.0, ~16.6k stars, pushed 2026-10-18.
- v4 self-hosting needs a webapp, Postgres, Redis, a Docker-socket supervisor, a registry and object storage. Minimum worker sizing is 4 vCPU and 8 GB. It is a platform, so it fails embeddable.

### Restate
- Sources: https://docs.restate.dev/get-restate, https://github.com/restatedev/restate, https://github.com/restatedev/sdk-typescript
- The server is BSL (GitHub license field "Other"); SDKs are MIT. The server is a separate binary with its own journal storage [K].
- Fails embeddable and has a BSL concern. Worth borrowing: the journal-per-invocation model and durable promises or awakeables.

### Temporal (TS SDK)
- Sources: https://github.com/temporalio/sdk-typescript (MIT, ~939 stars), https://docs.temporal.io/dev-guide/typescript/project-setup
- A separate Temporal Server (MIT) is required. The `start-dev` CLI uses an in-memory database "for local development only", and `TestWorkflowEnvironment` is test-only.
- There is no production-viable embedded mode, so it fails embeddable. Worth borrowing: signals, queries and updates semantics.

### Mastra
- Sources: https://github.com/mastra-ai/mastra (~17.3k stars), https://mastra.ai/docs/community/licensing
- Apache-2.0 except `ee/` directories, which fall under the Mastra Enterprise License. Not confirmed whether the workflows engine sits outside `ee/`.
- An AI-agent framework with suspend/resume snapshots [K]. Saga and cron support are unverified. Weak fit.

### Effect workflow
- Sources: https://effect.website/docs/v4/api/effect/unstable/workflow/Workflow, https://github.com/Effect-TS/effect
- ~28.9k stars; GitHub license field "Other" [V].
- Activities, `DurableDeferred` (external completion by token) and a compensation finalizer. The v4 docs place it under `effect/unstable/workflow`, and say compensation is registered only for top-level effects, not nested activities.
- Requires adopting the Effect runtime. Cluster SQL persistence status was not verified.

### Others
- LangGraph.js (MIT, Postgres checkpointers) [K]: graph-state checkpoints for agents, with no saga, no cron and no distribution model. Weak fit.
- xstate (MIT) [K]: state machines and snapshot serialization only, with no engine, queue or durable timers. Weak fit.
- workflow-es / Workflow Core ports: could not verify maintenance or license. Low confidence, not recommended.
- Windmill: core AGPLv3, with Apache-2.0 clients and proprietary enterprise code. A server platform. Fails embeddable and has license concerns. https://isitreallyfoss.com/projects/windmill/
- Kestra: https://github.com/kestra-io/kestra. Apache-2.0, ~29.8k stars, Java server [V]. Fails embeddable.
- Motia: https://github.com/MotiaDev/motia. Engine is Elastic License 2.0, SDKs Apache-2.0, and workers need the Rust "iii" engine [V]. Fails embeddable and has a license concern.
- Upstash Workflow: built on the hosted QStash service. The local dev server is for development only [K, weak source]. Fails.
- pg_durable (Microsoft): https://github.com/microsoft/pg_durable. A Rust Postgres extension (PG 17), ~2.8k stars, license shown as "Other", preview-stage, SQL DSL only [V]. Not a fit, but worth watching.
- Not evaluated: Sidequest.js (a BullMQ-style job runner), Solid Objects (seen only in an HN post), Resonate (did not appear in search).

## 3. Comparison table

| Candidate | Embeddable lib | PG/Redis only | TS | License | Saga | External async completion | Cron | Child workflows | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| DBOS Transact TS | Yes | PG | Native | MIT | Build it | recv/setEvent | Yes | Yes | Best adopt candidate, model mismatch |
| Absurd | Yes | PG | Yes (SDK) | Apache-2.0 | Build it | awaitEvent | No (DIY) | Yes | Best design to borrow, pre-1.0 |
| Vercel Workflow + PG world | Partial (framework host) | PG | Native | Apache-2.0 | Unverified | Hooks | Unverified | Yes [K] | Reference-grade PG world, incompatible model |
| pgflow | Partial | PG plus Supabase pieces | Yes | Apache-2.0 | No | No | Via pg_cron | DAG only | Borrow the DAG model |
| BullMQ | Yes | Redis, or PG (new) | Yes | MIT | No | No (job events only) | Yes | Flows (job trees) | Substrate |
| pg-boss | Yes | PG | Yes | MIT | No | No | Yes | Basic dependencies | Substrate |
| Graphile Worker | Yes | PG | Yes | MIT | No | No | Yes [K] | No | Substrate |
| Effect workflow | Yes (Effect runtime) | SQL | Yes | GitHub shows "Other" | Partial | DurableDeferred | Unverified | Yes | Needs a runtime rewrite, unstable |
| Mastra | Yes | Pluggable | Yes | Apache-2.0 plus ee/ | Unverified | Suspend/resume | Unverified | Unverified | Weak fit |
| LangGraph.js, xstate | Yes | PG checkpointer, or none | Yes | MIT [K] | No | Interrupts [K] | No | Subgraphs [K] | Weak fit |
| Hatchet | No (server) | PG | SDK | MIT | Unverified | Yes [K] | Yes | Yes | Fails embeddable |
| Inngest | No (server) | PG and Redis [K] | SDK | SSPL / DOSP server | Unverified | Yes [K] | Yes | Yes | Fails embeddable and license |
| Trigger.dev | No (platform) | PG and Redis plus more | SDK | Apache-2.0 | Unverified | Yes [K] | Yes | Yes | Fails embeddable |
| Restate | No (server) | Own storage | SDK (MIT) | Server BSL | Unverified | Awakeables [K] | Unverified | Yes | Fails embeddable and license |
| Temporal | No (server) | PG via server | SDK (MIT) | MIT | Sample patterns [K] | Signals | Yes | Yes | Fails embeddable |
| Windmill | No | PG | Scripts | AGPL / proprietary mix | Unverified | Yes [K] | Yes | Yes | Fails embeddable and license |
| Kestra | No (JVM) | PG, Kafka [K] | No | Apache-2.0 | Unverified | Yes [K] | Yes | Yes | Fails embeddable and TS |
| Motia | No (iii engine) | Unclear | SDK | ELv2 engine | Unverified | Unverified | Yes | Unverified | Fails embeddable and license |
| Upstash Workflow | No (hosted) | Neither | Yes | Service not open | Unverified | Yes | Yes | Yes | Fails |
| pg_durable | Extension | PG 17 | No (SQL DSL) | Unverified | No | No | Yes | No | Fails |

## 4. Shortlist, ranked
1. **Build your own engine, borrowing from DBOS and Absurd, on Postgres with Redis pub/sub.**
   - Keep the existing DSL and Medusa's checkpoint semantics.
   - Absurd shows how little is needed: claim with leases, step checkpoints, an event cache, spawn and await, watchdogs.
   - DBOS shows the full feature surface: queue flow control, signals, workflow timeouts that cancel children, fork.
2. **DBOS Transact TS as the core engine (adopt).** MIT, Postgres-only, in-process, with cron, queues, signals, timeouts and idempotency. The cost is the replay and determinism model, no saga primitive, and dependence on DBOS's schema and release cadence.
3. **Absurd as base or fork.** Small and readable, with events and child tasks. You would add cron, per-step timeouts, retention and partitioning, and compensation. Pre-1.0 and single-maintainer risk.
4. **pg-boss, Graphile Worker or BullMQ as substrate** under the custom engine, for retries, cron, delayed jobs and fan-out. BullMQ is easiest if staying Redis-first, since Medusa already has a Redis engine [K].
5. **Vercel Workflow with the Postgres world** as a design reference only: an event log plus hooks. Its own docs call the Postgres world not optimized for scale, speed or security, and it needs a framework host.

## 5. Build vs adopt given DSL backwards compatibility
- Constraint: `createWorkflow`/`createStep` with per-step compensation needs compensation ordering, step-level retry intervals and timeouts, async steps completed externally, hooks, and `transactionId` idempotency. The current engine [K] persists a transaction state machine (checkpoint model), not a replay log.
- Adopting a replay engine such as DBOS:
  - The DSL compiles to a static flow graph, so mapping it to imperative replayed code is possible. You then inherit determinism rules and versioning problems.
  - Compensation would have to be implemented by the adapter, which is where most bugs would live.
  - The upside is mature crash recovery, queue flow control and ops tooling, and less code to own.
- Building on a checkpoint-style store:
  - You keep exact semantics, and no determinism constraint leaks to users.
  - You own correctness: locking, leases, retention, timeouts, cron, observability. Absurd's and DBOS's designs shorten the path.
  - Lowest-risk route: a Postgres persistence layer with claim and lease plus a Redis or LISTEN/NOTIFY wake-up, with pg-boss or Graphile Worker for scheduled workflows and delayed retries.
- Mixed approach: define a storage and queue interface (as Vercel's "World" does) so Postgres and the existing Redis implementation coexist, and migrate gradually.
- To verify before deciding:
  - DBOS: saga patterns, per-step timeouts, multi-executor recovery.
  - Absurd: cancellation and timeout semantics.
  - Licenses: Effect, Mastra `ee/` boundaries, pg_durable, Restate's current BSL terms.
  - Independent benchmarks for any candidate.

## Sources
- DBOS: https://github.com/dbos-inc/dbos-transact-ts, https://docs.dbos.dev/typescript/tutorials/workflow-tutorial, https://dbos.dev/blog/dbos-transact-v2-typescript, https://dbos.dev/compare/dbos-vs-temporal, https://runtimewire.com/article/dbos-postgres-queues-30600-workflows-per-second
- Absurd: https://github.com/earendil-works/absurd, https://lucumr.pocoo.org/2025/11/3/absurd-workflows/, https://lucumr.pocoo.org/2026/4/4/absurd-in-production/
- Vercel Workflow: https://github.com/vercel/workflow, https://workflow-sdk.dev/worlds/postgres
- pgflow: https://github.com/pgflow-dev/pgflow
- BullMQ: https://github.com/taskforcesh/bullmq, https://docs.bullmq.io/guide/postgresql, https://docs.bullmq.io/guide/flows/
- Queues: https://github.com/timgit/pg-boss, https://github.com/graphile/worker
- Hatchet: https://github.com/hatchet-dev/hatchet, https://hatchet.run/launch-week-01/v1-engine, https://docs.hatchet.run/self-hosting/benchmarking, https://docs.hatchet.run/guarantees-and-tradeoffs
- Inngest: https://github.com/inngest/inngest, https://inngest.com/blog/inngest-1-0-announcing-self-hosting-support
- Trigger.dev: https://github.com/triggerdotdev/trigger.dev, https://trigger.dev/docs/self-hosting/docker
- Restate: https://docs.restate.dev/get-restate, https://github.com/restatedev/restate, https://github.com/restatedev/sdk-typescript
- Temporal: https://github.com/temporalio/sdk-typescript, https://docs.temporal.io/dev-guide/typescript/project-setup
- Mastra: https://mastra.ai/docs/community/licensing, https://github.com/mastra-ai/mastra
- Effect: https://effect.website/docs/v4/api/effect/unstable/workflow/Workflow, https://github.com/Effect-TS/effect
- Others: https://isitreallyfoss.com/projects/windmill/, https://github.com/kestra-io/kestra, https://github.com/MotiaDev/motia, https://upstash.com/workflow/howto/local-development, https://microsoft.github.io/pg_durable/, https://github.com/microsoft/pg_durable
