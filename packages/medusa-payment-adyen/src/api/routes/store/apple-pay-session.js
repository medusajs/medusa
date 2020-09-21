import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    validation_url: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const paymentProvider = req.scope.resolve("pp_applepay-adyen")

    const { data } = await paymentProvider.getApplePaySession(
      value.validation_url
    )

    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    throw err
  }
}
