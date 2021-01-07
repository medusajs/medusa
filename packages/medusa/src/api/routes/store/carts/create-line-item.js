import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    variant_id: Validator.string().required(),
    quantity: Validator.number().required(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const lineItemService = req.scope.resolve("lineItemService")
    const cartService = req.scope.resolve("cartService")

    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      let cart = await cartService.withTransaction(manager).retrieve(id)

      await lineItemService.withTransaction(manager).generate({
        cart_id: cart.id,
        variant_id: value.variant_id,
        region_id: cart.region_id,
        quantity: value.quantity,
        metadata: value.metadata,
      })

      cart = await cartService.retrieve(cart._id, ["region"])
      res.status(200).json({ cart })
    })
  } catch (err) {
    throw err
  }
}
