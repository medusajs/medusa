# Phase 2: Writing the Tutorial Documentation

Follow these steps after the build phase is confirmed complete by the user.

> **Prerequisites:** Building phase is done and user has confirmed the feature works. You know the example project path and all implemented features.

Also load `reference/tutorial-conventions.md` and `reference/concept-definitions.md` before starting.

## Step 1 — Create Step Diagram

Map out all tutorial steps in the logical order a developer would execute them. Write this to a temp file `_step-diagram.md` in the project root.

**Always start with Step 1 (Medusa installation) — it is always the first step.**

Typical step order:
1. Install Medusa Application (always first — use pre-written template)
2. Create custom module + data models (if any)
3. Run database migrations (immediately after module creation)
4. Create workflow steps
5. Create workflows
6. Create API routes (store and/or admin)
7. Create subscribers or scheduled jobs (if any)
8. Admin UI customizations (widgets, pages — if applicable)
9. Storefront customizations (if applicable)

> **Rule:** A step that creates something used by another step must come first. You can't write "Create API route" before "Create workflow" because the route uses the workflow.

Include "Test it Out" sub-steps for each major piece (API routes, subscribers, admin UI, storefront).

Example `_step-diagram.md`:
```
1. Install Medusa Application
2. Create Product Review Module (data models: ProductReview)
3. Run migrations
4. Create createProductReviewWorkflow (step: createProductReviewStep)
5. Create GET /store/products/:id/reviews route
6. Create POST /store/products/:id/reviews route
   - Test: Submit a review via API
7. Create GET /admin/product-reviews route
   - Test: List reviews in Admin
8. Create Admin UI widget (product reviews tab on product page)
   - Test: View reviews widget in Admin
9. Storefront: Display reviews on product page
10. Storefront: Add review submission form
    - Test: Submit and see review in storefront
```

## Step 2 — Write Per-Step MD Files

For each step in the diagram, write a separate temp file in the Medusa project root:
- `_step-01-install.md`
- `_step-02-module.md`
- `_step-03-migrations.md`
- etc.

**Step 1 (Medusa installation):** Copy the pre-written template directly from `tutorial-conventions.md`. Do not rewrite it.

For each other step file:
- Start with `## Step N: Step Title`
- Write 1-2 sentences explaining what this step does and why
- **First-use concept definitions:** The first time a Medusa concept is introduced (module, workflow, API route, subscriber, etc.), include its definition from `reference/concept-definitions.md` before the implementation. Do NOT repeat the definition in later steps that use the same concept.
- **Service method implementations:** When a step implements methods on a service class, give each method its own sub-step (e.g., `### b. Implement send Method`). Each sub-step must: (1) explain in 1-2 sentences what the method does and when Medusa calls it, (2) show the code for that method only, (3) explain relevant implementation details below the code block. See `tutorial-conventions.md` for the pattern.
- Show all code needed for this step with proper code block attributes (title, badgeLabel, highlights)
- End with a `### Test it Out` section showing how to verify this step works
- Follow all MDX patterns from `tutorial-conventions.md`

Load `writing-docs` skill to apply prose quality rules while writing step content.

> Write one step file at a time. Complete each file fully before moving to the next.

## Step 3 — Combine Into Final MDX

Once all step files are written, create the final tutorial file.

**Determine the path:**
- How-to tutorial: `www/apps/resources/app/how-to-tutorials/tutorials/{name}/page.mdx`
- Integration guide: `www/apps/resources/app/integrations/guides/{name}/page.mdx`

Create a `page.mdx` file with this structure (in order):

```
1. Frontmatter (sidebar_label, tags, products)
2. Imports (Github icon, Prerequisites, WorkflowDiagram, CardList from docs-ui)
3. export const metadata = { title: `...` }
4. export const highlights arrays (if any)
5. # {metadata.title}
6. Intro paragraph
7. ## Summary (bullet list)
8. Overview image placeholder
9. CardList (GitHub repo + OpenAPI specs if applicable)
10. ---
11. [All step content from per-step files, combined in order]
12. ## Next Steps
13. ## Troubleshooting
14. ## Getting Help
```

See `tutorial-conventions.md` for exact templates for each section.

## Step 4 — Update Sidebar

After writing the MDX file, verify the tutorial appears in the sidebar.

**For how-to tutorials** — open `www/apps/resources/sidebars/how-to-tutorials.mjs`:
- Find the relevant `sub-category` that has `autogenerate_tags` matching your tutorial's tags
- If a matching category exists (e.g., `autogenerate_tags: "howTo+server"`), ensure your tutorial's frontmatter `tags` array includes `server` and `tutorial` — no manual entry needed
- If no matching category exists, add a manual `link` entry in the appropriate section

**For integration guides** — open `www/apps/resources/sidebars/integrations.mjs`:
- Same approach: check for autogenerate tags or add a manual entry

## Step 5 — Cleanup

Delete all temp files from the Medusa project root:
- `_step-diagram.md`
- `_step-01-install.md`, `_step-02-module.md`, etc. (all `_step-*.md` files)

Verify the final `page.mdx` looks complete and correct before finishing.
