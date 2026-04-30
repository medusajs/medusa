# Release Notes Format

## Section Order

Do NOT add a title or heading at the top. The release notes start directly with the first section. Maintain this order:

```markdown
## Highlights
(only include if there are qualifying highlights — see release-types.md)

## Features

## Bugs

## Documentation

## Chores

## Other Changes

## New Contributors

**Full Changelog**: [vX.Y.Z-prev...vX.Y.Z](https://github.com/medusajs/medusa/compare/vX.Y.Z-prev...vX.Y.Z)
```

The Full Changelog line is **always last**, always present, always bold, not a heading.

---

## Bullet Format

Every entry in Features, Bugs, Documentation, Chores, and Other Changes must use this exact format:

```
*   <type>(<scope>): <description> by [@username](https://github.com/username) in [#NNNN](https://github.com/medusajs/medusa/pull/NNNN)
```

- Three spaces after the asterisk: `*   `
- Author: `[@username](https://github.com/username)` — use the GitHub handle from PR metadata
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
| Translation / i18n PRs | Other Changes |
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
