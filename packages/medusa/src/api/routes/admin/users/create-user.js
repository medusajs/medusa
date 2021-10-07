import { Validator, MedusaError } from "medusa-core-utils"
import _, { result } from "lodash"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    first_name: Validator.string().optional(),
    last_name: Validator.string().optional(),
    role: Validator.string()
      .valid("member", "admin", "developer")
      .optional(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    const data = _.pick(value, ["email", "first_name", "last_name", "role"])

    const { password_hash, ...user } = await userService.create(
      data,
      value.password
    )

    res.status(200).json({ user })
  } catch (err) {
    throw err
  }
}
