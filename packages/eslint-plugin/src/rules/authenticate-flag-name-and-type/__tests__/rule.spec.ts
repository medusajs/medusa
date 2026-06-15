import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("authenticate-flag-name-and-type", rule, {
  valid: [
    // Canonical AUTHENTICATE = false.
    {
      code: `export const AUTHENTICATE = false`,
      filename: "src/api/store/customers/me/route.ts",
    },
    // AUTHENTICATE = true also fine.
    {
      code: `export const AUTHENTICATE = true`,
      filename: "src/api/admin/products/route.ts",
    },
    // No AUTHENTICATE export — fine.
    {
      code: `export const GET = (req, res) => { res.json({}) }`,
      filename: "src/api/store/products/route.ts",
    },
    // Unrelated lowercase identifier (not "authenticate") — fine.
    {
      code: `export const validator = (input) => input`,
      filename: "src/api/store/products/route.ts",
    },
    // Wrong-case name outside route.ts — not this rule's scope.
    {
      code: `export const authenticate = false`,
      filename: "src/api/store/products/handlers.ts",
    },
    // Outside api/ — fine.
    {
      code: `export const authenticate = "no"`,
      filename: "src/workflows/foo.ts",
    },
    // Synthetic filename — rule bails out.
    {
      code: `export const authenticate = false`,
      filename: "<input>",
    },
    // route.js with canonical AUTHENTICATE.
    {
      code: `export const AUTHENTICATE = false`,
      filename: "src/api/store/products/route.js",
    },
  ],
  invalid: [
    // Lowercase `authenticate` — autofix renames to AUTHENTICATE.
    {
      code: `export const authenticate = false`,
      filename: "src/api/store/customers/me/route.ts",
      errors: [
        { messageId: "wrongCase", data: { name: "authenticate" } },
      ],
      output: `export const AUTHENTICATE = false`,
    },
    // PascalCase `Authenticate` — autofix renames.
    {
      code: `export const Authenticate = true`,
      filename: "src/api/admin/products/route.ts",
      errors: [
        { messageId: "wrongCase", data: { name: "Authenticate" } },
      ],
      output: `export const AUTHENTICATE = true`,
    },
    // AUTHENTICATE with string value — flag value, no autofix on the value.
    {
      code: `export const AUTHENTICATE = "false"`,
      filename: "src/api/store/customers/me/route.ts",
      errors: [{ messageId: "nonBooleanValue" }],
      output: null,
    },
    // AUTHENTICATE with number value.
    {
      code: `export const AUTHENTICATE = 0`,
      filename: "src/api/store/customers/me/route.ts",
      errors: [{ messageId: "nonBooleanValue" }],
      output: null,
    },
    // AUTHENTICATE with identifier (non-literal).
    {
      code: `const flag = false
export const AUTHENTICATE = flag`,
      filename: "src/api/admin/products/route.ts",
      errors: [{ messageId: "nonBooleanValue" }],
      output: null,
    },
    // Re-export with wrong-case exported name.
    {
      code: `
        const flag = false
        export { flag as authenticate }
      `,
      filename: "src/api/store/customers/me/route.ts",
      errors: [{ messageId: "wrongCase", data: { name: "authenticate" } }],
      output: `
        const flag = false
        export { flag as AUTHENTICATE }
      `,
    },
    // route.js variant.
    {
      code: `export const authenticate = false`,
      filename: "src/api/store/cart/route.js",
      errors: [{ messageId: "wrongCase", data: { name: "authenticate" } }],
      output: `export const AUTHENTICATE = false`,
    },
    // Nested api/ path without src/.
    {
      code: `export const Authenticate = false`,
      filename: "api/admin/orders/route.ts",
      errors: [{ messageId: "wrongCase", data: { name: "Authenticate" } }],
      output: `export const AUTHENTICATE = false`,
    },
  ],
})
