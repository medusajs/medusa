import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-duplicate-step-id-in-workflow", rule, {
  valid: [
    // Single step invocation — no duplicate possible.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          const { data } = useQueryGraphStep({ entity: "product", fields: ["id"] })
          return data
        })
      `,
    },
    // Two different step factories — different IDs by default.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          const a = fetchProductsStep({})
          const b = fetchCustomersStep({})
        })
      `,
    },
    // Same factory invoked twice but second renamed via .config({name}).
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          const { data: products } = useQueryGraphStep({ entity: "product", fields: ["id"] })
          const { data: customers } = useQueryGraphStep({ entity: "customer", fields: ["id"] }).config({ name: "fetch-customers" })
        })
      `,
    },
    // Both calls renamed with distinct .config({name}) values.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          useQueryGraphStep({}).config({ name: "a" })
          useQueryGraphStep({}).config({ name: "b" })
        })
      `,
    },
    // Same factory called twice but inside separate workflows — no conflict.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("one", () => {
          useQueryGraphStep({})
        })
        createWorkflow("two", () => {
          useQueryGraphStep({})
        })
      `,
    },
    // Step invoked inside a nested createStep callback — not the constructor body.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          const s = createStep("s", () => {
            useQueryGraphStep({})
            useQueryGraphStep({})
            return 1
          })
        })
      `,
    },
    // Outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        useQueryGraphStep({})
        useQueryGraphStep({})
        createWorkflow("hello", () => {})
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createWorkflow } from "some-other-lib"
        createWorkflow("hello", () => {
          useQueryGraphStep({})
          useQueryGraphStep({})
        })
      `,
    },
    // SDK helpers (transform/when/parallelize) are not step invocations.
    {
      code: `
        import { createWorkflow, transform, when, parallelize } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", (input) => {
          const a = transform({ input }, (d) => d.input)
          const b = transform({ input }, (d) => d.input)
          when({ input }, (d) => true).then(() => {})
          when({ input }, (d) => true).then(() => {})
          parallelize(a, b)
          parallelize(a, b)
        })
      `,
    },
    // Both calls renamed via `.config({ name })` with dynamic (non-literal)
    // values. The developer explicitly set distinct names we can't compare
    // statically, so neither is flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          useQueryGraphStep({}).config({ name: serverStepId })
          useQueryGraphStep({}).config({ name: workerStepId })
        })
      `,
    },
    // Even the same variable on both calls isn't flagged — once a name is set
    // explicitly, we don't second-guess it statically.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          useQueryGraphStep({}).config({ name: dynamicName })
          useQueryGraphStep({}).config({ name: dynamicName })
        })
      `,
    },
    // Mirrors the reported false positive: parallelize with two
    // `.config({ name })` calls using variable names.
    {
      code: `
        import { createWorkflow, parallelize } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          parallelize(
            waitForResourceStep({}).config({ name: waitForServerStepId, async: true }),
            waitForResourceStep({}).config({ name: waitForWorkerStepId, async: true })
          )
        })
      `,
    },
  ],
  invalid: [
    // Two bare calls to the same step factory.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          const { data: products } = useQueryGraphStep({ entity: "product", fields: ["id"] })
          const { data: customers } = useQueryGraphStep({ entity: "customer", fields: ["id"] })
        })
      `,
      errors: [
        { messageId: "duplicateStepId", data: { key: "use-query-graph" } },
      ],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          const { data: products } = useQueryGraphStep({ entity: "product", fields: ["id"] })
          const { data: customers } = useQueryGraphStep({ entity: "customer", fields: ["id"] }).config({ name: "use-query-graph-2" })
        })
      `,
    },
    // Three duplicates → two reports (first untouched).
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          useQueryGraphStep({})
          useQueryGraphStep({})
          useQueryGraphStep({})
        })
      `,
      errors: [
        { messageId: "duplicateStepId", data: { key: "use-query-graph" } },
        { messageId: "duplicateStepId", data: { key: "use-query-graph" } },
      ],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          useQueryGraphStep({})
          useQueryGraphStep({}).config({ name: "use-query-graph-2" })
          useQueryGraphStep({}).config({ name: "use-query-graph-3" })
        })
      `,
    },
    // Two .config({name}) calls with the same name → duplicate, no autofix.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          useQueryGraphStep({}).config({ name: "fetch" })
          useQueryGraphStep({}).config({ name: "fetch" })
        })
      `,
      errors: [{ messageId: "duplicateStepId", data: { key: "fetch" } }],
    },
    // A bare call and a .config-renamed call collide with a third bare call.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          fetchStep({})
          fetchStep({}).config({ name: "other" })
          fetchStep({})
        })
      `,
      errors: [{ messageId: "duplicateStepId", data: { key: "fetch" } }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          fetchStep({})
          fetchStep({}).config({ name: "other" })
          fetchStep({}).config({ name: "fetch-2" })
        })
      `,
    },
    // Aliased createWorkflow binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("hello", () => {
          useQueryGraphStep({})
          useQueryGraphStep({})
        })
      `,
      errors: [
        { messageId: "duplicateStepId", data: { key: "use-query-graph" } },
      ],
      output: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("hello", () => {
          useQueryGraphStep({})
          useQueryGraphStep({}).config({ name: "use-query-graph-2" })
        })
      `,
    },
    // Function-expression constructor with duplicates.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", function () {
          fetchProductsStep({})
          fetchProductsStep({})
        })
      `,
      errors: [
        { messageId: "duplicateStepId", data: { key: "fetch-products" } },
      ],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", function () {
          fetchProductsStep({})
          fetchProductsStep({}).config({ name: "fetch-products-2" })
        })
      `,
    },
    // Independent workflows: each tracked on its own. Only the second workflow has duplicates.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("one", () => {
          useQueryGraphStep({})
        })
        createWorkflow("two", () => {
          fetchStep({})
          fetchStep({})
        })
      `,
      errors: [{ messageId: "duplicateStepId", data: { key: "fetch" } }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("one", () => {
          useQueryGraphStep({})
        })
        createWorkflow("two", () => {
          fetchStep({})
          fetchStep({}).config({ name: "fetch-2" })
        })
      `,
    },
    // A dynamic-named call doesn't shield the remaining bare duplicates: the
    // two bare calls still collide, while the dynamic one is left alone.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          fetchStep({})
          fetchStep({}).config({ name: dynamicName })
          fetchStep({})
        })
      `,
      errors: [{ messageId: "duplicateStepId", data: { key: "fetch" } }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello", () => {
          fetchStep({})
          fetchStep({}).config({ name: dynamicName })
          fetchStep({}).config({ name: "fetch-2" })
        })
      `,
    },
  ],
})
