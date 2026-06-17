import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("prefer-container-registration-keys", rule, {
  valid: [
    // Canonical: ContainerRegistrationKeys.QUERY.
    {
      code: `
        import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
      `,
    },
    // Bare resolve with enum.
    {
      code: `
        import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
        const link = resolve(ContainerRegistrationKeys.LINK)
      `,
    },
    // Unrelated resolve target.
    {
      code: `const x = req.scope.resolve("customService")`,
    },
    // Unrelated method name.
    {
      code: `req.scope.register("query", value)`,
    },
    // resolve called with non-string argument.
    {
      code: `req.scope.resolve(someVariable)`,
    },
    // "remoteLink" — deprecated, handled by prefer-link-over-remote-link.
    {
      code: `req.scope.resolve("remoteLink")`,
    },
  ],
  invalid: [
    // resolve("query") with no existing import — adds the import.
    {
      code: `const query = req.scope.resolve("query")`,
      errors: [
        {
          messageId: "preferRegistrationKey",
          data: { key: "query", enumMember: "QUERY" },
        },
      ],
      output: `import { ContainerRegistrationKeys } from "@medusajs/framework/utils"\nconst query = req.scope.resolve(ContainerRegistrationKeys.QUERY)`,
    },
    // resolve('query') with single quotes — still autofixes (literal replaced).
    {
      code: `const query = container.resolve('query')`,
      errors: [{ messageId: "preferRegistrationKey" }],
      output: `import { ContainerRegistrationKeys } from "@medusajs/framework/utils"\nconst query = container.resolve(ContainerRegistrationKeys.QUERY)`,
    },
    // Bare resolve identifier (destructured from container).
    {
      code: `const link = resolve("link")`,
      errors: [
        {
          messageId: "preferRegistrationKey",
          data: { key: "link", enumMember: "LINK" },
        },
      ],
      output: `import { ContainerRegistrationKeys } from "@medusajs/framework/utils"\nconst link = resolve(ContainerRegistrationKeys.LINK)`,
    },
    // Existing framework/utils import — append to specifier list.
    {
      code: `
import { Modules } from "@medusajs/framework/utils"
const logger = req.scope.resolve("logger")
      `,
      errors: [{ messageId: "preferRegistrationKey" }],
      output: `
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
      `,
    },
    // ContainerRegistrationKeys already imported — reuse the binding.
    {
      code: `
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
const manager = req.scope.resolve("manager")
      `,
      errors: [{ messageId: "preferRegistrationKey" }],
      output: `
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
const manager = req.scope.resolve(ContainerRegistrationKeys.MANAGER)
      `,
    },
    // Aliased ContainerRegistrationKeys import — use the alias.
    {
      code: `
import { ContainerRegistrationKeys as CRK } from "@medusajs/framework/utils"
const q = req.scope.resolve("query")
      `,
      errors: [{ messageId: "preferRegistrationKey" }],
      output: `
import { ContainerRegistrationKeys as CRK } from "@medusajs/framework/utils"
const q = req.scope.resolve(CRK.QUERY)
      `,
    },
    // Other well-known keys.
    {
      code: `const q = container.resolve("remoteQuery")`,
      errors: [
        {
          messageId: "preferRegistrationKey",
          data: { key: "remoteQuery", enumMember: "REMOTE_QUERY" },
        },
      ],
      output: `import { ContainerRegistrationKeys } from "@medusajs/framework/utils"\nconst q = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)`,
    },
    {
      code: `const c = container.resolve("configModule")`,
      errors: [{ messageId: "preferRegistrationKey" }],
      output: `import { ContainerRegistrationKeys } from "@medusajs/framework/utils"\nconst c = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)`,
    },
    {
      code: `const p = container.resolve("__pg_connection__")`,
      errors: [
        {
          messageId: "preferRegistrationKey",
          data: { key: "__pg_connection__", enumMember: "PG_CONNECTION" },
        },
      ],
      output: `import { ContainerRegistrationKeys } from "@medusajs/framework/utils"\nconst p = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)`,
    },
    // Multi-violation file — both rewritten, single import added.
    {
      code: `
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
const q = req.scope.resolve("query")
const l = req.scope.resolve("link")
      `,
      errors: [
        { messageId: "preferRegistrationKey" },
        { messageId: "preferRegistrationKey" },
      ],
      output: `
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
const q = req.scope.resolve(ContainerRegistrationKeys.QUERY)
const l = req.scope.resolve(ContainerRegistrationKeys.LINK)
      `,
    },
  ],
})
