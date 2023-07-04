import bodyParser from "body-parser"
import { Router } from "express"
import jwt from "jsonwebtoken"
import { MedusaError } from "medusa-core-utils"

const JWT_SECRET = process.env.JWT_SECRET || ""

export default () => {
  const app = Router()

  app.delete("/:id/wishlist", bodyParser.json(), async (req, res) => {
    const customerService = req.scope.resolve("customerService")

    let customer = await customerService.retrieve(req.params.id)
    const wishlist = (customer.metadata && customer.metadata.wishlist) || []

    const newWishlist = [...wishlist]
    newWishlist.splice(req.body.index, 1)

    customer = await customerService.update(customer.id, {
      metadata: { wishlist: newWishlist },
    })

    res.json({ customer })
  })

  app.post("/:id/wishlist", bodyParser.json(), async (req, res) => {
    const lineItemService = req.scope.resolve("lineItemService")
    const customerService = req.scope.resolve("customerService")
    const regionService = req.scope.resolve("regionService")

    let customer = await customerService.retrieve(req.params.id)

    const regions = await regionService.list()
    if (regions.length) {
      const lineItem = await lineItemService.generate(
        req.body.variant_id,
        regions[0].id,
        req.body.quantity,
        { metadata: req.body.metadata }
      )

      const wishlist = (customer.metadata && customer.metadata.wishlist) || []
      customer = await customerService.update(customer.id, {
        metadata: { wishlist: [...wishlist, lineItem] },
      })
    }

    res.json({ customer })
  })

  app.post("/:id/wishlist/share-token", bodyParser.json(), async (req, res) => {
    const customerService = req.scope.resolve("customerService")

    const customer = await customerService.retrieve(req.params.id)

    // check customer has wishlist else throw 400 bad request
    if (!customer?.metadata?.wishlist) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid data - Customer doesn't have a wishlist"
      )
    }

    const token = jwt.sign(
      {
        customer_id: customer.id,
      },
      JWT_SECRET
    )

    res.json({ share_token: token })
  })

  return app
}
