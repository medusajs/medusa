import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("service-constructor-must-call-super", rule, {
  valid: [
    // Constructor with super(...arguments).
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {
            super(...arguments)
          }
        }
      `,
    },
    // Constructor with a bare super() call also satisfies the rule.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor(container) {
            super(container)
          }
        }
      `,
    },
    // No constructor defined — nothing to flag.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async create() {}
        }
      `,
    },
    // Class doesn't extend MedusaService — out of scope (even with *Service name).
    {
      code: `
        class FooService {
          constructor() {}
        }
      `,
    },
    // MedusaService imported from a non-framework source is ignored.
    {
      code: `
        import { MedusaService } from "some-other-lib"
        class FooService extends MedusaService({}) {
          constructor() {}
        }
      `,
    },
    // Class extends something other than MedusaService.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends SomethingElse {
          constructor() {}
        }
      `,
    },
    // Honors aliased MedusaService import.
    {
      code: `
        import { MedusaService as MS } from "@medusajs/framework/utils"
        class FooService extends MS({}) {
          constructor() {
            super(...arguments)
          }
        }
      `,
    },
    // super() call interleaved with other statements is still fine.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor(container) {
            this.foo = "bar"
            super(container)
          }
        }
      `,
    },
  ],
  invalid: [
    // Empty constructor body.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() { super(...arguments) }
        }
      `,
      errors: [{ messageId: "missingSuperCall" }],
    },
    // Multi-line empty body — fixer must insert with newline + indentation,
    // not jam everything on the opening-brace line.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {

          }
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {
            super(...arguments)
          }
        }
      `,
      errors: [{ messageId: "missingSuperCall" }],
    },
    // Constructor body with statements but no super call.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor(container) {
            this.container = container
          }
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor(container) {
            super(...arguments)
            this.container = container
          }
        }
      `,
      errors: [{ messageId: "missingSuperCall" }],
    },
    // Aliased MedusaService import.
    {
      code: `
        import { MedusaService as MS } from "@medusajs/framework/utils"
        class FooService extends MS({}) {
          constructor() {}
        }
      `,
      output: `
        import { MedusaService as MS } from "@medusajs/framework/utils"
        class FooService extends MS({}) {
          constructor() { super(...arguments) }
        }
      `,
      errors: [{ messageId: "missingSuperCall" }],
    },
    // Class expression.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        const FooService = class extends MedusaService({}) {
          constructor() {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        const FooService = class extends MedusaService({}) {
          constructor() { super(...arguments) }
        }
      `,
      errors: [{ messageId: "missingSuperCall" }],
    },
    // Constructor calls something that looks like super but isn't (e.g. a method named super-something).
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {
            this.init()
          }
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {
            super(...arguments)
            this.init()
          }
        }
      `,
      errors: [{ messageId: "missingSuperCall" }],
    },
  ],
})
