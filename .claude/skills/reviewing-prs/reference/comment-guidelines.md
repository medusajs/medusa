# Comment Writing Guidelines

## Tone

- Be **concise** — avoid long explanations. State what's needed and why, nothing more.
- Be **supportive** — acknowledge the contributor's effort, especially for community PRs.
- Be **specific** — when requesting changes, list exactly what needs to change. Never say "this needs improvement" without explaining how.
- Use "we" when speaking on behalf of the Medusa team.
- Avoid filler phrases like "Great work!", "Awesome PR!" — just get to the point.

## Initial Approval Comment Template

Use when the PR passes the review. The team still needs to do a final review before merging.

```
Thank you for your contribution, @<author>! 🎉

After an initial review, this PR looks good to us. Here's a summary:

✅ PR template is complete
✅ Linked to a verified issue
✅ Follows contribution guidelines
✅ Tests included
✅ Follows Medusa's conventions

A team member will do a final review before this is merged. We appreciate your patience!
```

Adjust the checklist to only include items that were actually verified. Omit items not applicable.

If there are **minor notes** that aren't blocking (style suggestions, optional improvements), add them as a separate "Notes" section after the summary — but still apply `initial-approval`.

## Requires-More Comment Template

Use when the PR needs changes. Be explicit about what is required.

```
Thank you for your contribution, @<author>!

After reviewing this PR, we need a few things addressed before we can move forward:

**Required changes:**
- [ ] <specific change 1>
- [ ] <specific change 2>

<Optional: brief explanation of why each change is needed>

<Include one or more of the sections below when applicable — omit sections that have nothing to report>

**Security Issues:**

🔒 **`path/to/file.ts`** — <vulnerability class>
```typescript
// problematic snippet
```
<Attack scenario + fix>

**Performance Issues:**

⚡ **`path/to/file.ts`** — <issue description>
```typescript
// problematic snippet
```
<Impact + fix>

**Potential Bugs:**

⚠️ **`path/to/file.ts`** — <bug description>
```typescript
// problematic snippet
```
<Why it fails + fix>
```

**Rules for the required changes list:**
- Each item must be actionable — the contributor should know exactly what to do
- Reference specific files or line numbers when relevant
- Group related items together
- Security issues and blocking performance issues **must** appear in Required changes AND in their dedicated section with code snippets

## Contextual Assessment

Before composing the review, assess whether the changes make sense in the broader context of the PR. This goes beyond checking conventions — it evaluates whether the implementation is sound and complete.

**Ask yourself:**

- **Is the behavior being changed intentional and documented?** If the PR modifies existing behavior, check whether that behavior is described as by design in the official Medusa documentation (`www/apps/book/app/learn/`). If the docs explicitly describe the current behavior as intentional, the PR is changing intended behavior and must be flagged as `requires-more`. Explain that the behavior is by design and reference the documentation section. This is a **blocking** concern — do not apply `initial-approval`.
- **Does it make sense?** Does the implementation actually solve the problem described in the PR or linked issue? Is the approach reasonable, or is there a simpler/safer way?
- **Are there unintended side effects?** Could the change break or alter behaviour in other areas of the codebase? For example: shared utilities, middleware, event handlers, or widely-used types.
- **Is the scope right?** Does the PR do more or less than what the linked issue asks for? Extra unrelated changes are a flag.
- **Is anything missing?** Could the change cause regressions that aren't covered by the added tests? Are edge cases handled?
- **Are there obvious performance or correctness concerns?** For example: N+1 queries, missing null checks, incorrect error handling.

If concerns are found, include them in the review comment under a **"Concerns"** section (for `requires-more`) or a **"Notes"** section (for `initial-approval` if non-blocking):

```
**Concerns:**
- <specific concern and which file/area it affects>
- <another concern>
```

Keep concerns concise and factual — describe the problem, not a lecture. If unsure whether something is actually a bug, phrase it as a question: *"Should `X` also handle the case where `Y` is null?"*

## Potential Bugs Section

When bugs are found in Step 10, include a **"Potential Bugs"** section in the review comment. **All bugs — confirmed or suspected — are required changes.** Always apply `requires-more` when this section is present.

**Format:**

```
**Potential Bugs:**

⚠️ **`path/to/file.ts`** — <one-line description of the bug>
```typescript
// the problematic snippet
```
<Specific failure scenario — "this will throw if `items` is empty", not "this looks wrong". Suggest the fix.>

⚠️ **`path/to/other-file.ts`** — <another bug>
...
```

**Rules:**
- Every bug goes into **Required changes** as a checkbox item AND in this section with the code snippet
- Always quote the relevant code snippet in a fenced code block
- Be specific about the failure scenario
- If uncertain, phrase as a question (*"Should this handle the case where X is undefined?"*) but still list it as a required change — the author must confirm or disprove it
- Do not flag style issues or code smell — only correctness/runtime concerns

## Security Issues Section

When security issues are found in Step 8, include a **"Security Issues"** section in the review comment.

- Confirmed security vulnerabilities → add to **Required changes** and always apply `requires-more`
- Suspected / uncertain risks → include under **"Security Issues"** with a question framing

**Format:**

```
**Security Issues:**

🔒 **`path/to/file.ts`** — <vulnerability class, e.g., "Missing authorization check">
```typescript
// the problematic snippet
```
<Explain the attack scenario in one sentence. What can an attacker do? What data is exposed or operation is possible? Suggest the fix.>

🔒 **`path/to/file.ts`** — <another issue>
...
```

**Rules:**
- Always name the vulnerability class (e.g., "SQL injection", "Missing auth", "Path traversal", "SSRF", "Sensitive data exposure")
- Always include the relevant code snippet in a fenced code block
- Describe the concrete attack scenario — *"an authenticated user could access another store's orders by passing a different `store_id`"* not *"this looks insecure"*
- If unsure, phrase as a question: *"Should this route require `isAdmin` middleware?"*
- Security issues are always **blocking** — do not apply `initial-approval` with a security issue in the Notes section

## Performance Issues Section

When performance issues are found in Step 9, include a **"Performance Issues"** section in the review comment.

- Blocking performance issues (N+1 queries, unbounded queries on large tables, missing pagination) → add to **Required changes** and apply `requires-more`
- Non-blocking performance observations → include under **"Performance Issues"** as notes only

**Format:**

```
**Performance Issues:**

⚡ **`path/to/file.ts`** — <one-line description, e.g., "N+1 query inside order item loop">
```typescript
// the problematic snippet
```
<Explain why this is a problem in production terms — e.g., "for a cart with 50 items, this executes 50 separate DB queries instead of one". Suggest the fix — e.g., "batch-load with `findMany({ where: { id: In(ids) } })` before the loop".>

⚡ **`path/to/file.ts`** — <another issue>
...
```

**Rules:**
- Always include the relevant code snippet in a fenced code block
- Quantify the impact where possible — *"N queries for N items"*, *"no LIMIT means entire table is fetched"*
- Suggest a concrete fix
- Do not flag theoretical micro-optimizations — only issues that would plausibly cause measurable degradation

## Security Risk Comment Template (non-malicious, simple case)

Use for a single, brief security concern when no full Security Issues section is needed:

```
**Security note:** <brief description of the potential risk and which file/change introduces it>

This may be unintentional, but please double-check and address it.
```

## Malicious Code Comment Template

Use only when closing a PR for malicious content. Be clear but not accusatory.

```
We've closed this PR because it contains code that poses a security risk to users of Medusa.

If you believe this was a mistake, please open a new issue to discuss.
```

## Formatting Rules

- Use `**bold**` for section headers within comments
- Use checkboxes (`- [ ]`) for required action items
- Use inline code for file paths, variable names, and labels
- Use **fenced code blocks** (not inline code) when quoting or referencing actual code from the PR — e.g., a function body, a condition, or a snippet being flagged
- Keep paragraphs short — no walls of text
- Do not use headers (`##`) in short comments; use bold instead
