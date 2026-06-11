import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-throw-in-transform", rule, {
  valid: [
    // No throw at all.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => data.input.foo)
          return value
        })
      `,
    },
    // throw inside a createStep callback is fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            if (!input) throw new Error("bad")
            return 1
          })
          return step
        })
      `,
    },
    // throw in a top-level helper is fine.
    {
      code: `
        import { transform } from "@medusajs/framework/workflows-sdk"
        function helper() {
          throw new Error("nope")
        }
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { transform } from "some-other-lib"
        transform({}, (data) => {
          throw new Error("ok here")
        })
      `,
    },
    // throw inside a function nested *inside* the transform callback is not flagged
    // (the immediately-enclosing function is the inner one, not the transform callback).
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            const inner = () => {
              throw new Error("ok")
            }
            return inner
          })
          return value
        })
      `,
    },
  ],
  invalid: [
    // Direct throw inside a transform arrow callback.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            if (!data.input.foo) {
              throw new Error("invalid")
            }
            return data.input.foo
          })
          return value
        })
      `,
      errors: [{ messageId: "throwInTransform" }],
    },
    // throw inside a transform function-expression callback.
    {
      code: `
        import { transform } from "@medusajs/framework/workflows-sdk"
        transform({}, function (data) {
          throw new Error("bad")
        })
      `,
      errors: [{ messageId: "throwInTransform" }],
    },
    // Aliased `transform` import binding is tracked.
    {
      code: `
        import { transform as t } from "@medusajs/framework/workflows-sdk"
        t({}, (data) => {
          throw new Error("bad")
        })
      `,
      errors: [{ messageId: "throwInTransform" }],
    },
    // Multiple throws — each flagged.
    {
      code: `
        import { transform } from "@medusajs/framework/workflows-sdk"
        transform({}, (data) => {
          if (data.a) throw new Error("a")
          if (data.b) throw new Error("b")
          return data
        })
      `,
      errors: [
        { messageId: "throwInTransform" },
        { messageId: "throwInTransform" },
      ],
    },
    // throw in a later callback when transform is chained with multiple callbacks.
    {
      code: `
        import { transform } from "@medusajs/framework/workflows-sdk"
        transform(
          {},
          (data) => data,
          (data) => {
            throw new Error("bad in second cb")
          }
        )
      `,
      errors: [{ messageId: "throwInTransform" }],
    },
  ],
})
