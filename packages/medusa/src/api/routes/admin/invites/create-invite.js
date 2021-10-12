import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    users: Validator.array()
      .items(
        Validator.string()
          .email()
          .trim()
      )
      .min(1),
    role: Validator.string()
      .trim()
      .required(),
  })
  const { value, error } = schema.validate(req.body)

  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
  }
  const inviteService = req.scope.resolve("inviteService")

  await inviteService.create(value.users, value.role)

  res.sendStatus(200)
}
