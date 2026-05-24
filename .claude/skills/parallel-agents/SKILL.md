---
name: parallel-agents
description: Orchestration logic for multi-agent coordination. Use when delegating tasks to sub-agents (Jules, Valera, etc.) or when multiple agents work on the same project.
allowed-tools: Read, Write, Edit
---

# 🎼 Agent Orchestration & Delegation Logic

ultrathink

> "Человечек сориентирует." — Valera delegates to a sub-routine.
> "В городе новый шериф." — Each agent rules their own domain.

> "One Maestro, many performers. No overlapping, no confusion."

---

## 🏗️ The Delegation Protocol

When the **Maestro** (Orchestrator) delegates a task:

1. **Context Compression**: Provide ONLY the necessary context (interfaces, schemas, specific files) to the sub-agent.
2. **Clear Boundaries**: Define what the sub-agent is NOT allowed to touch.
3. **Atomic Result**: The sub-agent must return a concise summary of changes and a verification result.

---

## 🛠️ Multi-Agent Interaction Workflow

### Step 1: Sub-Task Identification
Break the request into independent chunks (e.g., Frontend UI vs. Backend API).

### Step 2: Agent Assignment
Assign based on the **Maestro Mapping**:
- **Backend Specialist**: API, DB, Server logic.
- **Frontend Specialist**: UI, CSS, React components.
- **DevOps Engineer**: CI/CD, Deployment, Monitoring.
- **Debugger**: Root cause analysis and fixes.

### Step 3: Synchronization (The "Handover")
If Agent A depends on Agent B (e.g., Frontend needs API schema), Agent B must complete its task and provide the **Contract** (JSON schema, Type definitions) before Agent A starts.

---

## 🧠 Context Management Strategy

- **Shared Memory**: Use `.agent/shared/` for common types, schemas, and ADRs.
- **Status Updates**: Each sub-agent updates its status in the task tracking file (`{task-slug}.md`).
- **Conflict Resolution**: If two agents touch the same file, the **Orchestrator** must merge changes or sequence the tasks.

---

## 🚫 Anti-Patterns to Flag
- **"The Fog of War"**: Giving sub-agents the entire codebase without specific instructions.
- **"The Echo Chamber"**: Multiple agents reporting the same findings.
- **"Circular Dependency"**: Agent A waiting for Agent B, while Agent B waits for Agent A.

---

## ✅ Orchestration Checklist

- [ ] Task broken into atomic sub-tasks?
- [ ] Each sub-task assigned to the correct specialist?
- [ ] Dependencies between agents identified?
- [ ] Shared schemas/contracts provided?
- [ ] Verification steps defined for each agent?
