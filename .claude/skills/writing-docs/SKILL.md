---
name: writing-docs
description: Writes and updates Medusa documentation MDX files for the book, resources, ui, user-guide (Merchant Guide), and cloud projects, following the Cloud-first, agent-native docs messaging. Use when making documentation changes based on code diffs, adding new pages, updating existing content, or updating component examples. ALWAYS load this skill before modifying any MDX file in www/apps/.
---

# Writing Medusa Documentation

Skill for writing and updating MDX documentation across the `book`, `resources`, `ui`, `user-guide` (Merchant Guide), and `cloud` projects under `www/apps/`.

## Docs Messaging

The docs are **Cloud-first** and treat agents as first-class readers. On every page:

- Assume the reader uses Cloud. Show the Cloud way first, then local development.
- Never mention self-hosting or non-Cloud deployment platforms, and never install with `create-medusa-app`.
- Call the admin user docs the **Merchant Guide**, not "User Guide".
- Add an **Agent Hand-off** note where an agent can perform the page's steps.

Load `reference/cloud-first.md` for the patterns and the navbar-to-project map.

## Constraints

> **CRITICAL:** Violating these will corrupt the documentation or break CI.

- **Never document `@ignore`-tagged items** — any option, method, or parameter with `@ignore` in its TSDoc must be skipped entirely
- **Never touch `www/apps/resources/references/`** — auto-generated, will be overwritten
- **Never touch `www/apps/ui/specs/components/`** — auto-generated, will be overwritten
- **Never touch `www/apps/api-reference/`** — managed by a separate process
- **Never invent Cloudinary screenshot URLs** in the Merchant Guide (`user-guide`) — leave `<!-- TODO: add screenshot -->` instead

## After Making Changes

Run these from each project you changed (`www/apps/<project>`), in order:

1. **Prep:** `yarn prep:turbo --force` in resources, `yarn prep` in book, ui, user-guide, and cloud
2. **Content lint:** `yarn lint:content` (auto-fixes MDX; fix any remaining errors manually)
3. **Code lint:** `yarn lint`, only if you changed non-MDX files (for example, sidebar `.mjs` files or `specs/examples/` in ui)

## Load Reference Files When Needed

> **Load at least one reference file before writing any content.**

| Task | Load |
|------|------|
| Writing or updating any content (always) | `reference/cloud-first.md` |
| Deciding if a change needs docs | `reference/when-to-document.md` |
| Writing any MDX content | `reference/mdx-patterns.md` |
| Writing for the **book** project | `reference/book-style.md` |
| Writing for the **resources** project | `reference/resources-style.md` |
| Writing for the **user-guide** project (Merchant Guide) | `reference/user-guide-style.md` |
| Writing for the **cloud** project | `reference/cloud-style.md` |
| Checking prose quality | `reference/vale-rules.md` |

## Quick Reference

### Project paths and writable directories

| Project | Content path | Sidebar file |
|---------|-------------|--------------|
| book (Framework, under Build) | `www/apps/book/app/` | `www/apps/book/sidebar.mjs` |
| resources | `www/apps/resources/app/` | `www/apps/resources/sidebars/*.mjs` |
| ui | `www/apps/ui/app/`, `www/apps/ui/specs/examples/` | `www/apps/ui/sidebar.mjs` |
| user-guide (Merchant Guide) | `www/apps/user-guide/app/` | `www/apps/user-guide/sidebar.mjs` |
| cloud (Get Started) | `www/apps/cloud/app/` | `www/apps/cloud/sidebar.mjs` |

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
[text](!user-guide!/path)        → user-guide (Merchant Guide)
[text](!cloud!/path)             → cloud (Get Started)
```

## Common Mistakes

- [ ] Showing only local setup, or showing local setup before Cloud
- [ ] Mentioning self-hosting, Docker in production, or other hosting platforms
- [ ] Using `create-medusa-app` outside its reference page, or linking `!docs!/learn/installation` (use `!cloud!/setup-locally`)
- [ ] Writing "User Guide" or "Medusa Admin User Guide" instead of "Merchant Guide"
- [ ] Writing "Bloom" instead of "Docs Assistant"
- [ ] Setting environment variables only in `.env` without the Cloud step
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
reference/cloud-first.md        - Cloud-first messaging, docs structure, Agent Hand-off notes
reference/when-to-document.md   - Decision tree: does this change need docs?
reference/mdx-patterns.md       - MDX syntax, code blocks, components
reference/book-style.md         - book-specific structure and conventions
reference/resources-style.md    - resources-specific structure and conventions
reference/user-guide-style.md   - Merchant Guide (user-guide) writing style and conventions
reference/cloud-style.md        - cloud-specific structure and conventions
reference/vale-rules.md         - Vale + lint rules to follow in prose
```
