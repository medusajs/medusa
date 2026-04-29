# Feature Request Triage

## Step 1 — Check if the Feature Already Exists

Search the codebase and documentation to confirm the feature doesn't already exist.

**Where to look:**
- Medusa source code (`packages/`)
- Official docs (`www/apps/` or https://docs.medusajs.com)
- Recent merged PRs or changelog for the feature

---

### Feature EXISTS

The feature is already available. Add a comment pointing the user to it, then close the issue.

**Comment template — feature exists:**
```
Thanks for the suggestion! This functionality is actually already available in Medusa.

[Explanation of how to use it, with a link to the relevant docs or code example]

I'm closing this issue since the feature exists. Feel free to reopen if you're looking for something different or have follow-up questions!
```

Then: `bash scripts/close_issue.sh <issue_number>`

---

### Feature does NOT exist

Before converting to a discussion, assess whether the request is **straightforward enough for a community contribution**.

---

#### Is it a good community contribution?

Some feature requests are scoped, well-understood additions that don't require architectural decisions. If the request fits one of these patterns (or is similarly self-contained), invite a contribution instead of converting to a discussion:

| Example | Label | Notes |
|---------|-------|-------|
| Add a new admin dashboard language/translation | `good-first-issue` | Link to [admin translations guide](https://docs.medusajs.com/learn/resources/contribution-guidelines/admin-translations) |
| Add support for a new currency | `good-first-issue` | Typically a data addition |
| Emit a missing event in a workflow or service | `good-first-issue` or `help-wanted` | Depends on how many touchpoints are involved |

**General signals that a feature is contribution-ready:**
- No architectural decisions needed — the pattern already exists elsewhere in the codebase
- The change is additive (no breaking changes or redesign required)
- The scope is clear and bounded

**If it qualifies**, post a contribution invite comment and add the appropriate label:

**Comment template — contribution invite:**
```
Thanks for the request! This looks like a great opportunity for a community contribution.

[Brief explanation of where/how the change would be made, pointing to similar existing patterns if helpful]

We'd welcome a PR for this! Check out our [contribution guidelines](https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md) to get started.
```

For admin translation requests specifically, also link to: https://docs.medusajs.com/learn/resources/contribution-guidelines/admin-translations

```bash
bash scripts/labels.sh <issue_number> add good-first-issue
# or
bash scripts/labels.sh <issue_number> add help-wanted
```

---

#### Not a good community contribution?

If the request is broad, involves design decisions, or needs team input, convert it to a discussion instead.

**Comment template — convert to discussion:**
```
Thanks for the feature request! We use GitHub Discussions for tracking feature requests so they can be properly voted on and discussed by the community.

This issue will be converted into a GitHub Discussion now. You'll be able to continue the conversation there.

In the meantime, feel free to share any additional context or use cases that would help us understand the need better.
```

Then convert the issue to a discussion:
```bash
bash scripts/convert_to_discussion.sh <issue_number> "Feature Requests"
```
