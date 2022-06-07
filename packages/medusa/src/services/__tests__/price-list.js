import { MedusaError } from "medusa-core-utils"
import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import PriceListService from "../price-list"

describe("PriceListService", () => {
  const priceListRepository = MockRepository({
    findOne: (q) => {
      if (q === IdMap.getId("batman")) {
        return Promise.resolve(undefined)
      }
      return Promise.resolve({ id: IdMap.getId("ironman") })
    },
    create: (data) => {
      return Promise.resolve({ id: IdMap.getId("ironman"), ...data })
    },
    save: (data) => Promise.resolve(data),
  })

  const customerGroupService = {
    retrieve: jest.fn((id) => {
      if (id === IdMap.getId("group")) {
        return Promise.resolve({ id: IdMap.getId("group") })
      }

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `CustomerGroup with id ${id} was not found`
      )
    }),
  }

  const moneyAmountRepository = MockRepository()

  moneyAmountRepository.addPriceListPrices = jest.fn(() => Promise.resolve())
  moneyAmountRepository.removePriceListPrices = jest.fn(() => Promise.resolve())
  moneyAmountRepository.updatePriceListPrices = jest.fn(() => Promise.resolve())

  const defaultRelations = ["prices", "customer_groups"]

  const priceListService = new PriceListService({
    manager: MockManager,
    customerGroupService,
    priceListRepository,
    moneyAmountRepository,
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe("retrieve", () => {
    it("successfully retrieves a price list", async () => {
      const result = await priceListService.retrieve(IdMap.getId("ironman"))

      expect(priceListRepository.findOne).toHaveBeenCalledTimes(1)
      expect(priceListRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("ironman") },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })

    it("fails on non-existing product variant id", async () => {
      try {
        await priceListService.retrieve(IdMap.getId("batman"))
      } catch (error) {
        expect(error.message).toBe(
          `Price list with id: ${IdMap.getId("batman")} was not found`
        )
      }
    })
  })

  describe("create", () => {
    it("creates a new Price List", async () => {
      const result = await priceListService.create({
        name: "VIP winter sale",
        description: "Winter sale for VIP customers. 25% off selected items.",
        type: "sale",
        status: "active",
        starts_at: "2022-07-01T00:00:00.000Z",
        ends_at: "2022-07-31T00:00:00.000Z",
        customer_groups: [{ id: IdMap.getId("group") }],
        prices: [
          {
            amount: 100,
            currency_code: "usd",
            min_quantity: 1,
            max_quantity: 100,
          },
        ],
      })

      expect(priceListRepository.create).toHaveBeenCalledTimes(1)
      expect(priceListRepository.create).toHaveBeenCalledWith({
        name: "VIP winter sale",
        description: "Winter sale for VIP customers. 25% off selected items.",
        type: "sale",
        status: "active",
        starts_at: "2022-07-01T00:00:00.000Z",
        ends_at: "2022-07-31T00:00:00.000Z",
      })
      expect(customerGroupService.retrieve).toHaveBeenCalledTimes(1)
      expect(customerGroupService.retrieve).toHaveBeenCalledWith(
        IdMap.getId("group")
      )
      expect(moneyAmountRepository.addPriceListPrices).toHaveBeenCalledTimes(1)
      expect(moneyAmountRepository.addPriceListPrices).toHaveBeenCalledWith(
        IdMap.getId("ironman"),
        [
          {
            amount: 100,
            currency_code: "usd",
            min_quantity: 1,
            max_quantity: 100,
          },
        ]
      )
    })
  })
})
