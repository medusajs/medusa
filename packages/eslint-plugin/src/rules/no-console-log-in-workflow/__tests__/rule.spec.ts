import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-console-log-in-workflow", rule, {
  valid: [
    // No console call at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // console.log inside a createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            console.log("running step")
            console.info("info")
            return {}
          })
          return step
        })
      `,
    },
    // console.log inside a transform callback is fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            console.log("transforming", data)
            return data.input
          })
          return value
        })
      `,
    },
    // console inside the when() predicate callback is fine — the predicate
    // runs at execution time.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => {
            console.log("predicate", data)
            return true
          }).then(() => {
            return input
          })
        })
      `,
    },
    // console inside a createStep nested in a when().then() callback is fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => true).then(() => {
            const step = createStep("s", () => {
              console.log("inside step")
              return {}
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
          console.log("definition-time")
          return input
        })
      `,
    },
    // Outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper() {
          console.log("helper")
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
    // Member access on something other than `console` — not flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const logger = { log: (m) => m }
          return input
        })
      `,
    },
  ],
  invalid: [
    // console.log directly inside a workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          console.log("definition-time")
          return input
        })
      `,
      errors: [{ messageId: "consoleInWorkflow", data: { method: "log" } }],
    },
    // console.info / console.warn / console.error / console.debug all flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          console.info("i")
          console.warn("w")
          console.error("e")
          console.debug("d")
          return input
        })
      `,
      errors: [
        { messageId: "consoleInWorkflow", data: { method: "info" } },
        { messageId: "consoleInWorkflow", data: { method: "warn" } },
        { messageId: "consoleInWorkflow", data: { method: "error" } },
        { messageId: "consoleInWorkflow", data: { method: "debug" } },
      ],
    },
    // Aliased createWorkflow import is tracked.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          console.log("definition-time")
          return input
        })
      `,
      errors: [{ messageId: "consoleInWorkflow", data: { method: "log" } }],
    },
    // Function-expression constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          console.log("hi")
          return input
        })
      `,
      errors: [{ messageId: "consoleInWorkflow", data: { method: "log" } }],
    },
    // console.log directly inside a when().then() callback.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => true).then(() => {
            console.log("then-callback")
            return input
          })
        })
      `,
      errors: [{ messageId: "consoleInWorkflow", data: { method: "log" } }],
    },
    // Aliased `when` import is still tracked.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => true).then(() => {
            console.log("then-callback")
            return input
          })
        })
      `,
      errors: [{ messageId: "consoleInWorkflow", data: { method: "log" } }],
    },
  ],
})
