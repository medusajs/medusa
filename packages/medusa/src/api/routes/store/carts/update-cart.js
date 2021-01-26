import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"

import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    region_id: Validator.string().optional(),
    country_code: Validator.string().optional(),
    email: Validator.string()
      .email()
      .optional(),
    billing_address: Validator.object().optional(),
    shipping_address: Validator.object().optional(),
    gift_cards: Validator.array()
      .items({
        code: Validator.string(),
      })
      .optional(),
    discounts: Validator.array()
      .items({
        code: Validator.string(),
      })
      .optional(),
    customer_id: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")

    await manager.transaction(async m => {
      // Update the cart
      await cartService.withTransaction(m).update(id, value)

      // If the cart has payment sessions update these
      const updated = await cartService.withTransaction(m).retrieve(id, {
        relations: ["payment_sessions"],
      })

      if (updated.payment_sessions?.length && !value.region_id) {
        await cartService.withTransaction(m).setPaymentSessions(id)
      }
    })

    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ cart })
  } catch (err) {
    console.log(err)
    throw err
  }
}
