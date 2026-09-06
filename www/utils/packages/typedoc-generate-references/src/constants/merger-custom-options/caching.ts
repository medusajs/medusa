import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const cachingOptions: FormattingOptionsType = {
  "^caching/.*ICachingProviderService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this guide, you’ll learn how to create a Caching Module Provider and the methods you must implement in its main service.
    
:::note

The Caching Module and its providers are available starting [Medusa v2.11.0](https://github.com/medusajs/medusa/releases/tag/v2.11.0).

:::`,
    frontmatterData: {
      slug: "/references/caching-module-provider",
      tags: ["caching", "server", "how to"],
      sidebar_label: "Create Caching Provider",
      keywords: ["caching", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Caching Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sortMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
    },
    startSections: [
      // TODO add link to memcached guide when available
      `## Implementation Example

As you implement your Caching Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [Redis Caching Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/providers/caching-redis).`,
      `## 1. Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-caching\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-caching\`.

<Note>

The rest of this guide always uses the \`src/modules/my-caching\` directory as an example.

</Note>`,
      `## 2. Create the Caching Module Provider Service

Create the file \`src/modules/my-caching/service.ts\` that holds the module provider's main service. It must implement the \`ICachingProviderService\` interface imported from \`@medusajs/framework/types\`:

\`\`\`ts title="src/modules/my-caching/service.ts"
import { ICachingProviderService } from "@medusajs/framework/types"

class MyCachingProviderService implements ICachingProviderService {
  // TODO implement methods
}

export default MyCachingProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-caching/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-caching/index.ts"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import MyCachingProviderService from "./service"

export default ModuleProvider(Modules.CACHING, {
  services: [MyCachingProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyCachingProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your Caching Module Provider, add it to the \`providers\` array of the Caching Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-caching\`
            resolve: "./src/modules/my-caching",
            id: "my-caching",
            // set this if you want this provider to be used by default
            // and you have other Caching Module Providers registered.
            is_default: true,
            options: {
              url: "http://example.com",
              // provider options...
            }
          },
        ]
      }
    }
  ]
})
\`\`\`
`,
      `## 5. Test it Out

To test out your Caching Module Provider, create a simple API route that retrieves cached data with Query:

\`\`\`ts title="src/api/test-caching/route.ts"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  }, {
    cache: {
      enable: true,
      providers: ["my-caching"], // use your provider id here
    }
  })

  res.status(200).json({ data })
}
\`\`\`

Then, start your Medusa server with the following command:

\`\`\`bash npm2yarn
npm run dev
\`\`\`

Next, send a \`GET\` request to \`http://localhost:9000/test-caching\`:

\`\`\`bash
curl http://localhost:9000/test-caching
\`\`\`

You will receive a response with the list of products. The first time you make this request, the products will be fetched from the database and cached in memory. Subsequent requests will retrieve the products from the cache, which improves performance.
`,
      `## Useful Guides

- [How to Use Caching Module](/references/caching-service)
`,
    ],
  },
  "^caching/.*ICachingModuleService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this guide, you’ll learn about the different methods in the Caching Module's service and how to use them.
    
:::note

The Caching Module and its providers are available starting [Medusa v2.11.0](https://github.com/medusajs/medusa/releases/tag/v2.11.0).

:::

:::tip

You should use the Caching Module's service when you're caching computed data or data from external APIs. To cache database query results, enable caching in [Query](!docs!/learn/fundamentals/module-links/query#cache) or [Index Module](!docs!/learn/fundamentals/module-links/index-module#cache) instead.

:::
`,
    frontmatterData: {
      slug: "/references/caching-service",
      tags: ["caching", "server", "how to"],
      sidebar_label: "Use Caching Module",
    },
    reflectionTitle: {
      fullReplacement: "How to Use Caching Module",
    },
    expandMembers: true,
    sortMembers: true,
    startSections: [
      `## Resolve Caching Module's Service

In your workflow's step, you can resolve the Caching Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const cachingModuleService = container.resolve(
      Modules.CACHING
    )
    
    // TODO use cachingModuleService
  } 
)
\`\`\`

You can then use the Caching Module's service's methods in the step. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default cachingOptions
