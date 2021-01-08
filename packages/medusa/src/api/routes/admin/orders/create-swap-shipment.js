import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id, swap_id } = req.params

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
    const swapService = req.scope.resolve("swapService")

    await swapService.createShipment(
      swap_id,
      value.fulfillment_id,
      value.tracking_numbers
    )

    const order = await orderService.retrieve(id, [
      "region",
      "customer",
      "swaps",
    ])

    res.json({ order })
  } catch (error) {
    throw error
  }
}
