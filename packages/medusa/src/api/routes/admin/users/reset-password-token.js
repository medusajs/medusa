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

    // Should call a email service provider that sends the token to the user
    const token = await userService.generateResetPasswordToken(user.id)

    res.json({ token })
    res.sendStatus(204)
  } catch (error) {
    throw error
  }
}
