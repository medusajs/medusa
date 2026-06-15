import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const WIDGET = "src/admin/widgets/my-widget.tsx"
const UI_ROUTE = "src/admin/routes/custom/page.tsx"

ruleTester.run("admin-component-must-be-arrow-function", rule, {
  valid: [
    // Arrow function const default-exported via identifier — widget.
    {
      code: `const Widget = () => null\nexport default Widget`,
      filename: WIDGET,
    },
    // Anonymous arrow default-exported inline — widget.
    {
      code: `export default () => null`,
      filename: WIDGET,
    },
    // Arrow function in UI route page.
    {
      code: `const Page = () => null\nexport default Page`,
      filename: UI_ROUTE,
    },
    // Function declaration in a non-admin file — rule is a no-op.
    {
      code: `export default function Foo() { return null }`,
      filename: "src/api/admin/products/route.ts",
    },
    // Function declaration in nested admin route that isn't page.tsx — out of scope.
    {
      code: `export default function Foo() { return null }`,
      filename: "src/admin/routes/custom/other.tsx",
    },
    // Widget without default-exported component.
    {
      code: `export const config = {}`,
      filename: WIDGET,
    },
    // Async arrow function.
    {
      code: `const Widget = async () => null\nexport default Widget`,
      filename: WIDGET,
    },
  ],
  invalid: [
    // Named function declaration default-exported inline in widget.
    {
      code: `export default function MyWidget() { return null }`,
      output: `const MyWidget = () => { return null }\nexport default MyWidget`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeArrowFunction" }],
    },
    // Anonymous function declaration default-exported in widget.
    {
      code: `export default function () { return null }`,
      output: `export default () => { return null }`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeArrowFunction" }],
    },
    // Function declaration referenced by default-export identifier in widget.
    {
      code: `function MyWidget() { return null }\nexport default MyWidget`,
      output: `const MyWidget = () => { return null }\nexport default MyWidget`,
      filename: WIDGET,
      errors: [{ messageId: "mustBeArrowFunction" }],
    },
    // Async function declaration in UI route page.
    {
      code: `export default async function Page() { return null }`,
      output: `const Page = async () => { return null }\nexport default Page`,
      filename: UI_ROUTE,
      errors: [{ messageId: "mustBeArrowFunction" }],
    },
    // Function declaration in UI route page with params.
    {
      code: `export default function Page({ notify }) { return null }`,
      output: `const Page = ({ notify }) => { return null }\nexport default Page`,
      filename: UI_ROUTE,
      errors: [{ messageId: "mustBeArrowFunction" }],
    },
    // Detect under non-src prefix (e.g. when ESLint runs from a sub-cwd).
    {
      code: `export default function MyWidget() { return null }`,
      output: `const MyWidget = () => { return null }\nexport default MyWidget`,
      filename: "admin/widgets/my-widget.tsx",
      errors: [{ messageId: "mustBeArrowFunction" }],
    },
  ],
})
