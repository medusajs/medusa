import jwt from "jsonwebtoken"
import { Validator } from "medusa-core-utils"
import config from "../../../../config"

export default async (req, res) => {
  const { body } = req
  const schema = Validator.object().keys({
    email: Validator.string().required(),
    password: Validator.string().required(),
  })
  const { value, error } = schema.validate(body)

  if (error) {
    throw error
  }

  const authService = req.scope.resolve("authService")
  const result = await authService.authenticate(value.email, value.password)
  if (!result.success) {
    res.sendStatus(401)
    return
  }

  // Add JWT to cookie
  req.session.jwt = jwt.sign({ userId: result.user._id }, config.jwtSecret, {
    expiresIn: "24h",
  })

  res.json({ user: result.user })
}
