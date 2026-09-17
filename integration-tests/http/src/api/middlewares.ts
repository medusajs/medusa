import { allowSearchIndexes, defineMiddlewares } from "@medusajs/framework/http"

/**
 * The search fixture registers a `customer` index too, and it is deliberately
 * left out: the store search tests assert that an index has to be opted in
 * before `/store/search` will reach it.
 */
export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/search",
      middlewares: [allowSearchIndexes("product")],
    },
  ],
})
