import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const JOB = "src/jobs/sync-products.ts"

ruleTester.run("scheduled-job-schedule-valid-cron", rule, {
  valid: [
    // Standard 5-field cron.
    {
      code: `export const config = { name: "daily", schedule: "0 0 * * *" }`,
      filename: JOB,
    },
    // Every minute.
    {
      code: `export const config = { name: "every-minute", schedule: "* * * * *" }`,
      filename: JOB,
    },
    // Step and range syntax.
    {
      code: `export const config = { name: "weekdays", schedule: "*/15 9-17 * * 1-5" }`,
      filename: JOB,
    },
    // Named day-of-week.
    {
      code: `export const config = { name: "monday", schedule: "0 0 * * MON" }`,
      filename: JOB,
    },
    // Predefined alias.
    {
      code: `export const config = { name: "daily-alias", schedule: "@daily" }`,
      filename: JOB,
    },
    // Interval-based schedule — not a cron string, so nothing to validate.
    {
      code: `export const config = { name: "interval", schedule: { interval: 60000 } }`,
      filename: JOB,
    },
    // Schedule resolved through a const string identifier.
    {
      code: `const SCHEDULE = "0 0 * * *"
export const config = { name: "daily", schedule: SCHEDULE }`,
      filename: JOB,
    },
    // Schedule value can't be resolved statically — skip (no false positive).
    {
      code: `export const config = { name: "daily", schedule: buildSchedule() }`,
      filename: JOB,
    },
    // No schedule property — presence is enforced by scheduled-job-config-required.
    {
      code: `export const config = { name: "daily" }`,
      filename: JOB,
    },
    // No resolvable config object — nothing to validate.
    {
      code: `export { config } from "./shared-config"`,
      filename: JOB,
    },
    // Config resolved through a separate declaration + specifier export.
    {
      code: `const config = { name: "daily", schedule: "0 0 * * *" }
export { config }`,
      filename: JOB,
    },
  ],
  invalid: [
    // Gibberish.
    {
      code: `export const config = { name: "daily", schedule: "not-a-cron" }`,
      filename: JOB,
      errors: [{ messageId: "invalidCron" }],
    },
    // Out-of-range values.
    {
      code: `export const config = { name: "daily", schedule: "99 99 99 99 99" }`,
      filename: JOB,
      errors: [{ messageId: "invalidCron" }],
    },
    // Single out-of-range field (minutes max 59).
    {
      code: `export const config = { name: "daily", schedule: "60 * * * *" }`,
      filename: JOB,
      errors: [{ messageId: "invalidCron" }],
    },
    // Too few fields.
    {
      code: `export const config = { name: "daily", schedule: "0 0 * *" }`,
      filename: JOB,
      errors: [{ messageId: "invalidCron" }],
    },
    // Invalid cron resolved through a const string identifier.
    {
      code: `const SCHEDULE = "every day"
export const config = { name: "daily", schedule: SCHEDULE }`,
      filename: JOB,
      errors: [{ messageId: "invalidCron" }],
    },
    // Invalid cron in a config exported via specifier.
    {
      code: `const config = { name: "daily", schedule: "bad" }
export { config }`,
      filename: JOB,
      errors: [{ messageId: "invalidCron" }],
    },
  ],
})
