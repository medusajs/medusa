---
name: writing-docs
description: Writes and updates Medusa documentation MDX files for the book, resources, ui, user-guide, and cloud projects. Use when making documentation changes based on code diffs, adding new pages, updating existing content, or updating component examples. ALWAYS load this skill before modifying any MDX file in www/apps/.
---

# Writing Medusa Documentation

Skill for writing and updating MDX documentation across the `book`, `resources`, `ui`, `user-guide`, and `cloud` projects under `www/apps/`.

## Constraints

> **CRITICAL:** Violating these will corrupt the documentation or break CI.

- **Never document `@ignore`-tagged items** — any option, method, or parameter with `@ignore` in its TSDoc must be skipped entirely
- **Never touch `www/apps/resources/references/`** — auto-generated, will be overwritten
- **Never touch `www/apps/ui/specs/components/`** — auto-generated, will be overwritten
- **Never touch `www/apps/api-reference/`** — managed by a separate process
- **Never run `yarn prep` or `yarn lint:content`** — these run automatically after your session
- **Never invent Cloudinary screenshot URLs** in user-guide — leave `<!-- TODO: add screenshot -->` instead

## Load Reference Files When Needed

> **Load at least one reference file before writing any content.**

| Task | Load |
|------|------|
| Deciding if a change needs docs | `reference/when-to-document.md` |
| Writing any MDX content | `reference/mdx-patterns.md` |
| Writing for the **book** project | `reference/book-style.md` |
| Writing for the **resources** project | `reference/resources-style.md` |
| Writing for the **user-guide** project | `reference/user-guide-style.md` |
| Writing for the **cloud** project | `reference/cloud-style.md` |
| Checking prose quality | `reference/vale-rules.md` |

## Quick Reference

### Project paths and writable directories

| Project | Content path | Sidebar file |
|---------|-------------|--------------|
| book | `www/apps/book/app/` | `www/apps/book/sidebar.mjs` |
| resources | `www/apps/resources/app/` | `www/apps/resources/sidebars/*.mjs` |
| ui | `www/apps/ui/app/`, `www/apps/ui/specs/examples/` | `www/apps/ui/sidebar.mjs` |
| user-guide | `www/apps/user-guide/app/` | `www/apps/user-guide/sidebar.mjs` |
| cloud | `www/apps/cloud/app/` | `www/apps/cloud/sidebar.mjs` |

### MDX file minimum structure

```mdx
export const metadata = {
  title: `Page Title`,
}

# {metadata.title}

Content here.
```

For book pages that use chapter numbering, the title uses `${pageNumber}`:

```mdx
export const metadata = {
  title: `${pageNumber} Chapter Title`,
}
```

### Cross-project links

```mdx
[text](!docs!/learn/path)        → book
[text](!resources!/path)         → resources
[text](!user-guide!/path)        → user-guide
```

## Common Mistakes

- [ ] Adding a new option, method, or parameter without a version note
- [ ] Documenting any option, method, or parameter tagged with `@ignore` in its TSDoc — skip these entirely
- [ ] Touching `references/` or `specs/components/` directories
- [ ] Using `we`, `us`, `let's`, `our` in prose (use "you" or imperative)
- [ ] Using "Medusa API" to mean the backend — use "Medusa backend" instead
- [ ] Writing "Medusa Cloud" — use "Medusa" (noun form) or "Cloud" (location/service)
- [ ] Using `e.g.,` — write `for example` instead
- [ ] Using em dashes (`—`) — rewrite sentence to avoid them
- [ ] Using passive voice ("is created", "can be configured") — write active ("you can configure", "call X to create")
- [ ] Writing code lines longer than 64 characters
- [ ] Forgetting to add a new page to the sidebar file
- [ ] Removing `${pageNumber}` from book page titles
- [ ] Using `<img>` or bare HTML instead of MDX components
- [ ] Documenting internal implementation details (only public APIs)

## Reference Files

```
reference/when-to-document.md   - Decision tree: does this change need docs?
reference/mdx-patterns.md       - MDX syntax, code blocks, components
reference/book-style.md         - book-specific structure and conventions
reference/resources-style.md    - resources-specific structure and conventions
reference/user-guide-style.md   - user-guide writing style and conventions
reference/cloud-style.md        - cloud-specific structure and conventions
reference/vale-rules.md         - Vale + lint rules to follow in prose
```
