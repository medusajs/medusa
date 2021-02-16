import { MedusaError, Validator } from "medusa-core-utils"
import { defaultCartFields, defaultCartRelations, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    region_id: Validator.string().optional(),
    country_code: Validator.string().optional(),
    email: Validator.string()
      .email()
      .optional(),
    billing_address: Validator.object().optional(),
    shipping_address: Validator.object().optional(),

    discounts: Validator.array()
      .items({
        code: Validator.string(),
      })
      .optional(),
    customer_id: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const cartService = req.scope.resolve("cartService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      const draftOrder = await draftOrderService
        .withTransaction(manager)
        .retrieve(id, { select: defaultFields })

      if (
        draftOrder.status === "completed" ||
        draftOrder.status === "awaiting"
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You are only allowed to update open draft orders"
        )
      }

      await cartService
        .withTransaction(manager)
        .update(draftOrder.cart_id, value)

      draftOrder.cart = await cartService
        .withTransaction(manager)
        .retrieve(draftOrder.cart_id, {
          relations: defaultCartRelations,
          select: defaultCartFields,
        })

      res.status(200).json({ draft_order: draftOrder })
    })
  } catch (err) {
    throw err
  }
}
