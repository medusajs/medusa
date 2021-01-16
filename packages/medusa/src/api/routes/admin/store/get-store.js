export default async (req, res) => {
  try {
    const storeService = req.scope.resolve("storeService")
    const paymentProviderService = req.scope.resolve("paymentProviderService")
    const fulfillmentProviderService = req.scope.resolve(
      "fulfillmentProviderService"
    )

    const data = await storeService.retrieve(["currencies", "default_currency"])
    const paymentProviders = await paymentProviderService.list()
    const fulfillmentProviders = await fulfillmentProviderService.list()

    data.payment_providers = paymentProviders
    data.fulfillment_providers = fulfillmentProviders

    res.status(200).json({ store: data })
  } catch (err) {
    console.log(err)
    throw err
  }
}
