import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("medusa-context-on-context-param", rule, {
  valid: [
    // Context param decorated with @MedusaContext().
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
    },
    // Decorator on a plain (no-default) Context param.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async retrieve(id: string, @MedusaContext() sharedContext: Context) {}
        }
      `,
    },
    // Method without a Context parameter — not flagged.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(filters: object) {}
        }
      `,
    },
    // Non-service class — not checked.
    {
      code: `
        class Plain {
          async list(sharedContext: Context = {}) {}
        }
      `,
    },
    // Constructor with Context param is exempt.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor(sharedContext: Context) {
            super(...arguments)
          }
        }
      `,
    },
    // Aliased decorator import is honored.
    {
      code: `
        import { MedusaService, MedusaContext as MC } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(@MC() sharedContext: Context = {}) {}
        }
      `,
    },
    // Protected method with decorated Context param.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          protected async list_(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
    },
    // Service-suffixed class with decorated Context param (no MedusaService extension).
    {
      code: `
        import { MedusaContext } from "@medusajs/framework/utils"
        class OrderService {
          async list(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
    },
  ],
  invalid: [
    // Public method with bare Context param — autofix inserts decorator.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingMedusaContext" }],
    },
    // Bare Context param with no default — autofix.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async retrieve(id: string, sharedContext: Context) {}
        }
      `,
      output: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async retrieve(id: string, @MedusaContext() sharedContext: Context) {}
        }
      `,
      errors: [{ messageId: "missingMedusaContext" }],
    },
    // No import for MedusaContext — reported without autofix.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: null,
      errors: [{ messageId: "missingMedusaContext" }],
    },
    // Honors aliased decorator import in the autofix.
    {
      code: `
        import { MedusaService, MedusaContext as MC } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, MedusaContext as MC } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(@MC() sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingMedusaContext" }],
    },
    // Protected method with bare Context param.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          protected async list_(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingMedusaContext" }],
    },
    // Service-suffix-only detection.
    {
      code: `
        import { MedusaContext } from "@medusajs/framework/utils"
        class OrderService {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaContext } from "@medusajs/framework/utils"
        class OrderService {
          async list(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingMedusaContext" }],
    },
    // Multiple methods on the same class, each reported.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(@MedusaContext() sharedContext: Context = {}) {}
          protected async list_(@MedusaContext() sharedContext: Context = {}) {}
        }
      `,
      errors: [
        { messageId: "missingMedusaContext" },
        { messageId: "missingMedusaContext" },
      ],
    },
    // Context param after non-Context params is correctly targeted.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async retrieve(id: string, filters: object, sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async retrieve(id: string, filters: object, @MedusaContext() sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingMedusaContext" }],
    },
  ],
})
