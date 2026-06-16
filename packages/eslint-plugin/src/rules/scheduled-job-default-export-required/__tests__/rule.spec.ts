import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const JOB = "src/jobs/sync-products.ts"

ruleTester.run("scheduled-job-default-export-required", rule, {
  valid: [
    // Default export of the job function.
    {
      code: `export default async function syncProducts() {}
export const config = { name: "sync-products", schedule: "0 0 * * *" }`,
      filename: JOB,
    },
    // Inline default export.
    {
      code: `export default async () => {}`,
      filename: JOB,
    },
    // Default re-export via specifier (`export { X as default }`).
    {
      code: `const job = async () => {}
export { job as default }`,
      filename: JOB,
    },
    // Default re-export from another module.
    {
      code: `export { default } from "./sync-products-impl"`,
      filename: JOB,
    },
  ],
  invalid: [
    // No exports at all.
    {
      code: `const job = async () => {}`,
      filename: JOB,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Only a named export, no default.
    {
      code: `export const config = { name: "sync-products", schedule: "0 0 * * *" }
const job = async () => {}
export { job }`,
      filename: JOB,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Named export of the job, but no default.
    {
      code: `export const syncProducts = async () => {}`,
      filename: JOB,
      errors: [{ messageId: "missingDefaultExport" }],
    },
  ],
})
