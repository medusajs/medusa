import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import ProductVariantService from "../product-variant"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
}

describe("ProductVariantService", () => {
  describe("retrieve", () => {
    const productVariantRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === IdMap.getId("batman")) {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({ id: IdMap.getId("ironman") })
      },
    })

    const cartRepository = MockRepository({
      findOne: (data) => {
        return Promise.resolve({})
      },
    })

    const priceSelectionStrat = {
      calculateVariantPrice: (variantId, context) => {
        return {
          originalPrice: null,
          calculatedPrice: null,
          prices: [],
        }
      },
    }
    const priceSelectionStrategy = {
      withTransaction: (manager) => {
        return priceSelectionStrat
      },
    }

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      productVariantRepository,
      cartRepository,
      priceSelectionStrategy,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a product variant", async () => {
      const result = await productVariantService.retrieve(
        IdMap.getId("ironman")
      )

      expect(productVariantRepository.findOne).toHaveBeenCalledTimes(1)
      expect(productVariantRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("ironman") },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })

    it("fails on non-existing product variant id", async () => {
      try {
        await productVariantService.retrieve(IdMap.getId("batman"))
      } catch (error) {
        expect(error.message).toBe(
          `Variant with id: ${IdMap.getId("batman")} was not found`
        )
      }
    })
  })

  describe("create", () => {
    const productVariantRepository = MockRepository({
      findOne: (query) => {
        return Promise.resolve()
      },
    })

    const productRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === IdMap.getId("ironmans")) {
          return Promise.resolve({
            id: IdMap.getId("ironman"),
            options: [
              {
                id: IdMap.getId("color"),
                title: "red",
              },
              {
                id: IdMap.getId("size"),
                title: "size",
              },
            ],
            variants: [
              {
                id: IdMap.getId("v1"),
                title: "V1",
                options: [
                  {
                    id: IdMap.getId("test"),
                    option_id: IdMap.getId("color"),
                    value: "blue",
                  },
                  {
                    id: IdMap.getId("test"),
                    option_id: IdMap.getId("size"),
                    value: "large",
                  },
                ],
              },
            ],
          })
        }
        return Promise.resolve({
          id: IdMap.getId("ironman"),
          options: [
            {
              id: IdMap.getId("color"),
              title: "red",
            },
          ],
          variants: [
            {
              id: IdMap.getId("v1"),
              title: "V1",
              options: [
                {
                  id: IdMap.getId("test"),
                  option_id: IdMap.getId("color"),
                  value: "blue",
                },
              ],
            },
          ],
        })
      },
    })

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      productVariantRepository,
      productRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully create product variant", async () => {
      await productVariantService.create(IdMap.getId("ironman"), {
        id: IdMap.getId("v2"),
        options: [
          {
            id: IdMap.getId("test"),
            option_id: IdMap.getId("color"),
            value: "red",
          },
        ],
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)

      expect(productVariantRepository.create).toHaveBeenCalledTimes(1)
      expect(productVariantRepository.create).toHaveBeenCalledWith({
        id: IdMap.getId("v2"),
        product_id: IdMap.getId("ironman"),
        variant_rank: 1,
        options: [
          {
            id: IdMap.getId("test"),
            option_id: IdMap.getId("color"),
            value: "red",
          },
        ],
      })
    })

    it("fails if product options and variant options differ in length", async () => {
      try {
        await productVariantService.create(IdMap.getId("ironmans"), {
          id: IdMap.getId("v2"),
          options: [
            {
              id: IdMap.getId("test"),
              option_id: IdMap.getId("color"),
              value: "red",
            },
          ],
        })
      } catch (error) {
        expect(error.message).toBe(
          "Product options length does not match variant options length. Product has 2 and variant has 1."
        )
      }
    })

    it("fails if variants options is missing a product option", async () => {
      try {
        await productVariantService.create(IdMap.getId("ironmans"), {
          id: IdMap.getId("v2"),
          options: [
            {
              id: IdMap.getId("test"),
              option_id: IdMap.getId("color"),
              value: "red",
            },
            {
              id: IdMap.getId("test"),
              option_id: IdMap.getId("material"),
              value: "carbon",
            },
          ],
        })
      } catch (error) {
        expect(error.message).toBe(
          "Variant options do not contain value for size"
        )
      }
    })

    it("fails if new option already exists", async () => {
      try {
        await productVariantService.create(IdMap.getId("ironmans"), {
          id: IdMap.getId("v2"),
          options: [
            {
              id: IdMap.getId("test"),
              option_id: IdMap.getId("color"),
              value: "blue",
            },
            {
              id: IdMap.getId("test"),
              option_id: IdMap.getId("size"),
              value: "large",
            },
          ],
        })
      } catch (error) {
        expect(error.message).toBe(
          "Variant with title V1 with provided options already exists"
        )
      }
    })
  })

  describe("update", () => {
    const cartRepository = MockRepository({
      findOne: (data) => {
        return Promise.resolve({})
      },
    })

    const priceSelectionStrat = {
      calculateVariantPrice: (variantId, context) => {
        return {
          originalPrice: null,
          calculatedPrice: null,
          calculatedPriceType: undefined,
          prices: [],
        }
      },
    }

    const priceSelectionStrategy = {
      withTransaction: (manager) => {
        return priceSelectionStrat
      },
    }

    const productVariantRepository = MockRepository({
      findOne: (query) => Promise.resolve({ id: IdMap.getId("ironman") }),
      update: (data) => ({
        generatedMaps: [data],
      }),
      create: (data) => data,
    })

    const moneyAmountRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("some-amount") }),
    })

    const productOptionValueRepository = MockRepository({
      findOne: () =>
        Promise.resolve({ id: IdMap.getId("some-value"), value: "blue" }),
    })

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      moneyAmountRepository,
      productVariantRepository,
      productOptionValueRepository,
      cartRepository,
      priceSelectionStrategy,
    })

    productVariantService.updateOptionValue = jest
      .fn()
      .mockReturnValue(() => Promise.resolve())

    productVariantService.updateVariantPrices = jest
      .fn()
      .mockReturnValue(() => Promise.resolve())

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates variant by id", async () => {
      await productVariantService.update(IdMap.getId("ironman"), {
        title: "new title",
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith([
        {
          eventName: "product-variant.updated",
          data: {
            id: IdMap.getId("ironman"),
            fields: ["title"],
          },
        },
      ])

      expect(productVariantRepository.update).toHaveBeenCalledTimes(1)
      expect(productVariantRepository.update).toHaveBeenCalledWith(
        { id: IdMap.getId("ironman") },
        {
          id: IdMap.getId("ironman"),
          title: "new title",
        }
      )
    })

    it("successfully updates variant", async () => {
      await productVariantService.update(
        { id: IdMap.getId("ironman"), title: "new title" },
        {
          title: "new title 2",
        }
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith([
        {
          eventName: "product-variant.updated",
          data: {
            id: IdMap.getId("ironman"),
            fields: ["title"],
          },
        },
      ])

      expect(productVariantRepository.update).toHaveBeenCalledTimes(1)
      expect(productVariantRepository.update).toHaveBeenCalledWith(
        { id: IdMap.getId("ironman") },
        {
          id: IdMap.getId("ironman"),
          title: "new title 2",
        }
      )
    })

    it("successfully avoid to update variant if the data have not changed", async () => {
      await productVariantService.update(
        { id: IdMap.getId("ironman"), title: "new title" },
        {
          title: "new title",
        }
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(0)

      expect(productVariantRepository.save).toHaveBeenCalledTimes(0)
    })

    it("throws if provided variant is missing an id", async () => {
      try {
        await productVariantService.update(
          { title: "new title" },
          {
            title: "new title",
          }
        )
      } catch (error) {
        expect(error.message).toBe("Variant id missing")
      }
    })

    it("successfully updates variant metadata", async () => {
      await productVariantService.update(IdMap.getId("ironman"), {
        title: "new title",
        metadata: {
          testing: "this",
        },
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith([
        {
          eventName: "product-variant.updated",
          data: {
            id: IdMap.getId("ironman"),
            fields: ["title", "metadata"],
          },
        },
      ])

      expect(productVariantRepository.update).toHaveBeenCalledTimes(1)
      expect(productVariantRepository.update).toHaveBeenCalledWith(
        { id: IdMap.getId("ironman") },
        {
          id: IdMap.getId("ironman"),
          title: "new title",
          metadata: {
            testing: "this",
          },
        }
      )
    })

    it("successfully updates variant inventory_quantity", async () => {
      await productVariantService.update(IdMap.getId("ironman"), {
        title: "new title",
        inventory_quantity: 98,
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith([
        {
          eventName: "product-variant.updated",
          data: {
            id: IdMap.getId("ironman"),
            fields: ["title", "inventory_quantity"],
          },
        },
      ])

      expect(productVariantRepository.update).toHaveBeenCalledTimes(1)
      expect(productVariantRepository.update).toHaveBeenCalledWith(
        { id: IdMap.getId("ironman") },
        {
          id: IdMap.getId("ironman"),
          inventory_quantity: 98,
          title: "new title",
        }
      )
    })

    it("successfully updates variant prices", async () => {
      await productVariantService.update(IdMap.getId("ironman"), {
        title: "new title",
        prices: [
          {
            currency_code: "dkk",
            amount: 1000,
          },
        ],
      })

      expect(productVariantService.updateVariantPrices).toHaveBeenCalledTimes(1)
      expect(productVariantService.updateVariantPrices).toHaveBeenCalledWith([
        {
          variantId: IdMap.getId("ironman"),
          prices: [
            {
              currency_code: "dkk",
              amount: 1000,
            },
          ],
        },
      ])

      expect(productVariantRepository.update).toHaveBeenCalledTimes(1)
    })

    it("successfully updates variant options", async () => {
      await productVariantService.update(IdMap.getId("ironman"), {
        title: "new title",
        options: [
          {
            option_id: IdMap.getId("color"),
            value: "red",
          },
        ],
      })

      expect(productVariantService.updateOptionValue).toHaveBeenCalledTimes(1)
      expect(productVariantService.updateOptionValue).toHaveBeenCalledWith(
        IdMap.getId("ironman"),
        IdMap.getId("color"),
        "red"
      )

      expect(productVariantRepository.update).toHaveBeenCalledTimes(1)
    })
  })

  describe("updateVariantPrices", () => {
    const moneyAmountRepository = MockRepository({
      remove: () => Promise.resolve(),
    })
    const oldPrices = [
      {
        currency_code: "dkk",
        amount: 1000,
        variant_id: "ironman",
        region_id: null,
      },
    ]

    moneyAmountRepository.deleteVariantPricesNotIn = jest
      .fn()
      .mockImplementation(() => Promise.resolve(oldPrices))

    moneyAmountRepository.deleteVariantPrices = jest
      .fn()
      .mockImplementation((variant_id, price_ids) => Promise.resolve({}))

    const productVariantRepository = MockRepository({
      findOne: (query) => Promise.resolve({ id: IdMap.getId("ironman") }),
    })

    const productOptionValueRepository = MockRepository({
      findOne: () =>
        Promise.resolve({ id: IdMap.getId("some-value"), value: "blue" }),
    })

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      moneyAmountRepository,
      productVariantRepository,
      productOptionValueRepository,
    })

    productVariantService.updateOptionValue = jest
      .fn()
      .mockReturnValue(() => Promise.resolve())

    beforeEach(async () => {
      jest.clearAllMocks()
    })
  })

  describe("getRegionPrice", () => {
    const regionService = {
      retrieve: function () {
        return Promise.resolve({
          id: IdMap.getId("california"),
          name: "California",
        })
      },
      withTransaction: function () {
        return this
      },
    }
    const moneyAmountRepository = MockRepository({
      findOne: (query) => {
        if (query.where.variant_id === IdMap.getId("ironmanv2")) {
          return Promise.resolve(undefined)
        }
        if (query.where.variant_id === IdMap.getId("ironman-sale")) {
          return Promise.resolve({
            id: IdMap.getId("dkk"),
            variant_id: IdMap.getId("ironman-sale"),
            currency_code: "dkk",
            region_id: IdMap.getId("california"),
            amount: 1000,
          })
        }
        return Promise.resolve({
          id: IdMap.getId("dkk"),
          variant_id: IdMap.getId("ironman"),
          currency_code: "dkk",
          region_id: IdMap.getId("california"),
          amount: 1000,
        })
      },
    })

    const cartRepository = MockRepository({
      findOne: (data) => {
        return Promise.resolve({})
      },
    })

    const priceSelectionStrat = {
      calculateVariantPrice: (variantId, context) => {
        return Promise.resolve({
          originalPrice: null,
          calculatedPrice: 1000,
          prices: [],
        })
      },
    }

    const priceSelectionStrategy = {
      withTransaction: (manager) => {
        return priceSelectionStrat
      },
    }

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      regionService,
      moneyAmountRepository,
      cartRepository,
      priceSelectionStrategy,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves region price", async () => {
      const result = await productVariantService.getRegionPrice(
        IdMap.getId("ironman"),
        IdMap.getId("california")
      )

      expect(result).toBe(1000)
    })

    it("successfully retrieves region sale price", async () => {
      const result = await productVariantService.getRegionPrice(
        IdMap.getId("ironman-sale"),
        IdMap.getId("california")
      )

      // TODO: Update once PriceStrategy is implemented
      expect(result).toBe(1000)
    })

    it("fails if no price is found", async () => {
      try {
        await productVariantService.getRegionPrice(
          IdMap.getId("ironmanv2"),
          IdMap.getId("california")
        )
      } catch (error) {
        expect(error.message).toBe(
          "A price for region: California could not be found"
        )
      }
    })
  })

  describe("updateVariantPrices", () => {
    const moneyAmountRepository = MockRepository({
      findOne: (query) => {
        if (query.where.region_id === IdMap.getId("cali")) {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({
          id: IdMap.getId("dkk"),
          variant_id: IdMap.getId("ironman"),
          currency_code: "dkk",
          amount: 750,
        })
      },
      find: (query) => {
        if (query.where.region_id === IdMap.getId("cali")) {
          return Promise.resolve([])
        }
        return Promise.resolve([
          {
            id: IdMap.getId("dkk"),
            variant_id: IdMap.getId("ironman"),
            currency_code: "dkk",
            amount: 750,
          },
        ])
      },
      create: (p) => p,
      remove: () => Promise.resolve(),
      insertBulk: (data) => data,
    })

    const oldPrices = [
      {
        currency_code: "dkk",
        amount: 1000,
        variant_id: "ironman",
        region_id: null,
      },
    ]

    moneyAmountRepository.deleteVariantPricesNotIn = jest
      .fn()
      .mockImplementation(() => Promise.resolve(oldPrices))

    moneyAmountRepository.upsertVariantCurrencyPrice = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const priceSelectionStrategy = {
      withTransaction: function () {
        return this
      },
      onVariantsPricesUpdate: (variantIds) => Promise.resolve(),
    }

    const regionService = {
      list: jest.fn().mockImplementation((config) => {
        const idOrIds = config.id

        if (Array.isArray(idOrIds)) {
          return Promise.resolve(
            idOrIds.map((id) => ({ id, currency_code: "usd" }))
          )
        } else {
          return Promise.resolve([{ id: idOrIds, currency_code: "usd" }])
        }
      }),
      retrieve: function () {
        return Promise.resolve({
          id: IdMap.getId("california"),
          name: "California",
        })
      },
      withTransaction: function () {
        return this
      },
    }

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      regionService,
      priceSelectionStrategy,
      moneyAmountRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully removes obsolete prices and create new prices", async () => {
      await productVariantService.updateVariantPrices("ironman", [
        {
          currency_code: "usd",
          amount: 4000,
        },
      ])

      expect(
        moneyAmountRepository.deleteVariantPricesNotIn
      ).toHaveBeenCalledTimes(1)

      expect(moneyAmountRepository.insertBulk).toHaveBeenCalledTimes(1)
      expect(moneyAmountRepository.insertBulk).toHaveBeenCalledWith([
        {
          variant_id: "ironman",
          currency_code: "usd",
          amount: 4000,
        },
      ])
    })

    it("successfully creates new a region price", async () => {
      await productVariantService.updateVariantPrices(IdMap.getId("ironman"), [
        {
          amount: 100,
          region_id: IdMap.getId("cali"),
        },
      ])

      expect(moneyAmountRepository.create).toHaveBeenCalledTimes(1)
      expect(moneyAmountRepository.create).toHaveBeenCalledWith({
        variant_id: IdMap.getId("ironman"),
        region_id: IdMap.getId("cali"),
        currency_code: "usd",
        amount: 100,
      })

      expect(moneyAmountRepository.insertBulk).toHaveBeenCalledTimes(1)
    })

    it("successfully updates a currency price", async () => {
      await productVariantService.updateVariantPrices(IdMap.getId("ironman"), [
        {
          id: IdMap.getId("dkk"),
          currency_code: "dkk",
          amount: 850,
        },
      ])

      expect(moneyAmountRepository.create).toHaveBeenCalledTimes(0)

      expect(moneyAmountRepository.update).toHaveBeenCalledTimes(1)
      expect(moneyAmountRepository.update).toHaveBeenCalledWith(
        { id: IdMap.getId("dkk") },
        {
          amount: 850,
        }
      )
    })
  })

  describe("updateOptionValue", () => {
    const productOptionValueRepository = MockRepository({
      findOne: (query) => {
        if (query.where.variant_id === IdMap.getId("jibberish")) {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({
          id: IdMap.getId("red"),
          option_id: IdMap.getId("color"),
          value: "red",
        })
      },
    })

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      productOptionValueRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates", async () => {
      await productVariantService.updateOptionValue(
        IdMap.getId("ironman"),
        IdMap.getId("color"),
        "more red"
      )

      expect(productOptionValueRepository.save).toHaveBeenCalledTimes(1)
      expect(productOptionValueRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("red"),
        option_id: IdMap.getId("color"),
        value: "more red",
      })
    })

    it("fails if product option value does not exist", async () => {
      try {
        await productVariantService.updateOptionValue(
          IdMap.getId("jibberish"),
          IdMap.getId("color"),
          "red"
        )
      } catch (error) {
        expect(error.message).toBe("Product option value not found")
      }
    })
  })

  describe("addOptionValue", () => {
    const productOptionValueRepository = MockRepository({})

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      productOptionValueRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully add an option value", async () => {
      await productVariantService.addOptionValue(
        IdMap.getId("ironman"),
        IdMap.getId("color"),
        "black"
      )

      expect(productOptionValueRepository.create).toHaveBeenCalledTimes(1)
      expect(productOptionValueRepository.create).toHaveBeenCalledWith({
        variant_id: IdMap.getId("ironman"),
        option_id: IdMap.getId("color"),
        value: "black",
      })

      expect(productOptionValueRepository.save).toBeCalledTimes(1)
    })
  })

  describe("deleteOptionValue", () => {
    const productOptionValueRepository = MockRepository({
      findOne: (query) => {
        if (query.where.option_id === IdMap.getId("size")) {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({
          variant_id: IdMap.getId("ironman"),
          option_id: IdMap.getId("color"),
          id: IdMap.getId("test"),
        })
      },
    })

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      productOptionValueRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully deletes option value from variant", async () => {
      await productVariantService.deleteOptionValue(
        IdMap.getId("ironman"),
        IdMap.getId("color")
      )

      expect(productOptionValueRepository.softRemove).toBeCalledTimes(1)
      expect(productOptionValueRepository.softRemove).toBeCalledWith({
        variant_id: IdMap.getId("ironman"),
        option_id: IdMap.getId("color"),
        id: IdMap.getId("test"),
      })
    })

    it("successfully resolves if product option value does not exist", async () => {
      const result = await productVariantService.deleteOptionValue(
        IdMap.getId("ironman"),
        IdMap.getId("size")
      )

      expect(result).toBe(undefined)
    })
  })

  describe("delete", () => {
    const productVariantRepository = MockRepository({
      find: (query) => {
        if (query.where.id === IdMap.getId("ironmanv2")) {
          return Promise.resolve([])
        }
        return Promise.resolve([
          {
            id: IdMap.getId("ironman"),
            product_id: IdMap.getId("product-test"),
          },
        ])
      },
    })

    const productVariantService = new ProductVariantService({
      manager: MockManager,
      eventBusService,
      productVariantRepository,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully deletes variant", async () => {
      await productVariantService.delete(IdMap.getId("ironman"))

      expect(productVariantRepository.softRemove).toBeCalledTimes(1)
      expect(productVariantRepository.softRemove).toBeCalledWith([
        expect.objectContaining({
          id: IdMap.getId("ironman"),
        }),
      ])

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith([
        {
          eventName: "product-variant.deleted",
          data: {
            id: IdMap.getId("ironman"),
            product_id: IdMap.getId("product-test"),
          },
        },
      ])
    })

    it("successfully resolves if variant does not exist", async () => {
      const result = await productVariantService.delete(
        IdMap.getId("ironmanv2")
      )

      expect(result).toBe(undefined)
    })
  })
})
