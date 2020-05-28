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
    const data = await userService.setPassword(user_id, value.password)
    res.json({ user: data })
  } catch (error) {
    throw error
  }
}
