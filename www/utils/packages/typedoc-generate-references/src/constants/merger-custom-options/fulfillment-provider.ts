import { FormattingOptionsType } from "types"

const fulfillmentProviderOptions: FormattingOptionsType = {
  "^fulfillment_provider/.*AbstractFulfillmentProviderService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a fulfillment provider module and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/fulfillment/provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Fulfillment Provider Module",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-fulfillment\`.`,
      `## 2. Create the Fulfillment Provider Service

Create the file \`src/modules/my-fulfillment/service.ts\` that holds the module's main service. It must extend the \`AbstractFulfillmentProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-fulfillment/service.ts"
import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
  // TODO implement methods
}

export default MyFulfillmentProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-fulfillment/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-fulfillment/index.ts"
import MyFulfillmentProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [MyFulfillmentProviderService],
})
\`\`\`

This exports the module's definition, indicating that the \`MyFulfillmentProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Fulfillment Module Provider, add it to the \`providers\` array of the Fulfillment Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-fulfillment",
            id: "my-fulfillment",
            options: {
              // provider options...
            },
          },
        ],
      },
    },
  ]
})
\`\`\`
`,
      `## 5. Test it Out

Before you use your fulfillment provider, in the Medusa Admin:

1. Add the fulfillment provider to a location.
2. Add in the location a delivery shipping option that uses the provider.

Then, place an order, choosing the shipping option you created during checkout, and create a fulfillment in the Medusa Admin. The fulfillment is created using your provider.
`,
    ],
  },
}

export default fulfillmentProviderOptions
