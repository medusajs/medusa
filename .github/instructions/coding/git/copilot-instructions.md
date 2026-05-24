# Commit Message Rules (for AI Agents)

> **Source of truth**: `commitlint.config.js` + `.cz-config.cjs`
> **For humans**: use `npm run commit` (interactive wizard) — see `docs/COMMITIZEN.md`
> **For releases**: see [`semver-versioning` skill](../../../../.claude/skills/semver-versioning/SKILL.md) and [`/bump` command](../../../../.claude/commands/bump.md) — commit type maps directly to bump size.

---

## Format

```
type(scope): subject

[optional body]

[optional footer]
```

- **No period** at end of subject
- **Lowercase** subject start (no capital)
- Subject ≤ 100 chars (aim for 50-72). Commitlint allows 1000 but keep it short.
- Body: wrap at 72 chars. Separate from subject with blank line.

---

## Types (enforced by commitlint)

| Type | When |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure (no new feature, no fix) |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system, dependencies |
| `ci` | CI/CD pipeline |
| `chore` | Maintenance, tooling, config |
| `revert` | Revert a previous commit |
| `wip` | Work in progress (avoid on main) |

---

## Scopes (enforced as warning)

Use the **most specific** scope that applies:

| Scope | When |
|---|---|
| `server` | Backend logic not fitting a narrower scope |
| `client` | Frontend logic not fitting a narrower scope |
| `shared` | Shared schemas, types, utils |
| `db` | Database schema, migrations, queries |
| `api` | API routes, endpoints |
| `auth` | Authentication, authorization |
| `telegram`, `vk`, `sms`, `email` | Channel-specific code |
| `payments` | Billing, subscriptions, YooKassa |
| `assistant` | Assistant config, settings, AI behavior |
| `channels` | Cross-channel integration logic |
| `analytics` | Metrics, tracking, dashboards |
| `ui` | UI components, styling |
| `deps` | Dependency updates |
| `ci` | GitHub Actions, workflows |
| `docker` | Dockerfiles, compose, container config |
| `config` | App config, env vars, feature flags |
| `supercompat` | Supercompat engine (run-assistant, prompt-formatting) |

**Custom scopes allowed** — use when no standard scope fits. Keep it short (1 word).

### Feature ID as scope

When the change is part of a tracked feature, use `F{number}` as scope:

```
feat(F095): add parallel RAG probe for Tier 1 → Tier 2 upgrade
fix(F093): enrich adaptive intro bridge with fragment context
```

**Prefer feature ID** over component scope when the commit is clearly part of a feature branch/PR. Use component scope for standalone fixes not tied to a feature.

---

## Subject line rules

1. **Imperative mood**: "add", "fix", "remove" — not "added", "fixes", "removing"
2. **What, not how**: `add JWT middleware` not `create new file auth-middleware.ts`
3. **Be specific**: `fix token refresh race condition` not `fix auth bug`
4. **No ticket numbers in subject** — put them in footer or PR title

### Good examples

```
feat(supercompat): add contextual rephrase on detour-return
fix(auth): improve token refresh reliability and cross-tab sync
refactor(supercompat): extract reaction call and improve fallback handling
perf(server): cache fragment matching results per conversation turn
docs: add F094 contextual rephrase documentation
chore(docker): improve cleanup and enhance RAG dual-search strategy
```

### Bad examples

```
feat: update code                    # too vague
fix(server): Fix bug.               # capital F, period, vague
feat(auth): added new JWT thing     # past tense, "thing"
refactor: refactored stuff          # past tense, "stuff"
```

---

## Body (when to include)

Include body when:
- **Why** isn't obvious from the subject
- Change has **non-trivial side effects**
- Multiple files changed for **different reasons**
- **Breaking change** needs explanation

```
fix(supercompat): bypass completionsRunAdapter for toolless completion

The adapter was incorrectly wrapping responses when no tools were
registered, causing empty function_call arrays in the output.
Detected via LangSmith trace on production assistant #247.
```

---

## Footer

```
Refs: #374
BREAKING CHANGE: removed deprecated `legacyMode` flag from assistant settings
```

- `Refs: #NNN` — link to GitHub issue/PR
- `BREAKING CHANGE:` — triggers major version bump (when/if we use semantic-release)
- `Co-authored-by:` — for pair programming or AI-assisted commits

---

## Multi-scope commits

If a commit touches multiple scopes, pick the **primary** scope. If truly cross-cutting:

```
chore: improve docker cleanup and enhance RAG dual-search strategy
```

No scope = cross-cutting change. Don't comma-separate scopes.

---

## AI Agent specific rules

1. **Never amend** — always create new commits
2. **Never force-push** — ask user first
3. **Never batch unrelated changes** — one concern per commit
4. **Stage specific files** — no `git add .` or `git add -A`
5. **Run `npm run validate`** before committing
6. **Use HEREDOC** for multi-line commit messages in bash
