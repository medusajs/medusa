import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/products",
      methods: ["POST"],
      middlewares: [
        (req, res, next) => {
          // If our bugfix works, this user middleware will hit first and we can intercept
          // before the built-in validators throw a 400 Bad Request error.
          res.status(200).json({ custom_middleware_hit: true })
        },
      ],
    },
  ],
})
