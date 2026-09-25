import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("prefer-allow-fields-middleware", rule, {
  valid: [
    // Already uses allowFields.
    {
      code: `
        import {
          allowFields,
          defineMiddlewares,
        } from "@medusajs/framework/http"
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [allowFields("brand")],
            },
          ],
        })
      `,
    },
    // A middleware that doesn't touch the allowed fields.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [(req, res, next) => { next() }],
            },
          ],
        })
      `,
    },
    // An `allowed` property on something other than the request param.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [
                (req, res, next) => {
                  const config = { allowed: [] }
                  config.allowed.push("brand")
                  next()
                },
              ],
            },
          ],
        })
      `,
    },
    // Outside of defineMiddlewares.
    {
      code: `
        function handler(req, res, next) {
          req.allowed.push("brand")
          next()
        }
      `,
    },
  ],
  invalid: [
    // The documented pre-2.21.0 pattern.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [
                (req, res, next) => {
                  (req.allowed ??= []).push("brand")
                  next()
                },
              ],
            },
          ],
        })
      `,
      errors: [{ messageId: "preferAllowFields" }],
    },
    // Direct push.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [
                (req, res, next) => {
                  req.allowed.push("brand")
                  next()
                },
              ],
            },
          ],
        })
      `,
      errors: [{ messageId: "preferAllowFields" }],
    },
    // Whole-array assignment.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [
                function (request, res, next) {
                  request.allowed = ["brand"]
                  next()
                },
              ],
            },
          ],
        })
      `,
      errors: [{ messageId: "preferAllowFields" }],
    },
    // One report per offending middleware.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [
                (req, res, next) => {
                  req.allowed.push("brand")
                  next()
                },
              ],
            },
            {
              matcher: "/store/carts",
              middlewares: [
                (req, res, next) => {
                  req.allowed.push("custom")
                  next()
                },
              ],
            },
          ],
        })
      `,
      errors: [
        { messageId: "preferAllowFields" },
        { messageId: "preferAllowFields" },
      ],
    },
  ],
})
