import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

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
    // A `*Service`-named class that doesn't extend `MedusaService` is not a
    // service class — its bare `Context` param is not flagged.
    {
      code: `
        import { MedusaContext } from "@medusajs/framework/utils"
        class OrderService {
          async list(sharedContext: Context = {}) {}
        }
      `,
    },
    // Overload signatures (bodyless) with a bare Context param are ignored —
    // the decorator lives on the implementation, which carries it here.
    {
      code: `
        import { MedusaService, MedusaContext } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          list(id: string, sharedContext?: Context): Promise<string>
          list(id: number, sharedContext?: Context): Promise<number>
          async list(id: any, @MedusaContext() sharedContext: Context = {}): Promise<any> {}
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
