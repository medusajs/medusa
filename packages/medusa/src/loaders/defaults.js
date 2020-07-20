export default async ({ container }) => {
  const storeService = container.resolve("storeService")
  const profileService = container.resolve("shippingProfileService")

  let payIds
  try {
    const payProviders = container.resolve("paymentProviders")
    payIds = payProviders.map(p => p.getIdentifier())
  } catch (e) {
    payIds = []
  }

  let fulfilIds
  try {
    const fulfilProviders = container.resolve("fulfillmentProviders")
    fulfilIds = fulfilProviders.map(p => p.getIdentifier())
  } catch (e) {
    fulfilIds = []
  }

  await storeService.create({
    fulfillment_providers: fulfilIds,
    payment_providers: payIds,
  })

  await profileService.createDefault()
  await profileService.createGiftCardDefault()
}
