import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id, line_id } = req.params

  const schema = Validator.object().keys({
    quantity: Validator.number().required(),
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
      if (value.quantity === 0) {
        cart = await cartService
          .withTransaction(manager)
          .removeLineItem(id, line_id)
      } else {
        cart = await cartService.withTransaction(manager).retrieve(id)

        const existing = cart.items.find(i => i.id === line_id)
        if (!existing) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Could not find the line item"
          )
        }

        await lineItemService.withTransaction(manager).update(line_id, {
          variant_id: existing.variant.id,
          region_id: cart.region_id,
          quantity: value.quantity,
          metadata: existing.metadata || {},
        })
      }
    })

    cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart })
  } catch (err) {
    console.log(err)
    throw err
  }
}
