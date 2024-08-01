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

Create the file \`src/modules/my-payment/service.ts\` that holds the module's main service. It must extend the \`AbstractPaymentProvider\` class imported from \`@medusajs/utils\`:

\`\`\`ts title="src/modules/my-payment/service.ts"
import { AbstractPaymentProvider } from "@medusajs/utils"

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

export default {
  services: [MyPaymentProviderService],
}
\`\`\`

This exports the module's definition, indicating that the \`MyPaymentProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Payment Module Provider, add it to the \`providers\` array of the Payment Module:

\`\`\`js title="medusa-config.js"
import { Modules } from "@medusajs/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: {
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "./modules/my-payment",
            id: "my-payment",
            options: {
              // provider options...
              apiKey: "..."
            }
          }
        ]
      }
    }
  }
})
\`\`\`
`,
    ],
  },
}

export default paymentProviderOptions
