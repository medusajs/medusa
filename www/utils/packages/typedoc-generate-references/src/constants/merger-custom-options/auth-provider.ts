import { FormattingOptionsType } from "types"

const authProviderOptions: FormattingOptionsType = {
  "^auth_provider/.*AbstractAuthModuleProvider": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create an auth provider module and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/auth/provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create an Auth Provider Module",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-auth\`.`,
      `## 2. Create the Auth Provider Service

Create the file \`src/modules/my-auth/service.ts\` that holds the module's main service. It must extend the \`AbstractAuthModuleProvider\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-auth/service.ts"
import { AbstractAuthModuleProvider } from "@medusajs/framework/utils"

class MyAuthProviderService extends AbstractAuthModuleProvider {
  // TODO implement methods
}

export default MyAuthProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-auth/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-auth/index.ts"
import MyAuthProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.AUTH, {
  services: [MyAuthProviderService],
})
\`\`\`

This exports the module's definition, indicating that the \`MyAuthProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Auth Module Provider, add it to the \`providers\` array of the Auth Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-auth",
            id: "my-auth",
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

To test out your authentication provider, use any of the [Authentication Routes](https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route), using your provider's ID as a path parameter.

For example, to get a registration token for an admin user, send a \`POST\` request to \`/auth/user/my-auth/register\` replacing \`my-auth\` with your authentication provider's ID:

\`\`\`bash
curl -X POST http://localhost:9000/auth/user/my-auth/register
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Whitney_Schultz@gmail.com",
  "password": "supersecret"
}'
\`\`\`

Change the request body to pass the data required for your authentication provider to register the user.

If registration is successful, the response will have a \`token\` property.
      `,
    ],
  },
}

export default authProviderOptions
