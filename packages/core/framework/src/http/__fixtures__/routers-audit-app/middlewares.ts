import { defineMiddlewares } from "../../utils/define-middlewares"

export default defineMiddlewares([
  {
    matcher: "/admin/products*",
    audit: false,
  },
  {
    method: ["POST"],
    matcher: "/admin/products",
    audit: {
      requestData: (req) => ({ title: req.validatedBody?.title, app: true }),
    },
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id",
    audit: true,
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/cancel",
    audit: false,
  },
])
