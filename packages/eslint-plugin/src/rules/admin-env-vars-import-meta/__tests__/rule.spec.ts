import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const ADMIN_WIDGET = "src/admin/widgets/product-widget.tsx"
const ADMIN_ROUTE = "src/admin/routes/custom/page.tsx"
const ADMIN_LIB = "src/admin/lib/config.ts"
const NON_ADMIN = "src/api/admin/route.ts"
const WORKFLOW = "src/workflows/do-thing.ts"

ruleTester.run("admin-env-vars-import-meta", rule, {
  valid: [
    // Admin code already using import.meta.env — the desired pattern.
    {
      code: `const url = import.meta.env.VITE_BACKEND_URL`,
      filename: ADMIN_WIDGET,
    },
    // `process.env` in an API admin route (server code) — not flagged. The
    // file lives under src/api/admin, not src/admin.
    {
      code: `export const GET = async () => { const x = process.env.SECRET }`,
      filename: NON_ADMIN,
    },
    // `process.env` in a workflow (server code) — out of scope.
    {
      code: `const x = process.env.NODE_ENV`,
      filename: WORKFLOW,
    },
    // Locally-shadowed `process` in admin code — not the Node global.
    {
      code: `const process = { env: { FOO: "bar" } }
const x = process.env.FOO`,
      filename: ADMIN_ROUTE,
    },
    // `process` as a function parameter shadow.
    {
      code: `function read(process) { return process.env }`,
      filename: ADMIN_LIB,
    },
    // Unrelated member access on an object named `process` is impossible to
    // confuse here — `env` is the only property we match. A different property
    // is still `process.<x>`, but only `process.env` is the Node env object.
    {
      code: `const v = process.platform`,
      filename: ADMIN_LIB,
    },
  ],
  invalid: [
    // Reading a var off process.env in an admin widget.
    {
      code: `const url = process.env.VITE_BACKEND_URL`,
      filename: ADMIN_WIDGET,
      output: `const url = import.meta.env.VITE_BACKEND_URL`,
      errors: [{ messageId: "useImportMetaEnv", line: 1, column: 13 }],
    },
    // Admin UI route page.
    {
      code: `const mode = process.env.NODE_ENV
const Page = () => null
export default Page`,
      filename: ADMIN_ROUTE,
      output: `const mode = import.meta.env.NODE_ENV
const Page = () => null
export default Page`,
      errors: [{ messageId: "useImportMetaEnv" }],
    },
    // Bare `process.env` access (no further property) — still flagged & fixed.
    {
      code: `const env = process.env`,
      filename: ADMIN_LIB,
      output: `const env = import.meta.env`,
      errors: [{ messageId: "useImportMetaEnv" }],
    },
    // Multiple usages in one admin file → one report each.
    {
      code: `const a = process.env.VITE_A
const b = process.env.VITE_B`,
      filename: ADMIN_LIB,
      output: `const a = import.meta.env.VITE_A
const b = import.meta.env.VITE_B`,
      errors: [
        { messageId: "useImportMetaEnv", line: 1 },
        { messageId: "useImportMetaEnv", line: 2 },
      ],
    },
    // Admin file under a nested monorepo layout (`apps/admin/src/admin/...`).
    {
      code: `const url = process.env.VITE_BACKEND_URL`,
      filename: "apps/dashboard/src/admin/widgets/x.tsx",
      output: `const url = import.meta.env.VITE_BACKEND_URL`,
      errors: [{ messageId: "useImportMetaEnv" }],
    },
  ],
})
