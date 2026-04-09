# Documentation Issue Triage

## Step 1 — Identify the Doc Type

The user may not explicitly mention where the problem is. Use their description to infer what kind of documentation is affected, then map it to the correct fix location.

**Inference guide:**

| User describes... | Likely doc type | Fix location |
| --- | --- | --- |
| API reference content (e.g., "the product variant object description", "this endpoint's response schema", "missing field in the API docs") | API reference | See API reference section below |
| A guide, tutorial, or concept page being wrong or missing | General docs | MDX file in `www/apps/` |
| A reference page for a class, method, or type (e.g., "the docs for `IProductModuleService`") | Auto-generated reference | TSDoc in source code |
| A UI component's prop description being wrong or missing | UI component docs | `www/apps/ui/specs/` |

**For API reference issues**, distinguish further:

- **Description/text is unclear or wrong** → fix is in generated OAS output: `www/utils/generated/oas-output/`
- **Schema structure is wrong** (missing field, wrong type, wrong shape) → fix is in HTTP types: `packages/core/types/src/http/`

When in doubt, look at the relevant source to confirm before responding.

---

## Step 2 — Verify the Issue

Read the relevant file(s) to confirm whether the issue is real. For each doc type:

- **Auto-generated references** → Check the TSDoc comments in the relevant source file under `packages/`
- **API reference descriptions** → Check `www/utils/generated/oas-output/` and/or the source code if the description originates there
- **API reference schema** → Check `packages/core/types/src/http/` for the relevant type definition
- **UI component props** → Check `www/apps/ui/specs/` and/or the component source under `packages/design-system/`
- **General MDX docs** → Read the MDX file directly in `www/apps/`

Always look at the underlying source code (under `packages/`) when the generated output is the symptom but the root cause may be upstream.

---

## Step 3 — Respond

### Issue is VALID

Add a comment confirming the issue and indicating where the fix should go. Then add the `good-first-issue` label.

**Comment template — valid doc issue:**

```markdown
Thanks for pointing this out! You're right that the documentation [is missing / has incorrect information about / is unclear about] [topic].

[Include the fix location guidance below if it's non-obvious to contributors]

This is a great opportunity for a community contribution — we'd welcome a PR! Check out our [docs contribution guidelines](https://docs.medusajs.com/learn/resources/contribution-guidelines/docs) to get started.
```

**Fix location wording by doc type:**

- **Auto-generated references:** "The reference docs are auto-generated from TSDoc comments. The fix should be made in the TSDoc comments of [relevant source file]."
- **API reference descriptions:** "The API reference is generated from OpenAPI specs. The description fix should be made in `www/utils/generated/oas-output/`."
- **API reference schema:** "The schema structure comes from the HTTP types. The fix should be made in `packages/core/types/src/http/`."
- **UI component props:** "The component prop descriptions come from the component specs. The fix should be made in `www/apps/ui/specs/`."
- **General MDX docs:** No special routing needed.

```bash
bash scripts/labels.sh <issue_number> add good-first-issue
```

---

### Issue is NOT valid

Add a comment explaining what the docs actually say or why the report is inaccurate, then close the issue.

**Comment template — not a valid doc issue:**

```markdown
Thanks for the report! After reviewing the documentation, [explanation of why the docs are actually correct / where the correct information is].

[Link to the relevant docs section if helpful]

I'm going to close this, but please feel free to reopen if you believe something is still unclear or incorrect.
```

```bash
bash scripts/close_issue.sh <issue_number>
```
