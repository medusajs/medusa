import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    type: Validator.string()
      .valid("replace", "refund")
      .required(),
    claim_items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
        reason: Validator.string().valid(
          "missing_item",
          "wrong_item",
          "production_failure",
          "other"
        ),
        tags: Validator.array().items(Validator.string()),
        images: Validator.array().items(Validator.string()),
      })
      .required(),
    return_shipping: Validator.object()
      .keys({
        option_id: Validator.string().optional(),
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    additional_items: Validator.array()
      .items({
        variant_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .optional(),
    shipping_methods: Validator.array().items({
      id: Validator.string().optional(),
      option_id: Validator.string().optional(),
      price: Validator.number()
        .integer()
        .optional(),
    }),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const claimService = req.scope.resolve("claimService")

    const order = await orderService.retrieve(id)

    await claimService.create({
      order,
      type: value.type,
      claim_items: value.claim_items,
      return_shipping: value.return_shipping,
      additional_items: value.additional_items,
      shipping_methods: value.shipping_methods,
      metadata: value.metadata,
    })

    const data = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order: data })
  } catch (error) {
    throw error
  }
}
