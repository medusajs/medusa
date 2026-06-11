import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-try-catch-in-workflow", rule, {
  valid: [
    // No try/catch in the constructor at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // try/catch inside a nested createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            try {
              return doWork()
            } catch (e) {
              return null
            }
          })
          return step
        })
      `,
    },
    // try/catch inside a nested transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            try {
              return data.input.foo
            } catch (e) {
              return null
            }
          })
          return value
        })
      `,
    },
    // try/catch inside a createStep nested inside a when().then() callback is fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const step = createStep("s", () => {
              try {
                return 1
              } catch (e) {
                return 2
              }
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
          try {
            return input
          } catch (e) {
            return null
          }
        })
      `,
    },
    // try/catch outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper(x) {
          try {
            return x()
          } catch (e) {
            return null
          }
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // Arrow constructor with direct try/catch.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          try {
            return doSomething(input)
          } catch (e) {
            return null
          }
        })
      `,
      errors: [{ messageId: "tryCatchInWorkflow" }],
    },
    // Function-expression constructor with direct try/catch.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          try {
            return input
          } catch (e) {
            return null
          }
        })
      `,
      errors: [{ messageId: "tryCatchInWorkflow" }],
    },
    // Aliased createWorkflow import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          try {
            return input
          } catch (e) {
            return null
          }
        })
      `,
      errors: [{ messageId: "tryCatchInWorkflow" }],
    },
    // try/catch/finally is also flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          try {
            return input
          } catch (e) {
            return null
          } finally {
            cleanup()
          }
        })
      `,
      errors: [{ messageId: "tryCatchInWorkflow" }],
    },
    // Multiple try statements — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          try { doA() } catch (e) {}
          try { doB() } catch (e) {}
        })
      `,
      errors: [
        { messageId: "tryCatchInWorkflow" },
        { messageId: "tryCatchInWorkflow" },
      ],
    },
    // try/catch directly inside a when().then() callback is also flagged.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            try {
              return 1
            } catch (e) {
              return 2
            }
          })
        })
      `,
      errors: [{ messageId: "tryCatchInWorkflow" }],
    },
    // Aliased `when` import is tracked too.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => data.input.foo).then(() => {
            try {
              return 1
            } catch (e) {
              return 2
            }
          })
        })
      `,
      errors: [{ messageId: "tryCatchInWorkflow" }],
    },
  ],
})
