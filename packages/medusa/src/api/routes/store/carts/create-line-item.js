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
    const manager = req.scope.resolve("manager")
    const lineItemService = req.scope.resolve("lineItemService")
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.retrieve(id)

    await manager.transaction(async m => {
      const line = await lineItemService.generate(
        value.variant_id,
        cart.region_id,
        value.quantity,
        value.metadata
      )
      await cartService.withTransaction(m).addLineItem(id, line)

      const updated = await cartService.withTransaction(m).retrieve(id, {
        relations: ["payment_sessions"],
      })

      if (updated.payment_sessions?.length) {
        await cartService.withTransaction(m).setPaymentSessions(id)
      }
    })

    cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
