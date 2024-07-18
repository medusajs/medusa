import { FormattingOptionsType } from "types"

const fileOptions: FormattingOptionsType = {
  "^file/.*AbstractFileProviderService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a file provider module and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/file-provider-module",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a File Provider Module",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-file\`.`,
      `## 2. Create the File Provider Service

Create the file \`src/modules/my-file/service.ts\` that holds the implementation of the module's main service. It must extend the \`AbstractFileProviderService\` class imported from \`@medusajs/utils\`:

\`\`\`ts title="src/modules/my-file/service.ts"
import { AbstractFileProviderService } from "@medusajs/utils"

class MyFileProviderService extends AbstractFileProviderService {
  // TODO implement methods
}

export default MyFileProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-file/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-file/index.ts"
import MyFileProviderService from "./service"
import { Module } from "@medusajs/utils"

export default Module("my-file", {
  service: MyFileProviderService,
})
\`\`\`

This exports the module's definition, indicating that the \`MyFileProviderService\` is the main service of the module.`,
      `## 4. Use Module

To use your File Provider Module, add it to the \`providers\` array of the File Module:

<Note>

The File Module accepts one provider only.

</Note>

\`\`\`js title="medusa-config.js"
import { Modules } from "@medusajs/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: {
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "./modules/my-file",
            id: "my-file",
            options: {
              // provider options...
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

export default fileOptions
