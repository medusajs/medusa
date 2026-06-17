import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-reserved-default-properties-in-model", rule, {
  valid: [
    // Schema with no reserved properties.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          name: model.text(),
        })
      `,
    },
    // Empty schema.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {})
      `,
    },
    // \`model\` from another package — not flagged.
    {
      code: `
        import { model } from "some-other-lib"
        export const Brand = model.define("brand", {
          created_at: model.dateTime(),
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
    // Non-object second argument — skipped.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const schema = { created_at: model.dateTime() }
        export const Brand = model.define("brand", schema)
      `,
    },
    // Computed key matching reserved name — not flagged (out of scope).
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const K = "created_at"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          [K]: model.dateTime(),
        })
      `,
    },
    // Property named "id" is NOT reserved — users must define it themselves.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
    },
  ],
  invalid: [
    // Single reserved property — autofix removes it.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          created_at: model.dateTime(),
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "created_at" } },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
    },
    // updated_at — autofix.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          updated_at: model.dateTime(),
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "updated_at" } },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
    },
    // deleted_at — autofix.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          deleted_at: model.dateTime(),
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "deleted_at" } },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
    },
    // All three reserved properties — each flagged. (Multi-pass autofix
    // converges to a clean schema; one-pass output not asserted because
    // ESLint skips adjacent-range fixes.)
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          created_at: model.dateTime(),
          updated_at: model.dateTime(),
          deleted_at: model.dateTime(),
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "created_at" } },
        { messageId: "reservedDefaultProperty", data: { name: "updated_at" } },
        { messageId: "reservedDefaultProperty", data: { name: "deleted_at" } },
      ],
      output: [
        `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          updated_at: model.dateTime(),
        })
      `,
        `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
      ],
    },
    // String-literal key — flagged.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          "created_at": model.dateTime(),
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "created_at" } },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
    },
    // Aliased model import binding.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        export const Brand = m.define("brand", {
          id: m.id().primaryKey(),
          created_at: m.dateTime(),
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "created_at" } },
      ],
      output: `
        import { model as m } from "@medusajs/framework/utils"
        export const Brand = m.define("brand", {
          id: m.id().primaryKey(),
        })
      `,
    },
    // No trailing comma on reserved property — comma after prev property is preserved.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
          created_at: model.dateTime()
        })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "created_at" } },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {
          id: model.id().primaryKey(),
        })
      `,
    },
    // Sole property — just remove it.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", { created_at: model.dateTime() })
      `,
      errors: [
        { messageId: "reservedDefaultProperty", data: { name: "created_at" } },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {})
      `,
    },
  ],
})
