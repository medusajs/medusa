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
Thank you for your contribution! 🎉

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
Thank you for your contribution!

After reviewing this PR, we need a few things addressed before we can move forward:

**Required changes:**
- [ ] <specific change 1>
- [ ] <specific change 2>

<Optional: brief explanation of why each change is needed>
```

**Rules for the required changes list:**
- Each item must be actionable — the contributor should know exactly what to do
- Reference specific files or line numbers when relevant
- Group related items together

## Contextual Assessment

Before composing the review, assess whether the changes make sense in the broader context of the PR. This goes beyond checking conventions — it evaluates whether the implementation is sound and complete.

**Ask yourself:**

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

When bugs are found in Step 8, include a **"Potential Bugs"** section in the review comment. This section is **always required** when bugs are found — for both `initial-approval` and `requires-more`.

- Confirmed bugs (will cause incorrect runtime behaviour) → add to **Required changes** and apply `requires-more`
- Uncertain / possible bugs → include under **"Potential Bugs"** as a flagged concern, even on `initial-approval`

**Format:**

```
**Potential Bugs:**

⚠️ **`path/to/file.ts`** — <one-line description of the bug>
```typescript
// the problematic snippet
```
<Explanation of why this is a problem and what could go wrong. If a fix is obvious, suggest it.>

⚠️ **`path/to/other-file.ts`** — <another bug>
...
```

**Rules:**
- Always quote the relevant code snippet in a fenced code block so the author knows exactly what line is flagged
- Be specific about the failure scenario — *"this will throw if `items` is empty"* not *"this looks wrong"*
- If unsure, phrase as a question: *"Should this also handle the case where X is undefined?"*
- Do not flag style issues or code smell here — only actual correctness/runtime concerns

## Security Risk Comment Template

Use when a potential (non-malicious) security risk is found. Include it as part of the review, not as a standalone comment.

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
