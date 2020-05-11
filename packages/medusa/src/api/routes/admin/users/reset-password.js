import { MedusaError, Validator } from "medusa-core-utils"
import jwt from "jsonwebtoken"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    token: Validator.string().required(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    let user = await userService.retrieveByEmail(value.email)

    const decodedToken = await jwt.verify(value.token, user.password_hash)
    if (!decodedToken || decodedToken.user_id !== user._id) {
      res.status(401).send("Invalid or expired password reset token")
      return
    }

    await userService.setPassword(user._id, value.password)

    const updatedUser = await userService.retrieve(user._id)

    res.status(200).json(updatedUser)
  } catch (error) {
    throw error
  }
}
