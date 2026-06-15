import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const WIDGET = "src/admin/widgets/my-widget.tsx"

ruleTester.run("widget-zone-must-be-string-literal", rule, {
  valid: [
    // Plain string literal zone.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({ zone: "product.details.before" })`,
      filename: WIDGET,
    },
    // Array of string literals.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({ zone: ["product.details.before", "product.details.after"] })`,
      filename: WIDGET,
    },
    // Aliased import.
    {
      code: `import { defineWidgetConfig as dwc } from "@medusajs/admin-sdk"
export const config = dwc({ zone: "order.details.before" })`,
      filename: WIDGET,
    },
    // Call to a same-named function from a different module — out of scope.
    {
      code: `import { defineWidgetConfig } from "some-other-pkg"
export const config = defineWidgetConfig({ zone: ZONE })`,
      filename: WIDGET,
    },
    // No zone property at all — nothing to check.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({})`,
      filename: WIDGET,
    },
    // First argument is not an object literal — bail.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const opts = { zone: zoneVar }
export const config = defineWidgetConfig(opts)`,
      filename: WIDGET,
    },
  ],
  invalid: [
    // Identifier as zone.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const ZONE = "product.details.before"
export const config = defineWidgetConfig({ zone: ZONE })`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeStringLiteral" }],
    },
    // Member expression as zone.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({ zone: zones.product })`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeStringLiteral" }],
    },
    // Template literal without expressions — autofix to plain string.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({ zone: \`product.details.before\` })`,
      output: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({ zone: "product.details.before" })`,
      filename: WIDGET,
      errors: [{ messageId: "templateLiteralMustBeString" }],
    },
    // Template literal with expression — no autofix.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const x = "before"
export const config = defineWidgetConfig({ zone: \`product.details.\${x}\` })`,
      filename: WIDGET,
      errors: [{ messageId: "templateLiteralMustBeString" }],
    },
    // Array with one identifier element.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
export const config = defineWidgetConfig({ zone: ["product.details.before", ZONE] })`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeStringLiteral" }],
    },
    // Aliased import with non-literal zone.
    {
      code: `import { defineWidgetConfig as dwc } from "@medusajs/admin-sdk"
export const config = dwc({ zone: getZone() })`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeStringLiteral" }],
    },
  ],
})
