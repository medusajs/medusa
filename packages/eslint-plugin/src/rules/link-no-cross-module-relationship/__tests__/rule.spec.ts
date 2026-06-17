import {
  cleanupFixtureWorkspaces,
  createFixtureWorkspace,
  createRuleTester,
} from "../../../test-utils"
import { rule } from "../rule"

afterAll(cleanupFixtureWorkspaces)

/**
 * Writes a module on disk with a tsconfig declaring `paths` aliases, so the rule
 * can resolve aliased imports (e.g. `@models`) the same way TypeScript does.
 * Returns the absolute path of the model file under test.
 */
const moduleWithAlias = (tsconfigPaths: Record<string, string[]>): string => {
  const ws = createFixtureWorkspace("packages/modules/widget", [
    {
      rel: "tsconfig.json",
      content: JSON.stringify({ compilerOptions: { paths: tsconfigPaths } }),
    },
    { rel: "src/models/widget.ts", content: "export default {}" },
    { rel: "src/models/part.ts", content: "export default {}" },
  ])
  return ws.resolve("src/models/widget.ts")
}

// Alias `@models` resolving inside the module.
const aliasInModule = moduleWithAlias({ "@models": ["./src/models"] })
// Wildcard alias `@models/*` resolving inside the module.
const aliasSubpathInModule = moduleWithAlias({ "@models/*": ["./src/models/*"] })
// Alias that points OUTSIDE the module — must still be flagged.
const aliasOutsideModule = moduleWithAlias({
  "@external": ["../../other-module/src/models"],
})

const ruleTester = createRuleTester()

ruleTester.run("link-no-cross-module-relationship", rule, {
  valid: [
    // Same-module sibling import (relative).
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import PromotionRule from "./promotion-rule"
        export default model.define("promotion_rule_value", {
          promotion_rule: model.belongsTo(() => PromotionRule, { mappedBy: "values" }),
        })
      `,
    },
    // Parent-directory relative import (still same module).
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Promotion from "../models/promotion"
        export default model.define("campaign", {
          promotions: model.hasMany(() => Promotion, {}),
        })
      `,
    },
    // Block body with single return + relative import.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Promotion from "./promotion"
        export default model.define("campaign", {
          promotions: model.hasMany(() => { return Promotion }, {}),
        })
      `,
    },
    // Aliased model import + relative.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        import Item from "./item"
        export default m.define("order", {
          items: m.hasMany(() => Item, {}),
        })
      `,
    },
    // Generic type arg + relative.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Order from "./order"
        export default model.define("order_change", {
          order: model.belongsTo<() => typeof Order>(() => Order, {}),
        })
      `,
    },
    // Non-framework `model` import — out of scope.
    {
      code: `
        import { model } from "some-other-lib"
        import Other from "@medusajs/other/models/other"
        export default model.define("x", {
          other: model.belongsTo(() => Other, {}),
        })
      `,
    },
    // Non-relationship method — ignored.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export default model.define("x", {
          name: model.text(),
        })
      `,
    },
    // Relative import that stays inside the module (sibling models/ dir).
    {
      filename: "/repo/src/modules/company/models/company.ts",
      code: `
        import { model } from "@medusajs/framework/utils"
        import Office from "./office"
        export default model.define("company", {
          offices: model.hasMany(() => Office, {}),
        })
      `,
    },
    // Relative import via parent dir, still inside the module.
    {
      filename: "/repo/src/modules/company/models/nested/info.ts",
      code: `
        import { model } from "@medusajs/framework/utils"
        import Company from "../../company"
        export default model.define("info", {
          company: model.belongsTo(() => Company, {}),
        })
      `,
    },
    // Same-file declaration (not imported) — same module by definition.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const Sibling = model.define("sibling", {})
        const Parent = model.define("parent", {
          sibling: model.belongsTo(() => Sibling, {}),
        })
        export default Parent
      `,
    },
    // Path alias `@models` resolved via tsconfig — inside the same module.
    {
      filename: aliasInModule,
      code: `
        import { model } from "@medusajs/framework/utils"
        import { Part } from "@models"
        export default model.define("widget", {
          parts: model.hasMany(() => Part, { mappedBy: "widget" }),
        })
      `,
    },
    // Wildcard alias `@models/*` resolved via tsconfig — inside the module.
    {
      filename: aliasSubpathInModule,
      code: `
        import { model } from "@medusajs/framework/utils"
        import Part from "@models/part"
        export default model.define("widget", {
          parts: model.hasMany(() => Part, { mappedBy: "widget" }),
        })
      `,
    },
  ],
  invalid: [
    // belongsTo across modules.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Product from "@medusajs/medusa/product/models/product"
        export default model.define("blog_post", {
          product: model.belongsTo(() => Product, {}),
        })
      `,
      errors: [
        {
          messageId: "crossModuleRelationship",
          data: {
            method: "belongsTo",
            name: "Product",
            source: "@medusajs/medusa/product/models/product",
          },
        },
      ],
    },
    // hasMany across modules.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import { Customer } from "@medusajs/customer"
        export default model.define("loyalty", {
          customers: model.hasMany(() => Customer, {}),
        })
      `,
      errors: [{ messageId: "crossModuleRelationship" }],
    },
    // hasOne across modules.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Profile from "third-party-pkg/profile"
        export default model.define("user", {
          profile: model.hasOne(() => Profile, {}),
        })
      `,
      errors: [{ messageId: "crossModuleRelationship" }],
    },
    // manyToMany across modules.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Tag from "@scope/tags"
        export default model.define("post", {
          tags: model.manyToMany(() => Tag, {}),
        })
      `,
      errors: [{ messageId: "crossModuleRelationship" }],
    },
    // Block body with single return targeting an external import.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Other from "@medusajs/other"
        export default model.define("x", {
          other: model.belongsTo(() => { return Other }, {}),
        })
      `,
      errors: [{ messageId: "crossModuleRelationship" }],
    },
    // Aliased model import.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        import Foreign from "@medusajs/other/models/foreign"
        export default m.define("x", {
          foreign: m.belongsTo(() => Foreign, {}),
        })
      `,
      errors: [{ messageId: "crossModuleRelationship" }],
    },
    // Relative import escapes the current module via `../../<other-module>/`.
    {
      filename: "/repo/src/modules/company/models/country-company-info.ts",
      code: `
        import { model } from "@medusajs/framework/utils"
        import Post from "../../blog/models/post"
        export default model.define("country_company_info", {
          post: model.hasOne(() => Post, {}),
        })
      `,
      errors: [
        {
          messageId: "crossModuleRelationship",
          data: {
            method: "hasOne",
            name: "Post",
            source: "../../blog/models/post",
          },
        },
      ],
    },
    // Relative import escapes via `../../../<other-module>/`.
    {
      filename: "/repo/src/modules/company/models/nested/info.ts",
      code: `
        import { model } from "@medusajs/framework/utils"
        import Post from "../../../blog/models/post"
        export default model.define("info", {
          post: model.belongsTo(() => Post, {}),
        })
      `,
      errors: [
        {
          messageId: "crossModuleRelationship",
          data: {
            method: "belongsTo",
            name: "Post",
            source: "../../../blog/models/post",
          },
        },
      ],
    },
    // Unresolvable identifier (no binding in scope) — can't verify same-module.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export default model.define("x", {
          mystery: model.belongsTo(() => Mystery, {}),
        })
      `,
      errors: [
        { messageId: "unresolvableTarget", data: { method: "belongsTo" } },
      ],
    },
    // Non-identifier return (member chain) — can't verify same-module.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Other from "@medusajs/other"
        export default model.define("x", {
          ref: model.belongsTo(() => Other.foo, {}),
        })
      `,
      errors: [
        { messageId: "unresolvableTarget", data: { method: "belongsTo" } },
      ],
    },
    // Path alias resolves to a directory OUTSIDE the module — cross-module.
    {
      filename: aliasOutsideModule,
      code: `
        import { model } from "@medusajs/framework/utils"
        import { Post } from "@external"
        export default model.define("widget", {
          post: model.belongsTo(() => Post, {}),
        })
      `,
      errors: [
        {
          messageId: "crossModuleRelationship",
          data: {
            method: "belongsTo",
            name: "Post",
            source: "@external",
          },
        },
      ],
    },
    // Multiple relationships, only one is cross-module.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        import Sibling from "./sibling"
        import Foreign from "@medusajs/other/models/foreign"
        export default model.define("x", {
          sibling: model.belongsTo(() => Sibling, {}),
          foreign: model.belongsTo(() => Foreign, {}),
        })
      `,
      errors: [
        {
          messageId: "crossModuleRelationship",
          data: {
            method: "belongsTo",
            name: "Foreign",
            source: "@medusajs/other/models/foreign",
          },
        },
      ],
    },
  ],
})
