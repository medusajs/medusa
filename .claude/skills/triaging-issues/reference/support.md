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
2. **If docs cover it:** proceed with the standard support flow below, referencing the docs in your reply
3. **If docs don't cover it:** do NOT add a comment — only add the `requires-team` label and stop

```bash
bash scripts/labels.sh <issue_number> add requires-team
```

---

## Standard Support Flow

For non-Cloud support issues:

1. Add a comment directing the user to GitHub Discussions and community resources
2. Close the issue

**Comment template:**
```
Thanks for reaching out! Questions about implementing custom features or getting help with Medusa are best handled through our community channels, where more people can help and others can benefit from the answer.

Here's where you can get support:

- 💬 **[GitHub Discussions](https://github.com/medusajs/medusa/discussions)** — ask questions, share ideas, and get help from the community
- 🎮 **[Discord](https://discord.gg/medusajs)** — real-time help from the Medusa community
- ☁️ **[Medusa Cloud](https://medusajs.com/cloud/)** — premium support available for Cloud customers

I'm converting this to a discussion so it stays accessible. Feel free to continue the conversation there!
```

Then convert the issue to a discussion:
```bash
bash scripts/convert_to_discussion.sh <issue_number> "Support"
```
