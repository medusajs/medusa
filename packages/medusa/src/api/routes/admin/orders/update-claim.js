import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id, claim_id } = req.params

  const schema = Validator.object().keys({
    claim_items: Validator.array()
      .items({
        id: Validator.string().required(),
        note: Validator.string().allow(null, ""),
        reason: Validator.string().allow(null, ""),
        images: Validator.array().items({
          id: Validator.string().optional(),
          url: Validator.string().optional(),
        }),
        tags: Validator.array().items({
          id: Validator.string().optional(),
          value: Validator.string().optional(),
        }),
        metadata: Validator.object().optional(),
      })
      .optional(),
    shipping_methods: Validator.array()
      .items({
        id: Validator.string().optional(),
        option_id: Validator.string().optional(),
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const claimService = req.scope.resolve("claimService")

    await claimService.update(claim_id, value)

    const data = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order: data })
  } catch (error) {
    throw error
  }
}
