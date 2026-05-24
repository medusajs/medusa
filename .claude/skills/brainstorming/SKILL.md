---
name: brainstorming
description: Socratic questioning protocol + user communication. MANDATORY for complex requests, new features, or unclear requirements. Includes progress reporting and error handling.
allowed-tools: Read, Glob, Grep
---

# Brainstorming & Communication Protocol

ultrathink

> "Обрисуй ситуацию. Обрисуй персонажей." — Valera wants context before anything.
> "Тема мутная, надо покачать." — Complex / undocumented issue.

> **MANDATORY:** Use for complex/vague requests, new features, updates.

---

## Modes — Explore vs. Scrutinize

This skill has two directional modes. The invoking command/agent MUST pick one.

### 🧠 `explore` mode (forward-looking)

**Use before work starts.** Entry point: `/brainstorm` command, `brainstorm` agent, agents invoking this skill at spec time.

**Goal**: generate 3+ viable approaches, compare tradeoffs, let user pick direction.

**Process**:
1. Socratic gate first (see below) — don't generate options on a vague request.
2. Produce ≥3 options: A / B / C, each with pros, cons, effort.
3. Consider at least one unconventional option — don't just pick the 3 most obvious.
4. Recommend one with reasoning, but defer final choice to user.
5. No code in output.

**Checklist — what a good explore output has**:

- [ ] ≥3 options on meaningfully different axes (not "with X vs without X")
- [ ] Honest cons, including "hidden" complexity (migration cost, vendor lock-in, team skills)
- [ ] Effort estimate (Low/Medium/High), not time estimate
- [ ] One recommendation with "because" clause
- [ ] Explicit invitation: "Which direction?"

### 🔎 `scrutinize` mode (backward- / sideways-looking)

**Use mid-task or before claiming done.** Entry point: `/questions_ideas` command, agents auditing a draft plan or near-complete implementation.

**Goal**: devil's advocate pass. Find what's untested, unquestioned, unhandled — before reality finds it.

**Process**: produce four lists. Be blunt. If a category is empty, say so explicitly ("assumptions: none identified — suspicious, re-check"); do not pad.

1. **Untested Assumptions** — things we believe without verifying. Name each assumption and what would disprove it.
2. **Failure Modes** — how does this break? Network down, bad input, race condition, partial state, rollback needed. List concrete scenarios, not generic "error handling".
3. **Edge Cases by Taxonomy** — walk a standard taxonomy:
   - Empty / null / undefined / zero / negative
   - Boundary (first, last, overflow)
   - Concurrent (two writers, reader during write, version mismatch)
   - Stale (cache, token expired, schema migrated)
   - Malicious (injection, oversized, malformed)
   - Platform (Windows paths, timezone, locale, unicode, encoding)
4. **Rejected Alternatives** — approaches we implicitly skipped. For each: did we evaluate it? Is the skip justified? If the user/team made the choice elsewhere, link that decision.

**Output format for `scrutinize` mode**:

```markdown
## 🔎 Scrutiny: [what's being reviewed]

### Untested Assumptions
- [ ] **[assumption]** — disproved by: [concrete test]
- [ ] ...

### Failure Modes
- [ ] **[scenario]** — what happens now: [behavior]; what should happen: [expected]
- [ ] ...

### Edge Cases
- [ ] Empty/null: ...
- [ ] Boundary: ...
- [ ] Concurrent: ...
- [ ] Stale: ...
- [ ] Malicious: ...
- [ ] Platform: ...

### Rejected Alternatives
- [ ] **[approach X]** — rejected because: [reason] (or: "not evaluated — should we?")

### Recommended Actions
- Priority 1 (blocking): ...
- Priority 2 (before ship): ...
- Priority 3 (tech debt / note only): ...
```

**Checklist — what a good scrutinize output has**:

- [ ] At least one item per category (or explicit "none identified — suspicious").
- [ ] Each assumption has a falsification test — not abstract "we assume Y works", but "if we run X and get Z, assumption Y is false".
- [ ] Edge cases are *specific to this feature*, not generic textbook items.
- [ ] Blunt about what would block shipping vs what's a nice-to-have.

---

## 🛑 SOCRATIC GATE (applies to BOTH modes — ENFORCEMENT)

### When to Trigger

| Pattern | Action |
|---------|--------|
| "Build/Create/Make [thing]" without details | 🛑 ASK 3 questions |
| Complex feature or architecture | 🛑 Clarify before implementing |
| Update/change request | 🛑 Confirm scope |
| Vague requirements | 🛑 Ask purpose, users, constraints |

### 🚫 MANDATORY: 3 Questions Before Implementation

1. **STOP** - Do NOT start coding
2. **ASK** - Minimum 3 questions:
   - 🎯 Purpose: What problem are you solving?
   - 👥 Users: Who will use this?
   - 📦 Scope: Must-have vs nice-to-have?
3. **WAIT** - Get response before proceeding

---

## 🧠 Dynamic Question Generation

**⛔ NEVER use static templates.** Read `dynamic-questioning.md` for principles.

### Core Principles

| Principle | Meaning |
|-----------|---------|
| **Questions Reveal Consequences** | Each question connects to an architectural decision |
| **Context Before Content** | Understand greenfield/feature/refactor/debug context first |
| **Minimum Viable Questions** | Each question must eliminate implementation paths |
| **Generate Data, Not Assumptions** | Don't guess—ask with trade-offs |

### Question Generation Process

```
1. Parse request → Extract domain, features, scale indicators
2. Identify decision points → Blocking vs. deferable
3. Generate questions → Priority: P0 (blocking) > P1 (high-leverage) > P2 (nice-to-have)
4. Format with trade-offs → What, Why, Options, Default
```

### Question Format (MANDATORY)

```markdown
### [PRIORITY] **[DECISION POINT]**

**Question:** [Clear question]

**Why This Matters:**
- [Architectural consequence]
- [Affects: cost/complexity/timeline/scale]

**Options:**
| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| A | [+] | [-] | [Use case] |

**If Not Specified:** [Default + rationale]
```

**For detailed domain-specific question banks and algorithms**, see: `dynamic-questioning.md`

---

## Progress Reporting (PRINCIPLE-BASED)

**PRINCIPLE:** Transparency builds trust. Status must be visible and actionable.

### Status Board Format

| Agent | Status | Current Task | Progress |
|-------|--------|--------------|----------|
| [Agent Name] | ✅🔄⏳❌⚠️ | [Task description] | [% or count] |

### Status Icons

| Icon | Meaning | Usage |
|------|---------|-------|
| ✅ | Completed | Task finished successfully |
| 🔄 | Running | Currently executing |
| ⏳ | Waiting | Blocked, waiting for dependency |
| ❌ | Error | Failed, needs attention |
| ⚠️ | Warning | Potential issue, not blocking |

---

## Error Handling (PRINCIPLE-BASED)

**PRINCIPLE:** Errors are opportunities for clear communication.

### Error Response Pattern

```
1. Acknowledge the error
2. Explain what happened (user-friendly)
3. Offer specific solutions with trade-offs
4. Ask user to choose or provide alternative
```

### Error Categories

| Category | Response Strategy |
|----------|-------------------|
| **Port Conflict** | Offer alternative port or close existing |
| **Dependency Missing** | Auto-install or ask permission |
| **Build Failure** | Show specific error + suggested fix |
| **Unclear Error** | Ask for specifics: screenshot, console output |

---

## Completion Message (PRINCIPLE-BASED)

**PRINCIPLE:** Celebrate success, guide next steps.

### Completion Structure

```
1. Success confirmation (celebrate briefly)
2. Summary of what was done (concrete)
3. How to verify/test (actionable)
4. Next steps suggestion (proactive)
```

---

## Communication Principles

| Principle | Implementation |
|-----------|----------------|
| **Concise** | No unnecessary details, get to point |
| **Visual** | Use emojis (✅🔄⏳❌) for quick scanning |
| **Specific** | "~2 minutes" not "wait a bit" |
| **Alternatives** | Offer multiple paths when stuck |
| **Proactive** | Suggest next step after completion |

---

## Anti-Patterns (AVOID)

| Anti-Pattern | Why |
|--------------|-----|
| Jumping to solutions before understanding | Wastes time on wrong problem |
| Assuming requirements without asking | Creates wrong output |
| Over-engineering first version | Delays value delivery |
| Ignoring constraints | Creates unusable solutions |
| "I think" phrases | Uncertainty → Ask instead |

---
