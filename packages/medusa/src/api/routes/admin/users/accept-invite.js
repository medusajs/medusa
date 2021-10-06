import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    token: Validator.string().required(),
    user: Validator.object({
      firstName: Validator.string(),
      lastName: Validator.string(),
      password: Validator.string(),
    }),
  })
  const { value, error } = schema.validate(req.body)

  if (error) {
    throw error
  }

  const inviteService = req.scope.resolve("inviteService")

  await inviteService.accept(value.token, value.user)

  res.sendStatus(200)
}
