import { currencies } from "../utils/currencies"
import { countries } from "../utils/countries"

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
  const currencyRepository = container.resolve("currencyRepository")
  const countryRepository = container.resolve("countryRepository")
  const profileService = container.resolve("shippingProfileService")
  const logger = container.resolve("logger")

  const entityManager = container.resolve("manager")

  await entityManager.transaction(async (manager) => {
    const countryRepo = manager.getCustomRepository(countryRepository)
    const hasCountries = await countryRepo.findOne()
    if (!hasCountries) {
      for (const c of countries) {
        const query = `INSERT INTO "country" ("iso_2", "iso_3", "num_code", "name", "display_name") VALUES ($1, $2, $3, $4, $5)`

        const iso2 = c.alpha2.toLowerCase()
        const iso3 = c.alpha3.toLowerCase()
        const numeric = c.numeric
        const name = c.name.toUpperCase()
        const display = c.name

        await manager.queryRunner.query(query, [
          iso2,
          iso3,
          numeric,
          name,
          display,
        ])
      }
    }
  })

  await entityManager.transaction(async (manager) => {
    const currencyRepo = manager.getCustomRepository(currencyRepository)
    const hasCurrencies = await currencyRepo.findOne()
    if (!hasCurrencies) {
      for (const [, c] of Object.entries(currencies)) {
        const query = `INSERT INTO "currency" ("code", "symbol", "symbol_native", "name") VALUES ($1, $2, $3, $4)`

        const code = c.code.toLowerCase()
        const sym = c.symbol
        const nat = c.symbol_native
        const name = c.name

        await manager.queryRunner.query(query, [code, sym, nat, name])
      }
    }
  })

  await entityManager.transaction(async (manager) => {
    await storeService.withTransaction(manager).create()

    const pProviderService = container.resolve("paymentProviderService")

    const payProviders =
      silentResolution(container, "paymentProviders", logger) || []

    const payIds = payProviders.map((p) => p.getIdentifier())

    await pProviderService.registerInstalledProviders(payIds)

    const nProviderService = container.resolve("notificationService")

    const notiProviders =
      silentResolution(container, "notificationProviders", logger) || []

    const notiIds = notiProviders.map((p) => p.getIdentifier())
    await nProviderService.registerInstalledProviders(notiIds)

    const fProviderService = container.resolve("fulfillmentProviderService")

    const fulfilProviders =
      silentResolution(container, "fulfillmentProviders", logger) || []

    const fulfilIds = fulfilProviders.map((p) => p.getIdentifier())
    await fProviderService.registerInstalledProviders(fulfilIds)

    const tProviderService = container.resolve("taxProviderService")

    const taxProviders =
      silentResolution(container, "taxProviders", logger) || []

    const taxIds = taxProviders.map((p) => p.getIdentifier())
    await tProviderService.registerInstalledProviders(taxIds)

    await profileService.withTransaction(manager).createDefault()
    await profileService.withTransaction(manager).createGiftCardDefault()
  })
}
