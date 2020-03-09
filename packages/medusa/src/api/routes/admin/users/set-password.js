import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params
  const schema = Validator.object().keys({
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const userService = req.scope.resolve("userService")
  const user = await userService.setPassword(id, value.password)

  if (!user) {
    res.sendStatus(404)
    return
  }

  const newUser = await userService.retrieve(id)
  res.json(newUser)
}
