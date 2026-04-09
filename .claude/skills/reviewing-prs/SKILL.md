---
name: reviewing-prs
description: Reviews GitHub pull requests for the Medusa repository. Checks PR template compliance, contribution guidelines, code conventions, and community contribution limits. Posts a review comment and applies initial-approval or requires-more label. Use when a PR is opened or updated.
argument-hint: <pr_number> [title] [author]
---

# PR Review

Reviews GitHub pull requests for Medusa. Checks template compliance, contribution guidelines, code conventions, and community limits. Posts a concise review comment and applies a label.

## CRITICAL: Load Reference Files When Needed

**⚠️ The quick reference in this file is NOT sufficient on its own.** You MUST load the relevant reference files before executing each step.

**Load these references based on what you're doing:**

- **Checking contribution guidelines?** → MUST load `reference/contribution-types.md` first
- **Verifying code conventions?** → MUST load `reference/conventions.md` first
- **Writing a review comment?** → MUST load `reference/comment-guidelines.md` first (includes bug reporting format)

**Minimum requirement:** Load at least the relevant reference file(s) before completing the review.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `pr_number` | Yes | GitHub PR number to review |
| `title` | No | PR title (fetched via script if omitted) |
| `author` | No | PR author login (fetched via script if omitted) |

If title or author are not provided, fetch them with:
```bash
bash scripts/get_pr.sh <pr_number>
```

## Available Scripts

```bash
bash scripts/get_pr.sh <pr_number>                       # Fetch PR details (title, body, author, diff stats)
bash scripts/get_pr_files.sh <pr_number>                 # List files changed in the PR as JSON
bash scripts/get_linked_issues.sh <pr_number>            # Fetch issues linked with closing keywords
bash scripts/get_comments.sh <pr_number>                 # Fetch all existing comments on the PR
bash scripts/get_labels.sh <pr_number>                   # Fetch current labels on the PR
bash scripts/add_comment.sh <pr_number> <body>           # Post a comment on the PR
bash scripts/labels.sh <pr_number> <action> <label>      # Manage labels: action is "add" or "remove"
bash scripts/close_issue.sh <pr_number>                  # Close the PR
bash scripts/get_issue.sh <issue_number>                 # Fetch a linked issue's details
```

## Review Flow

### Step 1 — Fetch PR Details

If title/author were not passed as arguments:
```bash
bash scripts/get_pr.sh <pr_number>
```

Always fetch current labels, changed files, and prior comments:
```bash
bash scripts/get_labels.sh <pr_number>
bash scripts/get_pr_files.sh <pr_number>
bash scripts/get_comments.sh <pr_number>
```

### Step 2 — Review Prior Comments

Read the existing comments fetched in Step 1. Identify any previous bot review comments (comments from this automation) that raised issues or made requests.

For each previously raised issue or remark, determine whether it has been addressed in the current state of the PR:

- If **all prior issues are resolved** — acknowledge the progress in the new review comment and focus only on any remaining or new issues.
- If **some prior issues remain unresolved** — carry them forward into the new review. Do not re-explain them in detail; reference them briefly (e.g., *"The changeset message format is still incorrect"*).
- If **this is the first review** (no prior bot comments) — skip this step.
- If **there is a prior review and nothing has changed** — no new issues, no resolved issues, no new concerns — **do not post a new comment**. Stop here.

> **CRITICAL:** Do not repeat the full explanation for issues already raised in a previous comment. Keep follow-up reviews concise — assume the contributor has read the prior feedback.

### Step 3 — Check Team Membership

Read `.github/teams.yml`. If the PR author's login appears in the list, they are a **team member** — **skip steps 3 and 4** entirely and proceed directly to step 5.

### Step 3 — Template Compliance (non-team members only)

The PR body must follow `.github/pull_request_template.md`. It requires these sections to be filled in (not left as placeholder text):

- **What** — description of the changes
- **Why** — reason for the changes
- **How** — implementation approach
- **Testing** — how to verify the changes

If any section is missing or contains only the placeholder (*"Please provide answer here"*), post a comment requesting it be filled out, apply `requires-more`, and **stop**.

**Comment template — incomplete template:**
```
Thank you for your contribution!

Could you please fill in the PR description following our [pull request template](https://github.com/medusajs/medusa/blob/develop/.github/pull_request_template.md)? We need the **What**, **Why**, **How**, and **Testing** sections completed so we can review your PR efficiently.

Once you've updated the description, another review will be triggered automatically.

Thanks!
```

### Step 4 — Non-Member Checks (skip if team member)

**4a. Massive changes:**

If the PR has more than 500 changed lines (additions + deletions) **or** more than 20 changed files:
```bash
bash scripts/get_linked_issues.sh <pr_number>
```
Check whether any linked issue carries a `help-wanted` label. If not, apply `requires-more` and comment explaining that large contributions should be scoped and pre-approved via an issue first (reference `CONTRIBUTING.md`).

**4b. Security scan:**

Review the changed file paths and PR body for:
- Credentials, secrets, or API keys in code
- Remote code execution vectors (`eval`, dynamic imports of remote URLs)
- Suspicious package additions (`package.json` changes with unknown packages, unusual `scripts` entries)
- Tampered lock files or build scripts

If **malicious code** is found → close the PR immediately with a clear explanation:
```bash
bash scripts/close_issue.sh <pr_number>
```

If **potential security risks** (not clearly malicious) → include them as a concern in the review comment.

### Step 5 — Fetch Linked Issues

```bash
bash scripts/get_linked_issues.sh <pr_number>
```

Look for closing keywords (`closes`, `fixes`, `resolves` + `#<number>`) in the PR body. Note whether a verified, open issue is linked.

### Step 6 — Determine Contribution Type

Inspect the changed file paths and load the relevant reference section:

| Paths changed | Contribution type |
|--------------|-------------------|
| `www/apps/` or `www/packages/docs-ui/` | Docs → load `reference/contribution-types.md` Docs section |
| `packages/admin/dashboard/src/i18n/translations/` | Admin translation → load `reference/contribution-types.md` Admin Translations section |
| `packages/`, `integration-tests/`, or other | Code → load `reference/contribution-types.md` Code section |

For mixed PRs, apply all relevant types.

### Step 7 — Check Conventions

Load `reference/conventions.md` and verify the changed files follow Medusa's conventions. Focus on the areas most relevant to the contribution type (e.g., API conventions for code changes, MDX structure for docs changes).

### Step 8 — Bug Detection

Read the actual code diff carefully and look for potential bugs. Focus on:

- **Logic errors** — off-by-one, wrong conditionals, inverted boolean checks
- **Null / undefined access** — accessing properties on values that may be null/undefined without guards
- **Async issues** — missing `await`, unhandled promise rejections, race conditions
- **Type mismatches** — passing wrong types, unsafe casts, implicit coercions
- **Resource leaks** — unclosed DB connections, missing transaction rollbacks, unhandled errors in cleanup paths
- **Edge cases not handled** — empty arrays, zero values, missing input validation
- **Mutation side-effects** — mutating shared state or function arguments unexpectedly
- **Incorrect error handling** — swallowed errors, rethrowing without context, wrong error types

For each potential bug found:
- Note the **file and approximate location**
- Briefly explain **why it's a bug or risk**
- Suggest a **concrete fix** if one is obvious

> **CRITICAL:** Distinguish between confirmed bugs (clear logic/runtime errors) and code smell / style issues. Only flag something as a bug if it would plausibly cause incorrect behaviour at runtime.

### Step 9 — Contextual Assessment

Before writing the review, assess whether the changes make sense in the broader context of the PR. Load `reference/comment-guidelines.md` (Contextual Assessment section) for the full checklist. Key questions:

- Does the implementation actually solve the problem in the PR/linked issue?
- Could the change break or alter behaviour in other parts of the codebase?
- Is the scope right — no unrelated changes included?
- Are edge cases and potential regressions covered?
- Are there obvious performance or correctness concerns?

Note any concerns to include in the review comment.

### Step 10 — Compose and Post Review

Load `reference/comment-guidelines.md` for comment templates and tone guidance.

Decide the outcome:

| Label | When |
|-------|------|
| `initial-approval` | PR follows all guidelines; team will do the final review |
| `requires-more` | PR needs changes — list exactly what must change |

Post the comment then apply the label:
```bash
bash scripts/add_comment.sh <pr_number> "<body>"
bash scripts/labels.sh <pr_number> add <label>
```

## Common Mistakes

- [ ] Checking template compliance for team members — skip for team members
- [ ] Being vague about required changes — always list exactly what needs to change and why
- [ ] Closing a PR without a clear explanation
- [ ] Forgetting the docs-ui test requirement for `www/packages/docs-ui/` changes
- [ ] Skipping the integration test check for API route changes in `packages/medusa/src/api/`
- [ ] Not fetching PR details when they weren't passed as arguments

## Reference Files

```
reference/conventions.md           - Medusa coding conventions to verify
reference/contribution-types.md    - How to verify code, docs, and admin translation contributions
reference/comment-guidelines.md    - Comment writing rules and templates
```
