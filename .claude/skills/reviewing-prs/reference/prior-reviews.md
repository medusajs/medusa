# Prior Reviews and Earlier PRs

Steps 2 and 3: earlier open PRs on the same issue, and what earlier bot reviews already raised.

## Step 2 — Check for a Previous PR Resolving the Same Issue

If the PR body links an issue (from Step 1's PR details), determine whether
an **earlier** PR already resolves the same issue:

1. Get the linked issue numbers with `bash scripts/get_linked_issues.sh <pr_number>`.
2. For each linked issue number `M`, run
   `bash scripts/search_prs.sh M` (bare number, e.g.
   `bash scripts/search_prs.sh 1234`). This searches open PR **bodies**
   for a `#M` reference, so it catches PRs that merely **mention** the
   issue — many PRs reference an issue without linking it via a closing
   keyword, and those would be missed by only looking at the issue's
   linked/closing PRs. (The script post-filters the search so a PR that
   happens to contain the number `M` in an unrelated context is not
   returned.)
3. From the result, keep only PRs that are **not** the PR under review and
   have a **lower number** than it (a lower PR number means it was opened
   earlier — i.e. a *previous* PR). The search already returns only open
   PRs.

If one or more such previous PRs exist, the PR under review is the likely
duplicate. Flag it **once** by adding a **Heads up** line to your
`summary`, naming the earliest previous PR and the shared issue, e.g.:

> *"Heads up: PR #N already references issue #M and was opened earlier;
> if #N is merged first, this PR may be closed as a duplicate."*

This is **informational only** — it does not change the label outcome and
does not add a blocking point.

**Flag it only once per PR — at the first review.** Before adding the
line, scan the prior bot comments fetched in Step 1: if a previous review
already flagged the same duplicate (mentions the same previous PR /
issue), do **not** repeat it. Re-add the line only if the previous PR
changed (a different or newly-opened earlier PR now resolves the issue).

If the PR doesn't link an issue, or no earlier open PR references the same
issue, skip this step.

> **CRITICAL:** Do not block the PR solely because a previous PR was found.
> Only the earlier PR's author (or the team) decides which one wins — the
> heads-up is a coordination note, never a blocking point or label change.

## Step 3 — Review Prior Comments

Read the existing comments fetched in Step 1. Identify any previous bot review comments and assess what is still outstanding.

Check **each** blocking point of the latest bot review against the PR's current code (`get_pr_file.sh`), not against the author's reply. Give each one a status: **Fixed**, **Partial** (what's still missing), **Not fixed**, or **Dropped** (out of scope, or wrong on a second look). Report them as the **Previous review** lines of `summary` (see **Report Format** in `output.md`).

- If **all prior issues are resolved** — say so in the **Previous review** line and only list new findings in `blocking_points`.
- If **some prior issues remain unresolved** — carry each **Partial** or **Not fixed** one forward into `blocking_points`. Don't re-explain them in detail; reference them briefly.
- If a **prior blocker is no longer in scope** for this review (e.g. a missing linked issue, which `pr-guardrails.yml` now enforces), drop it silently. Dropping it counts as a change, so this is not a no-op re-review.
- If **this is the first review** (no prior bot comments) — skip this step.
- If **there is a prior review and nothing has changed** — no new issues, no resolved or dropped issues, no new concerns — emit a no-op decision (`review_template: null`, empty label arrays). Stop here. Exception: a PR labeled `requires-rewrite` never gets a no-op; continue to Step 5b.

> **CRITICAL:** Do not repeat the full explanation for issues already raised in a previous comment.

## Common Mistakes

- [ ] Skipping the previous-PR check (Step 2)
- [ ] Marking a prior blocking point fixed because the author said so, without reading the current code
- [ ] Blocking a PR solely because a previous PR resolves the same issue
- [ ] Repeating the previous-PR heads-up on every re-review — flag it only once, at the first review
- [ ] Flagging a *later* PR (higher number) as the one that may close this PR — the heads-up applies only when an *earlier* open PR resolves the same issue
