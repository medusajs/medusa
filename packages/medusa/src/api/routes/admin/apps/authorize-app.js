import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    application_name: Validator.string().required(),
    state: Validator.string().required(),
    code: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  try {
    const oauthService = req.scope.resolve("oauthService")
    const data = await oauthService.generateToken(
      value.application_name,
      value.code,
      value.state
    )
    res.status(200).json({ apps: data })
  } catch (err) {
    throw err
  }
}
