import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-trailing-slash-in-route-matcher", rule, {
  valid: [
    // No trailing slash — canonical form.
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/custom", middlewares: [] },
          ],
        })
      `,
    },
    // Root matcher "/" — not flagged (stripping would yield empty).
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/", middlewares: [] },
          ],
        })
      `,
    },
    // Multiple matchers, none with trailing slash.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/a", middlewares: [] },
            { matcher: "/admin/b", middlewares: [] },
          ],
        })
      `,
    },
    // Not a defineMiddlewares call — rule bails.
    {
      code: `
        somethingElse({
          routes: [
            { matcher: "/store/custom/", middlewares: [] },
          ],
        })
      `,
    },
    // Non-string matcher (e.g. variable) — rule does not flag.
    {
      code: `
        const m = "/store/x"
        export default defineMiddlewares({
          routes: [
            { matcher: m, middlewares: [] },
          ],
        })
      `,
    },
  ],
  invalid: [
    // Single matcher with trailing slash.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/custom/", middlewares: [] },
          ],
        })
      `,
      output: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/custom", middlewares: [] },
          ],
        })
      `,
      errors: [{ messageId: "trailingSlash" }],
    },
    // Single-quoted literal — quote style preserved.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: '/admin/x/', middlewares: [] },
          ],
        })
      `,
      output: `
        export default defineMiddlewares({
          routes: [
            { matcher: '/admin/x', middlewares: [] },
          ],
        })
      `,
      errors: [{ messageId: "trailingSlash" }],
    },
    // Multiple matchers — only offenders flagged.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/a/", middlewares: [] },
            { matcher: "/admin/b", middlewares: [] },
            { matcher: "/store/c/", middlewares: [] },
          ],
        })
      `,
      output: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/a", middlewares: [] },
            { matcher: "/admin/b", middlewares: [] },
            { matcher: "/store/c", middlewares: [] },
          ],
        })
      `,
      errors: [
        { messageId: "trailingSlash" },
        { messageId: "trailingSlash" },
      ],
    },
    // Multiple trailing slashes are all stripped.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/x//", middlewares: [] },
          ],
        })
      `,
      output: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/store/x", middlewares: [] },
          ],
        })
      `,
      errors: [{ messageId: "trailingSlash" }],
    },
  ],
})
