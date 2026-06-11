import { RuleTester } from "@typescript-eslint/rule-tester"
import * as path from "path"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: path.join(__dirname, "..", "..", "..", ".."),
    },
  },
})

ruleTester.run("no-non-serializable-step-return", rule, {
  valid: [
    // Plain object — fine.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse({ ok: true })
        })
      `,
    },
    // Array of primitives — fine.
    {
      code: `
        import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
        createStep("s", (input) => {
          return new StepResponse([1, 2, 3])
        })
      `,
    },
    // WorkflowResponse with a plain object.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("w", () => {
          return new WorkflowResponse({ ok: true })
        })
      `,
    },
    // \`new Map\` outside of a response — fine.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const m = new Map()
        const size = m.size
        const r = new StepResponse({ size })
      `,
    },
    // Not the workflows-sdk import — don't flag.
    {
      code: `
        import { StepResponse } from "some-other-lib"
        const r = new StepResponse({ data: new Map() })
      `,
    },
    // Buffer is intentionally not flagged.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const r = new StepResponse({ data: Buffer.from("hi") })
      `,
    },
    // Primitive return is fine.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const r = new StepResponse("hello")
      `,
    },
  ],
  invalid: [
    // \`new Map\` directly as a StepResponse argument.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const r = new StepResponse(new Map())
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Map" },
        },
      ],
    },
    // \`new Set\` nested inside an object property literal.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const r = new StepResponse({ items: new Set([1, 2, 3]) })
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Set" },
        },
      ],
    },
    // \`new WeakMap\` inside an array literal.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const r = new StepResponse([new WeakMap()])
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "WeakMap" },
        },
      ],
    },
    // \`new WeakSet\` deeply nested in an object.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const r = new StepResponse({ a: { b: { c: new WeakSet() } } })
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "WeakSet" },
        },
      ],
    },
    // Aliased StepResponse import is still tracked.
    {
      code: `
        import { StepResponse as SR } from "@medusajs/framework/workflows-sdk"
        const r = new SR({ items: new Map() })
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Map" },
        },
      ],
    },
    // WorkflowResponse with a non-serializable value.
    {
      code: `
        import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
        createWorkflow("w", () => {
          return new WorkflowResponse({ items: new Set<number>() })
        })
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Set" },
        },
      ],
    },
    // Type-aware: identifier whose type is `Map`.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const m = new Map<string, number>()
        const r = new StepResponse(m)
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Map" },
        },
      ],
    },
    // Type-aware: identifier whose type is an object with a Set property.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        const data: { items: Set<number> } = { items: new Set<number>() }
        const r = new StepResponse(data)
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Set" },
        },
      ],
    },
    // Type-aware: function call whose return type is a Map.
    {
      code: `
        import { StepResponse } from "@medusajs/framework/workflows-sdk"
        function build(): Map<string, number> { return new Map() }
        const r = new StepResponse(build())
      `,
      errors: [
        {
          messageId: "nonSerializableInResponse",
          data: { className: "Map" },
        },
      ],
    },
  ],
})
