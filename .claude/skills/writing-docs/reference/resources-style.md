# Resources Style Guide

The `resources` project (`www/apps/resources/`) covers commerce modules, how-to guides, recipes, integrations, and JS SDK documentation.

## Content Types and Locations

| Content type | Path |
|---|---|
| Commerce module overview | `app/commerce-modules/<module>/page.mdx` |
| Module sub-topics | `app/commerce-modules/<module>/<topic>/page.mdx` |
| Infrastructure modules | `app/infrastructure-modules/<module>/page.mdx` |
| How-to guides | `app/how-to-tutorials/<topic>/page.mdx` |
| Recipes (solution guides) | `app/recipes/<topic>/page.mdx` |
| JS SDK guides | `app/js-sdk/<topic>/page.mdx` |
| Integrations | `app/integrations/<name>/page.mdx` |

> **CRITICAL:** Never create or edit files under `references/`. These are auto-generated from TSDocs. Only link to them.

## Module Overview Page Structure

~~~mdx
---
generate_toc: true
---

import { CodeTabs, CodeTab } from "docs-ui"

export const metadata = {
  title: `<Module Name> Module`,
}

# {metadata.title}

In this section of the documentation, you will find resources to learn more
about the <Module Name> Module and how to use it in your application.

<Note title="Looking for no-code docs?">

Refer to the [Medusa Admin User Guide](!user-guide!/<path>) to learn how to
manage <items> using the dashboard.

</Note>

Medusa has <domain> features available out-of-the-box through the
<Module Name> Module. A [module](!docs!/learn/fundamentals/modules) is a
standalone package that provides features for a single domain.

## <Module Name> Features

- [Feature A](/references/<module>/models/ModelA): Description of feature A.
- [Feature B](./sub-topic/page.mdx): Description of feature B.

---

## How to Use the <Module Name> Module

In your Medusa application, you build flows around Commerce Modules. A flow is
built as a [Workflow](!docs!/learn/fundamentals/workflows).

For example:

export const highlights = [
  ["12", "Modules.<MODULE>", "Resolve the module in a step."]
]

​```ts title="src/workflows/example.ts" highlights={highlights}
import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const myStep = createStep(
  "my-step",
  async (input, { container }) => {
    const moduleService = container.resolve(Modules.<MODULE>)
    // ...
    return new StepResponse(result)
  }
)
​```
~~~

## How-to Guide Structure

~~~mdx
import { Prerequisites } from "docs-ui"

export const metadata = {
  title: `How to <Task>`,
}

# {metadata.title}

In this guide, you'll learn how to <task description>.

<Prerequisites
  items={[
    {
      text: "Medusa application set up",
      link: "!docs!/learn/installation",
    },
  ]}
/>

## Step 1: <First Step>

[Explanation of what and why]

​```ts title="src/..."
// code
​```

## Step 2: <Second Step>

...

## Summary

You've learned how to <task>. You can now...
~~~

## Sidebar Configuration

Each module has a dedicated sidebar file. When adding a new page:

1. Find the relevant sidebar file in `www/apps/resources/sidebars/`
   - Commerce modules: `sidebars/commerce-modules.mjs` or individual `sidebars/<module>.mjs`
   - How-to guides: `sidebars/how-to-tutorials.mjs`

2. Add a link entry:
   ```javascript
   {
     type: "link",
     path: "/commerce-modules/<module>/<topic>",
     title: "Topic Title",
   }
   ```

## Linking to Generated References

Link to references by path but never create or edit reference files:

```mdx
[Product data model](/references/product/models/Product)
[createProduct workflow](/references/core_flows/Product/functions/core_flows.Product.createProducts)
```

Check what references exist by looking at the `www/apps/resources/references/` directory.

## API Examples

Use the JS SDK pattern for API call examples, not raw fetch:

```ts
import Medusa from "@medusajs/js-sdk"

const sdk = new Medusa({ baseUrl: "http://localhost:9000" })

const { product } = await sdk.store.product.retrieve(productId)
```

## When to update resources

- A commerce module gains a new service method
- A module's data model gets new fields
- A new core-flows workflow or step is added
- An existing workflow/step changes its input/output signature
- A new how-to use case becomes possible due to a module change
- Admin widget zones or UI route extension API changes (update relevant extension guides)