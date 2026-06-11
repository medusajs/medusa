import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-conditional-expressions-in-workflow", rule, {
  valid: [
    // No conditional operators at all.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          return input
        })
      `,
    },
    // Conditional operators inside a createStep callback are fine.
    {
      code: `
        import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const step = createStep("s", () => {
            const a = input.foo || "default"
            const b = input.foo ?? "default"
            const c = input.foo ? 1 : 2
            const d = !!input.foo
            const e = input?.foo
            const f = input.foo === "bar"
            const g = input.foo != null
            return { a, b, c, d, e, f, g }
          })
          return step
        })
      `,
    },
    // Conditional operators inside a transform callback are fine.
    {
      code: `
        import { createWorkflow, transform } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const value = transform({ input }, (data) => {
            return data.input?.foo || "default"
          })
          return value
        })
      `,
    },
    // Conditional operators inside the when(...) *predicate* callback are
    // fine — the predicate runs at execution time against resolved input.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => !!data.input?.foo || false).then(() => {
            return input
          })
        })
      `,
    },
    // Conditional operators inside a transform nested in a when().then() callback are fine.
    {
      code: `
        import { createWorkflow, transform, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => true).then(() => {
            const value = transform({ input }, (data) => {
              return data.input?.foo || "default"
            })
            return value
          })
        })
      `,
    },
    // Conditional operators inside a createStep nested in a when().then() callback are fine.
    {
      code: `
        import { createWorkflow, createStep, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => true).then(() => {
            const step = createStep("s", () => {
              const v = input ? 1 : 2
              return v
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
          const v = input || "default"
          return v
        })
      `,
    },
    // Outside any workflow constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        function helper(x) {
          return x || "default"
        }
        createWorkflow("my-workflow", (input) => input)
      `,
    },
  ],
  invalid: [
    // `||` in workflow constructor body.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input || "default"
          return v
        })
      `,
      errors: [{ messageId: "logicalExpression" }],
    },
    // `&&` in workflow constructor body.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input && input.foo
          return v
        })
      `,
      errors: [{ messageId: "logicalExpression" }],
    },
    // `??` in workflow constructor body.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input ?? "default"
          return v
        })
      `,
      errors: [{ messageId: "logicalExpression" }],
    },
    // Ternary expression.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input ? 1 : 2
          return v
        })
      `,
      errors: [{ messageId: "conditionalExpression" }],
    },
    // Single `!` (negation).
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = !input
          return v
        })
      `,
      errors: [{ messageId: "negation" }],
    },
    // `!!` (double negation) — only the outermost `!` is reported.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = !!input
          return v
        })
      `,
      errors: [{ messageId: "negation" }],
    },
    // Strict equality `===`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input === "foo"
          return v
        })
      `,
      errors: [{ messageId: "equalityExpression" }],
    },
    // Loose equality `==`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input == "foo"
          return v
        })
      `,
      errors: [{ messageId: "equalityExpression" }],
    },
    // Strict inequality `!==`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input !== "foo"
          return v
        })
      `,
      errors: [{ messageId: "equalityExpression" }],
    },
    // Loose inequality `!=`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input != null
          return v
        })
      `,
      errors: [{ messageId: "equalityExpression" }],
    },
    // Equality directly inside a when().then() callback is flagged.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => true).then(() => {
            const v = input === "foo"
            return v
          })
        })
      `,
      errors: [{ messageId: "equalityExpression" }],
    },
    // Optional chaining `?.`.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const v = input?.foo
          return v
        })
      `,
      errors: [{ messageId: "optionalChaining" }],
    },
    // Aliased createWorkflow import.
    {
      code: `
        import { createWorkflow as cw } from "@medusajs/framework/workflows-sdk"
        cw("my-workflow", (input) => {
          const v = input || "default"
          return v
        })
      `,
      errors: [{ messageId: "logicalExpression" }],
    },
    // Function-expression constructor.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", function (input) {
          const v = input ?? "default"
          return v
        })
      `,
      errors: [{ messageId: "logicalExpression" }],
    },
    // Conditional operators directly inside a when().then() callback are flagged.
    {
      code: `
        import { createWorkflow, when } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          when({ input }, (data) => true).then(() => {
            const v = input || "default"
            return v
          })
        })
      `,
      errors: [{ messageId: "logicalExpression" }],
    },
    // Aliased `when` import is still tracked.
    {
      code: `
        import { createWorkflow, when as w } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          w({ input }, (data) => true).then(() => {
            const v = input?.foo
            return v
          })
        })
      `,
      errors: [{ messageId: "optionalChaining" }],
    },
    // Multiple violations of different kinds — each flagged.
    {
      code: `
        import { createWorkflow } from "@medusajs/framework/workflows-sdk"
        createWorkflow("my-workflow", (input) => {
          const a = input || "default"
          const b = input ? 1 : 2
          const c = !!input
          const d = input?.foo
          return { a, b, c, d }
        })
      `,
      errors: [
        { messageId: "logicalExpression" },
        { messageId: "conditionalExpression" },
        { messageId: "negation" },
        { messageId: "optionalChaining" },
      ],
    },
  ],
})
