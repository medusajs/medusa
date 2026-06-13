import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("route-handler-exports-uppercase", rule, {
  valid: [
    // Uppercase arrow handler — fine.
    {
      code: `export const GET = async (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/route.ts",
    },
    // Uppercase function declaration — fine.
    {
      code: `export async function POST(req, res) { res.json({}) }`,
      filename: "src/api/admin/orders/route.ts",
    },
    // Non-HTTP-method lowercase exports — fine (helpers).
    {
      code: `export const validator = (input) => input`,
      filename: "src/api/store/products/route.ts",
    },
    // Lowercase HTTP method outside route.ts — not this rule's scope.
    // (route-file-naming handles the wrong-file case.)
    {
      code: `export const get = (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/handlers.ts",
    },
    // Lowercase HTTP-method-shaped export outside api/ — fine.
    {
      code: `export const get = () => {}`,
      filename: "src/workflows/foo.ts",
    },
    // Synthetic filename — rule bails out.
    {
      code: `export const get = (req, res) => { res.json({}) }`,
      filename: "<input>",
    },
    // Re-export with uppercase exported name — fine.
    {
      code: `
        const handler = async (req, res) => {}
        export { handler as GET }
      `,
      filename: "src/api/admin/products/route.ts",
    },
    // route.js with uppercase handler — fine.
    {
      code: `export const DELETE = (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/route.js",
    },
  ],
  invalid: [
    // Lowercase const arrow handler in route.ts — autofix uppercases the name.
    {
      code: `export const get = async (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/route.ts",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "get", upper: "GET" } },
      ],
      output: `export const GET = async (req, res) => { res.json({}) }`,
    },
    // Lowercase function-declaration handler.
    {
      code: `export async function post(req, res) { res.json({}) }`,
      filename: "src/api/admin/orders/route.ts",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "post", upper: "POST" } },
      ],
      output: `export async function POST(req, res) { res.json({}) }`,
    },
    // Multiple lowercase handlers — one error per export, all fixed.
    {
      code: `
        export const get = async (req, res) => {}
        export const post = async (req, res) => {}
      `,
      filename: "src/api/store/products/route.ts",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "get", upper: "GET" } },
        { messageId: "lowercaseHandler", data: { name: "post", upper: "POST" } },
      ],
      output: `
        export const GET = async (req, res) => {}
        export const POST = async (req, res) => {}
      `,
    },
    // Re-export with lowercase exported name.
    {
      code: `
        const handler = async (req, res) => {}
        export { handler as get }
      `,
      filename: "src/api/admin/products/route.ts",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "get", upper: "GET" } },
      ],
      output: `
        const handler = async (req, res) => {}
        export { handler as GET }
      `,
    },
    // All seven HTTP methods.
    {
      code: `
        export const get = (req, res) => {}
        export const post = (req, res) => {}
        export const put = (req, res) => {}
        export const patch = (req, res) => {}
        export const del = (req, res) => {}
        export { del as delete }
        export const head = (req, res) => {}
        export const options = (req, res) => {}
      `,
      filename: "src/api/admin/things/route.ts",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "get", upper: "GET" } },
        { messageId: "lowercaseHandler", data: { name: "post", upper: "POST" } },
        { messageId: "lowercaseHandler", data: { name: "put", upper: "PUT" } },
        { messageId: "lowercaseHandler", data: { name: "patch", upper: "PATCH" } },
        { messageId: "lowercaseHandler", data: { name: "delete", upper: "DELETE" } },
        { messageId: "lowercaseHandler", data: { name: "head", upper: "HEAD" } },
        { messageId: "lowercaseHandler", data: { name: "options", upper: "OPTIONS" } },
      ],
      output: `
        export const GET = (req, res) => {}
        export const POST = (req, res) => {}
        export const PUT = (req, res) => {}
        export const PATCH = (req, res) => {}
        export const del = (req, res) => {}
        export { del as DELETE }
        export const HEAD = (req, res) => {}
        export const OPTIONS = (req, res) => {}
      `,
    },
    // route.js variant.
    {
      code: `export const get = (req, res) => { res.json({}) }`,
      filename: "src/api/store/cart/route.js",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "get", upper: "GET" } },
      ],
      output: `export const GET = (req, res) => { res.json({}) }`,
    },
    // Nested api/ path without src/.
    {
      code: `export const delete_ = async (req, res) => {}
export { delete_ as delete }`,
      filename: "api/admin/orders/route.ts",
      errors: [
        { messageId: "lowercaseHandler", data: { name: "delete", upper: "DELETE" } },
      ],
      output: `export const delete_ = async (req, res) => {}
export { delete_ as DELETE }`,
    },
  ],
})
