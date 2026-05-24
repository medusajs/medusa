# 🏛️ Architecture Decision Records (ADR Framework)

> "Capture the 'Why', not just the 'What'."

---

## 🏗️ ADR Template

### ADR-[Number]: [Title]
- **Date**: [YYYY-MM-DD]
- **Status**: [Proposed / Accepted / Superseded]
- **Context**: [Problem description, user needs, constraints]
- **Decision**: [The choice made]
- **Rationale**: [Why this choice? (e.g., Performance, Cost, Complexity)]
- **Alternatives Considered**:
  - [Option A]: [Pros/Cons]
  - [Option B]: [Pros/Cons]
- **Consequences**: [Impact on performance, maintenance, future scaling]

---

## ⚖️ Trade-off Evaluation Framework

When evaluating architecture choices, use the **MAESTRO Scale (1-5)**:

1. **Simplicity** (KISS): Higher is simpler.
2. **Performance**: Higher is faster.
3. **Reliability**: Higher is more stable.
4. **Maintainability**: Higher is easier to update.
5. **Cost (Token/Resource)**: Higher is cheaper.

### Example Comparison:

| Option | Simplicity | Performance | Cost | Decision |
|--------|------------|-------------|------|----------|
| **Redis** | 3 | 5 | 2 | ✅ Best for speed |
| **Memcached** | 4 | 4 | 3 | ❌ Good but limited |

---

## 🚫 Anti-Patterns to Flag
- **"Resume-Driven Development"**: Picking complex tools just to use them.
- **"Golden Hammer"**: Using the same tool (e.g., PostgreSQL) for everything (e.g., Search, Cache).
- **"Silent Pivot"**: Changing core architecture without an ADR.

---

## ✅ ADR Workflow
1. **Identify Change**: If it affects >2 modules or long-term data flow.
2. **Write Draft**: Present options to user.
3. **Confirm**: Get user approval.
4. **Log**: Save to `docs/adr/ADR-XXX.md`.
