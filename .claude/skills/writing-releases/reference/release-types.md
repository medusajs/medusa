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

## Identifying Feature Highlights

A change qualifies as a Highlight only if it meets **at least one** of these criteria:

- **New module**: introduces a new commerce module under `packages/modules/` or `packages/plugins/` (e.g. a new Subscriptions module, Loyalty plugin)
- **Wide API surface**: adds a substantial range of new endpoints or service methods across a domain — not a single new field or filter
- **New architecture pattern**: introduces a new framework-level capability (e.g. new workflow primitives, new plugin architecture, new event system)
- **Significant new commerce capability**: unlocks a major use case that wasn't possible before (e.g. B2B pricing, digital products, multi-warehouse fulfillment, new payment flow architecture)

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
Are there any minor changesets (breaking changes)?
  └─ Yes → Multi-Highlight required (each breaking change gets a Highlight)

Are there any changes matching the Feature Highlight criteria above?
  ├─ No → Minimal release (no Highlights section)
  ├─ One → Single Highlight
  └─ Several → Multi-Highlight
```
