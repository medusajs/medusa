# Support Issue Triage

Support issues are requests for help implementing something or understanding how Medusa works — not bug reports or feature requests.

## Step 1 — Check if It's Actually a Bug

Before treating the issue as a support request, assess whether the user's problem is caused by something broken in Medusa rather than a misunderstanding or usage question.

Signs it may be a bug:
- The user followed the docs correctly but got an unexpected error or result
- The behavior they describe contradicts what the code should do
- They provide a reproduction that demonstrates something not working as designed

**If it looks like a bug:** stop this flow and follow `reference/bug-report.md` instead.

**If it's clearly a support/usage question:** continue below.

---

## Cloud Platform Exception

**Before anything else:** check if the user mentions the issue is on the **Medusa Cloud platform** (e.g., cloud deployment, cloud dashboard, cloud-specific behavior).

If yes:
1. Search the docs (`www/apps/`) for information related to the user's issue
2. **If docs cover it:** proceed with the standard support flow below, referencing the docs in the summary
3. **If docs don't cover it:** pick `escalate` with `linear.team: "cloud"`, so the ticket goes to the Cloud team (CLO)

---

## Standard Support Flow

Usage questions are closed and pointed to community channels:

- `outcome: "close"`, `comment_template: "close-invalid"`
- `summary`: say this is a usage question rather than a bug, point to the
  relevant docs page when one answers it, and suggest asking in
  [GitHub Discussions](https://github.com/medusajs/medusa/discussions) or
  the Medusa Discord. Only github.com/medusajs, docs.medusajs.com, and
  medusajs.com links survive in the summary, so name Discord without a link.
