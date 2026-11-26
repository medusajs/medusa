import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"
import { getEnterpriseNotice } from "../../utils/enterprise.js"

const auditProviderOptions: FormattingOptionsType = {
  "^audit_provider/.*AbstractAuditProviderService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `${getEnterpriseNotice("audit")}In this document, you’ll learn how to create an Audit Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/audit/provider",
      keywords: ["audit", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Create an Audit Module Provider",
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

As you implement your Audit Module Provider, it can be useful to refer to an existing provider and how it's implemented.

If you need to refer to an existing implementation as an example, check the [Postgres Audit Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/audit/src/providers/audit-postgres).

<Note>

A provider only stores and reads audit logs. The Audit Module validates recorded audit logs, assigns their IDs, buffers them, and retries failed writes. It doesn't delete old audit logs from a custom provider, so implement a retention period in the provider or in your storage if you need one.

</Note>`,
      `## Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-audit\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-audit\`.

<Note>

The rest of this guide always uses the \`src/modules/my-audit\` directory as an example.

</Note>`,
      `## 2. Create the Audit Module Provider's Service

Create the file \`src/modules/my-audit/service.ts\` that holds the implementation of the module provider's main service. It must extend the \`AbstractAuditProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-audit/service.ts"
import { AbstractAuditProviderService } from "@medusajs/framework/utils"

class MyAuditProviderService extends AbstractAuditProviderService {
  // TODO implement methods
}

export default MyAuditProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Provider Definition File

Create the file \`src/modules/my-audit/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-audit/index.ts"
import MyAuditProviderService from "./service"
import {
  ModuleProvider,
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.AUDIT, {
  services: [MyAuditProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyAuditProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your Audit Module Provider, add it to the \`providers\` array of the Audit Module in \`medusa-config.ts\`:

<Note>

When you register a provider, the Audit Module no longer stores audit logs in your database. If you register more than one provider, set the \`default_provider\` option of the Audit Module to the provider that audit logs are written to and read from.

</Note>

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/audit",
      options: {
        // Only needed with more than one provider.
        // default_provider: "my-audit",
        providers: [
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-audit\`
            resolve: "./src/modules/my-audit",
            id: "my-audit",
            options: {
              // provider options...
            },
          },
        ],
      },
    },
  ],
})
\`\`\`
`,
      `## 5. Test it Out

To test the provider out, start your Medusa application:

\`\`\`bash npm2yarn
npm run dev
\`\`\`

Then, perform an action in the Medusa Admin, such as updating a product. The Audit Module records the request and calls your provider's \`write\` method with the audit log.

Finally, go to **Settings** > **Audit logs** in the Medusa Admin. The dashboard retrieves the audit logs with your provider's \`listAndCount\` method, and the details of an audit log with its \`retrieve\` method.
`,
      `## Additional Resources

- [Audit Module](/enterprise/audit)
- [Audit Module Options](/enterprise/audit/module-options)
- [Read Audit Logs](/enterprise/audit/read-audit-logs)
`,
    ],
  },
}

export default auditProviderOptions
