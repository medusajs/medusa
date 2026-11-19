# Release Notes Format

## Section Order

Do NOT add a title or heading at the top. The release notes start directly with the MCP update prompt. Maintain this order:

````markdown
Medusa MCP users can update their project using the following prompt:

```bash
Update my Medusa project to vX.Y.Z
```

## Run Migrations
(only if the release has migrations or migration scripts — see release-types.md)

## Highlights
(only include if there are qualifying highlights — see release-types.md)

## Features

## Bugs

## Documentation

## Chores

## Other Changes

## New Contributors

**Full Changelog**: [vX.Y.Z-prev...vX.Y.Z](https://github.com/medusajs/medusa/compare/vX.Y.Z-prev...vX.Y.Z)
````

The Full Changelog line is **always last**, always present, always bold, not a heading.

---

## MCP Update Prompt

Always the first content of every release, including minimal patch releases. Copy it exactly, replacing `vX.Y.Z` with the current release tag (with the `v` prefix). No heading above it.

---

## Run Migrations Section

Include it only when the release adds database migrations or migration scripts (detection rules in `release-types.md`). Use exactly this content:

````markdown
## Run Migrations

This release includes database migrations. After updating, run the following command to apply them:

```bash
npx medusa db:migrate
```
````

`db:migrate` also runs migration scripts and syncs module links, so one command covers both. If the release only adds migration scripts, replace "database migrations" with "migration scripts".

---

## Release Notices

When the release replaces or corrects a previous one (e.g. it republishes packages that shipped broken), add a short plain paragraph after the MCP prompt and before the first section. Say which release it supersedes, why, and link that release's notes if they hold content users still need (security patches, migration steps).

```markdown
This release supersedes v2.22.5, which was released with missing package files. v2.22.5 included a security hardening fix, so refer to [its notes](https://github.com/medusajs/medusa/releases/tag/v2.22.5) for the fix and patches for older versions.
```

---

## Bullet Format

Every entry in Features, Bugs, Documentation, Chores, and Other Changes must use this exact format:

```
*   <type>(<scope>): <description> by [@username](https://github.com/username) in [#NNNN](https://github.com/medusajs/medusa/pull/NNNN)
```

- Three spaces after the asterisk: `*   `
- Author: `[@username](https://github.com/username)` — use the GitHub handle from PR metadata
- Bot authors: `pr_author_login` is `app/<name>` (e.g. `app/medusa-os-bot`, `app/dependabot`). Drop the `app/` prefix from the handle and link to `https://github.com/apps/<name>`: `[@medusa-os-bot](https://github.com/apps/medusa-os-bot)`
- PR: `[#NNNN](https://github.com/medusajs/medusa/pull/NNNN)` — always linked
- Use the conventional commit prefix from the commit/PR title as-is (e.g. `feat(cart):`, `fix(order):`, `chore(deps):`)

**Example:**
```
*   feat(cart): add support for gift card line items by [@shahednasser](https://github.com/shahednasser) in [#14500](https://github.com/medusajs/medusa/pull/14500)
```

---

## Commit Prefix → Section Mapping

| Conventional commit prefix | Section |
|---------------------------|---------|
| `feat:` / `feat(scope):` | Features |
| `fix:` / `fix(scope):` | Bugs |
| `docs:` / `docs(scope):` | Documentation |
| `chore:` / `chore(scope):` | Chores |
| `refactor:`, `perf:`, `build:`, `ci:` | Chores |
| `test:` | Chores |
| `fix(ci):`, `Revert "..."` | Chores |
| Translation / i18n PRs, including `chore(dashboard): add missing translations` | Other Changes |
| Anything that doesn't fit cleanly | Other Changes |

---

## New Contributors Section

Add this section when there are first-time contributors. Format:

```markdown
## New Contributors
* @username made their first contribution in [#NNNN](https://github.com/medusajs/medusa/pull/NNNN)
```

---

## Full Changelog Line

Always the final line of the release body. Format:

```markdown
**Full Changelog**: [vX.Y.Z-prev...vX.Y.Z](https://github.com/medusajs/medusa/compare/vX.Y.Z-prev...vX.Y.Z)
```

Replace `X.Y.Z-prev` with the previous release tag (without `v` prefix in the display text, with `v` prefix in the URL path).
