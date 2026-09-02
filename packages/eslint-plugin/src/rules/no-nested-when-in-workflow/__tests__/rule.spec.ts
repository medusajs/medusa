import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-nested-when-in-workflow", rule, {
  valid: [
    // A single top-level `when().then()` in the workflow constructor is fine.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return when({ input }, (data) => data.input.foo).then(() => {
            return input
          })
        })
      `,
    },
    // Sibling (non-nested) `when().then()` calls in the constructor are fine.
    {
      code: `
        import { createWorkflow, when, createStep } from "@medusajs/framework/workflows-sdk"
        const stepA = createStep("a", () => {})
        const stepB = createStep("b", () => {})
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => data.input.foo).then(() => stepA())
          when({ input }, (data) => data.input.bar).then(() => stepB())
          return input
        })
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { when } from "some-other-lib"
        function build(input) {
          when(input, () => true).then(() => {
            when(input, () => false).then(() => {})
          })
        }
      `,
    },
    // `when(...)` outside any when-then callback (e.g. in a plain helper).
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        function helper(input) {
          return when(input, () => true)
        }
        createWorkflow("my-workflow", (input) => helper(input))
      `,
    },
  ],
  invalid: [
    // an inner `when().then()` nested
    // directly inside an outer `when().then()` callback.
    {
      code: `
        import { createWorkflow, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("demo", function (input) {
          const outer = when({ input }, (d) => d.input.items.length > 0).then(() => {
            const inner = when({ input }, (d) => d.input.flag).then(() => someStep(input))
            return inner
          })
          return new WorkflowResponse(outer)
        })
      `,
      errors: [{ messageId: "nestedWhenInWorkflow" }],
    },
    // Sibling nested `when()` calls inside the same outer `.then()` callback
    // are each flagged — the bug hits as soon as any inner `when().then()`
    // resolves before the outer one does.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (d) => d.input.foo).then(() => {
            when({ input }, (d) => d.input.bar).then(() => stepA())
            when({ input }, (d) => d.input.baz).then(() => stepB())
          })
        })
      `,
      errors: [
        { messageId: "nestedWhenInWorkflow" },
        { messageId: "nestedWhenInWorkflow" },
      ],
    },
    // Nested `when()` guarded by an intervening `if` still counts — no
    // function boundary sits between the inner call and the outer callback.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (d) => d.input.foo).then(() => {
            if (input.flag) {
              when({ input }, (d) => d.input.bar).then(() => stepA())
            }
          })
        })
      `,
      errors: [{ messageId: "nestedWhenInWorkflow" }],
    },
    // Aliased `when` import is tracked too.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (d) => d.input.foo).then(() => {
            w({ input }, (d) => d.input.bar).then(() => stepA())
          })
        })
      `,
      errors: [{ messageId: "nestedWhenInWorkflow" }],
    },
    // Three levels deep — the innermost and middle `when()` calls are each
    // nested inside a `when().then()` callback.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (d) => d.input.a).then(() => {
            when({ input }, (d) => d.input.b).then(() => {
              when({ input }, (d) => d.input.c).then(() => stepA())
            })
          })
        })
      `,
      errors: [
        { messageId: "nestedWhenInWorkflow" },
        { messageId: "nestedWhenInWorkflow" },
      ],
    },
  ],
})
