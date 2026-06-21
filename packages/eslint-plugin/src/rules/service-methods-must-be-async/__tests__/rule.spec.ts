import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("service-methods-must-be-async", rule, {
  valid: [
    // All methods async.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async create() {}
          async update() {}
        }
      `,
    },
    // Method with Promise return type annotation but no async (e.g. delegates to another async fn).
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          fetch(): Promise<void> {
            return Promise.resolve()
          }
        }
      `,
    },
    // Constructor is not flagged.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          constructor() {
            super(...arguments)
          }
          async create() {}
        }
      `,
    },
    // Private/protected methods are not flagged.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          private helper() {}
          protected internal() {}
          async publicOne() {}
        }
      `,
    },
    // Static method that's already async is fine.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          static async helper() {}
          async run() {}
        }
      `,
    },
    // Getters and setters are exempt — they can't be async and are accessed as
    // properties, not invoked like service methods.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          get name() { return "foo" }
          set name(v: string) {}
          get model() { return this.model_ }
          async run() {}
        }
      `,
    },
    // Class whose name doesn't end in "Service" and doesn't extend MedusaService is ignored.
    {
      code: `
        class Plain {
          create() {}
        }
      `,
    },
    // A `*Service`-named class that doesn't extend `MedusaService` is NOT
    // treated as a service — its sync methods are allowed, regardless of file
    // location. (Fixes false positives on helper classes like
    // `EntityDiscoveryService`.)
    {
      filename: "/repo/packages/modules/settings/src/utils/entity-discovery.ts",
      code: `
        export class EntityDiscoveryService {
          discover() {}
        }
      `,
    },
    // A plain class in a module's service location that doesn't extend
    // `MedusaService` is not checked, even when its methods are sync.
    {
      filename: "/repo/packages/modules/order/src/services/order.ts",
      code: `
        class OrderHelper {
          create() {}
        }
      `,
    },
    {
      filename: "/repo/packages/modules/order/src/service.ts",
      code: `
        class OrderModuleService {
          create() {}
        }
      `,
    },
    // MedusaService imported from a non-framework source is ignored (and class isn't named *Service).
    {
      code: `
        import { MedusaService } from "some-other-lib"
        class Foo extends MedusaService({}) {
          create() {}
        }
      `,
    },
    // Class extends something other than MedusaService, and isn't named *Service.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class Foo extends SomethingElse {
          create() {}
        }
      `,
    },
    // Honors aliased MedusaService import.
    {
      code: `
        import { MedusaService as MS } from "@medusajs/framework/utils"
        class FooService extends MS({}) {
          async create() {}
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          create() {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async create() {}
        }
      `,
      errors: [{ messageId: "methodMustBeAsync" }],
    },
    // Multiple non-async methods.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          create() {}
          update() {}
          async remove() {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async create() {}
          async update() {}
          async remove() {}
        }
      `,
      errors: [
        { messageId: "methodMustBeAsync" },
        { messageId: "methodMustBeAsync" },
      ],
    },
    // Non-Promise return type annotation.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          fetch(): void {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          async fetch(): void {}
        }
      `,
      errors: [{ messageId: "methodMustBeAsync" }],
    },
    // Aliased MedusaService import.
    {
      code: `
        import { MedusaService as MS } from "@medusajs/framework/utils"
        class FooService extends MS({}) {
          create() {}
        }
      `,
      output: `
        import { MedusaService as MS } from "@medusajs/framework/utils"
        class FooService extends MS({}) {
          async create() {}
        }
      `,
      errors: [{ messageId: "methodMustBeAsync" }],
    },
    // Class expression.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        const FooService = class extends MedusaService({}) {
          create() {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        const FooService = class extends MedusaService({}) {
          async create() {}
        }
      `,
      errors: [{ messageId: "methodMustBeAsync" }],
    },
    // Static methods are invocable from outside the service, so they must be async too.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          static helper() {}
        }
      `,
      output: `
        import { MedusaService } from "@medusajs/framework/utils"
        class FooService extends MedusaService({}) {
          static async helper() {}
        }
      `,
      errors: [{ messageId: "methodMustBeAsync" }],
    },
  ],
})
