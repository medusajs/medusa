import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import UserService from "../../../../services/user"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string().email().required(),
    name: Validator.string().optional(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const userService = req.scope.resolve("userService") as UserService
  const data = _.pick(value, ["email", "name"])

  const user = await userService.create(data, value.password)

  res.status(200).json({ user })
}
