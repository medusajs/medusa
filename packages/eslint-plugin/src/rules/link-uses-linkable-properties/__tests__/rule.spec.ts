import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("link-uses-linkable-properties", rule, {
  valid: [
    // Canonical: both args are direct linkable member chains.
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
    // Object form with linkable property (isList).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(
          ProductModule.linkable.product,
          { linkable: BlogModule.linkable.post, isList: true }
        )
      `,
    },
    // Both args in object form (many-to-many).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(
          { linkable: ProductModule.linkable.product, isList: true },
          { linkable: BlogModule.linkable.post, isList: true }
        )
      `,
    },
    // Third options arg is ignored (database renaming).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import ArticleModule from "../modules/article"
        export default defineLink(
          ProductModule.linkable.product,
          { linkable: ArticleModule.linkable.post, isList: true },
          { database: { table: "product_product_blog_post" } }
        )
      `,
    },
    // Aliased defineLink import.
    {
      code: `
        import { defineLink as dl } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default dl(ProductModule.linkable.product, BlogModule.linkable.post)
      `,
    },
    // defineLink from a non-framework source — should not trigger.
    {
      code: `
        import { defineLink } from "some-other-lib"
        export default defineLink({ foo: "bar" }, "something")
      `,
    },
    // Inverse read-only link form: second arg spreads `<X>.linkable.<y>.id`.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(
          { linkable: ProductModule.linkable.product, field: "id" },
          { ...BlogModule.linkable.post.id, primaryKey: "product_id" },
          { readOnly: true }
        )
      `,
    },
    // Read-only link with inline serviceName-based linkable descriptor.
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
    // Object form whose `linkable` value references a data model by id
    // (e.g. the only way to link to draft orders, via `order.id`).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import MarketplaceModule from "../modules/marketplace"
        import OrderModule from "@medusajs/medusa/order"
        export default defineLink(
          MarketplaceModule.linkable.vendor,
          { linkable: OrderModule.linkable.order.id, isList: true }
        )
      `,
    },
    // Deeper module chain (e.g. namespace import).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import * as Modules from "../modules"
        export default defineLink(
          Modules.Product.linkable.product,
          Modules.Blog.linkable.post
        )
      `,
    },
  ],
  invalid: [
    // Bare object literal without linkable property.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          ProductModule.linkable.product,
          { foo: "bar" }
        )
      `,
      errors: [{ messageId: "notLinkableProperty" }],
    },
    // String literal participant.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        export default defineLink("product", BlogModule.linkable.post)
      `,
      errors: [{ messageId: "notLinkableProperty" }],
    },
    // Direct module reference without .linkable.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(ProductModule, BlogModule.linkable.post)
      `,
      errors: [{ messageId: "notLinkableProperty" }],
    },
    // Object form whose `linkable` value is not a linkable member chain.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        export default defineLink(
          ProductModule.linkable.product,
          { linkable: "post", isList: true }
        )
      `,
      errors: [{ messageId: "notLinkableProperty" }],
    },
    // Both args invalid — two errors.
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        export default defineLink("product", "post")
      `,
      errors: [
        { messageId: "notLinkableProperty" },
        { messageId: "notLinkableProperty" },
      ],
    },
    // Aliased import + invalid arg.
    {
      code: `
        import { defineLink as dl } from "@medusajs/framework/utils"
        import BlogModule from "../modules/blog"
        export default dl({ foo: "bar" }, BlogModule.linkable.post)
      `,
      errors: [{ messageId: "notLinkableProperty" }],
    },
    // Direct module's .linkable property without sub-model (`ProductModule.linkable`).
    {
      code: `
        import { defineLink } from "@medusajs/framework/utils"
        import ProductModule from "@medusajs/medusa/product"
        import BlogModule from "../modules/blog"
        export default defineLink(
          ProductModule.linkable,
          BlogModule.linkable.post
        )
      `,
      errors: [{ messageId: "notLinkableProperty" }],
    },
  ],
})
