import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id, claim_id } = req.params

  const schema = Validator.object().keys({
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

    await claimService.update(claim_id, {
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
