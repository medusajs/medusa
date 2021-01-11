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

      const line = await lineItemService
        .withTransaction(manager)
        .generate(
          value.variant_id,
          cart.region_id,
          value.quantity,
          value.metadata
        )

      await lineItemService
        .withTransaction(manager)
        .create({ ...line, cart_id: id })

      cart = await cartService.withTransaction(manager).retrieve(cart.id, {
        select: [
          "subtotal",
          "tax_total",
          "shipping_total",
          "discount_total",
          "total",
        ],
        relations: ["region", "items"],
      })
      res.status(200).json({ cart })
    })
  } catch (err) {
    throw err
  }
}
