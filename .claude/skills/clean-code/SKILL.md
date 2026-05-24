---
name: clean-code
description: Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments
allowed-tools: Read, Write, Edit
version: 2.0
priority: CRITICAL
---

# Clean Code - Pragmatic AI Coding Standards

> **CRITICAL SKILL** - Be **concise, direct, and solution-focused**.

---

## 🧟 Legacy Code & Refactoring (Michael Feathers Standards)

Правила работы с запутанным легаси-кодом на основе *Working Effectively with Legacy Code*. Главный принцип: **мы не переписываем код вслепую, мы берём его в программные тиски.**

### 1. The Legacy Code Change Algorithm (Алгоритм укрощения)
- **Identify**: Найди точки, куда нужно внести изменения.
- **Find Test Points**: Найди места, где можно написать тесты для проверки этих изменений.
- **Break Dependencies**: Разорви зависимости, мешающие созданию объекта в тесте.
- **Write Tests**: Напиши *Characterization Tests*.
- **Refactor**: Только теперь вноси изменения и улучшай дизайн.

### 2. Seams & Breaking Dependencies (Швы и изоляция)
- **Seam (Шов)**: Место в коде, где можно изменить поведение программы, не редактируя сам исходный код. Используй *Object Seams* (передача зависимостей через интерфейсы).
- **Sensing & Separation**: Разрывай зависимости, чтобы отвязать код от тяжелой среды (БД, сеть) и получить доступ к результатам (передав Fake-объект).

### 3. Safe Feature Addition
- **Sprout Method/Class (Почкование)**: Напиши новый функционал как новый, протестированный метод. Вызови его из старого кода.
- **Wrap Method/Class (Обертывание)**: Переименуй старый метод, создай новый с таким же именем, вызови в нем старый и добавь свою логику.

### 4. Characterization Tests (Характеризационные тесты)
- Пиши тесты на то, что система *делает по факту* прямо сейчас, а не по ТЗ. Сделай ложный `assert`, посмотри реальный вывод, зафиксируй его в тесте. Это твои "тиски".

### 5. Mental Discipline
- **Scratch Refactoring**: Если код сложный, сделай отдельную ветку, порви его на куски без тестов, чтобы *понять* логику. Понял? Выбрасывай черновик (revert) и пиши на чистовик с тестами.
- **Lean on the Compiler**: Используй строгую типизацию как инструмент рефакторинга. Меняй тип у корня и двигайся по дереву ошибок компиляции.

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **SRP** | Single Responsibility - each function/class does ONE thing |
| **DRY** | Don't Repeat Yourself - extract duplicates, reuse |
| **KISS** | Keep It Simple - simplest solution that works |
| **YAGNI** | You Aren't Gonna Need It - don't build unused features |
| **Boy Scout** | Leave code cleaner than you found it |

---

## Naming Rules

| Element | Convention |
|---------|------------|
| **Variables** | Reveal intent: `userCount` not `n` |
| **Functions** | Verb + noun: `getUserById()` not `user()` |
| **Booleans** | Question form: `isActive`, `hasPermission`, `canEdit` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT` |

> **Rule:** If you need a comment to explain a name, rename it.

---

## Function Rules

| Rule | Description |
|------|-------------|
| **Small** | Max 20 lines, ideally 5-10 |
| **One Thing** | Does one thing, does it well |
| **One Level** | One level of abstraction per function |
| **Few Args** | Max 3 arguments, prefer 0-2 |
| **No Side Effects** | Don't mutate inputs unexpectedly |

---

## Code Structure

| Pattern | Apply |
|---------|-------|
| **Guard Clauses** | Early returns for edge cases |
| **Flat > Nested** | Avoid deep nesting (max 2 levels) |
| **Composition** | Small functions composed together |
| **Colocation** | Keep related code close |

---

## AI Coding Style

| Situation | Action |
|-----------|--------|
| User asks for feature | Write it directly |
| User reports bug | Fix it, don't explain |
| No clear requirement | Ask, don't assume |

---

## Anti-Patterns (DON'T)

| ❌ Pattern | ✅ Fix |
|-----------|-------|
| Comment every line | Delete obvious comments |
| Helper for one-liner | Inline the code |
| Factory for 2 objects | Direct instantiation |
| utils.ts with 1 function | Put code where used |
| "First we import..." | Just write code |
| Deep nesting | Guard clauses |
| Magic numbers | Named constants |
| God functions | Split by responsibility |

---

## 🔴 Before Editing ANY File (THINK FIRST!)

**Before changing a file, ask yourself:**

| Question | Why |
|----------|-----|
| **What imports this file?** | They might break |
| **What does this file import?** | Interface changes |
| **What tests cover this?** | Tests might fail |
| **Is this a shared component?** | Multiple places affected |

**Quick Check:**
```
File to edit: UserService.ts
└── Who imports this? → UserController.ts, AuthController.ts
└── Do they need changes too? → Check function signatures
```

> 🔴 **Rule:** Edit the file + all dependent files in the SAME task.
> 🔴 **Never leave broken imports or missing updates.**

---

## Summary

| Do | Don't |
|----|-------|
| Write code directly | Write tutorials |
| Let code self-document | Add obvious comments |
| Fix bugs immediately | Explain the fix first |
| Inline small things | Create unnecessary files |
| Name things clearly | Use abbreviations |
| Keep functions small | Write 100+ line functions |

> **Remember: The user wants working code, not a programming lesson.**

---

## 🔴 Self-Check Before Completing (MANDATORY)

**Before saying "task complete", verify:**

| Check | Question |
|-------|----------|
| ✅ **Goal met?** | Did I do exactly what user asked? |
| ✅ **Files edited?** | Did I modify all necessary files? |
| ✅ **Code works?** | Did I test/verify the change? |
| ✅ **No errors?** | Lint and TypeScript pass? |
| ✅ **Nothing forgotten?** | Any edge cases missed? |

> 🔴 **Rule:** If ANY check fails, fix it before completing.

---

## Verification Scripts (MANDATORY)

> 🔴 **CRITICAL:** Each agent runs ONLY their own skill's scripts after completing work.

### Agent → Script Mapping

| Agent | Script | Command |
|-------|--------|---------|
| **frontend-specialist** | UX Audit | `python ~/.claude/skills/frontend-design/scripts/ux_audit.py .` |
| **frontend-specialist** | A11y Check | `python ~/.claude/skills/frontend-design/scripts/accessibility_checker.py .` |
| **backend-specialist** | API Validator | `python ~/.claude/skills/api-patterns/scripts/api_validator.py .` |
| **mobile-developer** | Mobile Audit | `python ~/.claude/skills/mobile-design/scripts/mobile_audit.py .` |
| **database-architect** | Schema Validate | `python ~/.claude/skills/database-design/scripts/schema_validator.py .` |
| **security-auditor** | Security Scan | `python ~/.claude/skills/vulnerability-scanner/scripts/security_scan.py .` |
| **seo-specialist** | SEO Check | `python ~/.claude/skills/seo-fundamentals/scripts/seo_checker.py .` |
| **seo-specialist** | GEO Check | `python ~/.claude/skills/geo-fundamentals/scripts/geo_checker.py .` |
| **performance-optimizer** | Lighthouse | `python ~/.claude/skills/performance-profiling/scripts/lighthouse_audit.py <url>` |
| **test-engineer** | Test Runner | `python ~/.claude/skills/testing-patterns/scripts/test_runner.py .` |
| **test-engineer** | Playwright | `python ~/.claude/skills/webapp-testing/scripts/playwright_runner.py <url>` |
| **Any agent** | Lint Check | `python ~/.claude/skills/lint-and-validate/scripts/lint_runner.py .` |
| **Any agent** | Type Coverage | `python ~/.claude/skills/lint-and-validate/scripts/type_coverage.py .` |
| **Any agent** | i18n Check | `python ~/.claude/skills/i18n-localization/scripts/i18n_checker.py .` |

> ❌ **WRONG:** `test-engineer` running `ux_audit.py`
> ✅ **CORRECT:** `frontend-specialist` running `ux_audit.py`

---

### 🔴 Script Output Handling (READ → SUMMARIZE → ASK)

**When running a validation script, you MUST:**

1. **Run the script** and capture ALL output
2. **Parse the output** - identify errors, warnings, and passes
3. **Summarize to user** in this format:

```markdown
## Script Results: [script_name.py]

### ❌ Errors Found (X items)
- [File:Line] Error description 1
- [File:Line] Error description 2

### ⚠️ Warnings (Y items)
- [File:Line] Warning description

### ✅ Passed (Z items)
- Check 1 passed
- Check 2 passed

**Should I fix the X errors?**
```

4. **Wait for user confirmation** before fixing
5. **After fixing** → Re-run script to confirm

> 🔴 **VIOLATION:** Running script and ignoring output = FAILED task.
> 🔴 **VIOLATION:** Auto-fixing without asking = Not allowed.
> 🔴 **Rule:** Always READ output → SUMMARIZE → ASK → then fix.
