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
        variant_id: Validator.string()
          .optional()
          .allow(""),
        unit_price: Validator.number().optional(),
        title: Validator.string()
          .optional()
          .allow(""),
        quantity: Validator.number().required(),
        metadata: Validator.object().default({}),
      })
      .required(),
    region_id: Validator.string().required(),
    discounts: Validator.array()
      .items({
        code: Validator.string().required(),
      })
      .optional(),
    customer_id: Validator.string().optional(),
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
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    let draftOrder = await draftOrderService.create(value)

    draftOrder = await draftOrderService.retrieve(draftOrder.id, {
      relations: defaultRelations,
      select: defaultFields,
    })

    res.status(200).json({ draft_order: draftOrder })
  } catch (err) {
    throw err
  }
}
