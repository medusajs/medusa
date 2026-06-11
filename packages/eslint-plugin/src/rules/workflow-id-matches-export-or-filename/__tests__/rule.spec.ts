import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("workflow-id-matches-export-or-filename", rule, {
  valid: [
    // Variable with trailing `Workflow` — stripped before comparison.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello-world", (input) => {})
      `,
    },
    // Filename with trailing `-workflow` — stripped before comparison.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello-world", (input) => {})
      `,
      filename: "src/workflows/hello-world-workflow.ts",
    },
    // Variable without the `Workflow` suffix still matches when the id is identical.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const createCustomer = createWorkflow("create-customer", (input) => {})
      `,
    },
    // Aliased createWorkflow import.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = cw("hello-world", (input) => {})
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createWorkflow } from "some-other-lib"
        export const myWorkflow = createWorkflow("BadID", (input) => {})
      `,
    },
    // Non-string-literal id — outside this rule's scope.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        const id = "anything"
        export const helloWorldWorkflow = createWorkflow(id, (input) => {})
      `,
    },
    // Kebab id, no enclosing variable, filename is index.ts — skip filename check.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("anything-goes", (input) => {})
      `,
      filename: "src/workflows/foo/index.ts",
    },
    // Bare `workflow` variable — suffix not stripped (would leave empty); compare full.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const workflow = createWorkflow("workflow", (input) => {})
      `,
    },
  ],
  invalid: [
    // camelCase id — autofix to kebab from the variable name (suffix stripped).
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("helloWorldWorkflow", (input) => {})
      `,
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello-world", (input) => {})
      `,
    },
    // snake_case id — autofix to stripped kebab.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello_world", (input) => {})
      `,
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello-world", (input) => {})
      `,
    },
    // Uppercase id, no variable binding — autofix from filename (suffix stripped).
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("HelloWorld", (input) => {})
      `,
      filename: "src/workflows/hello-world-workflow.ts",
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello-world", (input) => {})
      `,
    },
    // Kebab but mismatches variable name — autofix to stripped variable kebab.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const createCustomerWorkflow = createWorkflow("update-customer", (input) => {})
      `,
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const createCustomerWorkflow = createWorkflow("create-customer", (input) => {})
      `,
    },
    // Id includes the `-workflow` suffix that the variable strips — flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello-world-workflow", (input) => {})
      `,
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello-world", (input) => {})
      `,
    },
    // Kebab but mismatches filename (no variable) — autofix to stripped filename kebab.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("something-else", (input) => {})
      `,
      filename: "src/workflows/hello-world-workflow.ts",
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("hello-world", (input) => {})
      `,
    },
    // Aliased createWorkflow import is still tracked.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = cw("helloWorld", (input) => {})
      `,
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = cw("hello-world", (input) => {})
      `,
    },
    // Variable name takes precedence over filename when both differ.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("other-id", (input) => {})
      `,
      filename: "src/workflows/different-name-workflow.ts",
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        export const helloWorldWorkflow = createWorkflow("hello-world", (input) => {})
      `,
    },
  ],
})
