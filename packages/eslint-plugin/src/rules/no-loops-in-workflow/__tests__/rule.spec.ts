import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-loops-in-workflow", rule, {
  valid: [
    // No loops in the constructor at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // Loop inside a nested createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            for (let i = 0; i < 10; i++) {
              doWork(i)
            }
            return 1
          })
          return step
        })
      `,
    },
    // Loop inside a nested transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            const out = []
            for (const item of data.input.items) {
              out.push(item)
            }
            return out
          })
          return value
        })
      `,
    },
    // Loop inside a createStep nested inside a when().then() callback is fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            const step = createStep("s", () => {
              for (let i = 0; i < 3; i++) {
                doWork(i)
              }
              return 1
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
          for (let i = 0; i < 5; i++) {
            doWork(i)
          }
          return input
        })
      `,
    },
    // Loop outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper(items) {
          for (const item of items) {
            doWork(item)
          }
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // for loop directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          for (let i = 0; i < 5; i++) {
            doWork(i)
          }
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // for-of loop directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          for (const item of input.items) {
            doWork(item)
          }
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // for-in loop directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          for (const key in input) {
            doWork(key)
          }
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // while loop directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          while (cond()) {
            doWork()
          }
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // do-while loop directly in the constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          do {
            doWork()
          } while (cond())
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // Function-expression constructor with a loop.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          for (let i = 0; i < 5; i++) {
            doWork(i)
          }
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // Aliased createWorkflow import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          for (const item of input.items) {
            doWork(item)
          }
          return input
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // Multiple loops — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          for (let i = 0; i < 5; i++) { doA() }
          while (cond()) { doB() }
        })
      `,
      errors: [
        { messageId: "loopInWorkflow" },
        { messageId: "loopInWorkflow" },
      ],
    },
    // Loop directly inside a when().then() callback is also flagged.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => {
            for (let i = 0; i < 3; i++) {
              doWork(i)
            }
          })
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
    // Aliased `when` import is tracked too.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => data.input.foo).then(() => {
            for (const item of input.items) {
              doWork(item)
            }
          })
        })
      `,
      errors: [{ messageId: "loopInWorkflow" }],
    },
  ],
})
