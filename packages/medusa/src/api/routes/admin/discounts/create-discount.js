import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    code: Validator.string().required(),
    discount_rule: Validator.object()
      .keys({
        description: Validator.string().optional(),
        type: Validator.string().required(),
        value: Validator.number().required(),
        allocation: Validator.string().required(),
        valid_for: Validator.array().items(Validator.string()),
        usage_limit: Validator.number().optional(),
      })
      .required(),
    usage_count: Validator.number().optional(),
    disabled: Validator.boolean().optional(),
    starts_at: Validator.date().optional(),
    ends_at: Validator.date().optional(),
    regions: Validator.array()
      .items(Validator.string())
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const discountService = req.scope.resolve("discountService")
    const data = await discountService.create(value)

    res.status(200).json({ discount: data })
  } catch (err) {
    throw err
  }
}
