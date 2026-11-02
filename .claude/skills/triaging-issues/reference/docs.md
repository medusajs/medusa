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

## Step 3 — Decide

### Issue is VALID

- Fix fits the limits in `reference/outcomes.md` (typically a wrong
  sentence, example, link, or TSDoc description in a few files): pick
  `fix` with `fix_route: "docs"` and template `fix-queued`. The summary
  says what's wrong and the fix location from the table below.
- Needs a new guide, a restructure, or a decision about intended behavior:
  pick `escalate` with template `escalated` and fill `linear`.

**Fix location by doc type:**

- **Auto-generated references:** TSDoc comments in the relevant source file under `packages/`.
- **API reference descriptions:** `www/utils/generated/oas-output/`.
- **API reference schema:** HTTP types in `packages/core/types/src/http/`. A schema change that alters the actual API response is a public API change: `escalate`.
- **UI component props:** `www/apps/ui/specs/`.
- **General MDX docs:** the MDX file in `www/apps/`.

### Issue is NOT valid

Pick `close` with `close-invalid`. The summary explains what the docs
actually say or where the correct information is, with a link (see
`doc-links.md`).
