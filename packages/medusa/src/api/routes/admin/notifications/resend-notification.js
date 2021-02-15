import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    to: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const notificationService = req.scope.resolve("notificationService")

    const config = {}

    if (value.to) {
      config.to = value.to
    }

    await notificationService.resend(id, config)

    const notification = await notificationService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ notification })
  } catch (error) {
    throw error
  }
}
