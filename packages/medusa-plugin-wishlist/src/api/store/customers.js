import { Router } from "express"
import bodyParser from "body-parser"
import { Validator, MedusaError } from "medusa-core-utils"

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
          value.quantity
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

  return app
}
