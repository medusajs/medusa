import { MockManager, MockRepository } from "medusa-test-utils"
import TaxProviderService from "../tax-provider"

describe("TaxProviderService", () => {
  describe("retrieveProvider", () => {
    const container = {
      manager: MockManager,
      productTaxRateService: {},
      systemTaxService: "system",
      tp_test: "good",
    }

    const providerService = new TaxProviderService(container)

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
    const container = {
      manager: MockManager,
      lineItemTaxLineRepository: MockRepository({ create: (d) => d }),
      systemTaxService: {
        getTaxLines: mockCalculateLineItemTaxes,
      },
    }

    test("success", async () => {
      const providerService = new TaxProviderService(container)
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

      const rates = await providerService.getTaxLines(cart, calcContext)

      expect(rates).toEqual(expected)

      expect(container.lineItemTaxLineRepository.create).toHaveBeenCalledTimes(
        1
      )
      expect(container.lineItemTaxLineRepository.create).toHaveBeenCalledWith(
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
        calcContext
      )
    })
  })

  describe("getRegionRatesForProduct", () => {
    const container = {
      manager: MockManager,
      productTaxRateService: {
        list: jest.fn(),
      },
    }

    test("success", async () => {
      container.productTaxRateService = {
        list: jest.fn([]),
      }

      const providerService = new TaxProviderService(container)
      providerService.getCacheEntry = jest.fn(() => null)
      providerService.setCache = jest.fn()

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

      expect(providerService.getCacheEntry).toHaveBeenCalledTimes(1)
      expect(providerService.getCacheEntry).toHaveBeenCalledWith(
        "prod_id",
        "reg_id"
      )

      expect(providerService.setCache).toHaveBeenCalledTimes(1)
      expect(providerService.setCache).toHaveBeenCalledWith(
        "prod_id",
        "reg_id",
        expected
      )
    })

    test("success - without product rates", async () => {
      container.productTaxRateService = {
        list: jest.fn(() => Promise.resolve([])),
      }

      const providerService = new TaxProviderService(container)
      providerService.getCacheEntry = jest.fn(() => null)
      providerService.setCache = jest.fn()

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
      expect(container.productTaxRateService.list).toHaveBeenCalledTimes(1)
      expect(container.productTaxRateService.list).toHaveBeenCalledWith({
        product_id: "prod_id",
        rate_id: ["reg_rate"],
      })

      expect(providerService.setCache).toHaveBeenCalledTimes(1)
      expect(providerService.setCache).toHaveBeenCalledWith(
        "prod_id",
        "reg_id",
        expected
      )

      expect(rates).toEqual(expected)
    })

    test("success - with product rates", async () => {
      container.productTaxRateService = {
        list: jest.fn(() =>
          Promise.resolve([
            {
              rate_id: "reg_rate",
            },
          ])
        ),
      }

      const providerService = new TaxProviderService(container)
      providerService.getCacheEntry = jest.fn(() => null)
      providerService.setCache = jest.fn()

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
      expect(container.productTaxRateService.list).toHaveBeenCalledTimes(1)
      expect(container.productTaxRateService.list).toHaveBeenCalledWith({
        product_id: "prod_id",
        rate_id: ["reg_rate"],
      })

      expect(providerService.setCache).toHaveBeenCalledTimes(1)
      expect(providerService.setCache).toHaveBeenCalledWith(
        "prod_id",
        "reg_id",
        expected
      )

      expect(rates).toEqual(expected)
    })

    test("fail - unexpected", async () => {
      container.productTaxRateService = {
        list: jest.fn(() =>
          Promise.resolve([
            {
              rate: 20,
              name: "PTR",
              code: "ptr",
            },
          ])
        ),
      }

      const providerService = new TaxProviderService(container)
      providerService.getCacheEntry = jest.fn(() => null)
      providerService.setCache = jest.fn()

      await expect(
        providerService.getRegionRatesForProduct("prod_id", {
          id: "reg_id",
          tax_rates: [{ id: "reg_rate" }],
          tax_rate: 12.5,
        })
      ).rejects.toThrow("An error occured while calculating tax rates")
    })
  })

  describe("getCacheKey", () => {
    const container = {
      manager: MockManager,
      productTaxRateService: {},
      systemTaxService: "system",
      tp_test: "good",
    }

    const providerService = new TaxProviderService(container)

    test("formats correctly", () => {
      expect(providerService.getCacheKey("product", "region")).toEqual(
        "txrtcache:product:region"
      )
    })
  })
})

const getTaxLineFactory = ({ items, region }) => {
  const cart = {
    items: items.map((i) => {
      return {
        id: i.id,
        variant: {
          product_id: i.product_id,
        },
      }
    }),
  }

  const calculationContext = {
    region,
    customer: {},
    allocation_map: {},
    shipping_address: {},
  }

  return { cart, calculationContext }
}
