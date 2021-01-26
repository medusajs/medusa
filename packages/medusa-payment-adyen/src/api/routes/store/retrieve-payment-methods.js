import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const adyenService = req.scope.resolve("adyenService")
    const cartService = req.scope.resolve("cartService")

    const cart = await cartService.retrieve(value.cart_id, {
      select: ["total"],
      relations: ["region", "region.payment_providers", "payment_sessions"],
    })

    const allowedMethods = cart.payment_sessions.map((ps) => {
      if (ps.provider_id.includes("adyen")) {
        return ps.provider_id.split("-adyen")[0]
      }
    })

    if (allowedMethods.length === 0) {
      res.status(200).json({ paymentMethods: {} })
      return
    }

    const pmMethods = await adyenService.retrievePaymentMethods(
      allowedMethods,
      cart.total,
      cart.currency_code,
      cart.customer_id || ""
    )

    // Adyen does not behave 100% correctly in regards to allowed methods
    // Therefore, we sanity filter before sending them to the storefront
    const { paymentMethods, groups, storedPaymentMethods } = pmMethods
    const methods = paymentMethods.filter((pm) =>
      allowedMethods.includes(pm.type)
    )

    const response = {
      paymentMethods: methods,
      groups,
      storedPaymentMethods,
    }

    res.status(200).json({ payment_methods: response })
  } catch (err) {
    throw err
  }
}
