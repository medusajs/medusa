import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    payment_provider: Validator.string().required(),
    payload: Validator.object().required(),
    payment_data: Validator.object().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const adyenService = req.scope.resolve("adyenService")
    const paymentProviderService = req.scope.resolve(
      `${value.payment_provider}AdyenProviderService`
    )

    const adyenResultCode = await adyenService.checkPaymentResult(
      value.payment_data,
      value.payload
    )

    const status = paymentProviderService.getStatus(adyenResultCode)

    res.status(200).json({ status })
  } catch (err) {
    throw err
  }
}
