import { Validator, MedusaError } from "medusa-core-utils"
import _ from "lodash"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    name: Validator.string().optional(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    const data = _.pick(value, ["email", "name"])

    const user = await userService.create(data, value.password)

    res.status(200).json({ user })
  } catch (err) {
    throw err
  }
}
