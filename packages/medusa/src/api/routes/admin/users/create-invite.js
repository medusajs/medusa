import { Validator, MedusaError } from "medusa-core-utils"
import config from "../../../../config"

export default async (req, res) => {
  const { id } = req.params
  const { body } = req
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
  const { value, error } = schema.validate(body)

  if (error) {
    throw error
  }

  const inviteService = req.scope.resolve("inviteService")

  const token = await inviteService.create({
    account_id: id,
    inviter: req.user,
    ...value,
  })

  res.json({ token })
  res.sendStatus(200)
}
