import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("read-only-link-requires-field", rule, {
  valid: [
    // Canonical read-only link with `field`.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          { linkable: BlogModule.linkable.post, field: "product_id" },
          ProductModule.linkable.product,
          { readOnly: true }
        )
      `,
    },
    // Inverse read-only link with `field` + `primaryKey`.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          { linkable: ProductModule.linkable.product, field: "id" },
          { ...BlogModule.linkable.post.id, primaryKey: "product_id" },
          { readOnly: true }
        )
      `,
    },
    // Inverse read-only link with `field` + `alias` (e.g. the only way to link
    // to draft orders, via the `order` linkable re-aliased to `draft_order`).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import QuoteModule from "../modules/quote"
        import OrderModule from "@medusajs/medusa/order"
        export default defineLink(
          { linkable: QuoteModule.linkable.quote, field: "draft_order_id" },
          { ...OrderModule.linkable.order.id, alias: "draft_order" },
          { readOnly: true }
        )
      `,
    },
    // Read-only link with inline serviceName-based linkable descriptor + primaryKey on inverse not needed (no spread).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import { CMS_MODULE } from "../modules/cms"
        export default defineLink(
          { linkable: ProductModule.linkable.product, field: "id" },
          {
            linkable: {
              serviceName: CMS_MODULE,
              alias: "cms_post",
              primaryKey: "product_id",
            },
          },
          { readOnly: true }
        )
      `,
    },
    // Not a read-only link — no `readOnly` key.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(
          ProductModule.linkable.product,
          BlogModule.linkable.post
        )
      `,
    },
    // `readOnly: false` — does not require field.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(
          ProductModule.linkable.product,
          BlogModule.linkable.post,
          { readOnly: false }
        )
      `,
    },
    // defineLink from a non-framework source — not tracked.
    {
      code: `
        import { defineLink } from "some-other-lib"
        export default defineLink({ foo: "bar" }, "x", { readOnly: true })
      `,
    },
    // Aliased defineLink import with valid shape.
    {
      code: `
        import { defineLink as dl } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default dl(
          { linkable: BlogModule.linkable.post, field: "product_id" },
          ProductModule.linkable.product,
          { readOnly: true }
        )
      `,
    },
    // `readOnly` is not a literal boolean — out of scope (statically unknown).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        const flag = true
        export default defineLink(
          ProductModule.linkable.product,
          BlogModule.linkable.post,
          { readOnly: flag }
        )
      `,
    },
  ],
  invalid: [
    // Read-only link, first arg is a bare linkable member chain (no `field`).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          BlogModule.linkable.post,
          ProductModule.linkable.product,
          { readOnly: true }
        )
      `,
      errors: [{ messageId: "missingField" }],
    },
    // Read-only link, first arg is an object but without `field`.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          { linkable: BlogModule.linkable.post },
          ProductModule.linkable.product,
          { readOnly: true }
        )
      `,
      errors: [{ messageId: "missingField" }],
    },
    // Inverse read-only: second arg spreads `.linkable.<y>.id` but no `primaryKey`.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          { linkable: ProductModule.linkable.product, field: "id" },
          { ...BlogModule.linkable.post.id },
          { readOnly: true }
        )
      `,
      errors: [{ messageId: "missingPrimaryKey" }],
    },
    // Inverse read-only: first arg also missing field → two errors.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          { linkable: ProductModule.linkable.product },
          { ...BlogModule.linkable.post.id },
          { readOnly: true }
        )
      `,
      errors: [
        { messageId: "missingField" },
        { messageId: "missingPrimaryKey" },
      ],
    },
    // Aliased import + missing field.
    {
      code: `
        import { defineLink as dl } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        export default dl(
          BlogModule.linkable.post,
          ProductModule.linkable.product,
          { readOnly: true }
        )
      `,
      errors: [{ messageId: "missingField" }],
    },
    // First arg is a non-object (e.g. identifier) — still flagged as missing field.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        import ProductModule from "@medusajs/medusa/product"
        const first = BlogModule.linkable.post
        export default defineLink(
          first,
          ProductModule.linkable.product,
          { readOnly: true }
        )
      `,
      errors: [{ messageId: "missingField" }],
    },
  ],
})
