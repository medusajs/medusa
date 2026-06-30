import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const authProviderOptions: FormattingOptionsType = {
  "^auth_provider/.*AbstractAuthModuleProvider": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create an Auth Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/auth/provider",
      tags: ["auth", "server", "how to"],
      sidebar_label: "Create Auth Provider",
      keywords: ["auth", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Create an Auth Module Provider",
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
      
As you implement your Auth Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [Google Auth Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/providers/auth-google).`,
      `## 1. Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-auth\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-auth\`.

<Note>

The rest of this guide always uses the \`src/modules/my-auth\` directory as an example.

</Note>`,
      `## 2. Create the Auth Module Provider's Service

Create the file \`src/modules/my-auth/service.ts\` that holds the module provider's main service. It must extend the \`AbstractAuthModuleProvider\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-auth/service.ts"
import { AbstractAuthModuleProvider } from "@medusajs/framework/utils"

class MyAuthProviderService extends AbstractAuthModuleProvider {
  // TODO implement methods
}

export default MyAuthProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Provider Definition File

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

This exports the module provider's definition, indicating that the \`MyAuthProviderService\` is the module provider's service.

<Note title="Tip">

A auth module provider can have export multiple provider services, where each are registered as a separate auth provider.

</Note>`,
      `## 4. Use Module Provider

To use your Auth Module Provider, add it to the \`providers\` array of the Auth Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        mfa: {
          encryption_key: process.env.AUTH_MFA_ENCRYPTION_KEY,
        },
        providers: [
          // default provider
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-auth\`
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

To test out your Authentication Module Provider, use any of the [Authentication Routes](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route), using your provider's ID as a path parameter.

For example, to get a registration token for a customer, send a \`POST\` request to \`/auth/customer/my-auth/register\` replacing \`my-auth\` with your Authentication Module Provider's ID:

\`\`\`bash
curl -X POST http://localhost:9000/auth/customer/my-auth/register
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Whitney_Schultz@gmail.com",
  "password": "supersecret"
}'
\`\`\`

Change the request body to pass the data required for your Authentication Module Provider to register the customer.

If registration is successful, the response will have a \`token\` property.

You can then use the token to create a customer by sending a request to the [Create Customer API route](https://docs.medusajs.com/api/store#customers_postcustomers).
      `,
    ],
  },
}

export default authProviderOptions
