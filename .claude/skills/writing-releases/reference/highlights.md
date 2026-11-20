# Writing the Highlights Section

## Structure

Each Highlight is an H3 subsection. In multi-highlight releases, subsections are separated by `---` horizontal rules. Never put a `---` after the last Highlight or after a single Highlight; `## Features` follows the last PR link directly. Use an H4 (`####`) only for a sub-part of one Highlight, such as patches for older versions.

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

## Ordering

Always sort Highlights from most to least disruptive for someone upgrading:

1. `🚧` breaking changes, including breaking dependency changes
2. Behavior changes (non-breaking, but existing stores may behave differently)
3. Feature highlights
4. Mechanical or low-impact work, ending with the non-breaking `Dependency Updates` Highlight

**Behavior change example:**
```markdown
### Inventory Confirmation Requires Location Levels

**Behavior change**

> Affects stores whose sales channel stock locations have no inventory levels for the purchased items.

Inventory confirmation now fails when no inventory level exists at a stock location linked to the cart's sales channel. Previously the check passed silently. Make sure every stock location linked to your sales channels has inventory levels for the items it sells.

[#NNNN](https://github.com/medusajs/medusa/pull/NNNN)
```

**Non-breaking dependency example:**
```markdown
### Dependency Updates

*   New package: `@medusajs/example` 1.0.0
*   `express` updated from 4.21.1 to 4.21.2

[#NNNN](https://github.com/medusajs/medusa/pull/NNNN)
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
- Avoid "we" when describing a change. Write "Medusa now supports…" or use passive sparingly. "We recommend" / "we urge" is fine for calls to action, such as asking users to update for a security fix
- If the feature requires an Enterprise License, or only applies to projects on Medusa Cloud, say so in the prose (e.g. "Requires Enterprise License.")
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

## Documentation Links

When a Highlight introduces or changes a feature that has a documentation page, end the prose with a "Learn more" sentence linking to it:

```markdown
Learn more in the [Translation Module documentation](https://docs.medusajs.com/resources/commerce-modules/translation).
```

- Map `docs.medusajs.com/learn/<path>` to `www/apps/book/app/learn/<path>/page.mdx` and `/resources/<path>` to `www/apps/resources/app/<path>/page.mdx`, and only link pages that exist there
- Use the regular page URL, not the `.md` version
- Anchors are fine when they point to the relevant section (e.g. `https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property`)

---

## Security Fix Highlights

Structure a security fix Highlight as:

1. What was hardened or fixed, and which routes, inputs, or configurations are affected (e.g. "users that have enabled the Index Module feature flag")
2. Who is affected: "Projects hosted on Medusa Cloud are not impacted and require no action." when that's true, then "We recommend that all self-hosted projects update to this version as soon as possible."
3. A `#### Patches for Older Versions` subheading followed by `<!-- TODO: add patch links for older versions -->`. Maintainers attach the patch ZIPs after drafting, so never invent links.

---

## Code Blocks

Include a fenced code block when the Highlight involves:
- A config change the developer must make
- New CLI commands
- Updated import paths
- A migration snippet

Place the code block after the prose, before the PR links.

Prompts meant for an AI coding agent (the MCP update prompt, patch `SKILL.md` instructions) also go in a `bash` code block, to match existing releases.

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
