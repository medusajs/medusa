import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("route-file-naming", rule, {
  valid: [
    // route.ts with arrow GET handler.
    {
      code: `export const GET = async (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/route.ts",
    },
    // route.ts with function-declaration POST handler.
    {
      code: `export async function POST(req, res) { res.json({}) }`,
      filename: "src/api/admin/orders/route.ts",
    },
    // route.js variant.
    {
      code: `export const GET = (req, res) => { res.json({}) }`,
      filename: "src/api/store/cart/route.js",
    },
    // route.ts with multiple HTTP method exports.
    {
      code: `
        export const GET = async (req, res) => { res.json({}) }
        export const POST = async (req, res) => { res.json({}) }
        export const DELETE = async (req, res) => { res.json({}) }
      `,
      filename: "src/api/admin/products/route.ts",
    },
    // route.ts with re-exported handler.
    {
      code: `
        const handler = async (req, res) => { res.json({}) }
        export { handler as GET }
      `,
      filename: "src/api/admin/products/route.ts",
    },
    // route.ts with HTTP method + helpers (helpers don't need to be HTTP methods).
    {
      code: `
        export const GET = async (req, res) => { res.json({}) }
        export const validator = (input) => input
      `,
      filename: "src/api/store/products/route.ts",
    },
    // File outside api/ — rule is a no-op.
    {
      code: `export const GET = async (req, res) => { res.json({}) }`,
      filename: "src/workflows/some-file.ts",
    },
    // helpers file in api/ that does NOT export an HTTP method — fine.
    {
      code: `export const buildFilters = (req) => ({})`,
      filename: "src/api/admin/products/helpers.ts",
    },
    // Lowercase exports look like HTTP methods but aren't recognized — not flagged here.
    // (That's the job of `route-handler-exports-uppercase`.)
    {
      code: `export const get = (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/handlers.ts",
    },
    // route.ts with `export { X as GET }` from a renamed local.
    {
      code: `
        function localGet(req, res) { res.json({}) }
        export { localGet as GET }
      `,
      filename: "src/api/admin/things/route.ts",
    },
    // Synthetic filename — rule bails out.
    {
      code: `export const GET = async (req, res) => { res.json({}) }`,
      filename: "<input>",
    },
  ],
  invalid: [
    // HTTP-method export in non-route file under src/api/.
    {
      code: `export const GET = async (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/handlers.ts",
      errors: [{ messageId: "wrongFileName", data: { name: "GET" } }],
    },
    // function-declaration POST in a non-route file.
    {
      code: `export async function POST(req, res) { res.json({}) }`,
      filename: "src/api/admin/orders/post.ts",
      errors: [{ messageId: "wrongFileName", data: { name: "POST" } }],
    },
    // Multiple HTTP-method exports in a non-route file — one error per export.
    {
      code: `
        export const GET = async (req, res) => {}
        export const POST = async (req, res) => {}
      `,
      filename: "src/api/store/products/handlers.ts",
      errors: [
        { messageId: "wrongFileName", data: { name: "GET" } },
        { messageId: "wrongFileName", data: { name: "POST" } },
      ],
    },
    // Re-export of HTTP method from a non-route file.
    {
      code: `
        const handler = async (req, res) => {}
        export { handler as GET }
      `,
      filename: "src/api/store/products/handlers.ts",
      errors: [{ messageId: "wrongFileName", data: { name: "GET" } }],
    },
    // route.ts with no HTTP method exports.
    {
      code: `export const helper = () => {}`,
      filename: "src/api/store/products/route.ts",
      errors: [{ messageId: "noHttpExports" }],
    },
    // route.js with no exports at all.
    {
      code: `const x = 1`,
      filename: "src/api/store/products/route.js",
      errors: [{ messageId: "noHttpExports" }],
    },
    // Nested api/ path (no leading src/).
    {
      code: `export const DELETE = async (req, res) => {}`,
      filename: "api/admin/orders/delete-handler.ts",
      errors: [{ messageId: "wrongFileName", data: { name: "DELETE" } }],
    },
  ],
})
