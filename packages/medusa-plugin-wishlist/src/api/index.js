import { Router } from "express"
import bodyParser from "body-parser"
import jwt from "jsonwebtoken"

const app = Router()
export default () => {
  app.get("/wishlists/:token", bodyParser.json(), async (req, res) => {
    const { token } = req.params

    const JWT_SECRET = process.env.JWT_SECRET || ""

    // decorde token with decode = jwt.decode(token, secret)
    const decode = jwt.decode(token, JWT_SECRET)
    console.log(decode)
    // fetch customer.retrieve(decode.customer_id)
    // get customer.metadata.wishlist

    // respond with
    // wishlist
    // first_name
    res.sendStatus(200)
  })

  return app
}
