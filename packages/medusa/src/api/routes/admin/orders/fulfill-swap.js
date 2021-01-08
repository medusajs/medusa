import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id, swap_id } = req.params

  const schema = Validator.object().keys({
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")

    // Fetch the order
    let order = await orderService.retrieve(id)

    // Receive the return
    await swapService.createFulfillment(order, swap_id, value.metadata)

    // Decorate the order
    order = await orderService.retrieve(id, ["region", "customer", "swaps"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
