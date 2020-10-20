import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    region_id: Validator.string(),
    country_code: Validator.string().optional(),
    email: Validator.string().email(),
    billing_address: Validator.address(),
    shipping_address: Validator.address(),
    discounts: Validator.array().items({
      code: Validator.string(),
    }),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const cartService = req.scope.resolve("cartService")
  const oldCart = await cartService.retrieve(id)
  if (!oldCart) {
    res.sendStatus(404)
    return
  }

  try {
    if (value.region_id) {
      await cartService.setRegion(id, value.region_id, value.country_code)
    }

    if (value.email) {
      await cartService.updateEmail(id, value.email)
    }

    if (!_.isEmpty(value.shipping_address)) {
      await cartService.updateShippingAddress(id, value.shipping_address)
    }

    if (!_.isEmpty(value.billing_address)) {
      await cartService.updateBillingAddress(id, value.billing_address)
    }

    if (value.discounts && value.discounts.length) {
      await Promise.all(
        value.discounts.map(async ({ code }) =>
          cartService.applyDiscount(id, code)
        )
      )
    }

    let newCart = await cartService.retrieve(id)
    const data = await cartService.decorate(newCart, [], ["region"])
    res.json({ cart: data })
  } catch (err) {
    throw err
  }
}
