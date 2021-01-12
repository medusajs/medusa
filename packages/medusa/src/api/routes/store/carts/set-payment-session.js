import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.setPaymentSession(id, value.provider_id)
    cart = await cartService.retrieve(cart.id, {
      select: [
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "total",
      ],
      relations: [
        "region",
        "region.countries",
        "region.payment_providers",
        "shipping_methods",
        "payment_session",
        "payment_sessions",
        "shipping_methods.shipping_option",
      ],
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
