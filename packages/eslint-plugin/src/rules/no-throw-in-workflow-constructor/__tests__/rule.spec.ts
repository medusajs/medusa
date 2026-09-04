import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-throw-in-workflow-constructor", rule, {
  valid: [
    // No throw in the constructor at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // throw inside a nested createStep callback is fine — it triggers
    // compensation of previously executed steps.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            if (!input) {
              throw new Error("missing input")
            }
            return input
          })
          return step
        })
      `,
    },
    // throw inside a nested transform callback is a different footgun,
    // covered by no-throw-in-transform — not this rule's concern.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            if (!data.input) {
              throw new Error("missing input")
            }
            return data.input
          })
          return value
        })
      `,
    },
    // throw inside a createStep nested inside a when().then() callback is fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const step = createStep("s", () => {
              if (!input) {
                throw new Error("missing input")
              }
              return input
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
          if (!input) {
            throw new Error("missing input")
          }
          return input
        })
      `,
    },
    // throw outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper(x) {
          if (!x) {
            throw new Error("missing x")
          }
          return x
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // Arrow constructor with direct throw.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (!input) {
            throw new Error("missing input")
          }
          return input
        })
      `,
      errors: [{ messageId: "throwInWorkflowConstructor" }],
    },
    // Function-expression constructor with direct throw.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          if (!input) {
            throw new Error("missing input")
          }
          return input
        })
      `,
      errors: [{ messageId: "throwInWorkflowConstructor" }],
    },
    // Aliased createWorkflow import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          if (!input) {
            throw new Error("missing input")
          }
          return input
        })
      `,
      errors: [{ messageId: "throwInWorkflowConstructor" }],
    },
    // Unconditional throw.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          throw new Error("not implemented")
        })
      `,
      errors: [{ messageId: "throwInWorkflowConstructor" }],
    },
    // Multiple throws — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (!input.a) { throw new Error("a") }
          if (!input.b) { throw new Error("b") }
          return input
        })
      `,
      errors: [
        { messageId: "throwInWorkflowConstructor" },
        { messageId: "throwInWorkflowConstructor" },
      ],
    },
    // throw directly inside a when().then() callback is also flagged — the
    // callback runs at workflow-definition time, just like the constructor.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            if (!input) {
              throw new Error("missing input")
            }
            return input
          })
        })
      `,
      errors: [{ messageId: "throwInWorkflowConstructor" }],
    },
    // Aliased `when` import is tracked too.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => data.input.foo).then(() => {
            if (!input) {
              throw new Error("missing input")
            }
          })
        })
      `,
      errors: [{ messageId: "throwInWorkflowConstructor" }],
    },
  ],
})
