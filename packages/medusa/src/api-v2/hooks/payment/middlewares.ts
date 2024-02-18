import { raw } from "body-parser"

import { MiddlewareRoute } from "../../../types/middlewares"

export const hooksRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    bodyParser: false,
    matcher: "/hooks/payment/[provider]",
    middlewares: [raw({ type: "application/json" })],
  },
]
