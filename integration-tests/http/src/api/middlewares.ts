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
  ],
})
