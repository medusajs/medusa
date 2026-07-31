import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("prefer-workflow-event-over-module-event", rule, {
  valid: [
    // Workflow enum member in `config.event` — the desired form.
    {
      code: `
        import { ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
        export const config = {
          event: ProductCategoryWorkflowEvents.DELETED,
        }
      `,
    },
    // Literal that names a workflow event value.
    {
      code: `export const config = { event: "order.placed" }`,
    },
    // Array of workflow-event literals.
    {
      code: `export const config = { event: ["cart.created", "cart.updated"] }`,
    },
    // A custom event
    {
      code: `export const config = { event: "my-custom.event" }`,
    },
    // An internal `*Events` enum whose value is `{module}.{action}` (no
    // data-model segment) is NOT an internal service event — not flagged.
    {
      code: `
        import { AuthEvents } from "@medusajs/framework/utils"
        export const config = { event: AuthEvents.MFA_ENABLED }
      `,
    },
    // Not a subscriber config
    {
      code: `
        import { ProductEvents } from "@medusajs/framework/utils"
        emitEvent(ProductEvents.PRODUCT_CATEGORY_DELETED)
      `,
    },
    // `config` without an `event` property
    {
      code: `export const config = { context: { subscriberId: "x" } }`,
    },
    // Dynamically-computed event list skipped
    {
      code: `
        const handlers = []
        export const config = { event: handlers.map((h) => h.event) }
      `,
    },
    // A locally-declared object that shares the enum name
    {
      code: `
        const ProductEvents = { PRODUCT_CATEGORY_DELETED: "x" }
        export const config = { event: ProductEvents.PRODUCT_CATEGORY_DELETED }
      `,
    },
  ],
  invalid: [
    // Named import — rewrite the access and add the workflow enum import.
    {
      code: `
import { ProductEvents } from "@medusajs/framework/utils"
export const config = {
  event: ProductEvents.PRODUCT_CATEGORY_DELETED,
}
      `,
      errors: [
        {
          messageId: "preferWorkflowEvent",
          data: {
            source: "ProductEvents.PRODUCT_CATEGORY_DELETED",
            target: "ProductCategoryWorkflowEvents.DELETED",
          },
        },
      ],
      output: `
import { ProductEvents, ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
export const config = {
  event: ProductCategoryWorkflowEvents.DELETED,
}
      `,
    },
    // Aliased named import — append after the last specifier, rewrite the usage.
    {
      code: `
import { ProductEvents as PE } from "@medusajs/framework/utils"
export const config = { event: PE.PRODUCT_CATEGORY_DELETED }
      `,
      errors: [{ messageId: "preferWorkflowEvent" }],
      output: `
import { ProductEvents as PE, ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
export const config = { event: ProductCategoryWorkflowEvents.DELETED }
      `,
    },
    // Namespace import — keep the namespace prefix, no import change.
    {
      code: `
import * as utils from "@medusajs/framework/utils"
export const config = { event: utils.ProductEvents.PRODUCT_CATEGORY_DELETED }
      `,
      errors: [{ messageId: "preferWorkflowEvent" }],
      output: `
import * as utils from "@medusajs/framework/utils"
export const config = { event: utils.ProductCategoryWorkflowEvents.DELETED }
      `,
    },
    // Computed member access is normalized to dot access.
    {
      code: `
import { ProductEvents } from "@medusajs/framework/utils"
export const config = { event: ProductEvents["PRODUCT_CATEGORY_DELETED"] }
      `,
      errors: [{ messageId: "preferWorkflowEvent" }],
      output: `
import { ProductEvents, ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
export const config = { event: ProductCategoryWorkflowEvents.DELETED }
      `,
    },
    // Literal internal-event value — same map lookup, fixed to the enum with a
    // fresh import added.
    {
      code: `export const config = { event: "product.product-category.deleted" }`,
      errors: [
        {
          messageId: "preferWorkflowEvent",
          data: {
            source: `"product.product-category.deleted"`,
            target: "ProductCategoryWorkflowEvents.DELETED",
          },
        },
      ],
      output: `import { ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
export const config = { event: ProductCategoryWorkflowEvents.DELETED }`,
    },
    // A different module enum with a workflow equivalent.
    {
      code: `
import { UserEvents } from "@medusajs/framework/utils"
export const config = { event: UserEvents.USER_CREATED }
      `,
      errors: [
        {
          messageId: "preferWorkflowEvent",
          data: {
            source: "UserEvents.USER_CREATED",
            target: "UserWorkflowEvents.CREATED",
          },
        },
      ],
      output: `
import { UserEvents, UserWorkflowEvents } from "@medusajs/framework/utils"
export const config = { event: UserWorkflowEvents.CREATED }
      `,
    },
    // Internal event inside an array — only that entry is flagged and fixed.
    {
      code: `
import { ProductEvents } from "@medusajs/framework/utils"
export const config = { event: ["order.placed", ProductEvents.PRODUCT_CATEGORY_DELETED] }
      `,
      errors: [{ messageId: "preferWorkflowEvent" }],
      output: `
import { ProductEvents, ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
export const config = { event: ["order.placed", ProductCategoryWorkflowEvents.DELETED] }
      `,
    },
    // `config` declared separately and exported by specifier.
    {
      code: `
import { ProductEvents } from "@medusajs/framework/utils"
const config = { event: ProductEvents.PRODUCT_CATEGORY_DELETED }
export { config }
      `,
      errors: [{ messageId: "preferWorkflowEvent" }],
      output: `
import { ProductEvents, ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
const config = { event: ProductCategoryWorkflowEvents.DELETED }
export { config }
      `,
    },
    // Internal service event with NO workflow equivalent (enum form) — warn, no fix.
    {
      code: `
import { FulfillmentEvents } from "@medusajs/framework/utils"
export const config = { event: FulfillmentEvents.FULFILLMENT_SET_CREATED }
      `,
      errors: [
        {
          messageId: "internalModuleEvent",
          data: { source: "FulfillmentEvents.FULFILLMENT_SET_CREATED" },
        },
      ],
      output: null,
    },
    // Internal service event with NO workflow equivalent (literal form) — warn, no fix.
    {
      code: `export const config = { event: "fulfillment.fulfillment-set.created" }`,
      errors: [
        {
          messageId: "internalModuleEvent",
          data: { source: `"fulfillment.fulfillment-set.created"` },
        },
      ],
      output: null,
    },
  ],
})
