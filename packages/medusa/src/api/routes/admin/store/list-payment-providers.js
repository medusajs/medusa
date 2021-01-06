export default async (req, res) => {
  try {
    const paymentProviderService = container.resolve("paymentProviderService")
    const paymentProviders = await paymentProviderService.list()
    res.status(200).json({ payment_providers: paymentProviders })
  } catch (err) {
    throw err
  }
}
