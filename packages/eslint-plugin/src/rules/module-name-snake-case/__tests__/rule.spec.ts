import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("module-name-snake-case", rule, {
  valid: [
    // snake_case name
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export default Module("brand", { service: Service })
      `,
    },
    // camelCase is allowed (alphanumeric + underscores only per docs)
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export default Module("productMedia", { service: Service })
      `,
    },
    // Single underscore-separated identifier
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export default Module("my_event", { service: Service })
      `,
    },
    // Digits allowed
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export default Module("module_v2", { service: Service })
      `,
    },
    // Identifier referencing a const string — resolved and accepted when valid.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export const BRAND_MODULE = "brand"
        export default Module(BRAND_MODULE, { service: Service })
      `,
    },
    // Identifier whose const init is non-literal — cannot resolve, skip.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        const NAME = getName()
        export default Module(NAME, {})
      `,
    },
    // \`let\` — not a stable constant; skip resolution.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        let NAME = "my-event"
        Module(NAME, {})
      `,
    },
    // Module imported from somewhere else — should not flag.
    {
      code: `
        import { Module } from "some-other-lib"
        export default Module("my-event", {})
      `,
    },
    // Aliased import — invalid name but unaliased identifier should not match.
    {
      code: `
        import { Module as M } from "@medusajs/framework/utils"
        export default M("ok_name", {})
      `,
    },
  ],
  invalid: [
    // Dash-separated (the failure mode the catalog points at).
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export default Module("my-event", { service: Service })
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Spaces.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        export default Module("my event", {})
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Special characters.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        export default Module("my.event", {})
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Empty string.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        export default Module("", {})
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Aliased Module import binding.
    {
      code: `
        import { Module as M } from "@medusajs/framework/utils"
        export default M("my-event", {})
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Identifier referencing a const string with an invalid value — flagged on the identifier.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        import Service from "./service"
        export const BRAND_MODULE = "my-event"
        export default Module(BRAND_MODULE, { service: Service })
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Identifier whose const init is an invalid string (no export).
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        const NAME = "my.event"
        Module(NAME, {})
      `,
      errors: [{ messageId: "invalidModuleName" }],
    },
    // Multiple Module calls in one file — each flagged.
    {
      code: `
        import { Module } from "@medusajs/framework/utils"
        Module("bad-one", {})
        Module("bad.two", {})
      `,
      errors: [
        { messageId: "invalidModuleName" },
        { messageId: "invalidModuleName" },
      ],
    },
  ],
})
