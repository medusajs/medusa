import { FormattingOptionsType } from "types"

const paymentProviderOptions: FormattingOptionsType = {
  "^payment_provider": {
    maxLevel: 2,
  },
  "^payment_provider/.*AbstractPaymentProvider": {
    reflectionDescription: `In this document, you’ll learn how to create a Payment Provider to be used with the Payment Module.`,
    frontmatterData: {
      slug: "/references/payment/provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Payment Provider",
    },
    reflectionGroups: {
      Properties: false,
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-payment\`.`,
      `## 2. Create the Payment Provider Service

Create the file \`src/modules/my-payment/service.ts\` that holds the module's main service. It must extend the \`AbstractPaymentProvider\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-payment/service.ts"
import { AbstractPaymentProvider } from "@medusajs/framework/utils"

type Options = {
  apiKey: string
}

class MyPaymentProviderService extends AbstractPaymentProvider<
  Options
> {
  // TODO implement methods
}

export default MyPaymentProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-payment/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-payment/index.ts"
import MyPaymentProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.PAYMENT, {
  services: [MyPaymentProviderService],
})
\`\`\`

This exports the module's definition, indicating that the \`MyPaymentProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Payment Module Provider, add it to the \`providers\` array of the Payment Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-payment",
            id: "my-payment",
            options: {
              // provider options...
              apiKey: "..."
            }
          }
        ]
      }
    }
  ]
})
\`\`\`
`,
      `## 5. Test it Out

Before you use your payment provider, enable it in a region using the Medusa Admin.

Then, go through checkout to place an order. Your payment provider is used to authorize the payment.
`,
      `## Useful Guides

- [Storefront Guide: how to implement UI for your payment provider during checkout](https://docs.medusajs.com/v2/resources/storefront-development/checkout/payment)
`,
    ],
  },
}

export default paymentProviderOptions
