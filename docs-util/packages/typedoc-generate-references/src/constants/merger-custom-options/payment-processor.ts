import { FormattingOptionsType } from "types"

const paymentProcessorOptions: FormattingOptionsType = {
  "^payment_processor": {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
    maxLevel: 2,
  },
  "^payment_processor/.*AbstractPaymentProcessor": {
    reflectionDescription: `In this document, you’ll learn how to create a Payment Processor in your Medusa backend. If you’re unfamiliar with the Payment architecture in Medusa, make sure to check out the [overview](https://docs.medusajs.com/modules/carts-and-checkout/payment) first.`,
    frontmatterData: {
      displayed_sidebar: "modules",
      slug: "/modules/carts-and-checkout/backend/add-payment-provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Payment Processor",
    },
    reflectionGroups: {
      Properties: false,
    },
    endSections: [
      `## Test Implementation

:::note

If you created your payment processor in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your payment processor implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Enable your payment processor in one or more regions. You can do that either using the [Admin APIs](https://docs.medusajs.com/api/admin#regions_postregionsregionpaymentproviders) or the [Medusa Admin](https://docs.medusajs.com/user-guide/regions/providers#manage-payment-providers).

4\\. There are different ways to test out your payment processor, such as authorizing payment on order completion or capturing payment of an order. You test payment in a checkout flow either using the [Next.js starter](https://docs.medusajs.com/starters/nextjs-medusa-starter) or [using Medusa's APIs and clients](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-checkout-flow).
    `,
    ],
  },
}

export default paymentProcessorOptions
