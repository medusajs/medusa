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
- **Writing a review comment?** → MUST load `reference/comment-guidelines.md` first (includes bug, security, and performance reporting formats)

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
bash scripts/get_pr_files.sh <pr_number>                 # List files changed in the PR as JSON (metadata only)
bash scripts/get_pr_diff.sh <pr_number>                  # Fetch the full unified diff of the PR (required for code review)
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

Always fetch current labels, changed files, the full diff, and prior comments:
```bash
bash scripts/get_labels.sh <pr_number>
bash scripts/get_pr_files.sh <pr_number>
bash scripts/get_pr_diff.sh <pr_number>
bash scripts/get_comments.sh <pr_number>
```

### Step 2 — Check for Duplicate PRs

If the PR body links an issue (from Step 1's PR details), search for other open PRs that reference the same issue:

```bash
gh pr list --repo medusajs/medusa --state open --search "issue-number" --json number,title,author
```

If another open PR is found that links the same issue:
1. Include a **Heads up** note at the top of your review comment (before any other feedback):
   ```
   **Heads up for the team:** PR #<other_number> also references issue #<issue_number>. Please coordinate to avoid duplicated work.
   ```
2. This note is **informational only** — it does not change the label outcome. Continue the rest of the review as normal.

If the PR doesn't link an issue, skip this step.

> **CRITICAL:** Do not block or close the PR solely because a duplicate was found. Only flag it so the team or author can decide how to proceed.

### Step 3 — Review Prior Comments

Read the existing comments fetched in Step 1. Identify any previous bot review comments (comments from this automation) that raised issues or made requests.

For each previously raised issue or remark, determine whether it has been addressed in the current state of the PR:

- If **all prior issues are resolved** — acknowledge the progress in the new review comment and focus only on any remaining or new issues.
- If **some prior issues remain unresolved** — carry them forward into the new review. Do not re-explain them in detail; reference them briefly (e.g., *"The changeset message format is still incorrect"*).
- If **this is the first review** (no prior bot comments) — skip this step.
- If **there is a prior review and nothing has changed** — no new issues, no resolved issues, no new concerns — **do not post a new comment**. Stop here.

> **CRITICAL:** Do not repeat the full explanation for issues already raised in a previous comment. Keep follow-up reviews concise — assume the contributor has read the prior feedback.

### Step 4 — Check Team Membership

Read `.github/teams.yml`. If the PR author's login appears in the list, they are a **team member** — **skip steps 4 and 5** entirely and proceed directly to step 6.

### Step 5 — Template Compliance (non-team members only)

The PR body must follow `.github/pull_request_template.md`. It requires these sections to be filled in (not left as placeholder text):

- **What** — description of the changes
- **Why** — reason for the changes
- **How** — implementation approach
- **Testing** — how to verify the changes

If any section is missing or contains only the placeholder (*"Please provide answer here"*), post a comment requesting it be filled out, apply `requires-more`, and **stop**.

**Comment template — incomplete template:**
```
Thank you for your contribution, @<author>!

Could you please fill in the PR description following our [pull request template](https://github.com/medusajs/medusa/blob/develop/.github/pull_request_template.md)? We need the **What**, **Why**, **How**, and **Testing** sections completed so we can review your PR efficiently.

Once you've updated the description, another review will be triggered automatically.

Thanks!
```

### Step 6 — Non-Member Checks (skip if team member)

**4a. Massive changes:**

If the PR has more than 500 changed lines (additions + deletions) **or** more than 20 changed files:
```bash
bash scripts/get_linked_issues.sh <pr_number>
```
Check whether any linked issue carries a `help-wanted` label. If not, apply `requires-more` and comment explaining that large contributions should be scoped and pre-approved via an issue first (reference `CONTRIBUTING.md`).

### Step 7 — Fetch Linked Issues

```bash
bash scripts/get_linked_issues.sh <pr_number>
```

Look for closing keywords (`closes`, `fixes`, `resolves` + `#<number>`) in the PR body. Note whether a verified, open issue is linked.

### Step 8 — Determine Contribution Type

Inspect the changed file paths and load the relevant reference section:

| Paths changed | Contribution type |
|--------------|-------------------|
| `www/apps/` or `www/packages/docs-ui/` | Docs → load `reference/contribution-types.md` Docs section |
| `packages/admin/dashboard/src/i18n/translations/` | Admin translation → load `reference/contribution-types.md` Admin Translations section |
| `packages/`, `integration-tests/`, or other | Code → load `reference/contribution-types.md` Code section |

For mixed PRs, apply all relevant types.

### Step 9 — Check Conventions

Load `reference/conventions.md` and verify the changed files follow Medusa's conventions. Focus on the areas most relevant to the contribution type (e.g., API conventions for code changes, MDX structure for docs changes).

> **CRITICAL — Read full file context:** For every file you intend to flag an issue in, read the **entire file** (not just the diff lines) before raising a concern. A pattern that looks wrong in isolation may be handled correctly later in the file, overridden by a wrapper, or follow an established project convention. Only flag an issue after confirming it is not resolved elsewhere in the file.

> **CRITICAL — Only flag new code:** The diff contains both removed lines (prefixed `-`) and added lines (prefixed `+`). **Only raise issues about added/new lines.** Never request changes to lines that were already modified as part of this PR — the new version of those lines is what matters, not the old one.

### Step 10 — Security Analysis (ALL PRs)

> **CRITICAL:** This step applies to **all PRs**, including team members. Read the actual diff — do not rely only on file path inspection. Before flagging any issue, read the full file to confirm the concern is not already handled elsewhere. Only flag issues present in the new (added) lines of the diff, not in lines that were removed or already changed by this PR.

Check for the following security issues:

**Authentication & Authorization:**
- Missing or bypassed authentication middleware on new routes
- Authorization checks missing — any route that accesses or mutates data scoped to a user/store must verify ownership
- Privilege escalation — e.g., a non-admin route accepting admin-level operations

**Injection & Execution:**
- Raw SQL constructed from user input (SQL injection)
- Use of `eval()`, `new Function()`, or `vm.runInContext()` with untrusted data
- Dynamic `require()`/`import()` with user-controlled paths
- Shell command construction with user input (`exec`, `spawn`, `execSync`)

**Input Validation:**
- User-controlled input passed to filesystem operations (`fs.readFile`, `path.join`) without sanitization → path traversal
- Missing size/length limits on inputs that could cause DoS
- Unvalidated external URLs used in server-side fetches → SSRF

**Data Exposure:**
- Sensitive fields (passwords, secrets, internal IDs, PII) included in API responses or logs
- Error messages leaking internal stack traces, SQL queries, or file paths to the client
- Credentials, API keys, or secrets hardcoded or committed in any file

**Dependencies & Supply Chain:**
- New packages added to `package.json` — verify they're well-known, not typosquats, and have a clear purpose
- Unusual `scripts` entries in `package.json` (e.g., `postinstall`, `preinstall`) that execute commands
- Lock file changes inconsistent with `package.json` changes

**Malicious code:**
If clearly malicious code is found → close the PR immediately:
```bash
bash scripts/close_issue.sh <pr_number>
```

For each confirmed or suspected security issue:
- Note the **file, line/function, and the exact vulnerability class**
- Explain the **attack scenario** in one sentence
- Suggest a **concrete fix**

Security issues are always **blocking** — apply `requires-more` even if everything else looks good. Load `reference/comment-guidelines.md` for the Security Issues comment format.

### Step 11 — Performance Analysis (ALL PRs)

> **CRITICAL:** This step applies to **all PRs**. Only flag issues that would plausibly cause measurable degradation in production — not theoretical micro-optimizations. Before flagging, read the full file to confirm the issue is not already handled elsewhere. Only flag issues in the new (added) lines of the diff.

Check for:

**Database / Query Performance:**
- **N+1 queries** — a `query.graph()`, `query.index()`, or service call inside a loop over a result set. Flag the loop location and the repeated call.
- **Unbounded queries** — `query.graph()` / `remoteQueryObjectFromString()` / service list calls missing `pagination: req.queryConfig.pagination`. A missing pagination object means a full-table scan.
- **Missing pagination in response** — list routes that omit `count`, `offset` (`metadata.skip`), and `limit` (`metadata.take`) from the response body, breaking client-side pagination.
- **Missing database indexes** — new fields used in `filters` or `order` in a query call without a corresponding index in the entity decorator or migration.

**Async & Concurrency:**
- Sequential `await` in a loop where `Promise.all()` would work
- Heavy synchronous computation (sorting, transforming large arrays) on the main event loop in a hot path
- Unthrottled parallel operations that could overwhelm the DB connection pool

**Memory & Payload:**
- Loading large datasets entirely into memory before filtering/transforming
- API responses including deeply nested or large objects that could be paginated or trimmed
- Accumulating results in memory across paginated batches without streaming

For each performance issue found:
- Note the **file and function/line**
- Explain **why it's a problem** (e.g., "this query runs once per order item, which means N DB roundtrips for a cart with N items")
- Suggest a **concrete fix**

Performance issues severity:
- **Blocking (requires-more):** N+1 queries, unbounded queries on large tables, missing pagination on list endpoints
- **Non-blocking (note only):** Suggestions that are improvements but don't introduce clear production risk

### Step 12 — Bug Detection (ALL PRs)

> **CRITICAL:** This step applies to **all PRs** including team members. Any potential bug — confirmed or suspected — is a **required change** and must result in `requires-more`. Do not leave bugs as notes.

> **CRITICAL — Read full file before flagging:** For every file where you intend to flag a bug, read the entire file first. A bug in the diff may be handled by a guard, a wrapper, or a caller further in the file. Only flag a bug after confirming it is not already handled in the full file context.

> **CRITICAL — Only flag new code:** Only raise bugs against lines that were **added** in this PR (diff lines prefixed `+`). Do not flag lines that were removed (`-`) or lines that are unchanged context. Do not request changes to code that was already changed by this PR.

Read the actual code diff carefully. Flag anything that would plausibly cause incorrect runtime behaviour. Focus on:

- **Logic errors** — off-by-one, wrong conditionals, inverted boolean checks
- **Null / undefined access** — accessing properties on values that may be null/undefined without guards
- **Async issues** — missing `await`, unhandled promise rejections, race conditions
- **Type mismatches** — passing wrong types, unsafe casts, implicit coercions
- **Resource leaks** — unclosed DB connections, missing transaction rollbacks, unhandled errors in cleanup paths
- **Edge cases not handled** — empty arrays, zero values, missing input validation
- **Mutation side-effects** — mutating shared state or function arguments unexpectedly
- **Incorrect error handling** — swallowed errors, rethrowing without context, wrong error types
- **Wrong HTTP status codes** — returning 200 for errors, 201 for non-creation responses, etc.
- **Workflow compensation gaps** — `createStep` with side effects but no compensation function, meaning failed workflows leave orphaned data

For each potential bug found:
- Note the **file and approximate location**
- Quote the **relevant code snippet** in a fenced code block
- Briefly explain **why it's a bug or risk** — describe the failure scenario specifically
- Suggest a **concrete fix**

> Do NOT flag style issues, code smell, or naming preferences here. Only flag things that would plausibly cause incorrect behaviour at runtime. If you're uncertain, phrase it as a question but still add it to **Required changes** — it is the author's responsibility to confirm or disprove it.

### Step 13 — Contextual Assessment

Before writing the review, assess whether the changes make sense in the broader context of the PR. Load `reference/comment-guidelines.md` (Contextual Assessment section) for the full checklist. Key questions:

- Does the implementation actually solve the problem in the PR/linked issue?
- Could the change break or alter behaviour in other parts of the codebase?
- Is the scope right — no unrelated changes included?
- Are edge cases and potential regressions covered?

Note any concerns to include in the review comment.

### Step 14 — Compose and Post Review

Load `reference/comment-guidelines.md` for comment templates and tone guidance.

Decide the outcome:

| Label | When |
|-------|------|
| `initial-approval` | PR follows all guidelines, no security/performance blockers; team will do the final review |
| `requires-more` | PR needs changes — list exactly what must change |

> **CRITICAL:** Any security issue, any potential bug, or any blocking performance issue (N+1, unbounded query) **must** result in `requires-more`, even if all other checks pass. Do not apply `initial-approval` with bugs or security issues as notes — they are always required changes.

Post the comment, apply the label, and remove the opposite label:
```bash
bash scripts/add_comment.sh <pr_number> "<body>"
bash scripts/labels.sh <pr_number> add initial-approval
bash scripts/labels.sh <pr_number> remove requires-more
```
or
```bash
bash scripts/add_comment.sh <pr_number> "<body>"
bash scripts/labels.sh <pr_number> add requires-more
bash scripts/labels.sh <pr_number> remove initial-approval
```

> **CRITICAL:** A PR must never have both `initial-approval` and `requires-more` at the same time. Whenever you add one, always remove the other — even if the other label wasn't set by you.

## Common Mistakes

- [ ] Checking template compliance for team members — skip for team members
- [ ] Being vague about required changes — always list exactly what needs to change and why
- [ ] Approving a PR that changes behavior documented as intentional — always check the docs when a PR modifies existing behavior; if the docs describe it as by design, flag it as `requires-more`
- [ ] Closing a PR without a clear explanation
- [ ] Forgetting the docs-ui test requirement for `www/packages/docs-ui/` changes
- [ ] Skipping the integration test check for API route changes in `packages/medusa/src/api/`
- [ ] Not fetching PR details when they weren't passed as arguments
- [ ] Skipping security analysis for team member PRs — security analysis applies to ALL PRs
- [ ] Skipping performance analysis — always check for N+1 queries and unbounded queries
- [ ] Applying `initial-approval` when a confirmed security or blocking performance issue was found
- [ ] Flagging style/code smell as bugs — only flag correctness/runtime issues in the Potential Bugs section
- [ ] Omitting the code snippet when flagging a bug, security issue, or performance issue — always quote the relevant code
- [ ] Flagging issues without reading the full file — always read the entire file before raising a concern to ensure it isn't already handled elsewhere
- [ ] Flagging issues in removed (`-`) or unchanged context lines — only flag issues in the new added (`+`) lines of the diff
- [ ] Requesting a change that the PR already makes — verify the current state of the code, not the old state
- [ ] Not mentioning the PR author in the review comment — always `@mention` the author
- [ ] Leaving both `initial-approval` and `requires-more` on a PR — always remove the opposite label when adding one
- [ ] Skipping the duplicate PR check — always check for other open PRs linked to the same issue
- [ ] Blocking or closing a PR solely because a duplicate was found — flag it as an informational note only

## Reference Files

```
reference/conventions.md           - Medusa coding conventions to verify
reference/contribution-types.md    - How to verify code, docs, and admin translation contributions
reference/comment-guidelines.md    - Comment writing rules and templates
```
