import { FormattingOptionsType } from "types"

const fulfillmentServiceOptions: FormattingOptionsType = {
  "^fulfillment_service": {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
    maxLevel: 2,
  },
  "^fulfillment_service/.*AbstractFulfillmentService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a fulfillment provider in the Medusa backend and the methods you must implement in it. If you’re unfamiliar with the Shipping architecture in Medusa, make sure to [check out the overview first](https://docs.medusajs.com/modules/carts-and-checkout/shipping).`,
    frontmatterData: {
      displayed_sidebar: "modules",
      slug: "/modules/carts-and-checkout/backend/add-fulfillment-provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Fulfillment Provider",
    },
    endSections: [
      `## Test Implementation

:::note

If you created your fulfillment provider in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your fulfillment provider implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Enable your fulfillment provider in one or more regions. You can do that either using the [Admin APIs](https://docs.medusajs.com/api/admin#regions_postregionsregionfulfillmentproviders) or the [Medusa Admin](https://docs.medusajs.com/user-guide/regions/providers#manage-fulfillment-providers).

4\\. To test out your fulfillment provider implementation, create a cart and complete an order. You can do that either using the [Next.js starter](https://docs.medusajs.com/starters/nextjs-medusa-starter) or [using Medusa's APIs and clients](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-cart).
    `,
    ],
  },
}

export default fulfillmentServiceOptions
