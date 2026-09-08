import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const fileOptions: FormattingOptionsType = {
  "^file/.*AbstractFileProviderService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a File Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/file-provider-module",
      keywords: ["file", "storage", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Create a File Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sortMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
    },
    startSections: [
      `## Implementation Example
      
As you implement your File Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [S3 File Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/providers/file-s3).`,
      `## Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-file\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-file\`.

<Note>

The rest of this guide always uses the \`src/modules/my-file\` directory as an example.

</Note>`,
      `## 2. Create the File Module Provider's Service

Create the file \`src/modules/my-file/service.ts\` that holds the implementation of the module provider's main service. It must extend the \`AbstractFileProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-file/service.ts"
import { AbstractFileProviderService } from "@medusajs/framework/utils"

class MyFileProviderService extends AbstractFileProviderService {
  // TODO implement methods
}

export default MyFileProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Provider Definition File

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

This exports the module provider's definition, indicating that the \`MyFileProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your File Module Provider, add it to the \`providers\` array of the File Module in \`medusa-config.ts\`:

<Note>

The File Module accepts one provider only.

</Note>

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          // default provider
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
          },
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-file\`
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

To test out your File Module Provider, use the Medusa Admin or the [Upload API route](https://docs.medusajs.com/api/admin/uploads/upload-files) to upload a file.
`,
    ],
  },
}

export default fileOptions
