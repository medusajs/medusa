import { Router } from "express"
import bodyParser from "body-parser"
import { Validator, MedusaError } from "medusa-core-utils"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || ""

export default () => {
  const app = Router()

  app.delete("/:id/wishlist", bodyParser.json(), async (req, res) => {
    const schema = Validator.object().keys({
      index: Validator.number().required(),
    })

    const { value, error } = schema.validate(req.body)
    if (error) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
    }

    try {
      const customerService = req.scope.resolve("customerService")

      let customer = await customerService.retrieve(req.params.id)
      const wishlist = (customer.metadata && customer.metadata.wishlist) || []

      const newWishlist = [...wishlist]
      newWishlist.splice(value.index, 1)

      customer = await customerService.update(customer.id, {
        metadata: { wishlist: newWishlist },
      })

      res.json({ customer })
    } catch (err) {
      throw err
    }
  })

  app.post("/:id/wishlist", bodyParser.json(), async (req, res) => {
    const schema = Validator.object().keys({
      variant_id: Validator.string().required(),
      quantity: Validator.number().required(),
      metadata: Validator.object().optional(),
    })

    const { value, error } = schema.validate(req.body)
    if (error) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
    }

    try {
      const lineItemService = req.scope.resolve("lineItemService")
      const customerService = req.scope.resolve("customerService")
      const regionService = req.scope.resolve("regionService")

      let customer = await customerService.retrieve(req.params.id)

      const regions = await regionService.list()
      if (regions.length) {
        const lineItem = await lineItemService.generate(
          value.variant_id,
          regions[0].id,
          value.quantity,
          { metadata: value.metadata }
        )

        const wishlist = (customer.metadata && customer.metadata.wishlist) || []
        customer = await customerService.update(customer.id, {
          metadata: { wishlist: [...wishlist, lineItem] },
        })
      }

      res.json({ customer })
    } catch (err) {
      throw err
    }
  })

  app.post("/:id/wishlist/share-token", bodyParser.json(), async (req, res) => {
    try {
      const customerService = req.scope.resolve("customerService")

      let customer = await customerService.retrieve(req.params.id)

      // check customer has wishlist else throw 400 bad request
      if (!customer?.metadata?.wishlist) {
        throw new MedusaError(
          Medusa.Types.INVALID_DATA,
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
    } catch (err) {
      throw err
    }
  })

  return app
}
