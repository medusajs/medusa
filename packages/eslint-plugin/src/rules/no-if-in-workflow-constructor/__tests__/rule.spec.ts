import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-if-in-workflow-constructor", rule, {
  valid: [
    // No `if` in the constructor at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // `if` inside a nested createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            if (input.foo) {
              return 1
            }
            return 2
          })
          return step
        })
      `,
    },
    // `if` inside a nested transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            if (data.input.foo) return 1
            return 2
          })
          return value
        })
      `,
    },
    // `if` inside when().then() callback is fine.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            if (input) {
              return 1
            }
            return 2
          })
        })
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createWorkflow } from "some-other-lib"
        createWorkflow("my-workflow", (input) => {
          if (input) return 1
          return 2
        })
      `,
    },
    // `if` outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper(x) {
          if (x) return 1
          return 2
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // Arrow constructor with direct `if`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (input) {
            return 1
          }
          return 2
        })
      `,
      errors: [{ messageId: "ifInWorkflowConstructor" }],
    },
    // Function-expression constructor with direct `if`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          if (input) {
            return 1
          }
        })
      `,
      errors: [{ messageId: "ifInWorkflowConstructor" }],
    },
    // Aliased import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          if (input) {
            return 1
          }
        })
      `,
      errors: [{ messageId: "ifInWorkflowConstructor" }],
    },
    // `if-else`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (input) {
            return 1
          } else {
            return 2
          }
        })
      `,
      errors: [{ messageId: "ifInWorkflowConstructor" }],
    },
    // Multiple `if`s — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (input) {}
          if (input.foo) {}
        })
      `,
      errors: [
        { messageId: "ifInWorkflowConstructor" },
        { messageId: "ifInWorkflowConstructor" },
      ],
    },
  ],
})
