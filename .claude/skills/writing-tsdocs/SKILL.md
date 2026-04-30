---
name: writing-tsdocs
description: Adds and updates TypeDoc (TSDoc) comments to TypeScript source files in the Medusa codebase. Covers HTTP types, API routes, UI components, data models, service interfaces, JS SDK methods, abstract providers, workflow SDK functions, core-flows workflows and steps, and events. Use when adding TSDoc comments to files in packages/core/types/src/http, packages/medusa/src/api, packages/design-system/ui/src/components, packages/modules/*/src/models, packages/core/types/src, packages/core/js-sdk/src, packages/core/utils/src, packages/core/workflows-sdk/src/utils/composer, packages/core/core-flows/src, or packages/core/utils/src/core-flows/events.ts.
---

# Writing Medusa TSDocs

Adds TypeDoc (TSDoc) comments to Medusa TypeScript source files. Follows TypeDoc conventions and uses custom tags defined in `www/utils/packages/typedoc-config/tsdoc.json`.

## Constraints

> **CRITICAL:** Violating these produces incorrect or broken documentation.

- **Never document unexported items** — only `export`ed interfaces, types, functions, classes
- **Never add TSDocs to test files** — skip `*.spec.ts`, `*.test.ts`, `__tests__/`
- **Never fabricate `@since` version numbers** — only use the version passed in the prompt
- **Never remove or modify existing TSDocs** — only add where missing
- **Never modify logic** — only add/edit comment blocks
- **For Medusa-specific custom tags**, only use those defined in `tsdoc.json`: `@expandable`, `@featureFlag`, `@since`, `@apiIgnore`, `@schema`, `@tags`, `@version`, `@keep`, `@customNamespace`, `@namespaceMember`

## Load Reference Files When Needed

> **Load the reference file for the file type you're documenting before writing any TSDocs.**

| Path pattern | Load |
|------|------|
| `packages/core/types/src/http/` | `reference/http-types.md` |
| `packages/medusa/src/api/admin/` or `/store/` | `reference/api-routes.md` |
| `packages/design-system/ui/src/components/` | `reference/ui-components.md` |
| `packages/modules/*/src/models/` | `reference/data-models.md` |
| `packages/core/types/src/` (non-http) | `reference/service-interfaces.md` |
| `packages/core/js-sdk/src/` | `reference/service-interfaces.md` |
| `packages/core/utils/src/` (abstract providers) | `reference/service-interfaces.md` |
| `packages/core/workflows-sdk/src/utils/composer/` | `reference/service-interfaces.md` |
| `packages/core/core-flows/src/` (workflows) | `reference/workflows-steps.md` |
| `packages/core/core-flows/src/` (steps) | `reference/workflows-steps.md` |
| `packages/core/utils/src/core-flows/events.ts` | `reference/events.md` |

## Quick Reference

### TSDoc block format

```typescript
/**
 * Brief description.
 */
export interface Foo {
  /**
   * The foo's ID.
   */
  id: string
}
```

### Per-type depth guide

| File type | What to document | Key Medusa tags |
|-----------|-----------------|----------|
| HTTP types | Every exported interface/type + all properties | `@expandable` on nested objects |
| API routes | Exported handlers only (minimal) | `@featureFlag`, `@since` |
| UI components | Component + all props | Plain descriptions |
| Data models | Model + each property | `@since` on new items |
| Service interfaces | Every method in full | `@param`, `@returns`, `@example` |
| JS SDK | Every public method | `@param`, `@returns`, `@example`, `@tags` |
| Providers | Class + every abstract method | `@param`, `@returns`, `@example` |
| Workflow SDK | Every exported function | `@param`, `@returns`, `@example` |
| core-flows workflows | Workflow export + hooks | `@summary`, `@featureFlag`, `@since` |
| core-flows steps | Step export + input type | `@featureFlag`, `@since`, `@example` |
| Events | Every event constant | `@eventPayload`, `@featureFlag`, `@since` |

### Medusa custom tags (from `www/utils/packages/typedoc-config/tsdoc.json`)

| Tag | Kind | Use when |
|-----|------|----------|
| `@featureFlag <name>` | block | Export requires a feature flag to be enabled |
| `@expandable` | modifier | Nested object expandable in API queries |
| `@since <version>` | block | Export was added in this version (prompt-provided only) |
| `@apiIgnore` | modifier | Exclude from API docs output |
| `@tags <name>` | block | SDK categorization |
| `@schema` | block | Custom schema documentation |
| `@keep` | modifier | Preserve during doc generation |
| `@customNamespace` | block | Assign to custom doc namespace |

Standard TypeDoc/JSDoc tags (`@param`, `@returns`, `@example`, `@deprecated`, `@remarks`, etc.) are always allowed.

## Common Mistakes

- [ ] Documenting unexported or `private` items
- [ ] Using `@since` without a version being provided in the prompt
- [ ] Writing property descriptions longer than 2 sentences
- [ ] Adding `@param`/`@returns` to non-method exports (interfaces, types)
- [ ] Documenting an `id` field without specifying what resource it belongs to

## Reference Files

```
reference/http-types.md          - HTTP type interfaces: properties, @expandable
reference/api-routes.md          - API routes: @featureFlag, @since, minimal docs
reference/ui-components.md       - UI components: component + inline prop pattern
reference/data-models.md         - DML models: @since, property descriptions
reference/service-interfaces.md  - Methods, SDK, providers, workflow SDK: full JSDoc
reference/workflows-steps.md     - core-flows workflows and steps: @summary, hooks, @example
reference/events.md              - Event constants: @eventPayload, @featureFlag, @since
```
