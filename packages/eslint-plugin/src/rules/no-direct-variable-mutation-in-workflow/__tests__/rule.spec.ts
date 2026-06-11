import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-direct-variable-mutation-in-workflow", rule, {
  valid: [
    // No mutations or recomputations in the constructor.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => 1)
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          return result
        })
      `,
    },
    // Mutation/recomputation INSIDE a nested transform callback is fine.
    {
      code: `
        import { createWorkflow, createStep, transform } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ count: 1 }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          const doubled = transform({ result }, (data) => {
            data.result.count = data.result.count + 1
            return \`count is \${data.result.count}\`
          })
          return doubled
        })
      `,
    },
    // Mutation inside a nested createStep callback is fine (it's runtime, not def-time).
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ count: 1 }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          const step2 = createStep("s2", (data) => {
            data.count = data.count + 1
            return data
          })
          const final = step2(result)
          return final
        })
      `,
    },
    // Pass-through usage is fine (no mutation, no recomputation).
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => 1)
        const step2 = createStep("s2", (data) => data + 1)
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          const next = step2(result)
          return next
        })
      `,
    },
    // Template literal with no interpolation is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => 1)
        createWorkflow("my-workflow", (input) => {
          const result = step1(\`hello world\`)
          return result
        })
      `,
    },
    // Not the workflows-sdk import — nothing tracked.
    {
      code: `
        import { createWorkflow, createStep } from "some-other-lib"
        const step1 = createStep("s1", () => 1)
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          result.value = 5
          const next = result.value + 1
          return result
        })
      `,
    },
  ],
  invalid: [
    // Object property assignment.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ count: 1 }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          result.count = 5
          return result
        })
      `,
      errors: [{ messageId: "mutateInWorkflow" }],
    },
    // Increment.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ count: 1 }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          result.count++
          return result
        })
      `,
      errors: [{ messageId: "mutateInWorkflow" }],
    },
    // Let-reassignment.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          let counter = 0
          counter = 5
          return input
        })
      `,
      errors: [{ messageId: "mutateInWorkflow" }],
    },
    // Arithmetic on a step output.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => 1)
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          const doubled = result + 1
          return doubled
        })
      `,
      errors: [{ messageId: "recomputeInWorkflow" }],
    },
    // Arithmetic on the workflow input — also a placeholder.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => 1)
        createWorkflow("my-workflow", (input) => {
          const value = input.value + 1
          const result = step1(value)
          return result
        })
      `,
      errors: [{ messageId: "recomputeInWorkflow" }],
    },
    // Template literal interpolating a placeholder.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ name: "x" }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          const label = \`hello \${result.name}\`
          return label
        })
      `,
      errors: [{ messageId: "recomputeInWorkflow" }],
    },
    // Aliased createWorkflow import still tracked.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          input.value = 5
          return input
        })
      `,
      errors: [{ messageId: "mutateInWorkflow" }],
    },
    // Mutation inside a when().then() callback also flagged.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ count: 1 }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          when({ result }, (data) => data.result.count > 0).then(() => {
            result.count = 10
          })
          return result
        })
      `,
      errors: [{ messageId: "mutateInWorkflow" }],
    },
    // Multiple violations in one workflow.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        const step1 = createStep("s1", () => ({ count: 1 }))
        createWorkflow("my-workflow", (input) => {
          const result = step1(input)
          result.count = 5
          const doubled = result.count + 1
          const label = \`hello \${result.count}\`
          return result
        })
      `,
      errors: [
        { messageId: "mutateInWorkflow" },
        { messageId: "recomputeInWorkflow" },
        { messageId: "recomputeInWorkflow" },
      ],
    },
  ],
})
