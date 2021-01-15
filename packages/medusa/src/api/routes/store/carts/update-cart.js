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
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.update(id, value)
    cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })
    res.json({ cart })
  } catch (err) {
    throw err
  }
}
