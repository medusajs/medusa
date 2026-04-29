# Book Style Guide

The `book` project (`www/apps/book/`) is the Medusa learning platform covering framework fundamentals, architecture, configurations, and how-to guides for building with Medusa.

## Content Structure

### Page structure

Every book page follows this pattern:

```mdx
export const metadata = {
  title: `${pageNumber} Topic Title`,
}

# {metadata.title}

In this chapter, you'll learn about <topic>.

## What is <Topic>?

[Conceptual explanation — 1-3 paragraphs]

<Note title="Don't use <Topic> if" type="error">
- Condition A → use [alternative]() instead
- Condition B → use [alternative]() instead
</Note>

---

## How to Create a <Topic>

[Step-by-step implementation with code examples]

### Test the <Topic>

[Minimal test steps]

---

## Example: <Realistic Use Case>

[Real-world example with full code]
```

### Directory structure and page placement

| Content type | Directory |
|---|---|
| Core concepts (modules, workflows, events, etc.) | `app/learn/fundamentals/` |
| Configuration files (medusa-config, pnpm, tsconfig) | `app/learn/configurations/` |
| Custom features, plugins, extend behavior | `app/learn/customization/` |
| Deployment, Docker, hosting | `app/learn/deployment/` |
| Testing, debugging, logging | `app/learn/debugging-and-testing/` |
| Frontend/storefront integration | `app/learn/storefront-development/` |

### Adding a new page

1. Create the file at the correct path:
   ```
   www/apps/book/app/learn/<section>/<topic>/page.mdx
   ```

2. Add the page to `www/apps/book/sidebar.mjs`:
   ```javascript
   {
     type: "link",
     path: "/learn/<section>/<topic>",
     title: "Topic Title",
   }
   ```

3. The `${pageNumber}` in the title is auto-populated by `yarn prep` — always include it.

## Writing Style

- **Second person**: "You create a workflow..." not "We create..."
- **Imperative for steps**: "Create the file `src/workflows/my-workflow.ts`..."
- **Present tense**: "The workflow runs..." not "The workflow will run..."
- **Concrete examples**: Every concept must have at least one working TypeScript code example
- **No jargon without explanation**: Define terms on first use

## Code Examples

Always include TypeScript examples. Follow the Medusa import patterns exactly:

```ts title="src/workflows/my-workflow.ts"
import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
```

Use highlights to call attention to key lines in the code (see `mdx-patterns.md`).

## When to update book

- A new framework feature is added (new decorator, new utility, new config option)
- A core concept changes its API or behavior (workflow API, module API, event system)
- A configuration option is added to `medusa-config`
- A concept referenced in existing chapters changes behavior
- Admin widget zones or UI route extension API changes (update `customization/` chapters)

## What NOT to add to book

- Commerce-module-specific documentation (product, order, cart) → goes in `resources`
- Step-by-step integration tutorials → goes in `resources`
- Generated API references → never add to book
- User-facing admin UI instructions → goes in `user-guide`
