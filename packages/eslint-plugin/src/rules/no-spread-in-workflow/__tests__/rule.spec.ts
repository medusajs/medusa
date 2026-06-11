import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-spread-in-workflow", rule, {
  valid: [
    // No spread at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // Spread inside a createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", (data) => {
            const merged = { ...data, extra: 1 }
            return merged
          })
          return step
        })
      `,
    },
    // Spread inside a transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            return { ...data.input, extra: 1 }
          })
          return value
        })
      `,
    },
    // Rest destructuring inside a transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            const { foo, ...rest } = data.input
            return rest
          })
          return value
        })
      `,
    },
    // Spread inside a createStep nested inside a when().then() callback is fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const step = createStep("s", (data) => {
              return { ...data, extra: 1 }
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
          const merged = { ...input, extra: 1 }
          return merged
        })
      `,
    },
    // Spread outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper(x) {
          return { ...x, extra: 1 }
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // Object spread in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const merged = { ...input, extra: 1 }
          return merged
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
    // Array spread in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const merged = [...input.items, 1]
          return merged
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
    // Spread as a call argument in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          doSomething(...input.args)
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
    // Rest destructuring in a const declaration in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const { foo, ...rest } = input
          return rest
        })
      `,
      errors: [{ messageId: "restInWorkflow" }],
    },
    // Function-expression constructor with spread.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          return { ...input }
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
    // Aliased createWorkflow import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          return { ...input }
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
    // Multiple spreads — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const a = { ...input }
          const b = [...input.items]
        })
      `,
      errors: [
        { messageId: "spreadInWorkflow" },
        { messageId: "spreadInWorkflow" },
      ],
    },
    // Spread directly inside a when().then() callback.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const merged = { ...input }
            return merged
          })
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
    // Aliased `when` import is tracked too.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => data.input.foo).then(() => {
            return [...input.items]
          })
        })
      `,
      errors: [{ messageId: "spreadInWorkflow" }],
    },
  ],
})
