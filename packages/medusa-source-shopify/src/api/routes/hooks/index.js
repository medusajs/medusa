import { Router } from "express"
import order from "./order"
import product from "./product"

const route = Router()

export default (app) => {
  app.use("/shopify", route)

  order(route)
  product(route)

  return app
}
