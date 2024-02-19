import { Modules } from "@medusajs/modules-sdk"
import { IRegionModuleService } from "@medusajs/types"
import { DefaultsUtils } from "@medusajs/utils"
import { initModules } from "medusa-test-utils"
import { MikroOrmWrapper } from "../utils"
import { getInitModuleConfig } from "../utils/get-init-module-config"

jest.setTimeout(30000)

describe("Region Module Service", () => {
  let service: IRegionModuleService
  let shutdownFunc: () => Promise<void>

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()

    const initModulesConfig = getInitModuleConfig()
    const { medusaApp, shutdown } = await initModules(initModulesConfig)
    service = medusaApp.modules[Modules.REGION]

    shutdownFunc = shutdown
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
    await shutdownFunc()
  })

  it("should create countries and currencies on application start", async () => {
    const countries = await service.listCountries()
    const currencies = await service.listCurrencies()

    expect(countries.length).toBeGreaterThan(0)
    expect(currencies.length).toBeGreaterThan(0)
  })

  it("should create countries added to default ones", async () => {
    const [, count] = await service.listAndCountCountries()
    const initialCountries = DefaultsUtils.defaultCountries.length

    expect(count).toEqual(initialCountries)

    DefaultsUtils.defaultCountries.push({
      name: "Dogecoin",
      alpha2: "DOGE",
      alpha3: "DOGE",
      numeric: "420",
    })

    await service.createDefaultCountriesAndCurrencies()

    const [, newCount] = await service.listAndCountCountries()
    expect(newCount).toEqual(initialCountries + 1)
  })

  it("should create and list a region", async () => {
    const createdRegion = await service.create({
      name: "Europe",
      currency_code: "EUR",
    })

    expect(createdRegion).toEqual(
      expect.objectContaining({
        id: createdRegion.id,
        name: "Europe",
        currency_code: "eur",
        countries: [],
      })
    )

    const region = await service.retrieve(createdRegion.id, {
      relations: ["currency", "countries"],
    })

    expect(region).toEqual(
      expect.objectContaining({
        id: region.id,
        name: "Europe",
        currency_code: "eur",
        currency: expect.objectContaining({
          code: "eur",
          name: "Euro",
        }),
        countries: [],
      })
    )
  })

  it("should create a region with countries", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    const region = await service.retrieve(createdRegion.id, {
      relations: ["countries", "currency"],
    })

    expect(region).toEqual(
      expect.objectContaining({
        id: region.id,
        name: "North America",
        currency_code: "usd",
        currency: expect.objectContaining({
          code: "usd",
          name: "US Dollar",
        }),
        countries: [
          expect.objectContaining({
            display_name: "Canada",
            iso_2: "ca",
          }),
          expect.objectContaining({
            display_name: "United States",
            iso_2: "us",
          }),
        ],
      })
    )
  })

  it("should throw when country doesn't exist", async () => {
    await expect(
      service.create({
        name: "North America",
        currency_code: "USD",
        countries: ["neverland"],
      })
    ).rejects.toThrowError('Countries with codes: "neverland" do not exist')
  })

  it("should throw when country is already assigned to a region", async () => {
    await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us"],
    })

    await expect(
      service.create({
        name: "United States",
        currency_code: "USD",
        countries: ["us"],
      })
    ).rejects.toThrowError(
      'Countries with codes: "us" are already assigned to a region'
    )
  })

  it("should throw when country is being assigned to multiple regions", async () => {
    await expect(
      service.create([
        {
          name: "United States",
          currency_code: "USD",
          countries: ["us"],
        },
        {
          name: "North America",
          currency_code: "USD",
          countries: ["us"],
        },
      ])
    ).rejects.toThrowError(
      'Countries with codes: "us" are already assigned to a region'
    )
  })

  it("should update the region successfully", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    await service.update(createdRegion.id, {
      name: "Americas",
      currency_code: "MXN",
      countries: ["us", "mx"],
    })

    const latestRegion = await service.retrieve(createdRegion.id, {
      relations: ["currency", "countries"],
    })

    expect(latestRegion).toMatchObject({
      id: createdRegion.id,
      name: "Americas",
      currency_code: "mxn",
    })

    expect(latestRegion.countries.map((c) => c.iso_2).sort()).toEqual([
      "mx",
      "us",
    ])
  })

  it("should update the region without affecting countries if countries are undefined", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    await service.update(createdRegion.id, {
      name: "Americas",
      currency_code: "MXN",
    })

    const updatedRegion = await service.retrieve(createdRegion.id, {
      relations: ["currency", "countries"],
    })

    expect(updatedRegion).toMatchObject({
      id: createdRegion.id,
      name: "Americas",
      currency_code: "mxn",
    })

    expect(updatedRegion.countries.map((c) => c.iso_2).sort()).toEqual([
      "ca",
      "us",
    ])
  })

  it("should remove the countries in a region successfully", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    await service.update(createdRegion.id, {
      name: "Americas",
      currency_code: "MXN",
      countries: [],
    })

    const updatedRegion = await service.retrieve(createdRegion.id, {
      relations: ["currency", "countries"],
    })

    expect(updatedRegion).toMatchObject({
      id: createdRegion.id,
      name: "Americas",
      currency_code: "mxn",
    })

    expect(updatedRegion.countries).toHaveLength(0)
  })

  it("should fail updating the region currency to a non-existent one", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    await expect(
      service.update(
        { id: createdRegion.id },
        {
          currency_code: "DOGECOIN",
        }
      )
    ).rejects.toThrowError('Currencies with codes: "dogecoin" were not found')
  })

  it("should fail updating the region countries to non-existent ones", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    await expect(
      service.update(
        { id: createdRegion.id },
        {
          countries: ["us", "neverland"],
        }
      )
    ).rejects.toThrowError('Countries with codes: "neverland" do not exist')
  })

  it("should fail updating the region if there are duplicate countries", async () => {
    const createdRegion = await service.create({
      name: "North America",
      currency_code: "USD",
      countries: ["us", "ca"],
    })

    await expect(
      service.update(
        { id: createdRegion.id },
        {
          countries: ["us", "us"],
        }
      )
    ).rejects.toThrowError(
      'Countries with codes: "us" are already assigned to a region'
    )
  })

  it("should fail updating the region if country is already used", async () => {
    const [createdRegion] = await service.create([
      {
        name: "North America",
        currency_code: "USD",
        countries: ["us", "ca"],
      },
      {
        name: "Americas",
        currency_code: "USD",
        countries: ["mx"],
      },
    ])

    await expect(
      service.update(
        { id: createdRegion.id },
        {
          countries: ["us", "mx"],
        }
      )
    ).rejects.toThrowError(
      'Countries with codes: "mx" are already assigned to a region'
    )
  })

  it("should fail when currency does not exist", async () => {
    await expect(
      service.create({
        name: "Europe",
        currency_code: "DOGECOIN",
      })
    ).rejects.toThrowError('Currencies with codes: "dogecoin" were not found')
  })
})
