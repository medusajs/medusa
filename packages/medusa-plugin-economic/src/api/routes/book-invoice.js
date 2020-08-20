export default async (req, res) => {
  const schema = Validator.object().keys({
    orderId: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const economicService = req.scope.resolve("economicService")
    await economicService.bookEconomicInvoice(value.orderId)
    res.sendStatus(200)
  } catch (error) {
    throw error
  }
}
