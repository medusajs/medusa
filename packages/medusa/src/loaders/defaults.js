export default async ({ container }) => {
  const storeService = container.resolve("storeService")
  const profileService = container.resolve("shippingProfileService")

  await storeService.create()

  let payIds
  const pProviderService = container.resolve("paymentProviderService")
  const payProviders = container.resolve("paymentProviders")
  payIds = payProviders.map(p => p.getIdentifier())
  await pProviderService.registerInstalledProviders(payIds)

  let fulfilIds
  const fProviderService = container.resolve("fulfillmentProviderService")
  const fulfilProviders = container.resolve("fulfillmentProviders")
  fulfilIds = fulfilProviders.map(p => p.getIdentifier())
  await fProviderService.registerInstalledProviders(fulfilIds)

  await profileService.createDefault()
  await profileService.createGiftCardDefault()
}
