import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    let order = await orderService.createFulfillment(
      id,
      value.items,
      value.metadata
    )

    const data = await orderService.decorate(
      order,
      [],
      ["region", "customer", "swaps"]
    )

    res.json({ order: data })
  } catch (error) {
    throw error
  }
}
