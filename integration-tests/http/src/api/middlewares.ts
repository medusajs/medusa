import {
  configureStoreSearch,
  defineMiddlewares,
} from "@medusajs/framework/http"

// The search fixture registers a `customer` index too, left out on purpose: the
// store search tests assert an index has to be opted in before it is reachable.
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/search",
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    // Overrides of core audit settings, asserted by the audit specs. They only
    // apply when the Audit Module is installed.
    {
      method: ["POST"],
      matcher: "/admin/sales-channels",
      audit: false,
    },
    {
      method: ["POST"],
      matcher: "/admin/regions",
      audit: {
        requestData: (req) => ({ name: req.validatedBody?.name }),
      },
    },
  ],
})
