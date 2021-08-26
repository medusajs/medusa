import { Router } from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import { getConfigFile } from "medusa-core-utils"

export default () => {
  const app = Router()

  const JWT_SECRET = process.env.JWT_SECRET || ""

  // const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  // const { projectConfig } = configModule

  // const corsOptions = {
  //   origin: projectConfig.store_cors.split(","),
  //   credentials: true,
  // }
  // console.log(corsOptions)
  // app.options("/wishlists/:token", cors(corsOptions))
  app.get("/wishlists/:token", async (req, res) => {
    const { token } = req.params

    // decorde token with decode = jwt.decode(token, secret)
    const decode = jwt.decode(token, JWT_SECRET)
    console.log(decode)
    // fetch customer.retrieve(decode.customer_id)
    // get customer.metadata.wishlist

    // respond with
    // wishlist
    // first_name
    res.json("200")
  })

  return app
}
