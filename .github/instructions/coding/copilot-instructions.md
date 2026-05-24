# AI_CODING_prompt.md

## Metadata

| Field         | Value                                                                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Version**   | 2.0.0                                                                                                                                                                                         |
| **Updated**   | 2026-03-13                                                                                                                                                                                    |
| **Scope**     | Universal Coding Standards (stack-agnostic)                                                                                                                                                   |
| **Agents**    | Domain expertise lives in `.claude/agents/*.md`                                                                                                                                               |
| **Changelog** | v2.0.0 — Refactored: moved domain content to agents, added MUST/SHOULD, quick commands, stop conditions, code examples, versioning. Reduced from 530→200 lines. v1.0.0 — Monolith (Feb 2026). |

---

## 1. Instruction Priority (MUST vs SHOULD)

**MUST** = Non-negotiable. Violation = broken build, security hole, or data loss.
**SHOULD** = Strong recommendation. Override only with explicit reason stated.

---

## 2. Standing Orders — MUST (All Agents, All Tasks)

1. **MUST** Never execute database migrations directly. Generate `.sql` files for review.
2. **MUST** Never use `--force`, `--yes`, `-y` or any bypass flags. If tool asks confirmation — stop, ask user.
3. **MUST** Never put API keys, passwords, or secrets in code, commits, or logs.
4. **MUST** Never install packages without explicit approval. Confirm exact name first.
5. **MUST** Never run destructive commands (`rm -rf`, `DROP TABLE`, `git push --force`) without triple-confirmed consent.
6. **MUST** Never commit, push, or deploy without explicit user request.
7. **MUST** Never read `.env`, `.env.*`, `~/.ssh/`, or secret files unless user explicitly asks.

---

## 3. Stop Conditions — MUST

**Stop coding and present a plan FIRST if:**

- Change touches **>3 files** → outline which files and why before editing.
- **≥2 valid approaches** exist → list pros/cons, let user choose.
- You're **unsure about a library API** → check context7 docs BEFORE writing code.
- Task is **ambiguous** → ask 3-5 clarifying questions (Interview Mode).
- You're about to **delete or rename** a public API/export → confirm with user.
- Confidence on a specific fact/API < 0.85 → flag it: "Проверь, я не уверен на 100%."

---

## 4. Universal Engineering Principles — SHOULD

These apply to ALL code, regardless of stack or domain:

- **SHOULD** Readability First — code is read 10x more than written.
- **SHOULD** DRY — flag duplication, abstract common logic.
- **SHOULD** KISS — simple > clever. Explicit > implicit.
- **SHOULD** YAGNI — implement only what's requested. No speculative features.
- **SHOULD** Crash Early — terminate > silent corruption. Don't swallow errors.
- **SHOULD** Program Deliberately — understand WHY code works, not "it just does."
- **SHOULD** No Broken Windows — fix bad code immediately or leave a TODO with ticket.
- **SHOULD** Boring is Good — reliable code is predictable code. No detective stories in prod.
- **SHOULD** Negative Lines — best code is deleted code. Every line is a liability.
- **SHOULD** Fail Sanely — bad input? Reject, log, continue on last valid state.
- **SHOULD** Small Batches — atomic PRs. Big PR = no real review = mystery bugs.
- **SHOULD** Shift Left — lint, test, security check on every commit, not at release.
- **SHOULD** No Alert Without Runbook — if it can fail, document what to do when it does.
- **SHOULD** Legacy = No Tests — untested code is legacy, regardless of age.

---

## 5. Workflow: Plumber's Loop

### For every task:

```
1. CLASSIFY  →  Big change or small change?
2. ANALYZE   →  Read only relevant files. Understand the problem.
3. SPEC      →  Don't write code until you have a behavior contract.
4. PLAN      →  For BIG: outline approach, get approval. For SMALL: proceed.
5. EXECUTE   →  Write code. One concern per change cycle.
6. VERIFY    →  Lint + Test + Type-check. Fix before reporting done.
7. REFLECT   →  Did I leave a mess? Clean up.
```

### Task Atomicization (WRAP):

- **W**rite issue (what are we doing)
- **R**efine (clarify unknowns)
- **A**tomic tasks (< 500 lines per change)
- **P**air execute (one goal: either refactor OR feature, never both)

### Chain of Verification (for complex changes):

1. Draft plan → 2. Verify against existing schema/routes → 3. Tracer bullet (end-to-end skeleton) → 4. Flesh out only after skeleton works.

---

## 6. Quick Commands

| Command      | Behavior                                                                          |
| ------------ | --------------------------------------------------------------------------------- |
| `hotfix`     | Emergency mode: fastest fix to restore uptime. No refactoring until fire is out.  |
| `review`     | Full 4-section code review: Architecture → Quality → Tests → Performance.         |
| `spec`       | Generate behavior spec before coding. No code until spec is approved.             |
| `brainstorm` | 3+ options with pros/cons/effort. No code. See `brainstorm.md` agent.             |
| `debug`      | Systematic investigation: hypotheses → test → root cause → fix → prevention.      |
| `plan`       | Outline approach for BIG change. Get approval before writing code.                |
| `ship`       | Pre-deploy checklist: tests pass, build works, env vars verified, rollback ready. |

---

## 7. Code Review Protocol

For each issue found in review:

1. Clear description of the problem.
2. Why it matters (security? performance? maintenance?).
3. 2-3 options (including "do nothing" if reasonable).
4. For each option: Effort / Risk / Impact / Maintenance cost.
5. Recommended option and reasoning.
6. **MUST** Ask for approval before applying changes.

### Review Sections (BIG changes = all 4, SMALL = relevant subset):

| Section          | Key Questions                                    |
| ---------------- | ------------------------------------------------ |
| **Architecture** | Boundaries? Coupling? Data flow? SPOF? Security? |
| **Code Quality** | DRY? Error handling? Edge cases? Tech debt?      |
| **Tests**        | Coverage? Assertion quality? Failure scenarios?  |
| **Performance**  | N+1? Memory? Caching? Latency?                   |

---

## 8. Code Examples (Reference Patterns)

### ✅ Correct: API Handler with Validation & Error Handling

```typescript
// POST /api/users — Create user
export async function createUser(req: Request): Promise<Response> {
  const parsed = createUserSchema.safeParse(await req.json());
  if (!parsed.success) {
    return json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await userService.create(parsed.data);
    return json({ data: user }, { status: 201 });
  } catch (err) {
    logger.error({ err, input: parsed.data }, "Failed to create user");
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Pattern**: Validate at boundary → delegate to service → structured error → log with context.

### ✅ Correct: Test with Edge Case

```typescript
describe("createUser", () => {
  it("rejects empty email", async () => {
    const res = await createUser(mockReq({ email: "", name: "Test" }));
    expect(res.status).toBe(400);
  });

  it("handles duplicate email gracefully", async () => {
    await createUser(mockReq({ email: "a@b.com", name: "First" }));
    const res = await createUser(mockReq({ email: "a@b.com", name: "Second" }));
    expect(res.status).toBe(409);
  });
});
```

**Pattern**: Test the sad path. Duplicates, empty input, boundary values.

### ❌ Wrong: What to avoid

```typescript
// ❌ Business logic in controller
app.post("/users", async (req, res) => {
  const user = await db.query(`INSERT INTO users VALUES ('${req.body.email}')`); // SQL injection
  res.json(user); // No validation, no error handling, no status code
});
```

---

## 9. Agent Routing — MUST

**Before starting ANY task, identify the domain and activate the right agent.**

| Domain             | Agent File                 | When                                 |
| ------------------ | -------------------------- | ------------------------------------ |
| Frontend / UI / UX | `frontend-specialist.md`   | Components, styling, state, a11y     |
| Backend / API / DB | `backend-specialist.md`    | Endpoints, services, auth, data flow |
| Database / Schema  | `database-architect.md`    | Schema design, migrations, queries   |
| DevOps / Deploy    | `devops-engineer.md`       | CI/CD, servers, monitoring, rollback |
| Security / Audit   | `security-auditor.md`      | Vulnerabilities, OWASP, supply chain |
| Performance        | `performance-optimizer.md` | Profiling, Web Vitals, bundle size   |
| Documentation      | `documentation-writer.md`  | README, API docs, changelog          |
| Debugging          | `debug.md`                 | Systematic bug investigation         |
| Brainstorming      | `brainstorm.md`            | Idea exploration, no code            |

**Routing protocol:**

1. Understand where data flows (Frontend? Backend? Infra?).
2. Read the agent file in `.claude/agents/{agent}.md`.
3. Check `skills:` in agent frontmatter, load relevant SKILL.md files.
4. Follow the agent's workflow.

**Cross-domain tasks**: Activate primary agent, reference secondary as needed. Example: "API endpoint with auth" → primary: `backend-specialist`, reference: `security-auditor`.

---

## 10. MCP Servers

| Server                | Purpose                      | Priority                                        |
| --------------------- | ---------------------------- | ----------------------------------------------- |
| `github`              | PRs, Issues, code search     | **Primary** for GitHub ops. Fallback: `gh` CLI. |
| `context7`            | Library docs (fresh)         | **MUST use** when unsure about any API.         |
| `filesystem`          | Dir tree, batch read, search | Extended file ops beyond built-in tools.        |
| `git`                 | Typed git commands           | All git ops. Safety protocols still apply.      |
| `sequential-thinking` | Structured reasoning         | Complex arch decisions, multi-step debug.       |
| `terminal-controller` | Stateful terminal sessions   | Interactive scenarios. Simple commands → Bash.  |

**Rules:**

- Don't duplicate: if built-in tool (Read, Edit, Grep, Bash) works → use it. MCP = extended scenarios.
- **MUST** check context7 before writing code with unfamiliar APIs.
- MCP tools are deferred. Load via `ToolSearch` before first use.

---

## 11. Commit & PR Convention

> **Full commit rules**: [git/copilot-instructions.md](git/copilot-instructions.md)

**Format**: `type(scope): subject`
**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
**Example**: `feat(auth): add jwt middleware`

**PR rules:**

- Atomic: one concern per PR.
- Title follows commit convention.
- Description: What changed, Why, How to test.
- **MUST** not mix refactoring with features in same PR.

---

## 12. Testing Discipline — SHOULD

- **SHOULD** TDD-Lite: write tests immediately after (or before) the feature.
- **SHOULD** Characterization Tests for legacy: test actual behavior before refactoring.
- **SHOULD** Run `test` + `lint` + `typecheck` before every commit.
- **SHOULD** No feature is complete without tests for happy path + at least 1 edge case.
- Stack: Vitest/Jest (unit), Supertest (integration), Playwright (E2E).

---

## 13. Linter-First Coding — SHOULD

- **SHOULD** Use strict linter (Biome/ESLint). No `any` in TypeScript.
- **SHOULD** Explicit return types on all functions.
- **SHOULD** Run `lint:fix` before commit.
- **SHOULD** Treat lint warnings as errors in CI.

---

## 14. Anti-Patterns — MUST avoid

Каталог граблей, на которые уже наступали. Каждое правило — реальный баг из
production ревью, не теоретическое предостережение.

### 14.1 Никаких имён файлов/модулей по имени LLM-модели

- **MUST NOT** называть файлы/классы/типы по конкретной модели:
  `haiku-compressor.ts`, `HaikuCompressInput`, `ClaudeValidator`.
- **MUST** называть по тому, что модуль **делает**: `compressor.ts`,
  `CompressInput`, `UnifiedValidator`. Модель — это config choice
  (`assistant.settings.models.compression`), не часть архитектуры.
- **Почему**: замена модели → огромный рефакторинг имён. Name-drift между
  кодом и реальностью ("haiku-compressor" запускает GPT-5 — читатель смущён).

### 14.2 Security Theater — удалять, не документировать

- **MUST NOT** оставлять код с комментарием "not a security primitive",
  "just UX guard", "no server-side verify". Если комментарий это пишет —
  **код не защищает ни от чего**, просто создаёт иллюзию безопасности.
- **MUST** удалять целиком. UX-защиты от мисклика делаются React-state'ом
  (`useState(false)` для чекбокса), не рандомным токеном с клиента.
- **Пример**: client-side `Math.random()`-токен без HMAC/nonce-ledger на
  сервере — выпилить, оставить только чекбокс "подтверждаю" в модалке.

### 14.3 Operator/user identity — только из JWT, никогда из body

- **MUST NOT** принимать `operatorId`, `userId`, `createdBy` в request body
  для админских/stateful действий. Даже если "мы же в auth middleware
  проверяем" — атрибуция аудита не должна зависеть от клиента.
- **MUST** читать через `getOperatorId(req)` / `req.user.id` после
  `authenticateToken`-middleware. Клиент передаёт только данные операции
  (threadId, reason) — кто делает — определяет сервер.
- **Следствие**: убирать prop drilling `user.id → Button → Modal → API` —
  FE не должен "знать" operator id даже для UX.

### 14.4 Error classification — structural signals, не substring match

- **MUST NOT** классифицировать ошибки через `err.message.includes("timeout")`.
  Messages меняются между версиями библиотек, локалями, minify-сборками.
- **MUST** использовать structural signals:
  - `err.name` — `AbortError`, `TimeoutError`
  - `err.code` — `ETIMEDOUT`, `ECONNABORTED`, `ESOCKETTIMEDOUT`
  - `err.status` / `err.response?.status` — HTTP codes
  - `err instanceof SpecificError`
- **Default fallback** — явный `"api_error"` / `"unknown"`, не выбрасывать.

### 14.5 Numeric form inputs — `Number.isFinite()` guard обязателен

- **MUST NOT** парсить `type="number"` как `Number(v)` без проверки. HTML
  `<input type="number">` принимает `"e"`, `"+"`, пробелы, научную нотацию.
  `Number("e")` → `NaN`, который улетит в JSON payload и сломает Zod/prompt
  downstream.
- **MUST** guard at form boundary:

  ```typescript
  const parsed = Number(v);
  const value = v === "" || !Number.isFinite(parsed) ? undefined : parsed;
  ```

- **Consistency**: если в одном месте в файле есть `isFinite`-guard —
  применить ко всем numeric inputs в том же файле.

### 14.6 Caller MUST guard mutations behind `{ committed }` / success flag

- **MUST NOT** вызывать функцию с возвращаемым `{ success: boolean }` /
  `{ committed: boolean }` и ignore-ить flag. Любой `local = newValue`
  после await **обязан** быть за `if (result.committed)`.
- **Rationale**: soft-fail функции существуют именно потому что вызов может
  не пройти (version mismatch, concurrent writer). Blind-update локальной
  переменной → stale JS state → corrupted downstream decisions.
- **Test discipline**: unit-test функцию в изоляции — недостаточно. **MUST**
  писать integration test который проверяет, что caller'ы правильно
  guard'ят mutation. Isolation tests silent-memory bug не ловят.

**Pattern**:

```typescript
// BEFORE (silent corruption on conflict):
await persistor.commit(threadId, newMeta, "label");
localMeta = newMeta; // ← blindly updates even if DB write was skipped

// AFTER:
const result = await persistor.commit(threadId, newMeta, "label").catch((err) => {
  log.error({ err }, "persist failed");
  return { committed: false, newVersion: -1 };
});
if (result.committed) {
  localMeta = newMeta;
}
```

---

## 15. LLM Integration Patterns — MUST

Стандартный layout для любого проекта где LLM-вызовы first-class feature.

### 15.1 LLM Prompts — admin-editable, never hardcoded-only

Каждый промпт резолвится по precedence:

1. **Per-assistant override** — `assistant.settings.prompts.X` (JSONB)
2. **Admin-editable row** — `admin_settings` table, ключ по паттерну `X_PROMPT_CONTENT`
3. **TypeScript seed constant** — fallback для чистой инсталляции / DB-hiccup

**MUST NOT** хардкодить промпт как single source. Хардкоженные-only промпты →
оператор не может iterate без CI/CD release → жуткий feedback loop
("поменяй запятую → жди 2 часа"). Admin editor — это и есть feedback loop.

```typescript
// shared/schema/admin.ts
export const adminSettingKeys = {
  COMPRESSION_PROMPT_CONTENT: "compression_prompt_content",
  // ... other _PROMPT_CONTENT keys
};

// service
export async function resolveCompressionPrompt(storage, settings) {
  const perAssistant = settings?.prompts?.compression?.trim();
  if (perAssistant) return perAssistant;
  const admin = await storage.getAdminSetting(COMPRESSION_PROMPT_CONTENT);
  if (typeof admin?.value === "string" && admin.value.trim()) return admin.value;
  return DEFAULT_COMPRESSION_PROMPT;
}
```

### 15.2 LLM Model — operator-pickable per phase

`assistant.settings.models.{phase}` для каждой фазы (`extraction`, `intro`,
`main`, `vision`, `verification`, `compression`, ...). Resolution:

1. `input.modelOverride` (tests / programmatic)
2. `assistant.settings.models.{phase}`
3. `process.env.{PHASE}_MODEL`
4. modelRegistry default

**MUST NOT**: хардкодить имя модели в сервисе (`modelRegistry.resolveModel("haiku", ...)`).
**MUST NOT**: именовать файлы/классы по модели (см. §14.1). Модель — config,
не архитектура.

---

## 16. Security: Concurrency & Locking — MUST

### 16.1 Rate-limit любой endpoint с exclusive lock

Admin endpoints, которые делают `SELECT ... FOR UPDATE` (или аналог) **MUST**
иметь rate-limiter. Без него скомпрометированный админ-токен / баговый
скрипт положит базу через exhaustion connection pool на dead-locks.

Typical limits (per-operator key = `req.user?.id ?? req.ip`):

| Severity                           | Limit      | Пример                     |
| ---------------------------------- | ---------- | -------------------------- |
| Destructive (financial, deletions) | **10/min** | force-pay-link, delete     |
| Mutations с lock (state override)  | **60/min** | force-advance, unlock-slot |
| Read-only admin                    | 300/min    | GET /admin/\*              |

### 16.2 Optimistic locking для shared-mutable JSONB state

Когда два кода могут писать в одну JSONB-row одновременно (классика: AI
pipeline + operator override оба мутируют `thread.metadata`), raw
`UPDATE SET col = ...` silently clobbers. Нужна version-колонка + CAS.

Паттерн:

1. Column `metadata_version BIGINT NOT NULL DEFAULT 0`
2. Writes через persistor-helper: `UPDATE ... SET col = ..., metadata_version = metadata_version + 1 WHERE id = ? AND metadata_version = expected`
3. Version mismatch → skip write, log WARN, set sticky `hasConflict` flag
4. **Callers MUST guard local state updates** (см. §14.6)

Reference impl (spec 126): `server/services/scripts/optimistic-thread-metadata.ts`.

---

`[END OF UNIVERSAL CODING PROMPT — PROJECT-SPECIFIC CONFIG GOES IN CLAUDE.md / .claude/rules/]`
