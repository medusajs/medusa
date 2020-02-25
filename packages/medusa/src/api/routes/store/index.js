import { Router } from "express"
import productRoutes from "./products"
import cartRoutes from "./carts"
import middlewares from "../../middlewares"

const route = Router()

export default app => {
  app.use("/store", route)

  productRoutes(route)
  cartRoutes(route)

  return app
}
