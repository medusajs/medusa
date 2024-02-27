import type { MiddlewaresConfig } from "@medusajs/medusa"
import { raw } from "body-parser"

export const config: MiddlewaresConfig = {
  routes: [
    {
      bodyParser: false,
      matcher: "/stripe/hooks",
      middlewares: [raw({ type: "application/json" })],
    },
  ],
}
