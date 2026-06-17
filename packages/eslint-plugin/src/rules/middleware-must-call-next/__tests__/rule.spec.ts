import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("middleware-must-call-next", rule, {
  valid: [
    // Canonical: calls next().
    {
      code: `
        import { defineMiddlewares } from "@medusajs/framework/http"
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/custom",
              middlewares: [(req, res, next) => { next() }],
            },
          ],
        })
      `,
    },
    // Function expression form.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/admin/custom",
              middlewares: [function (req, res, next) { return next() }],
            },
          ],
        })
      `,
    },
    // Renamed third param — body references the renamed identifier.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/x",
              middlewares: [(req, res, cont) => { cont() }],
            },
          ],
        })
      `,
    },
    // No third param — rule does not flag (out of scope for the heuristic).
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/x",
              middlewares: [(req, res) => { res.send("ok") }],
            },
          ],
        })
      `,
    },
    // Multiple middlewares; both reference next.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/x",
              middlewares: [
                (req, res, next) => { next() },
                (req, res, next) => { if (req.headers["x"]) next(); else next(new Error("x")) },
              ],
            },
          ],
        })
      `,
    },
    // next referenced indirectly (passed to another function).
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/x", middlewares: [(req, res, next) => Promise.resolve().then(next)] },
          ],
        })
      `,
    },
    // Not a defineMiddlewares call — rule bails.
    {
      code: `
        somethingElse({
          routes: [
            { matcher: "/x", middlewares: [(req, res, next) => {}] },
          ],
        })
      `,
    },
    // Destructured third param — current heuristic skips it.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/x", middlewares: [(req, res, { call }) => { call() }] },
          ],
        })
      `,
    },
  ],
  invalid: [
    // Body never references next.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/x", middlewares: [(req, res, next) => { res.json({}) }] },
          ],
        })
      `,
      errors: [{ messageId: "missingNextCall", data: { name: "next" } }],
    },
    // Renamed third param not referenced.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/x", middlewares: [(req, res, cont) => { res.send("ok") }] },
          ],
        })
      `,
      errors: [{ messageId: "missingNextCall", data: { name: "cont" } }],
    },
    // Function expression, empty body.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            { matcher: "/x", middlewares: [function (req, res, next) {}] },
          ],
        })
      `,
      errors: [{ messageId: "missingNextCall" }],
    },
    // Multiple middlewares — only one is flagged.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/x",
              middlewares: [
                (req, res, next) => { next() },
                (req, res, next) => { res.json({}) },
              ],
            },
          ],
        })
      `,
      errors: [{ messageId: "missingNextCall" }],
    },
    // Nested route group still inspected.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/x",
              middlewares: [(req, res, next) => {
                const value = req.headers["x"]
                res.json({ value })
              }],
            },
          ],
        })
      `,
      errors: [{ messageId: "missingNextCall" }],
    },
  ],
})
