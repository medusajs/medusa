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
    // Third-party SDK call whose option name collides with a module value.
    {
      code: `
        await this.mailchimp.campaigns.create({
          type: "regular",
          settings: { subject_line: "New Products" },
        })
      `,
    },
    // Third-party SDK call with several colliding option names.
    {
      code: `
        await stripe.customers.create({ user: 1, order: 2 })
      `,
    },
    // Colliding method name on an unrelated receiver.
    {
      code: `
        await queue.delete({ index: "x" })
      `,
    },
    // Receiver is a computed member — not resolvable to a link.
    {
      code: `
        await services["link"].create({ product: { id: "1" } })
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
    // Receiver resolved from the container under an unrelated name.
    {
      code: `
        import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
        const l = container.resolve(ContainerRegistrationKeys.LINK)
        await l.create({ product: { id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
        const l = container.resolve(ContainerRegistrationKeys.LINK)
        await l.create({ [Modules.PRODUCT]: { id: "1" } })
      `,
    },
    // Receiver typed as `Link`.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        const svc: Link = getIt()
        await svc.create({ order: { id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        const svc: Link = getIt()
        await svc.create({ [Modules.ORDER]: { id: "1" } })
      `,
    },
    // `remoteLink` receiver.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        await remoteLink.create({ product: { id: "1" } })
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        await remoteLink.create({ [Modules.PRODUCT]: { id: "1" } })
      `,
    },
    // `this.link_` receiver inside a service.
    {
      code: `
        import { Modules } from "@medusajs/framework/utils"
        class Svc {
          async run() {
            await this.link_.create({ product: { id: "1" } })
          }
        }
      `,
      errors: [{ messageId: "preferEnumKey" }],
      output: `
        import { Modules } from "@medusajs/framework/utils"
        class Svc {
          async run() {
            await this.link_.create({ [Modules.PRODUCT]: { id: "1" } })
          }
        }
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
        {
          messageId: "preferEnumKey",
          data: { key: "product", enumMember: "PRODUCT" },
        },
        {
          messageId: "preferEnumKey",
          data: { key: "order", enumMember: "ORDER" },
        },
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
