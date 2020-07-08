import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    region_id: Validator.string(),
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

    let cart = await cartService.create({ region_id: regionId })

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
