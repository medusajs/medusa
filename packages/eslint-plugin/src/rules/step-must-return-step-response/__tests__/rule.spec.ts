import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("step-must-return-step-response", rule, {
  valid: [
    // No return at all.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          const x = input
        })
      `,
    },
    // Bare \`return;\` (no value) is fine.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return
        })
      `,
    },
    // \`return undefined\` is fine.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return undefined
        })
      `,
    },
    // Returning a StepResponse is fine.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse({ ok: true })
        })
      `,
    },
    // Compensation callbacks are not required to return anything — even a
    // bare return of a plain value is fine.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep(
          "s",
          (input) => new StepResponse({ ok: true }),
          (compensateInput) => {
            return compensateInput
          }
        )
      `,
    },
    // Aliased StepResponse import is tracked.
    {
      code: `
        import { createStep, StepResponse as SR } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new SR({ ok: true })
        })
      `,
    },
    // `StepResponse.skip()` is a valid step return.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return StepResponse.skip()
        })
      `,
    },
    // `StepResponse.skip()` via an aliased import.
    {
      code: `
        import { createStep, StepResponse as SR } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return SR.skip()
        })
      `,
    },
    // `StepResponse.skip()` with a TS type assertion (`as any`) is still valid.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return StepResponse.skip() as any
        })
      `,
    },
    // `StepResponse.permanentFailure()` is a valid step return.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return StepResponse.permanentFailure("failed")
        })
      `,
    },
    // `StepResponse.permanentFailure()` via an aliased import.
    {
      code: `
        import { createStep, StepResponse as SR } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return SR.permanentFailure("failed")
        })
      `,
    },
    // `new StepResponse(...)` with a TS type assertion is still valid.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse({ ok: true }) as any
        })
      `,
    },
    // Return inside a nested function helper is irrelevant to this rule.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          function helper() {
            return { plain: "object" }
          }
          return new StepResponse(helper())
        })
      `,
    },
    // Returns in unrelated functions are not flagged.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        function helper() {
          return { plain: "object" }
        }
      `,
    },
    // Not the workflows-sdk import — should not flag.
    {
      code: `
        import { createStep } from "some-other-lib"
        createStep("s", (input) => {
          return { plain: "object" }
        })
      `,
    },
  ],
  invalid: [
    // Returning a plain object — autofix wraps it.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return { ok: true }
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse({ ok: true })
        })
      `,
    },
    // Returning an identifier — autofix wraps it.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          const value = input
          return value
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          const value = input
          return new StepResponse(value)
        })
      `,
    },
    // Aliased StepResponse — autofix uses the alias.
    {
      code: `
        import { createStep, StepResponse as SR } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return { ok: true }
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse as SR } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new SR({ ok: true })
        })
      `,
    },
    // Function-expression callback.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", function (input) {
          return input
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", function (input) {
          return new StepResponse(input)
        })
      `,
    },
    // Aliased createStep import.
    {
      code: `
        import { createStep as cs, StepResponse } from "@medusajs/framework/workflows-sdk"
        cs("s", (input) => {
          return input
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep as cs, StepResponse } from "@medusajs/framework/workflows-sdk"
        cs("s", (input) => {
          return new StepResponse(input)
        })
      `,
    },
    // Returning new <SomethingElse>(...) — not StepResponse.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        class Other {}
        createStep("s", (input) => {
          return new Other()
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        class Other {}
        createStep("s", (input) => {
          return new StepResponse(new Other())
        })
      `,
    },
    // A non-\`skip\` static call on StepResponse is not a valid return — wrapped.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return StepResponse.from(input)
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse(StepResponse.from(input))
        })
      `,
    },
    // Multiple returns — each is flagged and fixed.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          if (input) {
            return { early: true }
          }
          return { late: true }
        })
      `,
      errors: [
        { messageId: "missingStepResponse" },
        { messageId: "missingStepResponse" },
      ],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          if (input) {
            return new StepResponse({ early: true })
          }
          return new StepResponse({ late: true })
        })
      `,
    },
    // StepResponse is not yet imported — autofix inserts it into the existing import.
    {
      code: `
        import { createStep } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return input
        })
      `,
      errors: [{ messageId: "missingStepResponse" }],
      output: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse(input)
        })
      `,
    },
  ],
})
