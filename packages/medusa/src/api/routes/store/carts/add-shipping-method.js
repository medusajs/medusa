import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    option_id: Validator.string().required(),
    data: Validator.object()
      .optional()
      .default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")

    await manager.transaction(async m => {
      await cartService
        .withTransaction(m)
        .addShippingMethod(id, value.option_id, value.data)
      const updated = await cartService.withTransaction(m).retrieve(id, {
        relations: ["payment_sessions"],
      })

      if (updated.payment_sessions?.length) {
        await cartService.withTransaction(m).setPaymentSessions(id)
      }
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
