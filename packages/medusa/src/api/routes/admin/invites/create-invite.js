import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    user: Validator.string()
      .email()
      .trim(),
    role: Validator.string()
      .trim()
      .required(),
  })
  const { value, error } = schema.validate(req.body)

  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
  }
  const inviteService = req.scope.resolve("inviteService")

  await inviteService.create(value.user, value.role)

  res.sendStatus(200)
}
