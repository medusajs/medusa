import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

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

    let cart
    await entityManager.transaction(async manager => {
      cart = await cartService.withTransaction(manager).retrieve(id)

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
    })

    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })
    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
