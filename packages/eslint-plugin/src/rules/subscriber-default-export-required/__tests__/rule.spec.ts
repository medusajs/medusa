import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

const SUBSCRIBER = "src/subscribers/order-placed.ts"

ruleTester.run("subscriber-default-export-required", rule, {
  valid: [
    // Default export of the subscriber function.
    {
      code: `import type { SubscriberConfig } from "@medusajs/framework"
export default async function orderPlacedHandler() {}
export const config: SubscriberConfig = { event: "order.placed" }`,
      filename: SUBSCRIBER,
    },
    // Inline default export.
    {
      code: `export default async () => {}`,
      filename: SUBSCRIBER,
    },
    // Default re-export via specifier (`export { X as default }`).
    {
      code: `const handler = async () => {}
export { handler as default }`,
      filename: SUBSCRIBER,
    },
    // Default re-export from another module.
    {
      code: `export { default } from "./order-placed-impl"`,
      filename: SUBSCRIBER,
    },
  ],
  invalid: [
    // No exports at all.
    {
      code: `const handler = async () => {}`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Only a named export, no default.
    {
      code: `export const config = { event: "order.placed" }
const handler = async () => {}
export { handler }`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingDefaultExport" }],
    },
    // Named export of the handler, but no default.
    {
      code: `export const orderPlacedHandler = async () => {}`,
      filename: SUBSCRIBER,
      errors: [{ messageId: "missingDefaultExport" }],
    },
  ],
})
