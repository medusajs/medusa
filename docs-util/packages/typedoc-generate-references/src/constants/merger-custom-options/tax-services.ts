import { FormattingOptionsType } from "types"

const taxServicesOptions: FormattingOptionsType = {
  "^tax_service/": {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
  },
  "^tax_service/.*AbstractTaxService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a tax provider in the Medusa backend and the methods you must implement in it.`,
    frontmatterData: {
      displayed_sidebar: "modules",
      slug: "/modules/taxes/backend/create-tax-provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Tax Provider",
    },
    endSections: [
      `## Test Implementation

:::note

If you created your tax provider in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your tax provider implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Use the tax provider in a region. You can do that either using the [Admin APIs](https://docs.medusajs.com/modules/taxes/admin/manage-tax-settings#change-tax-provider-of-a-region) or the [Medusa Admin](https://docs.medusajs.com/user-guide/taxes/manage#change-tax-provider).

4\\. To test out your tax provider implementation, you can [trigger taxes calculation manually](https://docs.medusajs.com/modules/taxes/storefront/manual-calculation).
    `,
    ],
  },
}

export default taxServicesOptions
