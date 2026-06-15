import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const STATIC_PAGE = "src/admin/routes/custom/page.tsx"
const DYNAMIC_PAGE = "src/admin/routes/products/[id]/page.tsx"
const NESTED_DYNAMIC_PAGE = "src/admin/routes/products/[id]/edit/[step]/page.tsx"
const DYNAMIC_PAGE_NO_SRC = "admin/routes/orders/[id]/page.tsx"

ruleTester.run("no-config-on-dynamic-ui-route", rule, {
  valid: [
    // Static (non-dynamic) route — defineRouteConfig is fine here.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const CustomPage = () => null
export const config = defineRouteConfig({ label: "Custom" })
export default CustomPage`,
      filename: STATIC_PAGE,
    },
    // Dynamic route with NO config at all — nothing to flag.
    {
      code: `const ProductPage = () => null
export default ProductPage`,
      filename: DYNAMIC_PAGE,
    },
    // Dynamic route with a plain-object `config` (not defineRouteConfig) — out
    // of scope for this rule; it only targets the defineRouteConfig helper.
    {
      code: `const ProductPage = () => null
export const config = { label: "Product" }
export default ProductPage`,
      filename: DYNAMIC_PAGE,
    },
    // `defineRouteConfig` is a local shadow, not the admin SDK import.
    {
      code: `const defineRouteConfig = (x) => x
const ProductPage = () => null
export const config = defineRouteConfig({ label: "Product" })
export default ProductPage`,
      filename: DYNAMIC_PAGE,
    },
  ],
  invalid: [
    // Dynamic route exporting config via defineRouteConfig — reported on the call.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const ProductPage = () => null
export const config = defineRouteConfig({ label: "Product" })
export default ProductPage`,
      filename: DYNAMIC_PAGE,
      errors: [{ messageId: "configOnDynamicRoute", line: 3, column: 23 }],
    },
    // The variable name doesn't matter — any defineRouteConfig usage is flagged.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const ProductPage = () => null
export const routeConfig = defineRouteConfig({ label: "Product" })
export default ProductPage`,
      filename: DYNAMIC_PAGE,
      errors: [{ messageId: "configOnDynamicRoute" }],
    },
    // Not exported at all — still a pointless defineRouteConfig call on a
    // dynamic route.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const ProductPage = () => null
const config = defineRouteConfig({ label: "Product" })
export default ProductPage`,
      filename: DYNAMIC_PAGE,
      errors: [{ messageId: "configOnDynamicRoute" }],
    },
    // Aliased defineRouteConfig import.
    {
      code: `import { defineRouteConfig as drc } from "@medusajs/admin-sdk"
const ProductPage = () => null
export const config = drc({ label: "Product" })
export default ProductPage`,
      filename: DYNAMIC_PAGE,
      errors: [{ messageId: "configOnDynamicRoute" }],
    },
    // Nested dynamic segment deeper in the path.
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const StepPage = () => null
export const config = defineRouteConfig({ label: "Step" })
export default StepPage`,
      filename: NESTED_DYNAMIC_PAGE,
      errors: [{ messageId: "configOnDynamicRoute" }],
    },
    // Bare `admin/routes/...` layout (no `src/` prefix).
    {
      code: `import { defineRouteConfig } from "@medusajs/admin-sdk"
const OrderPage = () => null
export const config = defineRouteConfig({ label: "Order" })
export default OrderPage`,
      filename: DYNAMIC_PAGE_NO_SRC,
      errors: [{ messageId: "configOnDynamicRoute" }],
    },
  ],
})
