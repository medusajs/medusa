import { FormattingOptionsType } from "types"

const fileOptions: FormattingOptionsType = {
  "^file": {
    frontmatterData: {
      displayed_sidebar: "core",
    },
  },
  "^file/.*AbstractFileService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a file service in the Medusa backend and the methods you must implement in it.`,
    frontmatterData: {
      displayed_sidebar: "core",
      slug: "/development/file-service/create-file-service",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a File Service",
    },
    endSections: [
      `## Test Implementation

:::note

If you created your file service in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your file service implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Upload a file using the [Admin REST APIs](https://docs.medusajs.com/api/admin#uploads_postuploads) or using the Medusa admin, for example, to [upload a product's thumbnail](https://docs.medusajs.com/user-guide/products/manage#manage-thumbnails).
    `,
    ],
  },
}

export default fileOptions
