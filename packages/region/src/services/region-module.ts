import {
  Context,
  CountryDTO,
  CreateRegionDTO,
  DAL,
  FilterableRegionProps,
  InternalModuleDeclaration,
  IRegionModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  RegionCountryDTO,
  RegionCurrencyDTO,
  RegionDTO,
  UpdatableRegionFields,
  UpdateRegionDTO,
} from "@medusajs/types"
import {
  arrayDifference,
  InjectManager,
  InjectTransactionManager,
  isObject,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

import { Country, Currency, Region } from "@models"

import { DefaultsUtils } from "@medusajs/utils"
import { CreateCountryDTO, CreateCurrencyDTO } from "@types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

const COUNTRIES_LIMIT = 1000

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  regionService: ModulesSdkTypes.InternalModuleService<any>
  countryService: ModulesSdkTypes.InternalModuleService<any>
  currencyService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [Country, Currency]

export default class RegionModuleService<
    TRegion extends Region = Region,
    TCountry extends Country = Country,
    TCurrency extends Currency = Currency
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    RegionDTO,
    {
      Country: {
        dto: RegionCountryDTO
      }
      Currency: {
        dto: RegionCurrencyDTO
      }
    }
  >(Region, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IRegionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly regionService_: ModulesSdkTypes.InternalModuleService<TRegion>
  protected readonly countryService_: ModulesSdkTypes.InternalModuleService<TCountry>
  protected readonly currencyService_: ModulesSdkTypes.InternalModuleService<TCurrency>

  constructor(
    {
      baseRepository,
      regionService,
      countryService,
      currencyService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.regionService_ = regionService
    this.countryService_ = countryService
    this.currencyService_ = currencyService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async create(
    data: CreateRegionDTO[],
    sharedContext?: Context
  ): Promise<RegionDTO[]>
  async create(
    data: CreateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>
  @InjectManager("baseRepository_")
  async create(
    data: CreateRegionDTO | CreateRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.create_(input, sharedContext)

    return await this.baseRepository_.serialize<RegionDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    data: CreateRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Region[]> {
    let normalizedRequest = data.map((d) => ({
      ...d,
      currency_code: d.currency_code.toLowerCase(),
    }))

    const validations = [
      this.validateCurrencies(
        normalizedRequest.map((d) => d.currency_code),
        sharedContext
      ),
      this.validateCountries(
        normalizedRequest.map((d) => d.countries ?? []),
        sharedContext
      ),
    ] as const

    // Assign the full country object so the ORM updates the relationship
    const [, dbCountries] = await Promise.all(validations)
    const dbCountriesMap = asMap(dbCountries, "iso_2")
    normalizedRequest = normalizedRequest.map((d) => ({
      ...d,
      countries: (d.countries ?? []).map((c) => dbCountriesMap[c]),
    }))

    // Create the regions and update the country region_id
    return await this.regionService_.create(normalizedRequest, sharedContext)
  }

  async update(
    selector: FilterableRegionProps,
    data: UpdatableRegionFields,
    sharedContext?: Context
  ): Promise<RegionDTO[]>
  async update(
    regionId: string,
    data: UpdatableRegionFields,
    sharedContext?: Context
  ): Promise<RegionDTO>
  async update(data: UpdateRegionDTO[]): Promise<RegionDTO[]>
  @InjectManager("baseRepository_")
  async update(
    idOrSelectorOrData: string | FilterableRegionProps | UpdateRegionDTO[],
    data?: UpdatableRegionFields,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    const result = await this.update_(idOrSelectorOrData, data, sharedContext)

    const regions = await this.baseRepository_.serialize<
      RegionDTO[] | RegionDTO
    >(result)

    return isString(idOrSelectorOrData) ? regions[0] : regions
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    idOrSelectorOrData: string | FilterableRegionProps | UpdateRegionDTO[],
    data?: UpdatableRegionFields,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Region[]> {
    let normalizedRequest: UpdateRegionDTO[] = []
    if (isString(idOrSelectorOrData)) {
      normalizedRequest = [{ id: idOrSelectorOrData, ...data }]
    }

    if (Array.isArray(idOrSelectorOrData)) {
      normalizedRequest = idOrSelectorOrData
    }

    if (isObject(idOrSelectorOrData)) {
      const regions = await this.regionService_.list(
        idOrSelectorOrData,
        {},
        sharedContext
      )

      normalizedRequest = regions.map((region) => ({
        id: region.id,
        ...data,
      }))
    }

    normalizedRequest = normalizedRequest.map((d) => ({
      ...d,
      ...(d.currency_code
        ? { currency_code: d.currency_code.toLowerCase() }
        : {}),
    }))

    // Bring the countries to a clean slate, before proceeding with the update
    // Somewhat less efficient, but region operations will be very rare, so it is better to go with a simple solution
    await this.countryService_.update(
      {
        selector: { region_id: normalizedRequest.map((d) => d.id).flat() },
        data: { region_id: null },
      },
      sharedContext
    )

    const validations = [
      this.validateCurrencies(
        normalizedRequest.map((d) => d.currency_code),
        sharedContext
      ),
      this.validateCountries(
        normalizedRequest.map((d) => d.countries ?? []),
        sharedContext
      ),
    ] as const

    // Assign the full country object so the ORM updates the relationship
    const [, dbCountries] = await Promise.all(validations)
    const dbCountriesMap = asMap(dbCountries, "iso_2")
    normalizedRequest = normalizedRequest.map((d) => ({
      ...d,
      countries: (d.countries ?? []).map((c) => dbCountriesMap[c]),
    }))

    const result = await this.regionService_.update(
      normalizedRequest,
      sharedContext
    )

    return result
  }

  @InjectManager("baseRepository_")
  private async validateCurrencies(
    currencyCodes: (string | undefined)[] | undefined,
    sharedContext: Context
  ): Promise<void> {
    const normalizedCurrencyCodes = currencyCodes
      ?.filter((c) => c !== undefined)
      .map((c) => c!.toLowerCase())

    if (!normalizedCurrencyCodes || !normalizedCurrencyCodes.length) {
      return
    }

    const uniqueCurrencyCodes = Array.from(new Set(normalizedCurrencyCodes))
    const dbCurrencies = await this.currencyService_.list(
      { code: uniqueCurrencyCodes },
      {},
      sharedContext
    )
    const dbCurrencyCodes = dbCurrencies.map((c) => c.code.toLowerCase())

    if (uniqueCurrencyCodes.length !== dbCurrencyCodes.length) {
      const missingCurrencies = arrayDifference(
        uniqueCurrencyCodes,
        dbCurrencyCodes
      )

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Currencies with codes: "${missingCurrencies.join(
          ", "
        )}" were not found`
      )
    }
  }

  @InjectManager("baseRepository_")
  private async validateCountries(
    countries: string[][] | undefined,
    sharedContext: Context
  ): Promise<TCountry[]> {
    const flatCountries = countries?.flat()
    if (!flatCountries || !flatCountries.length) {
      return []
    }

    // The new regions being created have a country conflict
    const uniqueCountries = Array.from(new Set(flatCountries))
    if (uniqueCountries.length !== flatCountries.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${getDuplicateEntries(flatCountries).join(
          ", "
        )}" are already assigned to a region`
      )
    }

    const countriesInDb = await this.countryService_.list(
      { iso_2: uniqueCountries },
      { select: ["iso_2", "region_id"] },
      sharedContext
    )
    const countryCodesInDb = countriesInDb.map((c) => c.iso_2.toLowerCase())

    // Countries missing in the database
    if (countriesInDb.length !== uniqueCountries.length) {
      const missingCountries = arrayDifference(
        uniqueCountries,
        countryCodesInDb
      )

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${missingCountries.join(", ")}" do not exist`
      )
    }

    // Countries that already have a region already assigned to them
    const countriesWithRegion = countriesInDb.filter((c) => !!c.region_id)
    if (countriesWithRegion.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${countriesWithRegion
          .map((c) => c.iso_2)
          .join(", ")}" are already assigned to a region`
      )
    }

    return countriesInDb
  }

  @InjectManager("baseRepository_")
  public async createDefaultCountriesAndCurrencies(
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await promiseAll([
      await this.maybeCreateCountries(sharedContext),
      await this.maybeCreateCurrencies(sharedContext),
    ])
  }

  @InjectTransactionManager("baseRepository_")
  private async maybeCreateCountries(
    @MedusaContext() sharedContext: Context
  ): Promise<void> {
    const [countries, count] = await this.countryService_.listAndCount(
      {},
      { select: ["iso_2"], take: COUNTRIES_LIMIT },
      sharedContext
    )

    let countsToCreate: CreateCountryDTO[] = []
    if (count !== DefaultsUtils.defaultCountries.length) {
      const countriesInDb = new Set(countries.map((c) => c.iso_2))

      const countriesToAdd = DefaultsUtils.defaultCountries.filter(
        (c) => !countriesInDb.has(c.alpha2.toLowerCase())
      )

      countsToCreate = countriesToAdd.map((c) => ({
        iso_2: c.alpha2.toLowerCase(),
        iso_3: c.alpha3.toLowerCase(),
        num_code: c.numeric,
        name: c.name.toUpperCase(),
        display_name: c.name,
      }))
    }

    if (countsToCreate.length) {
      await this.countryService_.create(countsToCreate, sharedContext)
    }
  }

  @InjectTransactionManager("baseRepository_")
  private async maybeCreateCurrencies(
    @MedusaContext() sharedContext: Context
  ): Promise<void> {
    const [currency] = await this.currencyService_.list(
      {},
      { select: ["code"], take: 1 },
      sharedContext
    )

    let currsToCreate: CreateCurrencyDTO[] = []
    if (!currency) {
      currsToCreate = Object.entries(DefaultsUtils.defaultCurrencies).map(
        ([code, currency]) => ({
          code: code.toLowerCase(),
          symbol: currency.symbol,
          symbol_native: currency.symbol_native,
          name: currency.name,
        })
      )
    }

    if (currsToCreate.length) {
      await this.currencyService_.create(currsToCreate, sharedContext)
    }
  }
}

const asMap = <T extends Record<string, any>>(
  collection: T[],
  key: keyof T
) => {
  return collection.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {} as Record<keyof T, T>)
}

const getDuplicateEntries = (collection: string[]): string[] => {
  const uniqueElements = new Set()
  const duplicates: string[] = []

  collection.forEach((item) => {
    if (uniqueElements.has(item)) {
      duplicates.push(item)
    } else {
      uniqueElements.add(item)
    }
  })

  return duplicates
}
