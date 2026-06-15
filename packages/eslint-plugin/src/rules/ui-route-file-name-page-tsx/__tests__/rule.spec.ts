import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const PAGE = "src/admin/routes/custom/page.tsx"
const MISNAMED = "src/admin/routes/custom/custom.tsx"

ruleTester.run("ui-route-file-name-page-tsx", rule, {
  valid: [
    // Properly named page.tsx that uses defineRouteConfig.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => <div />
export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: PAGE,
    },
    // File not under admin/routes — out of scope.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
export const config = defineRouteConfig({ label: "Custom" })
export default () => <div />`,
      filename: "src/lib/helpers.tsx",
    },
    // Misnamed file with a default-exported component but no defineRouteConfig call.
    {
      code: `const CustomPage = () => <div />
export default CustomPage`,
      filename: MISNAMED,
    },
    // Misnamed file that imports defineRouteConfig but never calls it.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
export default () => <div />`,
      filename: MISNAMED,
    },
    // defineRouteConfig identifier from an unrelated package — not flagged.
    {
      code: `import { defineRouteConfig } from "some-other-pkg"
export const config = defineRouteConfig({ label: "Custom" })
export default () => <div />`,
      filename: MISNAMED,
    },
  ],
  invalid: [
    // Misnamed file calls defineRouteConfig from admin-sdk.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => <div />
export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: MISNAMED,
      errors: [{ messageId: "wrongFileName" }],
    },
    // Aliased import — still tracked.
    {
      code: `import { defineRouteConfig as drc } from "@medusajs/admin-sdk"
export const config = drc({ label: "Custom" })
export default () => <div />`,
      filename: MISNAMED,
      errors: [{ messageId: "wrongFileName" }],
    },
    // Bare `admin/routes/...` path (no `src/`).
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
export const config = defineRouteConfig({ label: "Custom" })
export default () => <div />`,
      filename: "admin/routes/custom/custom.tsx",
      errors: [{ messageId: "wrongFileName" }],
    },
    // Nested misnamed file.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
export const config = defineRouteConfig({ label: "Sub" })
export default () => <span />`,
      filename: "src/admin/routes/custom/sub-page.tsx",
      errors: [{ messageId: "wrongFileName" }],
    },
  ],
})
