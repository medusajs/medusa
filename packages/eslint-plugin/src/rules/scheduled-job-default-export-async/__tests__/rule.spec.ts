import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const JOB = "src/jobs/sync-products.ts"

ruleTester.run("scheduled-job-default-export-async", rule, {
  valid: [
    // Async function declaration as default export.
    {
      code: `export default async function syncProducts() {}`,
      filename: JOB,
    },
    // Async anonymous function declaration.
    {
      code: `export default async function () {}`,
      filename: JOB,
    },
    // Async arrow as default export.
    {
      code: `export default async () => {}`,
      filename: JOB,
    },
    // Async arrow assigned to a const, then default-exported by identifier.
    {
      code: `const job = async () => {}
export default job`,
      filename: JOB,
    },
    // Async function declaration referenced by identifier.
    {
      code: `async function job() {}
export default job`,
      filename: JOB,
    },
    // Async function expression assigned to a const, default-exported.
    {
      code: `const job = async function () {}
export default job`,
      filename: JOB,
    },
    // `export { job as default }` where job is async.
    {
      code: `const job = async () => {}
export { job as default }`,
      filename: JOB,
    },
    // Re-export of a default from another module — not resolvable, skipped.
    {
      code: `export { default } from "./sync-products-impl"`,
      filename: JOB,
    },
    // No default export at all — out of scope for this rule.
    {
      code: `export const config = { name: "sync-products", schedule: "* * * * *" }`,
      filename: JOB,
    },
    // Default export of a non-function value — not this rule's concern.
    {
      code: `export default 42`,
      filename: JOB,
    },
  ],
  invalid: [
    // Non-async function declaration as default export.
    {
      code: `export default function syncProducts() {}`,
      filename: JOB,
      output: `export default async function syncProducts() {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async anonymous function declaration.
    {
      code: `export default function () {}`,
      filename: JOB,
      output: `export default async function () {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async arrow as default export.
    {
      code: `export default () => {}`,
      filename: JOB,
      output: `export default async () => {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Single-param arrow without parens.
    {
      code: `export default (container) => {}`,
      filename: JOB,
      output: `export default async (container) => {}`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async arrow assigned to a const, default-exported by identifier.
    {
      code: `const job = () => {}
export default job`,
      filename: JOB,
      output: `const job = async () => {}
export default job`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async function declaration referenced by identifier.
    {
      code: `function job() {}
export default job`,
      filename: JOB,
      output: `async function job() {}
export default job`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // Non-async function expression assigned to a const.
    {
      code: `const job = function () {}
export default job`,
      filename: JOB,
      output: `const job = async function () {}
export default job`,
      errors: [{ messageId: "mustBeAsync" }],
    },
    // `export { job as default }` where job is not async.
    {
      code: `const job = () => {}
export { job as default }`,
      filename: JOB,
      output: `const job = async () => {}
export { job as default }`,
      errors: [{ messageId: "mustBeAsync" }],
    },
  ],
})
