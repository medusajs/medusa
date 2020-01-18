import { Router } from "express"
import productRoutes from './products'
import middlewares from "../../middlewares"

const route = Router()

export default app => {
  app.use("/store", route)

  productRoutes(route)

  return app
}
