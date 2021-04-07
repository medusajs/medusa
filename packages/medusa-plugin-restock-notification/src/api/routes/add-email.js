import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { variant_id } = req.params

  const schema = Validator.object().keys({
    email: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    res.status(400).json({ message: error.message })
    return
  }

  try {
    const restockNotificationService = req.scope.resolve(
      "restockNotificationService"
    )
    await restockNotificationService.addEmail(variant_id, value.email)
    res.sendStatus(201)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
