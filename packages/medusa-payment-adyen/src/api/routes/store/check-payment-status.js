import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    payload: Validator.string().required(),
    payment_data: Validator.string().required(),
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const adyen = req.scope.resolve("adyenService")
    const paymentProvider = req.scope.resolve(`pp_${value.provider_id}`)

    const { data } = await adyen.checkPaymentResult(
      value.payment_data,
      value.payload
    )

    const status = await paymentProvider.getStatus(data)

    res.status(200).json({ status })
  } catch (err) {
    throw err
  }
}
