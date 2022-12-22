import { asValue, createContainer } from "awilix"
import TaxProviderService from "../tax-provider"
import { defaultContainer, getCacheKey, getTaxLineFactory } from "../__fixtures__/tax-provider";

describe("TaxProviderService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  describe("retrieveProvider", () => {
    const providerService = defaultContainer.resolve("taxProviderService")

    it("successfully retrieves system provider", () => {
      const provider = providerService.retrieveProvider({
        tax_provider_id: null,
      })
      expect(provider).toEqual("system")
    })

    it("successfully retrieves external provider", () => {
      const provider = providerService.retrieveProvider({
        tax_provider_id: "test",
      })
      expect(provider).toEqual("good")
    })

    it("fails when payment provider not found", () => {
      expect.assertions(1)

      try {
        providerService.retrieveProvider({ tax_provider_id: "unregistered" })
      } catch (err) {
        expect(err.message).toEqual(
          "Could not find a tax provider with id: unregistered"
        )
      }
    })
  })

  describe("getTaxLines", () => {
    const mockCalculateLineItemTaxes = jest.fn(() => [
      {
        rate: 5,
        name: "test vat",
        code: "test_vat",
        item_id: "item_1",
      },
    ])
    const container = createContainer({}, defaultContainer)
    container.register("systemTaxService", asValue({
      getTaxLines: mockCalculateLineItemTaxes,
    }))

    test("success", async () => {
      const providerService = container.resolve("taxProviderService")
      providerService.getRegionRatesForProduct = jest.fn(() => [])

      const region = { id: "test", tax_provider_id: null }
      const { cart, calculationContext: calcContext } = getTaxLineFactory({
        items: [{ id: "item_1", product_id: "prod_1" }],
        region,
      })

      const expected = [
        {
          item_id: "item_1",
          rate: 5,
          name: "test vat",
          code: "test_vat",
          metadata: undefined,
        },
      ]

      const rates = await providerService.getTaxLines(cart.items, calcContext)

      expect(rates).toEqual(expected)

      const lineItemTaxLineRepository = container.resolve("lineItemTaxLineRepository")
      expect(lineItemTaxLineRepository.create).toHaveBeenCalledTimes(
        1
      )
      expect(lineItemTaxLineRepository.create).toHaveBeenCalledWith(
        expected[0]
      )

      expect(providerService.getRegionRatesForProduct).toHaveBeenCalledTimes(1)
      expect(providerService.getRegionRatesForProduct).toHaveBeenCalledWith(
        "prod_1",
        region
      )

      expect(mockCalculateLineItemTaxes).toHaveBeenCalledTimes(1)
      expect(mockCalculateLineItemTaxes).toHaveBeenCalledWith(
        [
          {
            item: cart.items[0],
            rates: [],
          },
        ],
        [],
        calcContext
      )
    })
  })

  describe("getRegionRatesForProduct", () => {
    const container = createContainer({}, defaultContainer)
    container.register("taxRateService", asValue({
      withTransaction: function () {
        return this
      },
      listByProduct: jest.fn(() => Promise.resolve([])),
    }))

    test("success", async () => {
      const providerService = container.resolve("taxProviderService")

      const rates = await providerService.getRegionRatesForProduct("prod_id", {
        id: "reg_id",
        tax_rates: [],
        tax_rate: 12.5,
      })

      const expected = [
        {
          rate: 12.5,
          name: "default",
          code: "default",
        },
      ]
      expect(rates).toEqual(expected)

      const cacheService = container.resolve("cacheService")
      const cacheKey = getCacheKey("prod_id", "reg_id")

      expect(cacheService.get).toHaveBeenCalledTimes(1)
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey)

      expect(cacheService.set).toHaveBeenCalledTimes(1)
      expect(cacheService.set).toHaveBeenCalledWith(
        cacheKey,
        expected
      )
    })

    test("success - without product rates", async () => {
      const providerService = container.resolve("taxProviderService")

      const rates = await providerService.getRegionRatesForProduct("prod_id", {
        id: "reg_id",
        tax_rates: [{ id: "reg_rate", rate: 20, name: "PTR", code: "ptr" }],
        tax_rate: 12.5,
      })

      const expected = [
        {
          rate: 12.5,
          name: "default",
          code: "default",
        },
      ]

      const taxRateService = container.resolve("taxRateService")

      expect(taxRateService.listByProduct).toHaveBeenCalledTimes(1)
      expect(taxRateService.listByProduct).toHaveBeenCalledWith(
        "prod_id",
        { region_id: "reg_id" }
      )

      const cacheService = container.resolve("cacheService")
      const cacheKey = getCacheKey("prod_id", "reg_id")

      expect(cacheService.get).toHaveBeenCalledTimes(1)
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey)

      expect(cacheService.set).toHaveBeenCalledTimes(1)
      expect(cacheService.set).toHaveBeenCalledWith(
        cacheKey,
        expected
      )

      expect(rates).toEqual(expected)
    })

    test("success - with product rates", async () => {
      const container = createContainer({}, defaultContainer)
      container.register("taxRateService", asValue({
        withTransaction: function () {
          return this
        },
        listByProduct: jest.fn(() =>
          Promise.resolve([
            {
              rate: 20,
              name: "PTR",
              code: "ptr",
            },
          ])
        ),
      }))

      const providerService = container.resolve("taxProviderService")

      const rates = await providerService.getRegionRatesForProduct("prod_id", {
        id: "reg_id",
        tax_rates: [{ id: "reg_rate", rate: 20, name: "PTR", code: "ptr" }],
        tax_rate: 12.5,
      })

      const expected = [
        {
          rate: 20,
          name: "PTR",
          code: "ptr",
        },
      ]

      const taxRateService = container.resolve("taxRateService")

      expect(taxRateService.listByProduct).toHaveBeenCalledTimes(1)
      expect(taxRateService.listByProduct).toHaveBeenCalledWith(
        "prod_id",
        { region_id: "reg_id" }
      )

      const cacheService = container.resolve("cacheService")
      const cacheKey = getCacheKey("prod_id", "reg_id")

      expect(cacheService.get).toHaveBeenCalledTimes(1)
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey)

      expect(cacheService.set).toHaveBeenCalledTimes(1)
      expect(cacheService.set).toHaveBeenCalledWith(
        cacheKey,
        expected
      )

      expect(rates).toEqual(expected)
    })
  })

  describe("getCacheKey", () => {
    const providerService = defaultContainer.resolve("taxProviderService")

    test("formats correctly", () => {
      expect(providerService.getCacheKey("product", "region")).toEqual(
        "txrtcache:product:region"
      )
    })
  })
})
