import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    return_items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    return_shipping: Validator.object()
      .keys({
        id: Validator.string().optional(),
        price: Validator.number().optional(),
      })
      .optional(),
    additional_items: Validator.array().items({
      variant_id: Validator.string().required(),
      quantity: Validator.number().required(),
    }),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")

    let order = await orderService.retrieve(id)

    // Phase 1: Create swap and add it to the order
    const swap = await swapService.create(
      order,
      value.return_items,
      value.additional_items,
      value.return_shipping
    )

    await orderService.registerSwapCreated(id, swap._id)

    // --> swap_created
    // Phase 2: Create a return request from the swap
    await swapService.requestReturn(order, swap._id)

    // --> return_request_created
    // Phase 3: Create a cart that can be used to pay for the swap difference
    await swapService.createCart(order, swap._id)

    // --> finished

    order = await orderService.retrieve(id)
    const data = await orderService.decorate(
      order,
      [],
      ["region", "customer", "swaps"]
    )

    res.status(200).json({ order: data })
  } catch (err) {
    throw err
  }
}
