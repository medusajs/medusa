import { defineMiddlewares } from "@medusajs/framework/http"
import { disallowedStoreFields } from "@medusajs/medusa/utils"

/**
 * The override is applied only when the request carries the header below, so a single
 * fixture app can exercise both the configured disallowed fields and the overridden ones.
 */
export const LIFT_HEADER = "x-lift-sales-channels"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products",
      middlewares: [
        (req, res, next) => {
          if (req.headers[LIFT_HEADER]) {
            req.disallowed = disallowedStoreFields.filter(
              (field) => field !== "sales_channels"
            )
          }

          next()
        },
      ],
    },
  ],
})
