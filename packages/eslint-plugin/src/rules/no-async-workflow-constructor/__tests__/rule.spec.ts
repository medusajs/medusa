import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-async-workflow-constructor", rule, {
  valid: [
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          return input
        })
      `,
    },
    // Async function from an unrelated import is not flagged.
    {
      code: `
        import { createWorkflow } from "some-other-lib"
        createWorkflow("my-workflow", async (input) => {
          return input
        })
      `,
    },
    // Async function not passed to createWorkflow is not flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        const doSomething = async () => 1
        createWorkflow("my-workflow", (input) => input)
      `,
    },
    // Honors aliased import binding for valid cases too.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", async (input) => {
          return input
        })
      `,
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
      errors: [{ messageId: "asyncWorkflowConstructor" }],
    },
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", async function (input) {
          return input
        })
      `,
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          return input
        })
      `,
      errors: [{ messageId: "asyncWorkflowConstructor" }],
    },
    // Aliased import binding.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", async (input) => input)
      `,
      output: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => input)
      `,
      errors: [{ messageId: "asyncWorkflowConstructor" }],
    },
  ],
})
