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

Create the file \`src/modules/my-file/service.ts\` that holds the implementation of the module's main service. It must extend the \`AbstractFileProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-file/service.ts"
import { AbstractFileProviderService } from "@medusajs/framework/utils"

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
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.FILE, {
  services: [MyFileProviderService],
})
\`\`\`

This exports the module's definition, indicating that the \`MyFileProviderService\` is the module's service.`,
      `## 4. Use Module

To use your File Module Provider, add it to the \`providers\` array of the File Module in \`medusa-config.ts\`:

<Note>

The File Module accepts one provider only.

</Note>

\`\`\`ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/framework/file",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-file",
            id: "my-file",
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

To test out your file provider, use the Medusa Admin or the [Upload API route](https://docs.medusajs.com/v2/api/admin#uploads_postuploads) to upload a file.
`,
    ],
  },
}

export default fileOptions
