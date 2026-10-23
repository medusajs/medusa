# Feature Request Triage

Feature requests are tracked in the
[Feature Requests](https://github.com/medusajs/medusa/discussions/categories/feature-requests)
Discussions category, not in issues. They are **closed**, never converted.

## Step 1 — Check if the Feature Already Exists

Search the codebase and documentation to confirm the feature doesn't already exist.

**Where to look:**
- Medusa source code (`packages/`)
- Official docs (`www/apps/`)
- Recent merged PRs or changelog for the feature

## Step 2 — Decide

| Finding | Outcome | Template | Summary |
|---------|---------|----------|---------|
| Feature exists | `close` | `close-invalid` | Explain how to use it, with a docs link (see `doc-links.md`) |
| Existing feature is broken, not missing | Treat as a bug: load `bug-report.md` | | |
| Feature doesn't exist | `feature` | `close-feature` | One sentence restating the request, so the author can carry it to Discussions |

The `close-feature` template already contains the Discussions link and the
reopen instructions; don't repeat them in the summary.
