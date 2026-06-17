import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-new-date-in-workflow", rule, {
  valid: [
    // No Date use at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // new Date() inside a nested createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            const now = new Date()
            return now
          })
          return step
        })
      `,
    },
    // Date.now() inside a nested transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, () => {
            return Date.now()
          })
          return value
        })
      `,
    },
    // new Date() inside a createStep nested inside a when().then() callback is fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const step = createStep("s", () => {
              const now = new Date()
              return now
            })
            return step
          })
        })
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createWorkflow } from "some-other-lib"
        createWorkflow("my-workflow", (input) => {
          const now = new Date()
          return now
        })
      `,
    },
    // Date use outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        const startedAt = new Date()
        const ts = Date.now()
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // new Date() directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const now = new Date()
          return input
        })
      `,
      errors: [{ messageId: "newDateInWorkflow" }],
    },
    // new Date(arg) directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const d = new Date(input.timestamp)
          return d
        })
      `,
      errors: [{ messageId: "newDateInWorkflow" }],
    },
    // Date.now() directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const ts = Date.now()
          return input
        })
      `,
      errors: [{ messageId: "dateMethodInWorkflow" }],
    },
    // Function-expression constructor with new Date().
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          const now = new Date()
          return input
        })
      `,
      errors: [{ messageId: "newDateInWorkflow" }],
    },
    // Aliased createWorkflow import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          const now = new Date()
          return input
        })
      `,
      errors: [{ messageId: "newDateInWorkflow" }],
    },
    // Both forms together — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const now = new Date()
          const ts = Date.now()
          return input
        })
      `,
      errors: [
        { messageId: "newDateInWorkflow" },
        { messageId: "dateMethodInWorkflow" },
      ],
    },
    // new Date() directly inside a when().then() callback is also flagged.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const now = new Date()
          })
        })
      `,
      errors: [{ messageId: "newDateInWorkflow" }],
    },
    // Date.parse(...) directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const t = Date.parse("2020-01-01")
          return input
        })
      `,
      errors: [{ messageId: "dateMethodInWorkflow", data: { method: "parse" } }],
    },
    // Date.UTC(...) directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const t = Date.UTC(2020, 0, 1)
          return input
        })
      `,
      errors: [{ messageId: "dateMethodInWorkflow", data: { method: "UTC" } }],
    },
    // Date.now() directly inside a when().then() callback (aliased `when` import).
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => data.input.foo).then(() => {
            const ts = Date.now()
          })
        })
      `,
      errors: [{ messageId: "dateMethodInWorkflow" }],
    },
  ],
})
