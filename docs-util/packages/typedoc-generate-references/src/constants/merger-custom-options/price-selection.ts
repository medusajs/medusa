import { FormattingOptionsType } from "types"

const priceSelectionOptions: FormattingOptionsType = {
  "^price_selection": {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
  },
  "^price_selection/.*AbstractPriceSelectionStrategy": {
    reflectionDescription: `In this document, you’ll learn what the price selection strategy and how to override it in the Medusa backend.`,
    reflectionGroups: {
      Properties: false,
    },
    frontmatterData: {
      displayed_sidebar: "modules",
      slug: "/modules/price-lists/price-selection-strategy",
    },
    reflectionTitle: {
      fullReplacement: "How to Override the Price Selection Strategy",
    },
    endSections: [
      `## Test Implementation

:::note

If you created your price selection strategy in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your price selection strategy implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. To test out your price selection strategy implementation, you can retrieve a product and it's variants by specifying pricing parameters as explained in [this guide](https://docs.medusajs.com/modules/products/storefront/show-products#product-pricing-parameters).
    `,
    ],
  },
}

export default priceSelectionOptions
