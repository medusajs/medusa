import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    to: Validator.string().required(),
    body: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const twilioService = req.scope.resolve("twilioSmsService")
    await twilioService.sendSms(value.to, value.body)
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
