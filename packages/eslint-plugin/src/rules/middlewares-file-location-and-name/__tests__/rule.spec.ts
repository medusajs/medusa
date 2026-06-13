import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("middlewares-file-location-and-name", rule, {
  valid: [
    // Canonical location + default export of defineMiddlewares(...).
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "src/api/middlewares.ts",
    },
    // Canonical location, .js variant.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "src/api/middlewares.js",
    },
    // Nested api/ path without src/.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "api/middlewares.ts",
    },
    // Not a middleware-shaped filename — rule bails out.
    {
      code: `export default function () {}`,
      filename: "src/api/store/products/route.ts",
    },
    // Singular `middleware.ts` that doesn't actually use defineMiddlewares —
    // not this rule's problem.
    {
      code: `export default {}`,
      filename: "src/api/middleware.ts",
    },
    // Plural in wrong dir but doesn't use defineMiddlewares — out of scope.
    {
      code: `export default {}`,
      filename: "src/middlewares.ts",
    },
    // Synthetic filename — rule bails.
    {
      code: `export default defineMiddlewares({})`,
      filename: "<input>",
    },
  ],
  invalid: [
    // Singular `middleware.ts` under api/ that calls defineMiddlewares.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "src/api/middleware.ts",
      errors: [{ messageId: "singularFilename" }],
    },
    // Singular under nested api/ path.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "api/middleware.js",
      errors: [{ messageId: "singularFilename" }],
    },
    // Plural `middlewares.ts` in wrong directory (src/, not src/api/).
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "src/middlewares.ts",
      errors: [{ messageId: "wrongDirectory" }],
    },
    // Plural deep inside api/ but not at the canonical path.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({ routes: [] })
      `,
      filename: "src/api/admin/middlewares.ts",
      errors: [{ messageId: "wrongDirectory" }],
    },
    // Canonical location but no default export at all.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export const config = defineMiddlewares({ routes: [] })
      `,
      filename: "src/api/middlewares.ts",
      errors: [{ messageId: "missingDefineMiddlewares" }],
    },
    // Canonical location but default export isn't defineMiddlewares(...).
    {
      code: `export default { routes: [] }`,
      filename: "src/api/middlewares.ts",
      errors: [{ messageId: "missingDefineMiddlewares" }],
    },
    // Canonical location, default export is a different call.
    {
      code: `export default somethingElse({ routes: [] })`,
      filename: "src/api/middlewares.ts",
      errors: [{ messageId: "missingDefineMiddlewares" }],
    },
  ],
})
