export default async (req, res) => {
  const { id } = req.params
  try {
    const storeService = req.scope.resolve("storeService")
    const paymentProviderService = req.scope.resolve("paymentProviderService")
    const customerService = req.scope.resolve("customerService")

    let customer = await customerService.retrieve(id)

    const store = await storeService.retrieve(["payment_providers"])

    const methods = await Promise.all(
      store.payment_providers.map(async next => {
        const provider = paymentProviderService.retrieveProvider(next)

        const pMethods = await provider.retrieveSavedMethods(customer)
        return pMethods.map(m => ({
          provider_id: next,
          data: m,
        }))
      })
    )

    res.json({ payment_methods: methods.flat() })
  } catch (err) {
    throw err
  }
}
