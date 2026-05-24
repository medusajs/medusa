---
name: system-design-patterns
description: Reference patterns for distributed systems (DDIA), scalable architecture (Alex Xu), and pragmatic SRE. Loaded by backend-specialist and devops-engineer when working on system design, scaling, data architecture, or reliability concerns.
---

# System Design Patterns

ultrathink

> "Хорошо написанная программа — это программа, написанная два раза." — Refactoring truth.
> "Кубернетис — как ИКЕА: инструкция есть, но собирать будешь три дня с матами." — K8s onboarding.

Reference knowledge for distributed systems, scalable architecture, and site reliability.

---

## Distributed Systems (DDIA — Kleppmann)

### Fallacies of Distributed Computing

- **Network is Unreliable**: Always add timeouts, retries with exponential backoff + jitter. Never assume a request arrived.
- **Clocks are Untrustworthy**: Server clocks drift. Don't use Last-Write-Wins (LWW) based on system timestamps alone. Use logical clocks or version vectors for conflict resolution.

### State & Event Logs

- **Log is Truth**: Treat the database as a derived materialized view from an event log. The log is the source of truth.
- **Change Data Capture (CDC)**: To sync data between systems (e.g., DB → Elasticsearch), use Outbox pattern or DB log listeners (Debezium). Never "dual write" from application code.

### Concurrency & Transactions

- **Know Your Isolation Levels**: `READ COMMITTED` does NOT prevent Write Skew. Understand what your isolation level actually guarantees.
- **Preventing Lost Updates**:
  - Counters → atomic operations: `UPDATE val = val + 1`
  - Reads before writes → explicit locks: `SELECT ... FOR UPDATE`
  - Optimistic approach → version column / compare-and-swap

### Replication & Partitioning

- **Split Brain**: Multi-leader systems need explicit conflict resolution logic.
- **Eventual Consistency**: Account for replication lag. After user writes, route their reads to the master node (Read-your-writes consistency).
- **Hot Spots**: When sharding, beware "hot keys." Add salt to the hash to distribute load.

---

## Scalable Architecture (Alex Xu — System Design)

### Scaling from Zero to Millions

- **Stateless Web Tier**: Servers must not store session state. State belongs in Redis/Memcached.
- **Redundancy**: Avoid SPOF. Replicate data, duplicate services behind load balancers.
- **Caching**: Cache frequent reads. CDN for static assets.

### Decoupling & Async Processing

- **Message Queues**: Use brokers (RabbitMQ, SQS, Kafka) as buffers during traffic spikes.
- **DAG Processing**: Break heavy tasks into directed graphs, process in parallel via queues.

### API Protection

- **Rate Limiting**: Protect public APIs with Token Bucket or Sliding Window algorithms.

### Data Distribution

- **Consistent Hashing**: For cache sharding, use consistent hashing with virtual nodes.
- **Delta Sync**: When syncing large files, transfer only changed blocks (chunks).

---

## Site Reliability Engineering (Google SRE)

### Error Budgets

- **100% Uptime is Impossible**: Target 99.9% or 99.99%. The remainder is your error budget for releases and incidents.
- **Stop the Line**: When error budget is exhausted, freeze features. Fix tech debt only.

### Eliminating Toil

- **Toil is Toxic**: If you do a manual, repetitive task twice — automate it.

### Four Golden Signals

Monitor these and alert only when human action is needed:

| Signal         | What to measure                   |
| -------------- | --------------------------------- |
| **Latency**    | p99 response time                 |
| **Traffic**    | QPS / bytes per second            |
| **Errors**     | HTTP 5xx rate                     |
| **Saturation** | CPU, RAM, I/O — alert BEFORE 100% |

### Overload & Cascading Failures

- **Exponential Backoff + Jitter**: Clients must increase retry delay + add randomness to avoid thundering herd.
- **Graceful Degradation**: Under overload, return partial/cached response rather than HTTP 500.

### Rollouts & Incidents

- **Canary Releases**: Roll out to 1% of servers first. Auto-rollback on error spike.
- **Blameless Postmortems**: Find the system failure, not the person. Fix the process.
- **Triage Over Root-Cause**: Mitigate first (rollback, restart), investigate later. Prod must recover in <5 minutes.

---

## Pragmatic Survival

### Actionable Alerts

- **Delete Noisy Alerts**: If an alert doesn't require immediate human action — delete it.
- **Symptom-Based**: Alert on symptoms (user can't log in), not causes (CPU at 80%).

### Internal Tooling

- **Treat Tools as Production Code**: Debug scripts, migration tools, admin panels — build them as reliable CLIs with validation, not throwaway bash scripts.

---

## DORA Metrics (High-Velocity Engineering)

| Metric                    | What it measures                   |
| ------------------------- | ---------------------------------- |
| **Deployment Frequency**  | How often you ship to prod         |
| **Lead Time for Changes** | Commit → prod time                 |
| **MTTR**                  | Mean time to restore after failure |
| **Change Failure Rate**   | % of deployments causing incidents |

### Trunk-Based Development

- **No Long-Lived Branches**: Branches live max 1-2 days. Merge to `main` daily.
- **Feature Flags**: Hide unfinished work behind flags, not branches.
- **Loosely Coupled**: Teams deploy independently.
