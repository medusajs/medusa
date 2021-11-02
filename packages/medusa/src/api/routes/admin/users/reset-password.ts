import jwt from "jsonwebtoken"
import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string().email().required(),
    token: Validator.string().required(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  const userService = req.scope.resolve("userService")
  const user = await userService.retrieveByEmail(value.email)

  const decodedToken = jwt.verify(value.token, user.password_hash) as {
    user_id: string
  }

  if (!decodedToken || decodedToken.user_id !== user.id) {
    res.status(401).send("Invalid or expired password reset token")
    return
  }

  const data = await userService.setPassword(user.id, value.password)

  res.status(200).json({ user: data })
}
