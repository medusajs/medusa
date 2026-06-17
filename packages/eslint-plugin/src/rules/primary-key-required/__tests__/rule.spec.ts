import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("primary-key-required", rule, {
  valid: [
    // id primary key.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {
          id: model.id().primaryKey(),
          title: model.text(),
        })
      `,
    },
    // text primary key.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {
          title: model.text().primaryKey(),
        })
      `,
    },
    // number primary key.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {
          views: model.number().primaryKey(),
        })
      `,
    },
    // primaryKey not at the end of the chain.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {
          id: model.id().primaryKey().nullable(),
          title: model.text(),
        })
      `,
    },
    // Aliased model import binding.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        export const Post = m.define("post", {
          id: m.id().primaryKey(),
        })
      `,
    },
    // \`model\` from another package — not flagged.
    {
      code: `
        import { model } from "some-other-lib"
        export const Post = model.define("post", {
          title: model.text(),
        })
      `,
    },
    // Non-define method — not flagged.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const col = model.text()
      `,
    },
    // Non-object second argument — skipped (can't analyze).
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const schema = { id: model.id().primaryKey() }
        export const Post = model.define("post", schema)
      `,
    },
    // Spread in schema — primary key could come from the spread, so skipped.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const base = { id: model.id().primaryKey() }
        export const Post = model.define("post", {
          ...base,
          title: model.text(),
        })
      `,
    },
  ],
  invalid: [
    // No primary key on any property.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {
          title: model.text(),
          views: model.number(),
        })
      `,
      errors: [{ messageId: "missingPrimaryKey", data: { name: '"post"' } }],
    },
    // Empty schema — no primary key.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {})
      `,
      errors: [{ messageId: "missingPrimaryKey", data: { name: '"post"' } }],
    },
    // \`id\` property without \`.primaryKey()\`.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Post = model.define("post", {
          id: model.id(),
          title: model.text(),
        })
      `,
      errors: [{ messageId: "missingPrimaryKey", data: { name: '"post"' } }],
    },
    // Aliased model import without a primary key.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        export const Post = m.define("post", {
          title: m.text(),
        })
      `,
      errors: [{ messageId: "missingPrimaryKey", data: { name: '"post"' } }],
    },
  ],
})
