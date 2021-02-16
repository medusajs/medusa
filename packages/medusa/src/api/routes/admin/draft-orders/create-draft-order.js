import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "."

export default async (req, res) => {
  const schema = Validator.object().keys({
    status: Validator.string()
      .valid("open", "awaiting", "completed")
      .optional(),
    email: Validator.string()
      .email()
      .required(),
    billing_address: Validator.address().optional(),
    shipping_address: Validator.address().optional(),
    billing_address_id: Validator.string().optional(),
    shipping_address_id: Validator.string().optional(),
    items: Validator.array()
      .items({
        variant_id: Validator.string().optional(),
        unit_price: Validator.number().optional(),
        title: Validator.string().optional(),
        quantity: Validator.number().required(),
        metadata: Validator.object().default({}),
      })
      .required(),
    region_id: Validator.string().required(),
    discounts: Validator.array().optional(),
    customer_id: Validator.string().optional(),
    customer: Validator.string().optional(),
    shipping_methods: Validator.array()
      .items({
        option_id: Validator.string().required(),
        data: Validator.object().optional(),
        price: Validator.number()
          .integer()
          .integer()
          .allow(0)
          .optional(),
      })
      .required(),
    metadata: Validator.object().optional(),
    requires_shipping: Validator.boolean().default(true),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      const requiresShipping = value.requires_shipping
      delete value.requires_shipping

      let draftOrder = await draftOrderService
        .withTransaction(manager)
        .create(value, requiresShipping)

      draftOrder = await draftOrderService
        .withTransaction(manager)
        .retrieve(draftOrder.id, {
          relations: defaultRelations,
          select: defaultFields,
        })

      res.status(200).json({ draft_order: draftOrder })
    })
  } catch (err) {
    throw err
  }
}
