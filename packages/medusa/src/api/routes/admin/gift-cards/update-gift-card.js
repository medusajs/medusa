import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    balance: Validator.number()
      .precision(0)
      .optional(),
    ends_at: Validator.date().optional(),
    is_disabled: Validator.boolean().optional(),
    region_id: Validator.string().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const giftCardService = req.scope.resolve("giftCardService")

    await giftCardService.update(id, value)

    const giftCard = await giftCardService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ gift_card: giftCard })
  } catch (err) {
    throw err
  }
}
