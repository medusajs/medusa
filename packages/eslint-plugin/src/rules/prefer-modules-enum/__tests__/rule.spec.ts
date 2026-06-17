import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("prefer-modules-enum", rule, {
  valid: [
    // Canonical: Modules.PRODUCT.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        const productModule = req.scope.resolve(Modules.PRODUCT)
      `,
    },
    // Bare resolve with enum.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        const order = resolve(Modules.ORDER)
      `,
    },
    // Unrelated resolve target (not a known module).
    {
      code: `const x = req.scope.resolve("customService")`,
    },
    // Container registration key — handled by prefer-container-registration-keys.
    {
      code: `const q = req.scope.resolve("query")`,
    },
    // Unrelated method name.
    {
      code: `req.scope.register("product", value)`,
    },
    // resolve called with a non-string argument.
    {
      code: `req.scope.resolve(someVariable)`,
    },
  ],
  invalid: [
    // resolve("product") with no existing import — adds the import.
    {
      code: `const productModule = req.scope.resolve("product")`,
      errors: [
        {
          messageId: "preferModulesEnum",
          data: { key: "product", enumMember: "PRODUCT" },
        },
      ],
      output: `import { Modules } from "@medusajs/framework/utils"\nconst productModule = req.scope.resolve(Modules.PRODUCT)`,
    },
    // Single quotes — still autofixes (literal replaced).
    {
      code: `const order = container.resolve('order')`,
      errors: [{ messageId: "preferModulesEnum" }],
      output: `import { Modules } from "@medusajs/framework/utils"\nconst order = container.resolve(Modules.ORDER)`,
    },
    // Bare resolve identifier (destructured from container).
    {
      code: `const cart = resolve("cart")`,
      errors: [
        {
          messageId: "preferModulesEnum",
          data: { key: "cart", enumMember: "CART" },
        },
      ],
      output: `import { Modules } from "@medusajs/framework/utils"\nconst cart = resolve(Modules.CART)`,
    },
    // Multi-word module value → underscored enum member.
    {
      code: `const sc = container.resolve("sales_channel")`,
      errors: [
        {
          messageId: "preferModulesEnum",
          data: { key: "sales_channel", enumMember: "SALES_CHANNEL" },
        },
      ],
      output: `import { Modules } from "@medusajs/framework/utils"\nconst sc = container.resolve(Modules.SALES_CHANNEL)`,
    },
    // Existing framework/utils import — append to specifier list.
    {
      code: `
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
const payment = req.scope.resolve("payment")
      `,
      errors: [{ messageId: "preferModulesEnum" }],
      output: `
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
const payment = req.scope.resolve(Modules.PAYMENT)
      `,
    },
    // Modules already imported — reuse the binding.
    {
      code: `
import { Modules } from "@medusajs/framework/utils"
const fulfillment = req.scope.resolve("fulfillment")
      `,
      errors: [{ messageId: "preferModulesEnum" }],
      output: `
import { Modules } from "@medusajs/framework/utils"
const fulfillment = req.scope.resolve(Modules.FULFILLMENT)
      `,
    },
    // Aliased Modules import — use the alias.
    {
      code: `
import { Modules as M } from "@medusajs/framework/utils"
const p = req.scope.resolve("pricing")
      `,
      errors: [{ messageId: "preferModulesEnum" }],
      output: `
import { Modules as M } from "@medusajs/framework/utils"
const p = req.scope.resolve(M.PRICING)
      `,
    },
    // Multi-violation file — both rewritten, single import added.
    {
      code: `
import { Modules } from "@medusajs/framework/utils"
const p = req.scope.resolve("product")
const o = req.scope.resolve("order")
      `,
      errors: [
        { messageId: "preferModulesEnum" },
        { messageId: "preferModulesEnum" },
      ],
      output: `
import { Modules } from "@medusajs/framework/utils"
const p = req.scope.resolve(Modules.PRODUCT)
const o = req.scope.resolve(Modules.ORDER)
      `,
    },
  ],
})
