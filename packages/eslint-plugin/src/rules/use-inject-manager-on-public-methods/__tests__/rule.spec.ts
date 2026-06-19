import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("use-inject-manager-on-public-methods", rule, {
  valid: [
    // Public method with @InjectManager() decorator.
    {
      code: `
        import { MedusaService, InjectManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectManager()
          async list(sharedContext: Context = {}) {}
        }
      `,
    },
    // Protected method with @InjectTransactionManager() decorator.
    {
      code: `
        import { MedusaService, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectTransactionManager()
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
    },
    // Method without a Context parameter is not flagged.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(filters: object) {}
        }
      `,
    },
    // Private method with @InjectTransactionManager() decorator.
    {
      code: `
        import { MedusaService, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectTransactionManager()
          private async helper(sharedContext: Context = {}) {}
        }
      `,
    },
    // Non-service class is not checked.
    {
      code: `
        class Plain {
          async list(sharedContext: Context = {}) {}
        }
      `,
    },
    // A `*Service`-named class that doesn't extend `MedusaService` is not a
    // service class — its undecorated Context method is not flagged.
    {
      code: `
        import { InjectManager } from "@medusajs/framework/utils"
        class OrderService {
          async list(sharedContext: Context = {}) {}
        }
      `,
    },
    // Constructor is exempt.
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
        import { MedusaService, InjectManager as IM } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @IM()
          async list(sharedContext: Context = {}) {}
        }
      `,
    },
    // Getter / setter / static methods aren't covered by this rule (no Context params anyway).
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          get name() { return "foo" }
          static helper() {}
        }
      `,
    },
    // Overload signatures (bodyless) are ignored — the decorator lives on the
    // implementation, which carries it here.
    {
      code: `
        import { MedusaService, InjectManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          list(id: string, sharedContext?: Context): Promise<string>
          list(id: number, sharedContext?: Context): Promise<number>
          @InjectManager()
          async list(id: any, sharedContext: Context = {}): Promise<any> {}
        }
      `,
    },
  ],
  invalid: [
    // Public method with Context param missing @InjectManager() — autofix inserts decorator.
    {
      code: `
        import { MedusaService, InjectManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, InjectManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectManager()
          async list(sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingInjectManager" }],
    },
    // Protected method with Context param missing @InjectTransactionManager() — autofix.
    {
      code: `
        import { MedusaService, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectTransactionManager()
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingInjectTransactionManager" }],
    },
    // No import for the decorator — reported without autofix.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: null,
      errors: [{ messageId: "missingInjectManager" }],
    },
    // Honors aliased decorator import in the autofix.
    {
      code: `
        import { MedusaService, InjectManager as IM } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, InjectManager as IM } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @IM()
          async list(sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingInjectManager" }],
    },
    // Decorator inserted before existing unrelated decorator.
    {
      code: `
        import { MedusaService, InjectManager, EmitEvents } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @EmitEvents()
          async list(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, InjectManager, EmitEvents } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectManager()
          @EmitEvents()
          async list(sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingInjectManager" }],
    },
    // Multiple methods on the same class are each reported.
    {
      code: `
        import { MedusaService, InjectManager, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async list(sharedContext: Context = {}) {}
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, InjectManager, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectManager()
          async list(sharedContext: Context = {}) {}
          @InjectTransactionManager()
          protected async list_(sharedContext: Context = {}) {}
        }
      `,
      errors: [
        { messageId: "missingInjectManager" },
        { messageId: "missingInjectTransactionManager" },
      ],
    },
    // Private method missing @InjectTransactionManager() is flagged like protected.
    {
      code: `
        import { MedusaService, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          private async helper(sharedContext: Context = {}) {}
        }
      `,
      output: `
        import { MedusaService, InjectTransactionManager } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          @InjectTransactionManager()
          private async helper(sharedContext: Context = {}) {}
        }
      `,
      errors: [{ messageId: "missingInjectTransactionManager" }],
    },
  ],
})
