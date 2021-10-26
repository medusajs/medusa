import { MedusaError, Validator } from "medusa-core-utils"
import jwt from "jsonwebtoken"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string().email(),
    token: Validator.string().required(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")

    const decoded = await jwt.decode(value.token)

    let user
    try {
      user = await userService.retrieveByEmail(value.email || decoded.email, {
        select: ["id", "password_hash"],
      })
    } catch (err) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "invalid token")
    }

    const verifiedToken = await jwt.verify(value.token, user.password_hash)
    if (!verifiedToken || verifiedToken.user_id !== user.id) {
      res.status(401).send("Invalid or expired password reset token")
      return
    }

    const { password_hash, ...data } = await userService.setPassword_(
      user.id,
      value.password
    )

    res.status(200).json({ user: data })
  } catch (error) {
    if (error.message === "invalid token") {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
    }
    throw error
  }
}
