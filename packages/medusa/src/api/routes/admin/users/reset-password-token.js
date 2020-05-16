import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    const user = await userService.retrieveByEmail(value.email)

    await userService.generateResetPasswordToken(user._id)

    res.sendStatus(204)
  } catch (error) {
    throw error
  }
}
