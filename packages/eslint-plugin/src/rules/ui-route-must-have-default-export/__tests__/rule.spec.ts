import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const PAGE = "src/admin/routes/custom/page.tsx"

ruleTester.run("ui-route-must-have-default-export", rule, {
  valid: [
    // Default export of an arrow function component.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => null
export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: PAGE,
    },
    // Inline default export.
    {
      code: `export default () => null`,
      filename: PAGE,
    },
    // Default re-export via specifier (`export { X as default }`).
    {
      code: `const CustomPage = () => null
export { CustomPage as default }`,
      filename: PAGE,
    },
    // Default re-export from another module.
    {
      code: `export { default } from "./page-impl"`,
      filename: PAGE,
    },
  ],
  invalid: [
    // No exports at all.
    {
      code: `const CustomPage = () => null`,
      filename: PAGE,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Only a named export, no default.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => null
export const config = defineRouteConfig({ label: "Custom" })
export { CustomPage }`,
      filename: PAGE,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Named export of the component, but no default.
    {
      code: `export const CustomPage = () => null`,
      filename: PAGE,
      errors: [{ messageId: "missingDefaultExport" }],
    },
  ],
})
