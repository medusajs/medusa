import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { user_id } = req.params
  const schema = Validator.object().keys({
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    await userService.setPassword(user_id, value.password)

    const newUser = await userService.retrieve(user_id)

    res.json(newUser)
  } catch (error) {
    throw error
  }
}
