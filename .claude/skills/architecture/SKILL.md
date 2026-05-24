---
name: architecture
description: Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation. Use when making architecture decisions or analyzing system design.
allowed-tools: Read, Glob, Grep
---

# Architecture Decision Framework

ultrathink

> "В городе новый шериф." — New architecture takes over.
> "Код на duct tape и молитвах — это не technical debt, это cultural heritage." — Legacy defense, when ADR explains why.

> "Requirements drive architecture. Trade-offs inform decisions. ADRs capture rationale."

## 🏗️ System Design Blueprint (Alex Xu Standards)

Практические правила построения масштабируемых веб-архитектур.

### 1. Scaling from Zero to Millions
- **Stateless Web Tier**: Серверы не должны хранить состояние сессий. Состояние — в Redis/Memcached.
- **Redundancy**: Избегай SPOF (Single Point of Failure). Реплицируй данные, дублируй сервисы за балансировщиками.
- **Caching**: Кэш для частых чтений. CDN для статики.

### 2. Decoupling & Asynchronous Processing
- **Message Queues**: Используй брокеры (RabbitMQ, SQS, Kafka) как буфер при пиковых нагрузках.
- **DAG Processing**: Тяжелые задачи разбивай на графы и обрабатывай параллельно через очереди.

### 3. API Protection
- **Rate Limiting**: Защищай публичные API от DDoS и парсеров (Token Bucket/Sliding Window).

### 4. Data Distribution
- **Consistent Hashing**: При шардировании кэша используй консистентное хеширование с виртуальными нодами.
- **Delta Sync**: При синхронизации больших файлов передавай только измененные блоки (chunks).

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File | Description | When to Read |
|------|-------------|--------------|
| `context-discovery.md` | Questions to ask, project classification | Starting architecture design |
| `trade-off-analysis.md` | ADR templates, trade-off framework | Documenting decisions |
| `pattern-selection.md` | Decision trees, anti-patterns | Choosing patterns |
| `examples.md` | MVP, SaaS, Enterprise examples | Reference implementations |
| `patterns-reference.md` | Quick lookup for patterns | Pattern comparison |

---

## 🤖 LLM Configuration Architecture

Когда проект использует LLM-вызовы (prompts, model picker, per-phase tuning) —
эти два правила МАСТ:

### LLM Prompts — admin-editable, НИКОГДА не only-hardcoded

Каждый промпт используется в трёх слоях разрешения:

1. **Per-assistant override** — `assistant.settings.prompts.X` (JSONB в settings)
2. **Admin-editable row** — `admin_settings` table, ключ по паттерну `X_PROMPT_CONTENT`
3. **TypeScript seed constant** — fallback только, не single source

**Precedence**: 1 → 2 → 3. Хардкоженные-only промпты = оператор не может
поправить без релиза → жуткий feedback loop на iteration ("поменяй запятую →
жди 2 часа на CI/CD"). Constant остаётся как seed default для чистой
инсталляции и fallback при DB hiccup.

```typescript
// shared/schema/admin.ts
export const adminSettingKeys = {
  COMPRESSION_PROMPT_CONTENT: "compression_prompt_content",
  // ... другие _PROMPT_CONTENT keys
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

### LLM Model — operator-pickable per phase, NEVER hardcoded model family

Модель выбирается через `assistant.settings.models.{phase}` — там куча
phase-ключей: `extraction`, `intro`, `main`, `vision`, `verification`,
`compression`, и т.д. Каждый вызов резолвит так:

1. `input.modelOverride` (tests / programmatic)
2. `assistant.settings.models.{phase}`
3. `process.env.{PHASE}_MODEL`
4. modelRegistry default

**MUST NOT**: хардкодить имя модели/семейства в коде (`"haiku"`, `"claude-sonnet"`).
**MUST NOT**: называть файлы/классы по имени модели (`haiku-compressor.ts` ←
плохо, `compressor.ts` ← good). Имя модели = конфиг, а не архитектура.
Замена провайдера не должна требовать refactor названий.

---

## 🔗 Related Skills

| Skill | Use For |
|-------|---------|
| `@[skills/database-design]` | Database schema design |
| `@[skills/api-patterns]` | API design patterns |
| `@[skills/deployment-procedures]` | Deployment architecture |

---

## Core Principle

**"Simplicity is the ultimate sophistication."**

- Start simple
- Add complexity ONLY when proven necessary
- You can always add patterns later
- Removing complexity is MUCH harder than adding it

---

## Validation Checklist

Before finalizing architecture:

- [ ] Requirements clearly understood
- [ ] Constraints identified
- [ ] Each decision has trade-off analysis
- [ ] Simpler alternatives considered
- [ ] ADRs written for significant decisions
- [ ] Team expertise matches chosen patterns
