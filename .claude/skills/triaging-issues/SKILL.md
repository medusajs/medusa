---
name: triaging-issues
description: Triages GitHub issues for the Medusa repository. Use when a GitHub issue is opened or receives a new comment. Categorizes the issue, validates it, executes the correct response flow, manages labels, and closes issues when appropriate. Accepts issue number as required argument plus optional title, body, and author.
argument-hint: <issue_number> [title] [body] [author]
---

# Issue Triage

Triage GitHub issues by categorizing them, validating content, responding appropriately, and managing labels/state.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `issue_number` | Yes | GitHub issue number to triage |
| `title` | No | Issue title (fetched via script if omitted) |
| `body` | No | Issue body (fetched via script if omitted) |
| `author` | No | Issue author login (fetched via script if omitted) |

If title, body, or author are not provided, fetch them with:
```bash
bash scripts/get_issue.sh <issue_number>
```

## Available Scripts

All GitHub operations are performed via scripts in `scripts/`:

```bash
bash scripts/get_issue.sh <issue_number>               # Fetch issue details (title, body, author, state)
bash scripts/get_comments.sh <issue_number>            # Fetch all comments on the issue
bash scripts/get_labels.sh <issue_number>              # Fetch current labels on the issue
bash scripts/get_linked_prs.sh <issue_number>          # Fetch PRs linked to the issue (cross-ref or connected)
bash scripts/add_comment.sh <issue_number> <body>      # Post a comment on the issue
bash scripts/labels.sh <issue_number> <action> <label> # Manage labels: action is "add", "edit", or "remove"
bash scripts/close_issue.sh <issue_number>             # Close the issue
bash scripts/convert_to_discussion.sh <issue_number>   # Convert issue to a GitHub Discussion
bash scripts/search_issues.sh <query>                  # Search for similar/duplicate issues
```

## Triage Flow

> **CRITICAL:** Always fetch comments before doing any work to get full conversation context. Only categorize based on the **original issue description**, not comments. Trigger on both new issues and new comments, but always re-evaluate the original issue body for category.

### Step 0 — Fetch Full Context

Before any analysis, always run:
```bash
bash scripts/get_issue.sh <issue_number>    # if issue details weren't passed as arguments
bash scripts/get_comments.sh <issue_number> # always — comments are never passed as arguments
bash scripts/get_labels.sh <issue_number>   # always — current labels are never passed as arguments
```

### Step 0.5 — Check for Linked PRs

After fetching context, check if any PRs are already linked to this issue:

```bash
bash scripts/get_linked_prs.sh <issue_number>
```

If one or more PRs are linked:

1. **PR is MERGED** — The fix is already shipped. Add the relevant category label (e.g., `type: bug`), post a short acknowledgement, and close the issue if still open. **Stop.**
2. **PR is OPEN** — A fix is in progress. Continue triage (categorize, validate, add labels), but:
   - **Do NOT** add `good-first-issue` or `help-wanted` labels
   - Use the "PR already linked" comment template from `reference/bug-report.md` instead of soliciting contributions
   - Still add `type: bug`, `requires-team`, or other applicable labels

If no linked PRs, continue to Step 0.75.

### Step 0.75 — Possible Early Exit for Comment-Only Events

**Only applies when triggered by a new comment (not a new issue).**

After fetching context, read the latest comment and assess whether it warrants triage action. **Exit immediately (do nothing)** if the comment is:

- A reply between users continuing an existing conversation
- A general discussion or back-and-forth that doesn't change the nature of the issue
- A "thank you", acknowledgement, or similar low-signal message
- A comment from a bot or automated system

**Only proceed with triage** if the comment:
- Provides new information that meaningfully changes the issue's category or validity (e.g., a reproduction that confirms a bug, or details that resolve a `requires-more` state)
- Explicitly asks for help or re-opens a question that needs a response
- Indicates the issue was reopened and needs re-evaluation

When in doubt, **do nothing** — it's better to skip unnecessary triage than to post redundant comments.

### Step 1 — Check for Duplicates

Before any categorization, search for existing issues that cover the same problem:

```bash
bash scripts/search_issues.sh "<keywords from issue title and body>"
```

If a matching issue is found, **verify they are truly about the same problem** — don't assume based on title alone. Read both issues carefully. If confirmed duplicate:
1. Add a comment referencing the original issue
2. Close this issue
3. **Stop** — no further triage needed

**Comment template — duplicate:**
```
This issue appears to be a duplicate of #[original_issue_number].

Please follow and comment on the original issue to keep the discussion in one place. I'm closing this one to avoid fragmentation.

If your situation is different from the original issue, please reopen and add more details explaining how it differs.
```

```bash
bash scripts/close_issue.sh <issue_number>
```

### Step 2 — Categorize

Read the issue title and body, then assign exactly one category:

| Category | When to use |
|----------|-------------|
| `feature-request` | User wants a new feature or enhancement that doesn't exist |
| `bug-report` | User reports something is broken or behaving unexpectedly |
| `support` | User needs help implementing something or understanding how to use Medusa |
| `docs` | Issue points to missing, incorrect, or outdated documentation |
| `feedback` | General opinion, suggestion, or experience sharing without a specific ask |
| `vague` | Issue body is nearly empty, missing, or incomprehensible |
| `other` | None of the above applies clearly |

### Step 3 — Execute Category Flow

Load the reference file for the assigned category and follow the detailed flow:

- **`bug-report`** → Load `reference/bug-report.md` (complex multi-step flow)
- **`feature-request`** → Load `reference/feature-request.md`
- **`support`** → Load `reference/support.md`
- **`docs`** → Load `reference/docs.md`
- **`feedback`, `vague`, `other`** → Load `reference/other-categories.md`

## Labels Reference

| Label | When to apply |
|-------|---------------|
| `type: bug` | Bug is confirmed — always apply when closing the triage on a valid bug report |
| `type: docs` | Issue is caused by a documentation gap — apply even when the issue was originally reported as a bug |
| `requires-more` | Issue lacks details needed to validate or reproduce |
| `requires-team` | Critical/high priority, or needs team expertise; cannot be resolved without team review |
| `good-first-issue` | Bug is confirmed, fix is straightforward — encourages community contribution |
| `help-wanted` | Bug is confirmed, fix is complex — encourages community contribution |
| `feedback` | General feedback that team will review later |

## Comment Writing Guidelines

All comments posted on issues must follow these principles:

**Tone — supportive and understanding:**
- Acknowledge the user's effort in reporting and assume good intent
- Validate their experience even when the issue turns out to be expected behavior or user error
- Never be dismissive; users reporting bugs or asking for help deserve a respectful, helpful response
- Use "we" when referring to the Medusa team — the bot speaks on behalf of the team

**Formatting — clear and readable:**
- Use markdown headings (`##`) to separate distinct sections in longer comments
- Use bullet lists or numbered steps for multi-part information
- Use inline code formatting for code references, file paths, and labels
- Keep paragraphs short; avoid walls of text

**Examples of what to avoid:**
- "This is not a bug." → too blunt; explain *why* and invite follow-up
- Long unformatted blocks of text → break into sections with headings
- Generic filler phrases ("Great question!") → skip the preamble, get to the point

## Documentation Links

Whenever linking to Medusa docs in a comment, load `reference/doc-links.md` to construct the correct URL. Doc file paths in `www/apps/` do not map directly to URLs — each project has its own prefix and rules.

## Common Mistakes

- [ ] Triaging a comment that is just an ongoing user conversation — exit early instead
- [ ] Categorizing based on comments instead of the original issue body
- [ ] Confirming a bug without first checking the documentation — always check if the behavior is documented as intentional before treating it as a bug
- [ ] Closing an issue without leaving a comment explaining why
- [ ] Adding `good-first-issue` or `help-wanted` before confirming the bug in the codebase
- [ ] Skipping the docs/codebase check for feature requests
- [ ] Missing the Cloud platform exception in support issues
- [ ] Linking to documentation using raw file paths instead of following `reference/doc-links.md`
- [ ] Not fetching issue details when they weren't passed as arguments
- [ ] Closing an issue that was reported as a bug but is actually a documentation gap — keep it open, add `type: docs`, and route to the docs flow
- [ ] Forgetting to add `type: docs` when the root cause is a documentation gap, even if the issue was filed as a bug
- [ ] Adding `good-first-issue` or `help-wanted` when a PR is already linked to the issue
- [ ] Posting a full triage comment soliciting contributions when a linked PR already addresses the fix

## Reference Files

```
reference/bug-report.md         - Full bug triage flow (details check, user error, validation, priority, labels)
reference/feature-request.md    - Feature existence check and response
reference/support.md            - Support handling and Cloud platform exception
reference/docs.md               - Documentation issue triage, fix location routing by doc type
reference/other-categories.md   - Flows for: feedback, vague, other
reference/doc-links.md          - URL conventions for linking to docs.medusajs.com (load when posting any doc link)
```
