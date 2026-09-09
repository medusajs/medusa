import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/carts/:id",
      middlewares: [
        (req, _res, next) => {
          ;(req.allowed ??= []).push("region.created_at")
          next()
        },
      ],
    },
  ],
})
