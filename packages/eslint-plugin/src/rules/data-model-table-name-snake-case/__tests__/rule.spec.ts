import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("data-model-table-name-snake-case", rule, {
  valid: [
    // snake_case name
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", { id: model.id().primaryKey() })
      `,
    },
    // Multi-word snake_case.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("product_media", { id: model.id().primaryKey() })
      `,
    },
    // Digits allowed (not at start).
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const M = model.define("brand_v2", { id: model.id().primaryKey() })
      `,
    },
    // Identifier referencing a const snake_case string — resolved and accepted.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const NAME = "brand"
        export const Brand = model.define(NAME, { id: model.id().primaryKey() })
      `,
    },
    // Identifier whose init is non-literal — cannot resolve, skip.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const NAME = getName()
        export const Brand = model.define(NAME, {})
      `,
    },
    // \`model\` imported from somewhere else — should not flag.
    {
      code: `
        import { model } from "some-other-lib"
        export const Brand = model.define("BadName", {})
      `,
    },
    // Aliased import — unaliased identifier should not match.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        export const Brand = m.define("brand", {})
      `,
    },
    // Method call on `model` for something other than `define` should not flag.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const col = model.text()
      `,
    },
  ],
  invalid: [
    // Dash-separated — autofix to snake_case.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("my-brand", {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("my_brand", {})
      `,
    },
    // camelCase — autofix.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const ProductMedia = model.define("productMedia", {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const ProductMedia = model.define("product_media", {})
      `,
    },
    // PascalCase — autofix.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("BrandModel", {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand_model", {})
      `,
    },
    // Consecutive uppercase — handles XML-style.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const X = model.define("myXMLParser", {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const X = model.define("my_xml_parser", {})
      `,
    },
    // Uppercase — autofix.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("BRAND", {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model } from "@medusajs/framework/utils"
        export const Brand = model.define("brand", {})
      `,
    },
    // Aliased model import binding.
    {
      code: `
        import { model as m } from "@medusajs/framework/utils"
        export const Brand = m.define("my-brand", {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model as m } from "@medusajs/framework/utils"
        export const Brand = m.define("my_brand", {})
      `,
    },
    // Identifier referencing a const string with an invalid value — flagged on
    // the identifier (no autofix; only literals are rewritten).
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        const NAME = "my-brand"
        export const Brand = model.define(NAME, {})
      `,
      errors: [{ messageId: "invalidTableName" }],
    },
    // Multiple model.define calls — each flagged.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        model.define("bad-one", {})
        model.define("bad.two", {})
      `,
      errors: [
        { messageId: "invalidTableName" },
        { messageId: "invalidTableName" },
      ],
      output: `
        import { model } from "@medusajs/framework/utils"
        model.define("bad_one", {})
        model.define("bad_two", {})
      `,
    },
    // Single quotes preserved by autofix.
    {
      code: `
        import { model } from "@medusajs/framework/utils"
        model.define('my-brand', {})
      `,
      errors: [{ messageId: "invalidTableName" }],
      output: `
        import { model } from "@medusajs/framework/utils"
        model.define('my_brand', {})
      `,
    },
  ],
})
