import { MiddlewareRoute } from "../../types/middlewares"

export const hooksRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    bodyParser: { preserveRawBody: true },
    matcher: "/hooks/payment/:provider",
  },
]
