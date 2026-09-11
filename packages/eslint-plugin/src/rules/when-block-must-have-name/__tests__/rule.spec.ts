import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("when-block-must-have-name", rule, {
  valid: [
    // Named `when(name, values, condition)` — no warning possible.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when("my-when", { input }, ({ input }) => !!input.flag).then(() => {
            return transform(input, (i) => ({ value: i }))
          })
        })
      `,
    },
    // `.then()` returns the direct result of a step invocation — `when.ts`
    // never wraps this, so no name is needed.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() => {
            return findOrCreateCustomerStep({ email: input.email })
          })
        })
      `,
    },
    // Direct step invocation with a chained `.config(...)` is still step-like.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() => {
            return someStep({ id: input.id }).config({ name: "renamed" })
          })
        })
      `,
    },
    // `.runAsStep(...)` (a workflow run as a step) is step-like too.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() => {
            return someWorkflow.runAsStep({ input })
          })
        })
      `,
    },
    // No return at all — `.then()` resolves to `undefined`, never wrapped.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() => {
            someStep({ id: input.id })
          })
        })
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createWorkflow, when } from "some-other-lib"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() => {
            return transform(input, (i) => ({ value: i }))
          })
        })
      `,
    },
    // `when(...)` not chained with `.then(...)` — malformed, not this rule's concern.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag)
        })
      `,
    },
  ],
  invalid: [
    // Unnamed `when` whose `.then()` returns a `transform(...)` call
    {
      code: `
        import { createWorkflow, when, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => input.data?.custom_amount === null).then(() => {
            const action = transform({ input }, ({ input }) => ({ id: input.id }))
            return transform(action, (a) => [a])
          })
        })
      `,
      errors: [{ messageId: "whenBlockMissingName" }],
    },
    // Unnamed `when` whose `.then()` returns a plain object literal.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() => {
            return { active: true }
          })
        })
      `,
      errors: [{ messageId: "whenBlockMissingName" }],
    },
    // Expression-bodied `.then()` callback (implicit return).
    {
      code: `
        import { createWorkflow, when, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, ({ input }) => !!input.flag).then(() =>
            transform(input, (i) => ({ value: i }))
          )
        })
      `,
      errors: [{ messageId: "whenBlockMissingName" }],
    },
    // Aliased `when` import is still tracked.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, ({ input }) => !!input.flag).then(() => {
            return { active: true }
          })
        })
      `,
      errors: [{ messageId: "whenBlockMissingName" }],
    },
  ],
})
