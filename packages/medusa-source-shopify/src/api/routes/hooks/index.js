import { Router } from "express"
import order from "./order"
import product from "./product"
import refund from "./refund"

const route = Router()

export default (app) => {
  app.use("/shopify", route)

  order(route)
  product(route)
  refund(route)

  return app
}
