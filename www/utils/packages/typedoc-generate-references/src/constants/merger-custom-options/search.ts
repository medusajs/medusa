import { FormattingOptionsType } from "types"

const searchOptions: FormattingOptionsType = {
  "^search/.*AbstractSearchService": {
    reflectionDescription: `In this document, you’ll learn how to create a search service in the Medusa backend and the methods you must implement in it.

## Prerequisites

A search service must extend the \`AbstractSearchService\` class imported from the \`@medusajs/utils\` package. If you don’t already have the package 
installed, run the following command to install it within your project:

\`\`\`bash npm2yarn
npm install @medusajs/utils
\`\`\`

---`,
    frontmatterData: {
      slug: "/references/search-service",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Search Service",
    },
    endSections: [
      `## Test Implementation

:::note

If you created your search service in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your search service implementation:

1\\. Make sure you have an [event bus module](https://docs.medusajs.com/development/events/modules/redis) installed that triggers search indexing when the Medusa backend loads.

2\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

3\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

4\\. Try to search for products either using the [Search Products API Route](https://docs.medusajs.com/api/store#products_postproductssearch). The results returned by your search service's \`search\` method is returned in the \`hits\` response field.
    `,
    ],
  },
}

export default searchOptions
