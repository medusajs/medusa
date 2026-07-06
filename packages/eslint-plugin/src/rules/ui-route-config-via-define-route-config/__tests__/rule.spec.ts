import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const PAGE = "src/admin/routes/custom/page.tsx"
const DYNAMIC_PAGE = "src/admin/routes/products/[id]/page.tsx"

ruleTester.run("ui-route-config-via-define-route-config", rule, {
  valid: [
    // config initialized via defineRouteConfig.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => null
export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: PAGE,
    },
    // Aliased defineRouteConfig import.
    {
      code: `import { defineRouteConfig as drc } from "@medusajs/admin-sdk"
const CustomPage = () => null
export const config = drc({ label: "Custom" })
export default CustomPage`,
      filename: PAGE,
    },
    // No config export at all — nothing to enforce.
    {
      code: `const CustomPage = () => null
export default CustomPage`,
      filename: PAGE,
    },
    // A non-`config` export initialized via something else is irrelevant.
    {
      code: `const CustomPage = () => null
export const label = "Custom"
export default CustomPage`,
      filename: PAGE,
    },
    // config typed but still initialized via defineRouteConfig.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
import type { RouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => null
export const config: RouteConfig = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: PAGE,
    },
    // Dynamic route — `config` doesn't apply, so a bad initializer is ignored.
    {
      code: `const CustomPage = () => null
export const config = { label: "Custom" }
export default CustomPage`,
      filename: DYNAMIC_PAGE,
    },
  ],
  invalid: [
    // config is a plain object literal — reported on the `config` variable.
    {
      code: `const CustomPage = () => null
export const config = { label: "Custom" }
export default CustomPage`,
      filename: PAGE,
      errors: [
        { messageId: "configNotDefineRouteConfig", line: 2, column: 14 },
      ],
    },
    // config is some other call expression.
    {
      code: `const buildConfig = () => ({ label: "Custom" })
const CustomPage = () => null
export const config = buildConfig()
export default CustomPage`,
      filename: PAGE,
      errors: [
        { messageId: "configNotDefineRouteConfig", line: 3, column: 14 },
      ],
    },
    // config references an identifier defined elsewhere.
    {
      code: `const routeConfig = { label: "Custom" }
const CustomPage = () => null
export const config = routeConfig
export default CustomPage`,
      filename: PAGE,
      errors: [{ messageId: "configNotDefineRouteConfig" }],
    },
    // `defineRouteConfig` not imported from the admin SDK — local shadow.
    {
      code: `const defineRouteConfig = (x) => x
const CustomPage = () => null
export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: PAGE,
      errors: [{ messageId: "configNotDefineRouteConfig" }],
    },
  ],
})
