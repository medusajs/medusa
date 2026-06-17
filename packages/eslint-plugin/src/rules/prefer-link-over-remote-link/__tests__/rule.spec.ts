import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("prefer-link-over-remote-link", rule, {
  valid: [
    // Canonical: resolve("link").
    {
      code: `const link = req.scope.resolve("link")`,
    },
    // Canonical: ContainerRegistrationKeys.LINK.
    {
      code: `
        import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
        const link = container.resolve(ContainerRegistrationKeys.LINK)
      `,
    },
    // Unrelated resolve target.
    {
      code: `const x = req.scope.resolve("query")`,
    },
    // Unrelated registration key.
    {
      code: `const x = container.resolve(ContainerRegistrationKeys.QUERY)`,
    },
    // Unrelated method name (not resolve).
    {
      code: `req.scope.register("remoteLink", value)`,
    },
    // Unrelated type import.
    {
      code: `import type { Link } from "@medusajs/framework/types"`,
    },
    // RemoteLink-like name from non-framework source — should not trigger.
    {
      code: `import type { RemoteLink } from "some-other-lib"`,
    },
  ],
  invalid: [
    // resolve("remoteLink") with double quotes.
    {
      code: `const link = req.scope.resolve("remoteLink")`,
      errors: [{ messageId: "remoteLinkString" }],
      output: `const link = req.scope.resolve("link")`,
    },
    // resolve('remoteLink') with single quotes — preserve quote style.
    {
      code: `const link = req.scope.resolve('remoteLink')`,
      errors: [{ messageId: "remoteLinkString" }],
      output: `const link = req.scope.resolve('link')`,
    },
    // Bare resolve identifier (destructured from container).
    {
      code: `
        const { resolve } = container
        const link = resolve("remoteLink")
      `,
      errors: [{ messageId: "remoteLinkString" }],
      output: `
        const { resolve } = container
        const link = resolve("link")
      `,
    },
    // ContainerRegistrationKeys.REMOTE_LINK.
    {
      code: `
        import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
        const link = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      `,
      errors: [{ messageId: "remoteLinkRegistrationKey" }],
      output: `
        import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
        const link = container.resolve(ContainerRegistrationKeys.LINK)
      `,
    },
    // Namespace-style REMOTE_LINK (any object).
    {
      code: `const link = container.resolve(Keys.REMOTE_LINK)`,
      errors: [{ messageId: "remoteLinkRegistrationKey" }],
      output: `const link = container.resolve(Keys.LINK)`,
    },
    // Type import: RemoteLink from @medusajs/framework/types.
    {
      code: `import type { RemoteLink } from "@medusajs/framework/types"`,
      errors: [{ messageId: "remoteLinkTypeImport" }],
      output: `import type { Link } from "@medusajs/framework/types"`,
    },
    // Type import: IRemoteLink from @medusajs/types.
    {
      code: `import { IRemoteLink } from "@medusajs/types"`,
      errors: [{ messageId: "remoteLinkTypeImport" }],
      output: `import { ILink } from "@medusajs/types"`,
    },
    // Mixed: rename only the deprecated specifier.
    {
      code: `import type { Link, RemoteLink } from "@medusajs/framework/types"`,
      errors: [{ messageId: "remoteLinkTypeImport" }],
      output: `import type { Link, Link } from "@medusajs/framework/types"`,
    },
    // Aliased import — rename only the `imported` part, keep alias.
    {
      code: `import type { RemoteLink as MyLink } from "@medusajs/framework/types"`,
      errors: [{ messageId: "remoteLinkTypeImport" }],
      output: `import type { Link as MyLink } from "@medusajs/framework/types"`,
    },
    // Multiple violations in one file.
    {
      code: `
        import { RemoteLink } from "@medusajs/framework/types"
        const a = req.scope.resolve("remoteLink")
        const b = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      `,
      errors: [
        { messageId: "remoteLinkTypeImport" },
        { messageId: "remoteLinkString" },
        { messageId: "remoteLinkRegistrationKey" },
      ],
      output: `
        import { Link } from "@medusajs/framework/types"
        const a = req.scope.resolve("link")
        const b = container.resolve(ContainerRegistrationKeys.LINK)
      `,
    },
  ],
})
