import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { discount_id } = req.params
  const schema = Validator.object().keys({
    code: Validator.string().optional(),
    is_dynamic: Validator.boolean().default(false),
    rule: Validator.object()
      .keys({
        id: Validator.string().required(),
        description: Validator.string().optional(),
        type: Validator.string().required(),
        value: Validator.number().required(),
        allocation: Validator.string().required(),
        valid_for: Validator.array().items(Validator.string()),
      })
      .optional(),
    is_disabled: Validator.boolean().optional(),
    starts_at: Validator.date().optional(),
    ends_at: Validator.date().optional(),
    regions: Validator.array()
      .items(Validator.string())
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const discountService = req.scope.resolve("discountService")

    await discountService.update(discount_id, value)

    const discount = await discountService.retrieve(discount_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}
