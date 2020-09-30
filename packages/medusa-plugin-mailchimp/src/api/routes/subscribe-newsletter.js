import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string().required(),
    data: Validator.object().default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  console.log(value)

  try {
    const mailchimpService = req.scope.resolve("mailchimpService")
    await mailchimpService.subscribeNewsletter(value.email, value.data)
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
