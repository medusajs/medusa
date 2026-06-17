import { createRuleTester } from "../../../test-utils"
import * as path from "path"
import { rule } from "../rule"

const ruleTester = createRuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: path.join(__dirname, "..", "..", "..", ".."),
    },
  },
})

ruleTester.run("no-workflow-call-without-container", rule, {
  valid: [
    // Canonical use: invoke with container, chain .run.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        const myWorkflow = createWorkflow("my", () => new WorkflowResponse({}))
        async function handler(container: any) {
          await myWorkflow(container).run({ input: {} })
        }
      `,
    },
    // Invoking with container but not chaining .run — no longer flagged (container-only rule).
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        const myWorkflow = createWorkflow("my", () => new WorkflowResponse({}))
        async function handler(container: any) {
          const exec = myWorkflow(container)
        }
      `,
    },
    // ReturnWorkflow-typed value invoked properly.
    {
      code: `
        import type { ReturnWorkflow } from "@medusajs/framework/workflows-sdk"
        declare const myWorkflow: ReturnWorkflow<any, any, []>
        async function handler(container: any) {
          await myWorkflow(container).run({ input: {} })
        }
      `,
    },
    // Identifier whose type isn't a workflow — ignored.
    {
      code: `
        function regular(): number { return 1 }
        regular()
      `,
    },
    // The createWorkflow call itself is not a workflow invocation.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        const myWorkflow = createWorkflow("my", () => new WorkflowResponse({}))
      `,
    },
    // Look-alike object — not a workflow type.
    {
      code: `
        const myWorkflow = { run: () => {} }
        myWorkflow.run()
      `,
    },
  ],
  invalid: [
    // Workflow invoked with no container.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        const myWorkflow = createWorkflow("my", () => new WorkflowResponse({}))
        async function go() {
          await myWorkflow().run({ input: {} })
        }
      `,
      errors: [{ messageId: "missingContainer", data: { name: "myWorkflow" } }],
    },
    // Calling .run directly on the workflow value bypasses container resolution.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        const helloWorldWorkflow = createWorkflow("hello", () => new WorkflowResponse({}))
        async function go() {
          await helloWorldWorkflow.run({ input: {} })
        }
      `,
      errors: [
        { messageId: "missingContainer", data: { name: "helloWorldWorkflow" } },
      ],
    },
    // ReturnWorkflow-typed: no container.
    {
      code: `
        import type { ReturnWorkflow } from "@medusajs/framework/workflows-sdk"
        declare const myWorkflow: ReturnWorkflow<any, any, []>
        async function go() {
          await myWorkflow().run({ input: {} })
        }
      `,
      errors: [{ messageId: "missingContainer", data: { name: "myWorkflow" } }],
    },
    // ReturnWorkflow-typed: .run accessed directly.
    {
      code: `
        import type { ReturnWorkflow } from "@medusajs/framework/workflows-sdk"
        declare const myWorkflow: ReturnWorkflow<any, any, []>
        async function go() {
          await myWorkflow.run({ input: {} })
        }
      `,
      errors: [{ messageId: "missingContainer", data: { name: "myWorkflow" } }],
    },
    // Member-expression callee: namespace-style access, called with no container.
    {
      code: `
        import type { ReturnWorkflow } from "@medusajs/framework/workflows-sdk"
        declare const flows: { createCustomerWorkflow: ReturnWorkflow<any, any, []> }
        async function go() {
          await flows.createCustomerWorkflow().run({ input: {} })
        }
      `,
      errors: [
        {
          messageId: "missingContainer",
          data: { name: "createCustomerWorkflow" },
        },
      ],
    },
    // Member-expression .run on member-accessed workflow value.
    {
      code: `
        import type { ReturnWorkflow } from "@medusajs/framework/workflows-sdk"
        declare const flows: { createCustomerWorkflow: ReturnWorkflow<any, any, []> }
        async function go() {
          await flows.createCustomerWorkflow.run({ input: {} })
        }
      `,
      errors: [
        {
          messageId: "missingContainer",
          data: { name: "createCustomerWorkflow" },
        },
      ],
    },
  ],
})
