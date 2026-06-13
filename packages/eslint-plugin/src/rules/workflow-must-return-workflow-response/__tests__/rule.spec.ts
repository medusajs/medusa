import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("workflow-must-return-workflow-response", rule, {
  valid: [
    // No return at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = input
        })
      `,
    },
    // Bare \`return;\` (no value) is fine.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return
        })
      `,
    },
    // \`return undefined\` is fine.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return undefined
        })
      `,
    },
    // Returning a WorkflowResponse is fine.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return new WorkflowResponse({ ok: true })
        })
      `,
    },
    // Aliased WorkflowResponse import is tracked.
    {
      code: `
        import { createWorkflow, WorkflowResponse as WR } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return new WR({ ok: true })
        })
      `,
    },
    // Return inside a nested createStep callback is irrelevant to this rule.
    {
      code: `
        import { createWorkflow, createStep, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            return { plain: "object" }
          })
          return new WorkflowResponse(step)
        })
      `,
    },
    // Returns in unrelated functions are not flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper() {
          return { plain: "object" }
        }
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createWorkflow } from "some-other-lib"
        createWorkflow("my-workflow", (input) => {
          return { plain: "object" }
        })
      `,
    },
  ],
  invalid: [
    // Returning a plain object — autofix wraps it.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return { ok: true }
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return new WorkflowResponse({ ok: true })
        })
      `,
    },
    // Returning an identifier — autofix wraps it.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = input
          return value
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = input
          return new WorkflowResponse(value)
        })
      `,
    },
    // Aliased WorkflowResponse — autofix uses the alias.
    {
      code: `
        import { createWorkflow, WorkflowResponse as WR } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return { ok: true }
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow, WorkflowResponse as WR } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return new WR({ ok: true })
        })
      `,
    },
    // Function-expression constructor.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          return input
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          return new WorkflowResponse(input)
        })
      `,
    },
    // Aliased createWorkflow import.
    {
      code: `
        import { createWorkflow as cw, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          return input
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow as cw, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          return new WorkflowResponse(input)
        })
      `,
    },
    // Returning new <SomethingElse>(...) — not WorkflowResponse.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        class Other {}
        createWorkflow("my-workflow", (input) => {
          return new Other()
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        class Other {}
        createWorkflow("my-workflow", (input) => {
          return new WorkflowResponse(new Other())
        })
      `,
    },
    // Multiple returns — each is flagged and fixed.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (input) {
            return { early: true }
          }
          return { late: true }
        })
      `,
      errors: [
        { messageId: "missingWorkflowResponse" },
        { messageId: "missingWorkflowResponse" },
      ],
      output: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          if (input) {
            return new WorkflowResponse({ early: true })
          }
          return new WorkflowResponse({ late: true })
        })
      `,
    },
    // WorkflowResponse is not yet imported — autofix inserts it into the existing import.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
      errors: [{ messageId: "missingWorkflowResponse" }],
      output: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return new WorkflowResponse(input)
        })
      `,
    },
  ],
})
