# Release Types and Classification

## When to Include a Highlights Section

**No Highlights** — use for patch releases where:
- All changes are routine bug fixes or chores
- Nothing requires user action or introduces new user-facing behavior
- No notable new capabilities ship in this release

**Single Highlight** — use when:
- One change is the primary reason for the release (e.g. a critical regression fix)
- One significant new feature ships alongside minor fixes
- The release is mostly small changes but one deserves explanation

**Multi-Highlight** — use when:
- Multiple changes independently warrant explanation
- A minor or major version ships with several notable features

---

## Identifying Breaking Changes

A PR is a breaking change if **either** of the following is true:

1. **Minor changeset** — the PR includes a changeset file under `.changeset/` with `"package-name": minor` (as opposed to `patch`). Look for changeset files added in the commit: `git show <hash> -- .changeset/*.md`
2. **`breaking-change` label** — the PR's `pr_labels` array in the commit JSON contains `"breaking-change"`

Either signal alone is sufficient. The workflow pre-counts both and passes the total as `minor_changesets` in the prompt context.

**What to do with a breaking change:**
- It **must** appear in the Highlights section
- The Highlight subsection starts with `🚧 Breaking change` on its own line
- Include migration steps (config changes, updated imports, CLI commands) in a fenced code block
- If there is nuance (e.g. "only breaking if you use X"), add a `>` blockquote explaining who is affected

---

## Identifying Behavior Changes

A non-breaking change still gets a Highlight when it can change how an existing store behaves after upgrading. Check every `fix:` and `feat:` commit touching `packages/modules/`, `packages/core/core-flows/`, or `packages/medusa/src/api/` with `git show <hash> --stat`, then read the diff of the ones that look relevant.

It's a behavior change when the PR:

- Adds validation or a new error where the operation used to succeed (even if succeeding was the bug)
- Changes a default value, calculation (totals, taxes, prices, inventory quantities), or status transition
- Changes which records a workflow or route reads, creates, or returns

Example: a fix that makes inventory confirmation fail when no stock location level is linked to the sales channel's location. It's correct, but stores without location levels now get errors at checkout, so it needs a Highlight telling them to set location levels.

**What to do with a behavior change:**
- Add a Highlight with `**Behavior change**` on its own line (no emoji)
- Add a `>` blockquote saying who is affected and what to check or configure before upgrading

---

## Identifying Migrations

The release needs the `## Run Migrations` section (see `format.md`) when any commit adds a file under:

- `packages/modules/**/src/migrations/` or `packages/plugins/**/migrations/` (database migrations)
- `packages/**/src/migration-scripts/` (migration scripts)

Check with `git show <hash> --stat --diff-filter=A`. Ignore `__fixtures__` and `__tests__` paths.

---

## Identifying Dependency Changes

Check commits touching any `packages/**/package.json` (`chore(deps)`, `build`, and new-package PRs especially) with `git show <hash> -- '**/package.json'`. Ignore `devDependencies`, version bumps of `@medusajs/*` packages from the release itself, and root/`www/` changes.

- **Breaking dependency change**: a minor changeset on the PR, a major bump of a `peerDependency`, a new required `peerDependency`, a raised Node.js `engines` version, or a major bump of a dependency whose API users touch directly (e.g. `zod`, `react`, `@mikro-orm/*`). Treat it as a breaking change: a `🚧` Highlight with the exact install command.
- **Non-breaking dependency change**: a new published `@medusajs/*` package, a new dependency, or a minor/patch bump. Group them in a single `Dependency Updates` Highlight placed last (see ordering in `highlights.md`), one line per package with old and new version.

---

## Identifying Feature Highlights

A change qualifies as a Highlight only if it meets **at least one** of these criteria:

- **New module**: introduces a new commerce module under `packages/modules/` or `packages/plugins/` (e.g. a new Subscriptions module, Loyalty plugin)
- **Wide API surface**: adds a substantial range of new endpoints or service methods across a domain — not a single new field or filter
- **New architecture pattern**: introduces a new framework-level capability (e.g. new workflow primitives, new plugin architecture, new event system)
- **Significant new commerce capability**: unlocks a major use case that wasn't possible before (e.g. B2B pricing, digital products, multi-warehouse fulfillment, new payment flow architecture)

**Also a Highlight, whatever the commit prefix** (these often ship as `chore:` or `fix:`, so don't skip them):

- **Module or feature leaves beta**: a feature flag is removed or a module becomes enabled by default. Title it `<Name> Stable` and say what's now available without a flag.
- **Deprecation**: a module, API, or option is deprecated. Say what replaces it and show the config or code to remove or change.
- **Support for a new major version of user-facing tooling**: TypeScript, Tailwind CSS, Node.js, React, or a package manager. Show the install command.
- **Security fix**: a PR fixing a vulnerability or hardening input handling (`security` label, CVE in the title, words like "harden", "escape", "sanitize", "unsafe"). See `highlights.md` for the structure. Routine dependency bumps for CVEs stay in bullets unless the vulnerability affects Medusa's own code paths.

**Not a Highlight** (put in Features bullets only):
- A single new filter parameter on an existing endpoint
- A new optional field on an existing resource
- A minor UI improvement in the admin dashboard
- A non-breaking API extension that adds one method
- A new translation/locale
- Dependency upgrades without user-facing behavior change
- Test infrastructure improvements
- Routine DX improvements (better error messages, new CLI flag)

**Rule of thumb**: if a developer reading the release notes would need to update their code or architecture to take advantage of it, it's a Highlight. If a developer would find this change interesting or cool, it's a Highlight. If they can ignore it and everything still works, it's probably not.

---

## Decision Flowchart

```
Are there any minor changesets (breaking changes) or breaking dependency changes?
  └─ Yes → Multi-Highlight required (each breaking change gets a Highlight)

Are there any behavior changes or dependency changes?
  └─ Yes → Each gets a Highlight (dependency changes share one non-breaking Highlight)

Are there any changes matching the Feature Highlight criteria above?
  ├─ No → Minimal release (no Highlights section)
  ├─ One → Single Highlight
  └─ Several → Multi-Highlight
```
