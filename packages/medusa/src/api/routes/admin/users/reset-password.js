import { MedusaError, Validator } from "medusa-core-utils"
import jwt from "jsonwebtoken"

export default async (req, res) => {
  const { id } = req.params
  const schema = Validator.object().keys({
    token: Validator.string().required(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    let user = await userService.retrieve(id)

    const decodedToken = await jwt.verify(value.token, user.password_hash)
    if (!decodedToken) {
      res.status(401).send("Invalid or expired password reset token")
    }

    await userService.setPassword(user._id, value.password)

    user = await userService.retrieve(user._id)
    user = await userService.decorate(user, ["email"])
    res.status(200).json(user)
  } catch (error) {
    throw error
  }
}
