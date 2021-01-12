import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"

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
      select: [
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "total",
      ],
      relations: ["region", "items", "payment_sessions"],
    })
    res.json({ cart })
  } catch (err) {
    throw err
  }
}
