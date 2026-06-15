import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const SUBSCRIBER = "src/subscribers/order-placed.ts"

ruleTester.run("subscriber-default-export-must-be-async", rule, {
  valid: [
    // Async function declaration as default export.
    {
      code: `export default async function orderPlacedHandler() {}`,
      filename: SUBSCRIBER,
    },
    // Async anonymous function declaration.
    {
      code: `export default async function () {}`,
      filename: SUBSCRIBER,
    },
    // Async arrow as default export.
    {
      code: `export default async () => {}`,
      filename: SUBSCRIBER,
    },
    // Async arrow assigned to a const, then default-exported by identifier.
    {
      code: `const handler = async () => {}
export default handler`,
      filename: SUBSCRIBER,
    },
    // Async function declaration referenced by identifier.
    {
      code: `async function handler() {}
export default handler`,
      filename: SUBSCRIBER,
    },
    // Async function expression assigned to a const, default-exported.
    {
      code: `const handler = async function () {}
export default handler`,
      filename: SUBSCRIBER,
    },
    // `export { handler as default }` where handler is async.
    {
      code: `const handler = async () => {}
export { handler as default }`,
      filename: SUBSCRIBER,
    },
    // Re-export of a default from another module — not resolvable, skipped.
    {
      code: `export { default } from "./order-placed-impl"`,
      filename: SUBSCRIBER,
    },
    // No default export at all — out of scope for this rule.
    {
      code: `export const config = { event: "order.placed" }`,
      filename: SUBSCRIBER,
    },
    // Default export of a non-function value — not this rule's concern.
    {
      code: `export default 42`,
      filename: SUBSCRIBER,
    },
  ],
  invalid: [
    // Non-async function declaration as default export.
    {
      code: `export default function orderPlacedHandler() {}`,
      filename: SUBSCRIBER,
      output: `export default async function orderPlacedHandler() {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async anonymous function declaration.
    {
      code: `export default function () {}`,
      filename: SUBSCRIBER,
      output: `export default async function () {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async arrow as default export.
    {
      code: `export default () => {}`,
      filename: SUBSCRIBER,
      output: `export default async () => {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Single-param arrow without parens.
    {
      code: `export default (event) => {}`,
      filename: SUBSCRIBER,
      output: `export default async (event) => {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async arrow assigned to a const, default-exported by identifier.
    {
      code: `const handler = () => {}
export default handler`,
      filename: SUBSCRIBER,
      output: `const handler = async () => {}
export default handler`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async function declaration referenced by identifier.
    {
      code: `function handler() {}
export default handler`,
      filename: SUBSCRIBER,
      output: `async function handler() {}
export default handler`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async function expression assigned to a const.
    {
      code: `const handler = function () {}
export default handler`,
      filename: SUBSCRIBER,
      output: `const handler = async function () {}
export default handler`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // `export { handler as default }` where handler is not async.
    {
      code: `const handler = () => {}
export { handler as default }`,
      filename: SUBSCRIBER,
      output: `const handler = async () => {}
export { handler as default }`,
      errors: [{ messageId: "mustBeAsync" }],
    },
  ],
})
