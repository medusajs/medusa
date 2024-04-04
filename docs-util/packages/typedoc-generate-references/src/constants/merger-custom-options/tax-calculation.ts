import { FormattingOptionsType } from "types"

const taxCalculationOptions: FormattingOptionsType = {
  "^tax_calculation": {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
  },
  "^tax_calculation/.*AbstractTaxCalculationStrategy": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to override the tax calculations strategy in the Medusa backend and the methods you must implement in it.`,
    frontmatterData: {
      displayed_sidebar: "modules",
      slug: "/modules/taxes/backend/tax-calculation-strategy",
    },
    reflectionTitle: {
      fullReplacement: "How to Override a Tax Calculation Strategy",
    },
    endSections: [
      `## Test Implementation

:::note

If you created your tax calculation strategy in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your tax calculation strategy implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. To test out your tax calculation strategy implementation, you can [trigger taxes calculation manually](https://docs.medusajs.com/modules/taxes/storefront/manual-calculation).
    `,
    ],
  },
}

export default taxCalculationOptions
