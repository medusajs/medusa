import express, { Router } from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import { getConfigFile, MedusaError, parseCorsOrigins } from "medusa-core-utils"

const app = Router()
export default (rootDirectory) => {
  const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  const { projectConfig } = configModule
  const corsOptions = {
    origin: parseCorsOrigins(projectConfig.store_cors),
    credentials: true,
  }
  const JWT_SECRET = process.env.JWT_SECRET || ""

  app.use("/wishlists/:token", cors(corsOptions))
  app.get(
    "/wishlists/:token",
    cors(corsOptions),
    express.json(),
    async (req, res) => {
      const customerService = req.scope.resolve("customerService")
      const { token } = req.params
      let decode

      try {
        decode = jwt.decode(token, JWT_SECRET)

        if (!decode || !decode.customer_id) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Invalid token")
        }
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
      try {
        const customer = await customerService.retrieve(decode.customer_id)
        const wishlist = {
          items: customer.metadata.wishlist,
          first_name: customer.first_name,
        }

        res.status(200).json({ wishlist })
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
    }
  )

  return app
}
