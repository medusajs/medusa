import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("link-create-keys-modules-enum", rule, {
  valid: [
    // Canonical: computed key using the Modules enum.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({
          [Modules.PRODUCT]: { product_id: "1" },
          [Modules.ORDER]: { order_id: "2" },
        })
      `,
    },
    // Custom module name (not in the Modules enum) — left alone.
    {
      code: `
        await link.create({
          blog: { post_id: "1" },
          custom_module: { id: "x" },
        })
      `,
    },
    // Unrelated method on `link` — not flagged.
    {
      code: `
        await link.list({ product: "x" })
      `,
    },
    // Unrelated identifier call (not a tracked step) — even with a matching key.
    {
      code: `
        somethingElse({ product: { id: "1" } })
      `,
    },
    // Step from another package — not tracked.
    {
      code: `
        import { createRemoteLinkStep } from "some-other-package"
        createRemoteLinkStep({ product: { id: "1" } })
      `,
    },
    // Array of objects, all enum-form.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create([
          { [Modules.PRODUCT]: { product_id: "1" }, blog: { post_id: "2" } },
        ])
      `,
    },
  ],
  invalid: [
    // Identifier key for a known module → autofix + add import.
    {
      code: `await link.create({ product: { product_id: "1" } })`,
      errors: [
        {
          messageId: "preferEnumKey",
          data: { key: "product", enumMember: "PRODUCT" },
        },
      ],
      output: `import { Modules } from "@medusajs/framework/utils"
await link.create({ [Modules.PRODUCT]: { product_id: "1" } })`,
    },
    // String-literal key.
    {
      code: `await link.create({ "product": { product_id: "1" } })`,
      errors: [{ messageId: "preferEnumKey" }],
      output: `import { Modules } from "@medusajs/framework/utils"
await link.create({ [Modules.PRODUCT]: { product_id: "1" } })`,
    },
    // Existing framework/utils import → append `Modules` to specifier list.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        await link.create({ product: { product_id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { defineLink, Modules } from "@medusajs/framework/utils"
        await link.create({ [Modules.PRODUCT]: { product_id: "1" } })
      `,
    },
    // Modules already imported → reuse local binding, no second import added.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({ product: { id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({ [Modules.PRODUCT]: { id: "1" } })
      `,
    },
    // Aliased Modules import.
    {
      code: `
        import { Modules as M } from "@medusajs/framework/utils"
        await link.create({ order: { id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules as M } from "@medusajs/framework/utils"
        await link.create({ [M.ORDER]: { id: "1" } })
      `,
    },
    // link.dismiss with snake_case enum value.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await link.dismiss({ sales_channel: { id: "x" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        await link.dismiss({ [Modules.SALES_CHANNEL]: { id: "x" } })
      `,
    },
    // Workflow step: createRemoteLinkStep.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
        createRemoteLinkStep([
          { product: { product_id: "1" }, blog: { post_id: "2" } },
        ])
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
        createRemoteLinkStep([
          { [Modules.PRODUCT]: { product_id: "1" }, blog: { post_id: "2" } },
        ])
      `,
    },
    // Workflow step alias.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        import { dismissRemoteLinkStep as drls } from "@medusajs/medusa/core-flows"
        drls({ order: { id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        import { dismissRemoteLinkStep as drls } from "@medusajs/medusa/core-flows"
        drls({ [Modules.ORDER]: { id: "1" } })
      `,
    },
    // Shorthand property.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({ product })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({ [Modules.PRODUCT]: product })
      `,
    },
    // Multiple violations in one call.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({
          product: { id: "1" },
          order: { id: "2" },
          blog: { id: "3" },
        })
      `,
      errors: [
        { messageId: "preferEnumKey", data: { key: "product", enumMember: "PRODUCT" } },
        { messageId: "preferEnumKey", data: { key: "order", enumMember: "ORDER" } },
      ],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        await link.create({
          [Modules.PRODUCT]: { id: "1" },
          [Modules.ORDER]: { id: "2" },
          blog: { id: "3" },
        })
      `,
    },
  ],
})
