import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const WIDGET = "src/admin/widgets/my-widget.tsx"

ruleTester.run("widget-must-have-default-export", rule, {
  valid: [
    // Default export of an arrow function component.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const MyWidget = () => null
export const config = defineWidgetConfig({ zone: "product.details.before" })
export default MyWidget`,
      filename: WIDGET,
    },
    // Inline default export.
    {
      code: `export default () => null`,
      filename: WIDGET,
    },
    // Default re-export via specifier (`export { X as default }`).
    {
      code: `const MyWidget = () => null
export { MyWidget as default }`,
      filename: WIDGET,
    },
    // Default re-export from another module.
    {
      code: `export { default } from "./widget-impl"`,
      filename: WIDGET,
    },
  ],
  invalid: [
    // No exports at all.
    {
      code: `const MyWidget = () => null`,
      filename: WIDGET,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Only a named export, no default.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const MyWidget = () => null
export const config = defineWidgetConfig({ zone: "product.details.before" })
export { MyWidget }`,
      filename: WIDGET,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Named export of the component, but no default.
    {
      code: `export const MyWidget = () => null`,
      filename: WIDGET,
      errors: [{ messageId: "missingDefaultExport" }],
    },
  ],
})
