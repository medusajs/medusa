# Writing the Highlights Section

## Structure

Each Highlight is an H3 subsection. In multi-highlight releases, subsections are separated by `---` horizontal rules.

```markdown
## Highlights

### Descriptive Outcome Title

Body prose here.

[#NNNN](https://github.com/medusajs/medusa/pull/NNNN)

---

### Another Highlight Title

Body prose here.

[#MMMM](https://github.com/medusajs/medusa/pull/MMMM)
```

---

## H3 Heading

- Write a short, descriptive title summarizing the **outcome or capability**, not the PR title verbatim
- Use title case
- Focus on what the user/developer gains, not the internal implementation detail

**Good:** `Priority-based Event Processing`
**Good:** `Fix credit line computation on order cancellation`
**Bad:** `feat(events): add priority queue to event bus` (PR title verbatim)
**Bad:** `Event Bus Update` (too vague)

---

## Body Prose

- 1–4 sentences explaining what changed, why it matters, and (for breaking changes) what action is required
- Write in present or past tense, active voice
- Avoid "we" — write "Medusa now supports…" or use passive sparingly
- For breaking changes: lead with `🚧 Breaking change` on its own line, then prose
- DO NOT include emdashes.

**Breaking change example:**
```markdown
### Zod Dependency Restructuring

🚧 Breaking change

Zod has been moved from a peer dependency to a direct dependency of `@medusajs/framework`. If you previously installed Zod explicitly in your project to satisfy the peer dependency requirement, you can remove it.

[#14441](https://github.com/medusajs/medusa/pull/14441)
```

**Feature highlight example:**
```markdown
### Priority-based Event Processing

The event bus now supports assigning a priority level to events. Higher-priority events are processed before lower-priority ones within the same queue, enabling time-sensitive workflows (such as payment confirmations) to run ahead of background tasks.

[#14520](https://github.com/medusajs/medusa/pull/14520)
```

---

## Code Blocks

Include a fenced code block when the Highlight involves:
- A config change the developer must make
- New CLI commands
- Updated import paths
- A migration snippet

Place the code block after the prose, before the PR links.

```markdown
### Improved pnpm Support

Medusa's CLI and starter templates now fully support pnpm as a package manager. Pass `--package-manager pnpm` when creating a new project:

\`\`\`bash
npx create-medusa-app@latest my-store --package-manager pnpm
\`\`\`

[#14600](https://github.com/medusajs/medusa/pull/14600)
```

---

## PR Links

- Place at the bottom of each Highlight subsection, after all prose and code blocks
- One link per line as a bare markdown link (no surrounding text)
- Multiple PRs: each on its own line

```markdown
[#14441](https://github.com/medusajs/medusa/pull/14441)
[#14520](https://github.com/medusajs/medusa/pull/14520)
```

Do **not** write: `See [#14441](url) and [#14520](url)` — bare links only.

---

## Breaking Change Nuance

When a breaking change only affects a subset of users, add a `>` blockquote after the `🚧` line:

```markdown
🚧 Breaking change

> This change only affects projects that manually configure the event bus priority settings. If you use the default configuration, no action is required.

Zod has been moved...
```
