import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("use-medusa-error-not-generic-error", rule, {
  valid: [
    // Already throwing MedusaError.
    {
      code: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.NOT_FOUND, "nope")`,
    },
    // Custom (non-built-in) error classes are out of scope.
    { code: `throw new MyCustomError("boom")` },
    { code: `throw new HttpError(404)` },
    // Constructing (not throwing) a generic Error is allowed — e.g. passing it
    // to a callback. The rule only targets `throw new Error(...)`.
    { code: `const e = new Error("x"); reject(e)` },
    { code: `promise.catch(() => new Error("x"))` },
    // Re-throwing a caught value is fine.
    { code: `try { run() } catch (e) { throw e }` },
    // Throwing a non-NewExpression value.
    { code: `throw someError` },
    { code: `throw "string error"` },
  ],
  invalid: [
    // Generic Error with a message → suggest MedusaError, add the import.
    {
      code: `throw new Error("Something went wrong")`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "Error" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "Something went wrong")`,
            },
          ],
        },
      ],
    },
    // No-arg Error.
    {
      code: `throw new Error()`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "Error" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE)`,
            },
          ],
        },
      ],
    },
    // Other built-in error constructors are flagged too.
    {
      code: `throw new TypeError("bad type")`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "TypeError" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "bad type")`,
            },
          ],
        },
      ],
    },
    {
      code: `throw new RangeError("out of range")`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "RangeError" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "out of range")`,
            },
          ],
        },
      ],
    },
    // MedusaError already imported via named specifier → no duplicate import,
    // appended to the existing specifier list is unnecessary (already present).
    {
      code: `import { MedusaError } from "@medusajs/framework/utils"
throw new Error("boom")`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "Error" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "boom")`,
            },
          ],
        },
      ],
    },
    // Existing utils import without MedusaError → append to specifier list.
    {
      code: `import { Modules } from "@medusajs/framework/utils"
throw new Error("boom")`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "Error" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { Modules, MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "boom")`,
            },
          ],
        },
      ],
    },
    // Error with multiple args (e.g. AggregateError cause options).
    {
      code: `throw new Error("msg", { cause: err })`,
      output: null,
      errors: [
        {
          messageId: "useMedusaError",
          data: { name: "Error" },
          suggestions: [
            {
              messageId: "replaceWithMedusaError",
              output: `import { MedusaError } from "@medusajs/framework/utils"
throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "msg", { cause: err })`,
            },
          ],
        },
      ],
    },
  ],
})
