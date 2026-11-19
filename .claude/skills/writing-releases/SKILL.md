---
name: writing-releases
description: Writes GitHub release notes for Medusa releases in the established style. Use when generating a draft release description from a list of commits and PR metadata. Covers minimal patch releases, single-highlight releases, multi-feature releases, and releases with breaking changes.
---

# Writing Medusa Release Notes

Generates GitHub release notes from commit/PR data in the established Medusa style.

## Constraints

- **Full Changelog link is mandatory** — always the last line: `**Full Changelog**: [vPREV...vNEW](compare-url)`
- **No top-level Breaking Changes section** — breaking changes are embedded inside their Highlight subsection with `🚧 Breaking change`, never in a separate `## Breaking Changes` heading
- **Bullet format is strict** — every entry in Features/Bugs/Chores/etc. must include author link and PR link (see `reference/format.md`)
- **Highlights are not a summary of all PRs** — only significant changes qualify; routine additions go in Features/Bugs bullets only (see `reference/release-types.md`)
- **No emojis** — the only permitted emoji is `🚧` on breaking change highlights; use none anywhere else
- **MCP update prompt is mandatory** — always the first content, before any section (see `reference/format.md`)
- **Migrations go at the top** — if the release adds migrations or migration scripts, add `## Run Migrations` right after the MCP prompt
- **Highlights are sorted by impact** — breaking (incl. breaking dependency changes) → behavior changes → features → mechanical work and non-breaking dependency updates last
- **Behavior changes are highlighted** — fixes or features that can change how an existing store behaves (new validation, changed defaults or calculations) get a Highlight even when not breaking
- **Code block required for actionable steps** — if a highlight requires the developer to install a package, run a command, or update config, include a fenced code block with the exact command(s)

## Load Reference Files When Needed

> **Load at least one reference file before writing.**

| Task | Load |
|------|------|
| Formatting sections and bullets | `reference/format.md` |
| Deciding whether to write Highlights; identifying breaking changes, behavior changes, migrations, and dependency changes | `reference/release-types.md` |
| Writing the Highlights section | `reference/highlights.md` |

## Quick Reference

### Release type decision

| Commit set | Release type |
|-----------|-------------|
| Only routine fixes/chores, no user-facing impact | Minimal — no Highlights section |
| One important change is the main reason for the release | Single Highlight |
| Multiple significant features or fixes | Multi-Highlight |
| Any PR with a minor changeset in `.changeset/` | Add `🚧` to that Highlight |
| Fix/feature that changes existing commerce behavior | Highlight with `**Behavior change**` |
| Breaking dependency change | `🚧` Highlight with other breaking changes |
| New package or non-breaking dependency change | Last Highlight: `Dependency Updates` |
| New migrations or migration scripts | `## Run Migrations` at the top |

### Section order (include only sections with entries, except the MCP prompt)

```
MCP update prompt (always)
## Run Migrations
## Highlights
## Features
## Bugs
## Documentation
## Chores
## Other Changes
## New Contributors
**Full Changelog**: [vPREV...vNEW](url)
```

## Common Mistakes

- [ ] Adding a title or `# Heading` at the top — release notes have no title, start directly with the MCP update prompt
- [ ] Missing the MCP update prompt, or using a version other than the current release tag
- [ ] Release adds migrations but has no `## Run Migrations` section
- [ ] Skipping a fix that adds validation or changes a calculation because it isn't technically breaking
- [ ] Highlights out of order (a feature before a breaking or behavior change)
- [ ] Skipping a Highlight because the PR is a `chore:`: feature-flag removals (module goes stable), deprecations, new major tooling support (TypeScript, Tailwind CSS), and security fixes are Highlights
- [ ] A `---` after the last Highlight, right before `## Features`
- [ ] Linking a bot author to `https://github.com/app/<name>` or `https://github.com/<name>` instead of `https://github.com/apps/<name>`
- [ ] A feature Highlight without a "Learn more" docs link when a docs page exists
- [ ] Inventing patch download links for a security fix instead of leaving the TODO comment
- [ ] Putting `chore(dashboard): add missing translations` in Chores instead of Other Changes
- [ ] Adding a `## Breaking Changes` top-level section — embed inside the Highlight instead
- [ ] Putting a routine bug fix or small feature addition in Highlights
- [ ] Missing the Full Changelog link at the end
- [ ] Bullet missing author link or PR link
- [ ] Using PR title verbatim as a Highlight heading — write a descriptive outcome-focused title
- [ ] Treating every `feat:` commit as a Highlight candidate
- [ ] Using emojis anywhere except `🚧` on breaking change highlights
- [ ] Writing a Highlight that requires a developer action (install, run, config change) without a fenced code block

## Reference Files

```
reference/format.md          — section order, bullet format, commit prefix → section mapping
reference/release-types.md   — when to add Highlights; breaking, behavior, migration, and dependency detection
reference/highlights.md      — Highlight ordering and how to write subsections
```
