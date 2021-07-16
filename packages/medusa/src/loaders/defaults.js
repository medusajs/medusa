const silentResolution = (container, name, logger) => {
  try {
    const resolved = container.resolve(name)
    return resolved
  } catch (err) {
    if (err.name !== "AwilixResolutionError") {
      throw err
    } else {
      let identifier
      switch (name) {
        case "paymentProviders":
          identifier = "payment"
          break
        case "notificationProviders":
          identifier = "notification"
          break
        case "fulfillmentProviders":
          identifier = "fulfillment"
          break
        default:
          identifier = name
      }
      logger.warn(
        `You don't have any ${identifier} provider plugins installed. You may want to add one to your project.`
      )
    }
  }
}

export default async ({ container }) => {
  const storeService = container.resolve("storeService")
  const profileService = container.resolve("shippingProfileService")
  const logger = container.resolve("logger")

  const entityManager = container.resolve("manager")

  await entityManager.transaction(async manager => {
    await storeService.withTransaction(manager).create()

    let payIds
    const pProviderService = container.resolve("paymentProviderService")

    const payProviders =
      silentResolution(container, "paymentProviders", logger) || []

    payIds = payProviders.map(p => p.getIdentifier())
    await pProviderService.registerInstalledProviders(payIds)

    let notiIds
    const nProviderService = container.resolve("notificationService")

    const notiProviders =
      silentResolution(container, "notificationProviders", logger) || []

    notiIds = notiProviders.map(p => p.getIdentifier())
    await nProviderService.registerInstalledProviders(notiIds)

    let fulfilIds
    const fProviderService = container.resolve("fulfillmentProviderService")

    const fulfilProviders =
      silentResolution(container, "fulfillmentProviders", logger) || []

    fulfilIds = fulfilProviders.map(p => p.getIdentifier())
    await fProviderService.registerInstalledProviders(fulfilIds)

    await profileService.withTransaction(manager).createDefault()
    await profileService.withTransaction(manager).createGiftCardDefault()
  })
}
