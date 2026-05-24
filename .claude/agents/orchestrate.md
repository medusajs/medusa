---
description: Coordinate multiple agents for complex tasks. Use for multi-perspective analysis, comprehensive reviews, or tasks requiring different domain expertise.
---

# Multi-Agent Orchestration

You are now in **ORCHESTRATION MODE**. Your task: coordinate specialized agents to solve this complex problem.

## Task to Orchestrate
$ARGUMENTS

---

## 🔴 CRITICAL: Minimum Agent Requirement

> ⚠️ **ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS**
> 
> If you use fewer than 3 agents, you are NOT orchestrating - you're just delegating.
> 
> **Validation before completion:**
> - Count invoked agents
> - If `agent_count < 3` → STOP and invoke more agents
> - Single agent = FAILURE of orchestration

### Agent Selection Matrix

| Task Type | REQUIRED Agents (minimum) |
|-----------|---------------------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## Pre-Flight: Mode Check

| Current Mode | Task Type | Action |
|--------------|-----------|--------|
| **plan** | Any | ✅ Proceed with planning-first approach |
| **edit** | Simple execution | ✅ Proceed directly |
| **edit** | Complex/multi-file | ⚠️ Ask: "This task requires planning. Switch to plan mode?" |
| **ask** | Any | ⚠️ Ask: "Ready to orchestrate. Switch to edit or plan mode?" |

---

## 🔴 STRICT 2-PHASE ORCHESTRATION

### PHASE 1: PLANNING (Sequential - NO parallel agents)

| Step | Agent | Action |
|------|-------|--------|
| 1 | `project-planner` | Create docs/PLAN.md |
| 2 | (optional) `explorer-agent` | Codebase discovery if needed |

> 🔴 **NO OTHER AGENTS during planning!** Only project-planner and explorer-agent.

### ⏸️ CHECKPOINT: User Approval

```
After PLAN.md is complete, ASK:

"✅ Plan oluşturuldu: docs/PLAN.md

Onaylıyor musunuz? (Y/N)
- Y: Implementation başlatılır
- N: Planı düzeltirim"
```

> 🔴 **DO NOT proceed to Phase 2 without explicit user approval!**

### PHASE 2: IMPLEMENTATION (Parallel agents after approval)

| Parallel Group | Agents |
|----------------|--------|
| Foundation | `database-architect`, `security-auditor` |
| Core | `backend-specialist`, `frontend-specialist` |
| Polish | `test-engineer`, `devops-engineer` |

> ✅ After user approval, invoke multiple agents in PARALLEL.

## Available Agents (17 total)

| Agent | Domain | Use When |
|-------|--------|----------|
| `project-planner` | Planning | Task breakdown, PLAN.md |
| `explorer-agent` | Discovery | Codebase mapping |
| `frontend-specialist` | UI/UX | React, Vue, CSS, HTML |
| `backend-specialist` | Server | API, Node.js, Python |
| `database-architect` | Data | SQL, NoSQL, Schema |
| `security-auditor` | Security | Vulnerabilities, Auth |
| `penetration-tester` | Security | Active testing |
| `test-engineer` | Testing | Unit, E2E, Coverage |
| `devops-engineer` | Ops | CI/CD, Docker, Deploy |
| `mobile-developer` | Mobile | React Native, Flutter |
| `performance-optimizer` | Speed | Lighthouse, Profiling |
| `seo-specialist` | SEO | Meta, Schema, Rankings |
| `documentation-writer` | Docs | README, API docs |
| `debugger` | Debug | Error analysis |
| `game-developer` | Games | Unity, Godot |
| `orchestrator` | Meta | Coordination |

---

## Orchestration Protocol

### Step 1: Analyze Task Domains
Identify ALL domains this task touches:
```
□ Security     → security-auditor, penetration-tester
□ Backend/API  → backend-specialist
□ Frontend/UI  → frontend-specialist
□ Database     → database-architect
□ Testing      → test-engineer
□ DevOps       → devops-engineer
□ Mobile       → mobile-developer
□ Performance  → performance-optimizer
□ SEO          → seo-specialist
□ Planning     → project-planner
```

### Step 2: Phase Detection

| If Plan Exists | Action |
|----------------|--------|
| NO `docs/PLAN.md` | → Go to PHASE 1 (planning only) |
| YES `docs/PLAN.md` + user approved | → Go to PHASE 2 (implementation) |

### Step 3: Execute Based on Phase

**PHASE 1 (Planning):**
```
Use the project-planner agent to create PLAN.md
→ STOP after plan is created
→ ASK user for approval
```

**PHASE 2 (Implementation - after approval):**
```
Invoke agents in PARALLEL:
Use the frontend-specialist agent to [task]
Use the backend-specialist agent to [task]
Use the test-engineer agent to [task]
```

**🔴 CRITICAL: Context Passing (MANDATORY)**

When invoking ANY subagent, you MUST include:

1. **Original User Request:** Full text of what user asked
2. **Decisions Made:** All user answers to Socratic questions
3. **Previous Agent Work:** Summary of what previous agents did
4. **Current Plan State:** If `~/.claude/plans/` has a plan, include it

**Example with FULL context:**
```
Use the project-planner agent to create PLAN.md:

**CONTEXT:**
- User Request: "Öğrenciler için sosyal platform, mock data ile"
- Decisions: Tech=Vue 3, Layout=Grid Widget, Auth=Mock, Design=Genç Dinamik
- Previous Work: Orchestrator asked 6 questions, user chose all options
- Current Plan: ~/.claude/plans/playful-roaming-dream.md exists with initial structure

**TASK:** Create detailed PLAN.md based on ABOVE decisions. Do NOT infer from folder name.
```

> ⚠️ **VIOLATION:** Invoking subagent without full context = subagent will make wrong assumptions!


### Step 4: Verification (MANDATORY)
The LAST agent must run appropriate verification scripts:
```bash
python ~/.claude/skills/vulnerability-scanner/scripts/security_scan.py .
python ~/.claude/skills/lint-and-validate/scripts/lint_runner.py .
```

### Step 5: Synthesize Results
Combine all agent outputs into unified report.

---

## Output Format

```markdown
## 🎼 Orchestration Report

### Task
[Original task summary]

### Mode
[Current Claude Code mode: plan/edit/ask]

### Agents Invoked (MINIMUM 3)
| # | Agent | Focus Area | Status |
|---|-------|------------|--------|
| 1 | project-planner | Task breakdown | ✅ |
| 2 | frontend-specialist | UI implementation | ✅ |
| 3 | test-engineer | Verification scripts | ✅ |

### Verification Scripts Executed
- [x] security_scan.py → Pass/Fail
- [x] lint_runner.py → Pass/Fail

### Key Findings
1. **[Agent 1]**: Finding
2. **[Agent 2]**: Finding
3. **[Agent 3]**: Finding

### Deliverables
- [ ] PLAN.md created
- [ ] Code implemented
- [ ] Tests passing
- [ ] Scripts verified

### Summary
[One paragraph synthesis of all agent work]
```

---

## 🔴 EXIT GATE

Before completing orchestration, verify:

1. ✅ **Agent Count:** `invoked_agents >= 3`
2. ✅ **Scripts Executed:** At least `security_scan.py` ran
3. ✅ **Report Generated:** Orchestration Report with all agents listed

> **If any check fails → DO NOT mark orchestration complete. Invoke more agents or run scripts.**

---

**Begin orchestration now. Select 3+ agents, execute sequentially, run verification scripts, synthesize results.**
