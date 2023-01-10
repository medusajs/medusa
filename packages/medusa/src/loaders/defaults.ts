import {
  BaseFulfillmentService,
  BaseNotificationService,
  BasePaymentService,
} from "medusa-interfaces"
import { currencies } from "../utils/currencies"
import { countries } from "../utils/countries"
import { AwilixContainer } from "awilix"
import { Logger } from "../types/global"
import { EntityManager } from "typeorm"
import { CountryRepository } from "../repositories/country"
import {
  FulfillmentProviderService,
  NotificationService,
  PaymentProviderService,
  SalesChannelService,
  ShippingProfileService,
  StoreService,
  TaxProviderService,
} from "../services"
import { CurrencyRepository } from "../repositories/currency"
import { FlagRouter } from "../utils/flag-router"
import SalesChannelFeatureFlag from "./feature-flags/sales-channels"
import {
  AbstractPaymentProcessor,
  AbstractPaymentService,
  AbstractTaxService,
} from "../interfaces"

const silentResolution = <T>(
  container: AwilixContainer,
  name: string,
  logger: Logger
): T | never | undefined => {
  try {
    return container.resolve<T>(name)
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
    return
  }
}

export default async ({
  container,
}: {
  container: AwilixContainer
}): Promise<void> => {
  const storeService = container.resolve<StoreService>("storeService")
  const currencyRepository =
    container.resolve<typeof CurrencyRepository>("currencyRepository")
  const countryRepository =
    container.resolve<typeof CountryRepository>("countryRepository")
  const profileService = container.resolve<ShippingProfileService>(
    "shippingProfileService"
  )
  const salesChannelService = container.resolve<SalesChannelService>(
    "salesChannelService"
  )
  const logger = container.resolve<Logger>("logger")
  const featureFlagRouter = container.resolve<FlagRouter>("featureFlagRouter")

  const entityManager = container.resolve<EntityManager>("manager")

  await entityManager.transaction(async (manager: EntityManager) => {
    const countryRepo = manager.getCustomRepository(countryRepository)
    const hasCountries = await countryRepo.findOne()
    if (!hasCountries) {
      for (const c of countries) {
        const query = `INSERT INTO "country" ("iso_2", "iso_3", "num_code", "name", "display_name")
                       VALUES ($1, $2, $3, $4, $5)`

        const iso2 = c.alpha2.toLowerCase()
        const iso3 = c.alpha3.toLowerCase()
        const numeric = c.numeric
        const name = c.name.toUpperCase()
        const display = c.name

        await manager.queryRunner?.query(query, [
          iso2,
          iso3,
          numeric,
          name,
          display,
        ])
      }
    }
  })

  await entityManager.transaction(async (manager: EntityManager) => {
    const currencyRepo = manager.getCustomRepository(currencyRepository)
    const hasCurrencies = await currencyRepo.findOne()
    if (!hasCurrencies) {
      for (const [, c] of Object.entries(currencies)) {
        const query = `INSERT INTO "currency" ("code", "symbol", "symbol_native", "name")
                       VALUES ($1, $2, $3, $4)`

        const code = c.code.toLowerCase()
        const sym = c.symbol
        const nat = c.symbol_native
        const name = c.name

        await manager.queryRunner?.query(query, [code, sym, nat, name])
      }
    }
  })

  await entityManager.transaction(async (manager: EntityManager) => {
    await storeService.withTransaction(manager).create()

    const context = { container, manager, logger }
    await registerPaymentProvider(context)
    await registerNotificationProvider(context)
    await registerFulfillmentProvider(context)
    await registerTaxProvider(context)

    const profileServiceTx = profileService.withTransaction(manager)
    await profileServiceTx.createDefault()
    await profileServiceTx.createGiftCardDefault()

    const isSalesChannelEnabled = featureFlagRouter.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )
    if (isSalesChannelEnabled) {
      await salesChannelService.withTransaction(manager).createDefault()
    }
  })
}

async function registerPaymentProvider({
  manager,
  container,
  logger,
}: {
  container: AwilixContainer
  manager: EntityManager
  logger: Logger
}): Promise<void> {
  const payProviders =
    silentResolution<
      (
        | typeof BasePaymentService
        | AbstractPaymentService
        | AbstractPaymentProcessor
      )[]
    >(container, "paymentProviders", logger) || []

  const payIds: string[] = []
  await Promise.all(
    payProviders.map((paymentProvider) => {
      payIds.push(paymentProvider.getIdentifier())

      if (paymentProvider instanceof AbstractPaymentProcessor) {
        return paymentProvider.init()
      }

      return
    })
  )

  const pProviderService = container.resolve<PaymentProviderService>(
    "paymentProviderService"
  )
  await pProviderService
    .withTransaction(manager)
    .registerInstalledProviders(payIds)
}

async function registerNotificationProvider({
  manager,
  container,
  logger,
}: {
  container: AwilixContainer
  manager: EntityManager
  logger: Logger
}): Promise<void> {
  const notiProviders =
    silentResolution<typeof BaseNotificationService[]>(
      container,
      "notificationProviders",
      logger
    ) || []
  const notiIds = notiProviders.map((p) => p.getIdentifier())

  const nProviderService = container.resolve<NotificationService>(
    "notificationService"
  )
  await nProviderService
    .withTransaction(manager)
    .registerInstalledProviders(notiIds)
}

async function registerFulfillmentProvider({
  manager,
  container,
  logger,
}: {
  container: AwilixContainer
  manager: EntityManager
  logger: Logger
}): Promise<void> {
  const fulfilProviders =
    silentResolution<typeof BaseFulfillmentService[]>(
      container,
      "fulfillmentProviders",
      logger
    ) || []
  const fulfilIds = fulfilProviders.map((p) => p.getIdentifier())

  const fProviderService = container.resolve<FulfillmentProviderService>(
    "fulfillmentProviderService"
  )
  await fProviderService
    .withTransaction(manager)
    .registerInstalledProviders(fulfilIds)
}

async function registerTaxProvider({
  manager,
  container,
  logger,
}: {
  container: AwilixContainer
  manager: EntityManager
  logger: Logger
}): Promise<void> {
  const taxProviders =
    silentResolution<AbstractTaxService[]>(container, "taxProviders", logger) ||
    []
  const taxIds = taxProviders.map((p) => p.getIdentifier())

  const tProviderService =
    container.resolve<TaxProviderService>("taxProviderService")
  await tProviderService
    .withTransaction(manager)
    .registerInstalledProviders(taxIds)
}
