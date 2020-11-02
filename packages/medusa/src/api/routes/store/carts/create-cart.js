import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    region_id: Validator.string(),
    country_code: Validator.string().optional(),
    items: Validator.array()
      .items({
        variant_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const lineItemService = req.scope.resolve("lineItemService")
    const cartService = req.scope.resolve("cartService")

    // Add a default region if no region has been specified
    let regionId = value.region_id
    if (!value.region_id) {
      const regionService = req.scope.resolve("regionService")
      const regions = await regionService.list()
      regionId = regions[0]._id
    }

    let customerId = ""
    let email = ""
    if (req.user && req.user.customer_id) {
      const customerService = req.scope.resolve("customerService")
      const customer = await customerService.retrieve(req.user.customer_id)
      customerId = customer._id
      email = customer.email
    }

    const toCreate = {
      region_id: regionId,
      customer_id: customerId,
      email,
    }

    if (value.country_code) {
      toCreate.shipping_address = {
        country_code: value.country_code.toUpperCase(),
      }
    }

    let cart = await cartService.create(toCreate)
    if (value.items) {
      await Promise.all(
        value.items.map(async i => {
          const lineItem = await lineItemService.generate(
            i.variant_id,
            i.quantity,
            value.region_id
          )
          await cartService.addLineItem(cart._id, lineItem)
        })
      )
    }

    cart = await cartService.retrieve(cart._id)
    cart = await cartService.decorate(cart, [], ["region"])
    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
