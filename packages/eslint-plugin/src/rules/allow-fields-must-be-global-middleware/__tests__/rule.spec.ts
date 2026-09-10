import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("allow-fields-must-be-global-middleware", rule, {
  valid: [
    // Global middleware: no method scoping.
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
    // Global middleware writing to req.allowed.
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
    },
    // A method-scoped middleware that doesn't touch allowed fields.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              method: "GET",
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
              method: "GET",
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
    // A method-scoped middleware validating the body.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              methods: ["POST"],
              middlewares: [validateAndTransformBody(schema)],
            },
          ],
        })
      `,
    },
  ],
  invalid: [
    // allowFields under `method`.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              method: "GET",
              middlewares: [allowFields("brand")],
            },
          ],
        })
      `,
      errors: [
        {
          messageId: "methodScoped",
          data: { source: "allowFields", key: "method" },
        },
      ],
    },
    // allowFields under `methods`.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              methods: ["GET"],
              middlewares: [allowFields("brand")],
            },
          ],
        })
      `,
      errors: [
        {
          messageId: "methodScoped",
          data: { source: "allowFields", key: "methods" },
        },
      ],
    },
    // req.allowed mutation under `method`.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              method: "GET",
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
      errors: [
        {
          messageId: "methodScoped",
          data: { source: "req.allowed", key: "method" },
        },
      ],
    },
    // Only the method-scoped route is reported.
    {
      code: `
        export default defineMiddlewares({
          routes: [
            {
              matcher: "/store/products",
              middlewares: [allowFields("brand")],
            },
            {
              matcher: "/store/carts",
              method: "GET",
              middlewares: [allowFields("custom")],
            },
          ],
        })
      `,
      errors: [
        {
          messageId: "methodScoped",
          data: { source: "allowFields", key: "method" },
        },
      ],
    },
  ],
})
