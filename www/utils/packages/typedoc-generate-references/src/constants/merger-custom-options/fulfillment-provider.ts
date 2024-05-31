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

Create the file \`src/modules/my-fulfillment/service.ts\` that holds the module's main service. It must extend the \`AbstractFulfillmentProviderService\` class imported from \`@medusajs/utils\`:

\`\`\`ts title="src/modules/my-fulfillment/service.ts"
import { AbstractFulfillmentProviderService } from "@medusajs/utils"

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

export default {
  service: MyFulfillmentProviderService,
}
\`\`\`

This exports the module's definition, indicating that the \`MyFulfillmentProviderService\` is the main service of the module.`,
      `## 4. Use Module

To use your Fulfillment Provider Module, add it to the \`providers\` array of the Fulfillment Module:

\`\`\`js title="medusa-config.js"
const { Modules } = require("@medusajs/modules-sdk")

// ...

module.exports = defineConfig({
  // ...
  modules: {
    [Modules.FULFILLMENT]: {
      resolve: "@medusajs/fulfillment",
      options: {
        providers: [
          {
            resolve: "./dist/modules/my-fulfillment",
            options: {
              config: {
                "my-fulfillment": {
                  // provider options...
                },
              },
            },
          },
        ],
      },
    },
  }
})
\`\`\`
`,
    ],
  },
}

export default fulfillmentProviderOptions
