import { Router } from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import express from "express"
import { getConfigFile, MedusaError } from "medusa-core-utils"

const app = Router()
export default (rootDirectory) => {
  const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  const { projectConfig } = configModule
  const corsOptions = {
    origin: projectConfig.store_cors.split(","),
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
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            "Invalid token",
            400
          )
        }
      } catch (err) {
        res.status(400).json(err)
      }
      try {
        const customer = await customerService.retrieve(decode.customer_id)
        const response = {
          wishlist: customer.metadata.wishlist,
          first_name: customer.first_name,
        }

        res.status(200).json({ response })
      } catch (err) {
        res.status(400).json(err)
      }
    }
  )

  return app
}
