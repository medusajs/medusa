import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const WIDGET = "src/admin/widgets/my-widget.tsx"

ruleTester.run("widget-must-export-config", rule, {
  valid: [
    // Standard widget: default export + named config via defineWidgetConfig.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const MyWidget = () => null
export const config = defineWidgetConfig({ zone: "product.details.before" })
export default MyWidget`,
      filename: WIDGET,
    },
    // Aliased defineWidgetConfig import.
    {
      code: `import { defineWidgetConfig as dwc } from "@medusajs/admin-sdk"
const MyWidget = () => null
export const config = dwc({ zone: "product.details.before" })
export default MyWidget`,
      filename: WIDGET,
    },
    // Re-export of config from another module — accepted (initializer unreachable).
    {
      code: `export { config } from "./widget-config"
export default () => null`,
      filename: WIDGET,
    },
    // Renamed export `foo as config`.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
const widgetConfig = defineWidgetConfig({ zone: "product.details.before" })
export { widgetConfig as config }
export default () => null`,
      filename: WIDGET,
    },
  ],
  invalid: [
    // No config export at all.
    {
      code: `const MyWidget = () => null
export default MyWidget`,
      filename: WIDGET,
      errors: [{ messageId: "missingConfigExport" }],
    },
    // Only a default export, no named config.
    {
      code: `export default () => null`,
      filename: WIDGET,
      errors: [{ messageId: "missingConfigExport" }],
    },
    // `export const config = {...}` — not a defineWidgetConfig call.
    {
      code: `export const config = { zone: "product.details.before" }
export default () => null`,
      filename: WIDGET,
      errors: [{ messageId: "configNotDefineWidgetConfig" }],
    },
    // `export const config = somethingElse(...)` — wrong function.
    {
      code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"
function buildConfig() { return { zone: "product.details.before" } }
export const config = buildConfig()
export default () => null`,
      filename: WIDGET,
      errors: [{ messageId: "configNotDefineWidgetConfig" }],
    },
    // defineWidgetConfig imported from a non-admin-sdk source — local name not tracked.
    {
      code: `import { defineWidgetConfig } from "./fake-sdk"
export const config = defineWidgetConfig({ zone: "product.details.before" })
export default () => null`,
      filename: WIDGET,
      errors: [{ messageId: "configNotDefineWidgetConfig" }],
    },
  ],
})
