import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    code: Validator.string().required(),
    is_dynamic: Validator.boolean().default(false),
    rule: Validator.object()
      .keys({
        description: Validator.string().optional(),
        type: Validator.string().required(),
        value: Validator.number()
          .positive()
          .required(),
        allocation: Validator.string().required(),
        valid_for: Validator.array().items(Validator.string()),
        usage_limit: Validator.number().optional(),
      })
      .required(),
    is_disabled: Validator.boolean().default(false),
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

    const created = await discountService.create(value)
    const discount = await discountService.retrieve(created.id, [
      "rule",
      "rule.valid_for",
      "regions",
    ])

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}
