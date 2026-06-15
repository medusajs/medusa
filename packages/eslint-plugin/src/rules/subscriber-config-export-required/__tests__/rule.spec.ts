import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

const SUBSCRIBER = "src/subscribers/order-placed.ts"

ruleTester.run("subscriber-config-export-required", rule, {
  valid: [
    // Inline config object with a string event.
    {
      code: `export default async function () {}
export const config = { event: "order.placed" }`,
      filename: SUBSCRIBER,
    },
    // Event as an array of strings.
    {
      code: `export const config = { event: ["order.placed", "order.updated"] }`,
      filename: SUBSCRIBER,
    },
    // Typed config export.
    {
      code: `import type { SubscriberConfig } from "@medusajs/framework"
export const config: SubscriberConfig = { event: "order.placed" }`,
      filename: SUBSCRIBER,
    },
    // Config declared separately, then exported by specifier.
    {
      code: `const config = { event: "order.placed" }
export { config }`,
      filename: SUBSCRIBER,
    },
    // Exported under an alias.
    {
      code: `const subscriberConfig = { event: "order.placed" }
export { subscriberConfig as config }`,
      filename: SUBSCRIBER,
    },
    // Config resolved through an identifier initializer.
    {
      code: `const base = { event: "order.placed" }
export const config = base`,
      filename: SUBSCRIBER,
    },
    // Re-export from another module — can't resolve the object, skip event check.
    {
      code: `export { config } from "./shared-config"`,
      filename: SUBSCRIBER,
    },
    // Object spreads another value — `event` might come from the spread, skip.
    {
      code: `export const config = { ...base }`,
      filename: SUBSCRIBER,
    },
    // Config initialized via a call we can't resolve — skip event check.
    {
      code: `export const config = buildConfig()`,
      filename: SUBSCRIBER,
    },
  ],
  invalid: [
    // No config export at all.
    {
      code: `export default async function () {}`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingConfigExport" }],
    },
    // Empty config object — no event.
    {
      code: `export const config = {}`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingEventProperty" }],
    },
    // Config object with other properties but no event.
    {
      code: `export const config = { context: { subscriberId: "x" } }`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingEventProperty" }],
    },
    // Config declared separately without event, exported by specifier.
    {
      code: `const config = { context: {} }
export { config }`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingEventProperty" }],
    },
    // Aliased export of an event-less config object.
    {
      code: `const subscriberConfig = {}
export { subscriberConfig as config }`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingEventProperty" }],
    },
  ],
})
