import { Router } from "express"
import bodyParser from "body-parser"
import { MedusaError } from "medusa-core-utils"
import jwt from "jsonwebtoken"
import { IsString, IsNumber, IsObject, IsOptional } from "class-validator"
import { validator } from "@medusajs/utils"

const JWT_SECRET = process.env.JWT_SECRET || ""

export default () => {
  const app = Router()

  app.delete("/:id/wishlist", bodyParser.json(), async (req, res) => {
    const validated = await validator(DeleteWishlistReq, req.body)

    try {
      const customerService = req.scope.resolve("customerService")

      let customer = await customerService.retrieve(req.params.id)
      const wishlist = (customer.metadata && customer.metadata.wishlist) || []

      const newWishlist = [...wishlist]
      newWishlist.splice(validated.index, 1)

      customer = await customerService.update(customer.id, {
        metadata: { wishlist: newWishlist },
      })

      res.json({ customer })
    } catch (err) {
      throw err
    }
  })

  app.post("/:id/wishlist", bodyParser.json(), async (req, res) => {
    const validated = await validator(CreateWishlistReq, req.body)

    try {
      const lineItemService = req.scope.resolve("lineItemService")
      const customerService = req.scope.resolve("customerService")
      const regionService = req.scope.resolve("regionService")

      let customer = await customerService.retrieve(req.params.id)

      const regions = await regionService.list()
      if (regions.length) {
        const lineItem = await lineItemService.generate(
          validated.variant_id,
          regions[0].id,
          validated.quantity,
          { metadata: validated.metadata }
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

class DeleteWishlistReq {
  @IsNumber
  index
}

class CreateWishlistReq {
  @IsString
  variant_id

  @IsNumber
  quantity

  @IsObject
  @IsOptional
  metadata
}
