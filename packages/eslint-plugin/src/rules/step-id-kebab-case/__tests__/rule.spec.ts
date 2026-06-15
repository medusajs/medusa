import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("step-id-kebab-case", rule, {
  valid: [
    // Variable with trailing `Step` — stripped before comparison.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch-customers", () => {})
      `,
    },
    // Filename with trailing `-step` — stripped before comparison.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("fetch-customers", () => {})
      `,
      filename: "src/workflows/fetch-customers-step.ts",
    },
    // Variable without `Step` suffix still matches when the id is identical.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomers = createStep("fetch-customers", () => {})
      `,
    },
    // Kebab id containing digits — matches variable name (Step suffix stripped).
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersV2Step = createStep("fetch-customers-v2", () => {})
      `,
    },
    // Aliased createStep import.
    {
      code: `
        import { createStep as cs } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = cs("fetch-customers", () => {})
      `,
    },
    // Non-string-literal id — outside this rule's scope.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        const id = "anything"
        export const fetchCustomersStep = createStep(id, () => {})
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createStep } from "some-other-lib"
        export const fetchCustomers = createStep("BadID", () => {})
      `,
    },
    // Kebab id, no enclosing variable, filename is index.ts — skip filename check.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("anything-goes", () => {})
      `,
      filename: "src/workflows/foo/index.ts",
    },
    // Bare `step` variable — suffix not stripped (would leave empty); compare full.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const step = createStep("step", () => {})
      `,
    },
  ],
  invalid: [
    // camelCase id — autofix to kebab from variable (Step suffix stripped).
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetchCustomers", () => {})
      `,
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch-customers", () => {})
      `,
    },
    // snake_case id — autofix to stripped kebab.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch_customers", () => {})
      `,
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch-customers", () => {})
      `,
    },
    // PascalCase id, no variable binding — autofix from filename (Step suffix stripped).
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("FetchCustomers", () => {})
      `,
      filename: "src/workflows/fetch-customers-step.ts",
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("fetch-customers", () => {})
      `,
    },
    // Kebab but mismatches variable name — autofix to stripped variable kebab.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const createCustomerStep = createStep("update-customer", () => {})
      `,
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const createCustomerStep = createStep("create-customer", () => {})
      `,
    },
    // Id includes the `-step` suffix that the variable strips — flagged.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch-customers-step", () => {})
      `,
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch-customers", () => {})
      `,
    },
    // Kebab but mismatches filename (no variable) — autofix to stripped filename kebab.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("something-else", () => {})
      `,
      filename: "src/workflows/fetch-customers-step.ts",
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("fetch-customers", () => {})
      `,
    },
    // Aliased createStep import is still tracked.
    {
      code: `
        import { createStep as cs } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = cs("fetchCustomers", () => {})
      `,
      errors: [{ messageId: "notKebabCase" }],
      output: `
        import { createStep as cs } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = cs("fetch-customers", () => {})
      `,
    },
    // Variable name takes precedence over filename when both differ.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("other-id", () => {})
      `,
      filename: "src/workflows/different-name-step.ts",
      errors: [{ messageId: "idMismatch" }],
      output: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        export const fetchCustomersStep = createStep("fetch-customers", () => {})
      `,
    },
  ],
})
