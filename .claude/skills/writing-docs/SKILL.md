---
name: writing-docs
description: Writes and updates Medusa documentation MDX files for the book, resources, ui, and user-guide projects. Use when making documentation changes based on code diffs, adding new pages, updating existing content, or updating component examples. ALWAYS load this skill before modifying any MDX file in www/apps/.
---

# Writing Medusa Documentation

Skill for writing and updating MDX documentation across the `book`, `resources`, `ui`, and `user-guide` projects under `www/apps/`.

## Constraints

> **CRITICAL:** Violating these will corrupt the documentation or break CI.

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
| Checking prose quality | `reference/vale-rules.md` |

## Quick Reference

### Project paths and writable directories

| Project | Content path | Sidebar file |
|---------|-------------|--------------|
| book | `www/apps/book/app/` | `www/apps/book/sidebar.mjs` |
| resources | `www/apps/resources/app/` | `www/apps/resources/sidebars/*.mjs` |
| ui | `www/apps/ui/app/`, `www/apps/ui/specs/examples/` | `www/apps/ui/sidebar.mjs` |
| user-guide | `www/apps/user-guide/app/` | `www/apps/user-guide/sidebar.mjs` |

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

- [ ] Touching `references/` or `specs/components/` directories
- [ ] Using `we`, `us`, `let's`, `our` in prose (use "you" or imperative)
- [ ] Using passive voice ("is created", "was updated") — write active
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
reference/vale-rules.md         - Vale + lint rules to follow in prose
```
