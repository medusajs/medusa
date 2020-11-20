import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    fulfillment_id: Validator.string().required(),
    tracking_numbers: Validator.array()
      .items(Validator.string())
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.createShipment(
      id,
      value.fulfillment_id,
      value.tracking_numbers
    )
    order = await orderService.decorate(
      order,
      [],
      ["region", "customer", "swaps"]
    )
    res.json({ order })
  } catch (error) {
    throw error
  }
}
