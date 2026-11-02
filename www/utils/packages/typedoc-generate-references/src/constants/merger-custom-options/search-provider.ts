import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const searchProviderOptions: FormattingOptionsType = {
  "^search_provider/.*AbstractSearchProviderService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a Search Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/search/provider",
      keywords: ["search", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Search Module Provider",
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
      `## Implementation Example
      
As you implement your Search Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [Postgres Search Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/providers/search-postgres).`,
      `## Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-search\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-search\`.

<Note>

The rest of this guide always uses the \`src/modules/my-search\` directory as an example.

</Note>`,
      `## 2. Create the Search Module Provider's Service

Create the file \`src/modules/my-search/service.ts\` that holds the implementation of the module provider's main service. It must extend the \`AbstractSearchProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-search/service.ts"
import { AbstractSearchProviderService } from "@medusajs/framework/utils"

class MySearchProviderService extends AbstractSearchProviderService {
  // TODO implement methods
}

export default MySearchProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Provider Definition File

Create the file \`src/modules/my-search/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-search/index.ts"
import MySearchProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.SEARCH, {
  services: [MySearchProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MySearchProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your Search Module Provider, add it to the \`providers\` array of the Search Module in \`medusa-config.ts\`:

<Note>

If you're using more than one Search Module Provider, make sure to set the \`default_provider\` option of the Search Module to the provider you want to use by default. You can also set it in an index definition's \`provider\` property to use a specific provider for that index.

</Note>

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/search",
      options: {
        // Only needed with more than one provider.
        // default_provider: "my-search",
        providers: [
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-search\`
            resolve: "./src/modules/my-search",
            id: "my-search",
            options: {
              // provider options...
            },
          },
          // ...
        ],
      },
    },
  ],
})
\`\`\`
`,
      `## 5. Test it Out

To test the module out, add an API route that uses \`query.search\` to search through products. For example, create the file \`src/api/search-products/route.ts\` with the following content:

\`\`\`ts title="src/api/search-products/route.ts"
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

  const { data, search_result } = await query.search({
    entity: "product",
    fields: ["id", "title", "handle"],
    filters: {
      q: req.query.q as string,
      status: "published",
    },
    pagination: { take: 20 },
  })

  res.json({
    products: data,
    metadata: search_result.metadata,
  })
}
\`\`\`

This route resolves the [Query](!docs!/learn/fundamentals/module-links/query) from the [Medusa container](!docs!/learn/fundamentals/medusa-container) and uses its \`search\` method to search the \`product\` index. \`query.search\` uses your Search Module Provider under the hood to run the query, then hydrates the returned hits with \`query.graph\`.

Finally, start your Medusa application:

\`\`\`bash npm2yarn
npm run dev
\`\`\`

Then, send a request to the route:

\`\`\`bash
curl "http://localhost:9000/search-products?q=shirt"
\`\`\`

You'll receive the products whose titles match the query, ordered by relevance, based on your Search Module Provider's implementation:

\`\`\`json title="Example Response"
{
  "products": [
    {
      "id": "prod_01KXR3J9J610DT161E2E4ZS6P1",
      "title": "Medusa T-Shirt",
      "handle": "t-shirt"
    }
  ],
  "metadata": {
    "skip": 0,
    "take": 20,
    "count": 1,
    "query": "shirt",
    "processing_time_ms": 9
  }
}
\`\`\`
`,
      `## Additional Resources

- [How to Use the Search Module](/references/search/service)
`,
    ],
  },
}

export default searchProviderOptions
