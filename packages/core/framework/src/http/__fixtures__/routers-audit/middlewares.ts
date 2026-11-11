import { z } from "../../../deps/zod"
import { defineMiddlewares } from "../../utils/define-middlewares"
import { validateAndTransformBody } from "../../utils/validate-body"

export default defineMiddlewares([
  {
    method: ["POST"],
    matcher: "/admin/products",
    audit: {
      action: "product.create",
      resource: (_req, body) => ({ type: "product", id: body?.product?.id }),
      requestData: (req) => ({ title: req.validatedBody?.title }),
    },
    middlewares: [
      validateAndTransformBody(
        z.object({ title: z.string(), description: z.string().optional() })
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id",
    audit: false,
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/cancel",
    audit: { action: "order.cancel" },
  },
  {
    method: ["POST"],
    matcher: "/admin/fail",
    audit: {
      resource: () => {
        throw new Error("resource failed")
      },
      responseData: (_req, body) => ({ body }),
    },
  },
  {
    method: ["POST"],
    matcher: "/store/carts",
    audit: {
      resource: (_req, body) => ({ type: "cart", id: body?.cart?.id }),
      responseData: (_req, body) => ({ cart_id: body?.cart?.id }),
    },
  },
])
