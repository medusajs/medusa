# When to Document a Change

Use this reference when reviewing a code diff to decide whether documentation updates are needed, and if so, which projects to update.

## Golden Rule: Document All User-Facing Features

**If a user-facing feature exists in the code but is missing from the docs, document it — regardless of whether the current diff added it or just changed it.**

When reviewing a diff, always check whether the affected feature (CLI option, workflow, service method, config key, admin screen, UI component) is documented. If it is not, add the documentation as part of this update. The fact that a feature was previously undocumented is not a reason to skip it — it is a reason to add it now.

This applies especially to:
- CLI options present in the source that are missing from the reference table in docs
- Workflow steps or service methods referenced in code but not described on any doc page
- Config options accepted by `medusa-config` but absent from the configurations docs
- Admin UI screens or flows that exist but have no user-guide page

---

## Decision Tree

### Always document

- A new exported `interface`, `type`, `class`, or `function` is added to a module's public API
- An existing exported type/interface/class signature changes (new fields, changed field types, renamed parameters)
- A new module service method is added (document in `resources` under the module's overview page)
- A new workflow or step is added to `core-flows` (document in `resources`, consider `book` if it relates to a core concept)
- A workflow or step's input/output type changes (update usage examples in `resources` and `book` if referenced there)
- A new configuration option is added to `medusa-config` (document in `book` under `configurations/`)
- A new `packages/admin/dashboard` route is added that creates new UI screens visible to admin users (document in `user-guide`)

### Document in `book` AND `resources`

- Module API changes that affect how developers use it in workflows or services
- Framework changes that affect how modules, workflows, or loaders are written
- Changes to `core-flows` workflow/step names or signatures used in tutorials

### Document in `book` AND `resources` (admin-related)

- Changes to `packages/admin/admin-shared/src/extensions/widgets/` — widget zone constants
- Changes to `packages/admin/admin-shared/src/extensions/routes/` — UI route definitions
- Any new admin extension point (widget zones, UI routes, field types) that developers use to extend the admin

> **Why:** The `book` has chapters on customizing the admin (adding widgets, creating UI routes), and `resources` has how-to guides for the same. If the extension API changes, both need updating.

### Document in `user-guide` only

- New screens, tabs, or sections added to the Medusa admin dashboard
- Changes to existing admin UI that affect how a non-technical user completes a task
- New buttons, modals, or workflows in the admin that change the user experience

### Document in `ui` only (or skip)

- A new UI component is added to `packages/design-system/ui` — add a page in `www/apps/ui/app/components/`
- A UI component's public props/API changes — update `www/apps/ui/app/components/<Component>/` and check if any examples in `www/apps/ui/specs/examples/` break
- A UI component is removed or renamed — update all references in `ui` docs

### Document in `book` AND `resources` (design-system)

- A component that is referenced in `book` or `resources` tutorials changes its name or key props
- Check: search for the component name in `www/apps/book/app/` and `www/apps/resources/app/` to confirm it's referenced before updating

### Skip entirely

- Internal refactor with no change to public API (same exports, same behavior)
- Bug fix that restores intended behavior with no API change
- Performance or infrastructure changes with no user-visible effect
- Adding/changing tests, fixtures, or migration files
- Changes only to `devDependencies`, tooling config, or CI scripts
- Private helper functions (`private` class methods, unexported functions)
- Type-only changes that don't affect usage (e.g. renaming an internal generic parameter)

### CLI tool changes (`packages/cli/**`)

CLI packages have dedicated documentation pages in `resources` and are also referenced across other guides.

**`packages/cli/create-medusa-app`** — the `create-medusa-app` CLI tool:
- Changes to flags, options, or the default project structure → update `www/apps/resources/app/create-medusa-app/` and any page across `book` or `resources` that shows a `create-medusa-app` command
- New flags should be added to the reference page; changed defaults should update all usage examples that show the old default

**`packages/cli/medusa-cli`** (the `medusa` CLI) — commands like `medusa start`, `medusa db:migrate`, `medusa plugin:develop`, etc.:
- New subcommands or new flags on existing commands → update `www/apps/resources/app/medusa-cli/`
- Changed command signatures → search across `book` and `resources` for usages of that command and update them
- Removed or renamed commands → find all occurrences across the doc projects and update

To find usages of a CLI command in the docs, search across the writable directories:
```bash
grep -r "create-medusa-app" www/apps/book/app www/apps/resources/app
grep -r "medusa db:migrate" www/apps/book/app www/apps/resources/app
```

### Other package changes

For packages that don't fall into the categories above (shown under "Other Changed Packages" in the prompt):
- If the package exposes a public API used in tutorials or guides, check whether any doc page references it and update accordingly
- If it's a purely internal package with no user-facing surface, skip

## Which project to update per package kind

| Package kind | Default projects | Condition for extras |
|---|---|---|
| `module` | `book`, `resources` | Always both |
| `core-flow` | `book`, `resources` | Always both |
| `framework` | `book`, `resources` | Always both |
| `admin` | `user-guide` | Add `book` + `resources` if widget zones or extension API changed |
| `design-system` | `ui` | Add `book` + `resources` if a component referenced in those docs changed |
| `cli` | `resources` | Also update `book` if the command appears in book tutorials |
| `other` | (advisory) | Decide based on whether the change has a user-facing doc surface |

## Scope of changes

When you do decide to document:

- **Update existing pages** before creating new ones — check if there's already a page for the module/feature
- **Update examples** to reflect new API signatures
- **Add a new section** only if a genuinely new concept was introduced
- **Create a new page** only if a completely new feature with no existing page was added
- Keep changes targeted — don't rewrite working content, only fix what's affected by the diff
