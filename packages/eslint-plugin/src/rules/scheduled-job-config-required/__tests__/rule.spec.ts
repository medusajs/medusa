import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const JOB = "src/jobs/sync-products.ts"

ruleTester.run("scheduled-job-config-required", rule, {
  valid: [
    // Inline config object with name and schedule.
    {
      code: `export default async function () {}
export const config = { name: "sync-products", schedule: "0 0 * * *" }`,
      filename: JOB,
    },
    // Typed config export.
    {
      code: `import type { MedusaContainer } from "@medusajs/framework/types"
export const config = { name: "daily", schedule: "* * * * *" }`,
      filename: JOB,
    },
    // Interval-based schedule: `schedule` is an object with `interval`, not a
    // cron string. The presence check is value-agnostic, so this is valid.
    {
      code: `export const config = {
  name: "greeting-every-minute",
  schedule: { interval: 60000 },
}`,
      filename: JOB,
    },
    // Config declared separately, then exported by specifier.
    {
      code: `const config = { name: "daily", schedule: "* * * * *" }
export { config }`,
      filename: JOB,
    },
    // Exported under an alias.
    {
      code: `const jobConfig = { name: "daily", schedule: "* * * * *" }
export { jobConfig as config }`,
      filename: JOB,
    },
    // Config resolved through an identifier initializer.
    {
      code: `const base = { name: "daily", schedule: "* * * * *" }
export const config = base`,
      filename: JOB,
    },
    // Re-export from another module — can't resolve the object, skip checks.
    {
      code: `export { config } from "./shared-config"`,
      filename: JOB,
    },
    // Object spreads another value — name/schedule might come from the spread.
    {
      code: `export const config = { ...base }`,
      filename: JOB,
    },
    // Spread alongside one property — the other might come from the spread.
    {
      code: `export const config = { ...base, name: "daily" }`,
      filename: JOB,
    },
    // Config initialized via a call we can't resolve — skip checks.
    {
      code: `export const config = buildConfig()`,
      filename: JOB,
    },
  ],
  invalid: [
    // No config export at all.
    {
      code: `export default async function () {}`,
      filename: JOB,
      errors: [{ messageId: "missingConfigExport" }],
    },
    // Empty config object — no name, no schedule.
    {
      code: `export const config = {}`,
      filename: JOB,
      errors: [
        { messageId: "missingNameProperty" },
        { messageId: "missingScheduleProperty" },
      ],
    },
    // Missing schedule only.
    {
      code: `export const config = { name: "daily" }`,
      filename: JOB,
      errors: [{ messageId: "missingScheduleProperty" }],
    },
    // Missing name only.
    {
      code: `export const config = { schedule: "* * * * *" }`,
      filename: JOB,
      errors: [{ messageId: "missingNameProperty" }],
    },
    // Config declared separately without schedule, exported by specifier.
    {
      code: `const config = { name: "daily" }
export { config }`,
      filename: JOB,
      errors: [{ messageId: "missingScheduleProperty" }],
    },
    // Aliased export of an empty config object.
    {
      code: `const jobConfig = {}
export { jobConfig as config }`,
      filename: JOB,
      errors: [
        { messageId: "missingNameProperty" },
        { messageId: "missingScheduleProperty" },
      ],
    },
  ],
})
