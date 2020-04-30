import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { user_id } = req.params
  const schema = Validator.object().keys({
    name: Validator.string().optional(),
    api_token: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")

    await userService.update(user_id, value)
    const user = await userService.retrieve(user_id)

    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}
