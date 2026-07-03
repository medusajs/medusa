import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const mfaOptions: FormattingOptionsType = {
  "^mfa/.*AuthMfaProvider": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this guide, you’ll learn how to create a Multi-Factor Authentication (MFA) Auth Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/auth/mfa-module-provider",
      tags: ["auth", "server", "how to"],
      sidebar_label: "Create MFA Provider",
      keywords: ["mfa", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement:
        "How to Create a Multi-Factor Authentication (MFA) Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sortMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
      member_sources_overrides: false,
    },
    startSections: [
      `## What is an MFA Module Provider?
      
An MFA Module Provider is a provider that implements the \`AuthMfaProvider\` interface. It allows you to integrate a new MFA provider into the Medusa Auth Module, enabling users to enroll and authenticate with MFA factors beyond the built-in TOTP provider.

Medusa provides a built-in Totp MFA Module Provider that you can use out-of-the-box. You can also
override it or create your own custom MFA Module Provider by following the instructions in this guide.

<Note title="Creating a Recovery Code MFA Module Provider Instead?">

Refer to the [Create a Recovery Code MFA Module Provider](/references/recovery-code-mfa-module-provider) guide instead.

</Note>`,
      `## Implementation Example
      
As you implement your MFA Auth Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [Totp MFA Module Provider in the Medusa repository](https://github.com/medusajs/medusa/blob/develop/packages/modules/auth/src/providers/mfa/totp.ts).`,
      `## 1. Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-mfa\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-mfa\`.

<Note>

The rest of this guide always uses the \`src/modules/my-mfa\` directory as an example.

</Note>`,
      `## 2. Create the MFA Module Provider Service

Create the file \`src/modules/my-mfa/service.ts\` that holds the module provider's main service. It must implement the \`AuthMfaProvider\` interface imported from \`@medusajs/framework/types\`:

\`\`\`ts title="src/modules/my-mfa/service.ts"
import { AuthMfaProvider } from "@medusajs/framework/types"

type Options = {
  // define any options your provider needs here
}

class MyAuthMfaProviderService implements AuthMfaProvider {
  // TODO implement methods
}

export default MyAuthMfaProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-mfa/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-mfa/index.ts"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import MyAuthMfaProviderService from "./service"

export default ModuleProvider(Modules.AUTH, {
  services: [MyAuthMfaProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyAuthMfaProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your MFA Module Provider, add it to the \`mfa.providers\` array of the Auth Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        mfa: {
          encryption_key: process.env.AUTH_MFA_ENCRYPTION_KEY,
          providers: [
            {
              // if module provider is in a plugin, use \`plugin-name/providers/my-mfa\`
              resolve: "./src/modules/my-mfa",
              // if you're overriding the totp provider, set this to "totp"
              id: "my-mfa",
              options: {
                // provider options...
              }
            }
          ]
        },
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
  ]
})
\`\`\`
`,
      `## 5. Test it Out

There are two ways to test out your MFA Module Provider:

1. **Custom Provider:** Use it with the MFA API routes to enroll and authenticate users with MFA. See the [MFA guide](/commerce-modules/auth/mfa) for more details.
2. **Overriding Totp Provider:** If your provider overrides the Totp provider, you can test it out in the admin dashboard by managing your profile's [two-factor authentication settings from the admin dashboard](!user-guide!/settings/profile#manage-two-factor-authentication).
`,
    ],
  },
  "^mfa/.*RecoveryCodeAuthMfaProvider": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this guide, you’ll learn how to create a Recovery Code Multi-Factor Authentication (MFA) Auth Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/auth/recovery-code-mfa-module-provider",
      tags: ["auth", "server", "how to"],
      sidebar_label: "Create Recovery Code MFA Provider",
      keywords: ["mfa", "provider", "integration", "recovery code"],
    },
    reflectionTitle: {
      fullReplacement:
        "How to Create a Recovery Code Multi-Factor Authentication (MFA) Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sortMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
      member_sources_overrides: false,
    },
    startSections: [
      `## What is a Recovery Code MFA Module Provider?

A Recovery Code MFA Module Provider is a specialized MFA provider that, in addition to
verifying codes, can generate a fresh batch of one-time recovery codes for an auth identity.
Recovery codes are typically used as a fallback when the user loses access to their primary
MFA factor (such as their TOTP authenticator).

Each generated code should be returned to the user only once (in plain text), stored as a
hash on the server using the injected \`authMfaRecoveryCodeService\`, and invalidated after a
successful verification.

Medusa provides a built-in Recovery Code MFA Module Provider that you can use out-of-the-box. You can also
override it by following the instructions in this guide.`,
      `## Implementation Example
      
As you implement your Recovery Code MFA Auth Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [Recovery Code MFA Module Provider in the Medusa repository](https://github.com/medusajs/medusa/blob/develop/packages/modules/auth/src/providers/mfa/recovery-code.ts).`,
      `## 1. Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-recovery-code\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-recovery-code\`.

<Note>

The rest of this guide always uses the \`src/modules/my-recovery-code\` directory as an example.

</Note>`,
      `## 2. Create the Recovery Code MFA Module Provider Service

Create the file \`src/modules/my-recovery-code/service.ts\` that holds the module provider's main service. It must implement the \`RecoveryCodeAuthMfaProvider\` interface imported from \`@medusajs/framework/types\`:

\`\`\`ts title="src/modules/my-recovery-code/service.ts"
import { RecoveryCodeAuthMfaProvider } from "@medusajs/framework/types"

type Options = {
  // define any options your provider needs here
}

class MyRecoveryCodeProviderService implements RecoveryCodeAuthMfaProvider {
  // TODO implement methods
}

export default MyRecoveryCodeProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-recovery-code/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-recovery-code/index.ts"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import MyRecoveryCodeProviderService from "./service"

export default ModuleProvider(Modules.AUTH, {
  services: [MyRecoveryCodeProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyRecoveryCodeProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your Recovery Code MFA Module Provider, add it to the \`mfa.providers\` array of the Auth Module in \`medusa-config.ts\`:

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        mfa: {
          encryption_key: process.env.AUTH_MFA_ENCRYPTION_KEY,
          providers: [
            {
              // if module provider is in a plugin, use \`plugin-name/providers/my-recovery-code\`
              resolve: "./src/modules/my-recovery-code",
              id: "recovery-code",
              options: {
                // provider options...
              }
            }
          ]
        },
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
  ]
})
\`\`\`
`,
      `## 5. Test it Out

To test out your Recovery Code MFA Module Provider, you can [manage two-factor authentication settings in the admin dashboard][two-factor authentication settings from the admin dashboard](!user-guide!/settings/profile#manage-two-factor-authentication). You can enable 2FA, which will show you the recovery codes generated by your provider.

You can also refer to the [MFA guide](/commerce-modules/auth/mfa) for more details on how to use MFA providers with the API routes.
`,
    ],
  },
}

export default mfaOptions
