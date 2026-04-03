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

Acknowledge the request and inform the user it will be converted to a GitHub Discussion.

**Comment template — feature doesn't exist:**
```
Thanks for the feature request! We use GitHub Discussions for tracking feature requests so they can be properly voted on and discussed by the community.

This issue will be converted into a GitHub Discussion now. You'll be able to continue the conversation there.

In the meantime, feel free to share any additional context or use cases that would help us understand the need better.
```

Then convert the issue to a discussion:
```bash
bash scripts/convert_to_discussion.sh <issue_number> "Feature Requests"
```
