import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const schema = Validator.object().keys({
    value: Validator.number()
      .integer()
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

    await giftCardService.create(value)

    const giftCard = await giftCardService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ gift_card: giftCard })
  } catch (err) {
    throw err
  }
}
