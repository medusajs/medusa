import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { variant_id } = req.parmas

  const schema = Validator.object().keys({
    email: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const restockNotificationService = req.scope.resolve(
      "restockNotificationService"
    )
    await restockNotificationService.addEmail(variant_id, value.email)
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(400).json({ message: err.message })
  }
}
