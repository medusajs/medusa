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
- **Code block required for actionable steps** — if a highlight requires the developer to install a package, run a command, or update config, include a fenced code block with the exact command(s)

## Load Reference Files When Needed

> **Load at least one reference file before writing.**

| Task | Load |
|------|------|
| Formatting sections and bullets | `reference/format.md` |
| Deciding whether to write Highlights, and identifying breaking changes | `reference/release-types.md` |
| Writing the Highlights section | `reference/highlights.md` |

## Quick Reference

### Release type decision

| Commit set | Release type |
|-----------|-------------|
| Only routine fixes/chores, no user-facing impact | Minimal — no Highlights section |
| One important change is the main reason for the release | Single Highlight |
| Multiple significant features or fixes | Multi-Highlight |
| Any PR with a minor changeset in `.changeset/` | Add `🚧` to that Highlight |

### Section order (include only sections with entries)

```
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

- [ ] Adding a title or `# Heading` at the top — release notes have no title, start directly with the first section
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
reference/release-types.md   — when to add Highlights, breaking change detection, highlight criteria
reference/highlights.md      — how to write Highlight subsections
```
