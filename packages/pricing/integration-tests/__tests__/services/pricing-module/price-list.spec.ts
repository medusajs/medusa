import { SqlEntityManager } from "@mikro-orm/postgresql"

import { PriceListService } from "@services"

import { createCurrencies } from "../../../__fixtures__/currency"
import { createPriceLists } from "../../../__fixtures__/price-list"
import { PriceListUtils } from "../../../../../utils/dist"
import { initialize } from "../../../../src"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceList Service", () => {
  let service: PriceListService
  let testManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    testManager = MikroOrmWrapper.forkManager()
    await createCurrencies(testManager)
    await createPriceLists(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list priceLists", async () => {
      const priceListResult = await service.listPriceLists()

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
          name: "Default Price List",
          description: "Default Price List",
        }),

        expect.objectContaining({
          id: "price-list-2",
          name: "Default Price List",
          description: "Default Price List",
        }),
      ])
    })

    it("should list priceLists by id", async () => {
      const priceListResult = await service.listPriceLists({
        id: ["price-list-1"],
      })

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
          name: "Default Price List",
          description: "Default Price List",
        }),
      ])
    })

    it("should list priceLists with relations and selects", async () => {
      const priceListResult = await service.listPriceLists(
        {
          id: ["price-list-1"],
        },
        {
          select: ["id", "name", "prices.id"],
          relations: ["prices"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceListResult))

      expect(serialized).toEqual([
        {
          id: "price-list-1",
          name: "Default Price List",
          prices: [
            {
              id: "pl-money-amount-USD",
              price_list_id: "price-list-1", // TODO: this is not correct
              price_list: { id: "price-list-1", name: "Default Price List" },
            },
            {
              id: "pl-money-amount-EUR",
              price_list_id: "price-list-1", // TODO:
              price_list: { id: "price-list-1", name: "Default Price List" },
            },
            {
              id: "pl-money-amount-CAD",
              price_list_id: "price-list-1", // TODO:
              price_list: { id: "price-list-1", name: "Default Price List" },
            },
          ],
        },
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return priceLists and count", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists()

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
          name: "Default Price List",
          description: "Default Price List",
        }),

        expect.objectContaining({
          id: "price-list-2",
          name: "Default Price List",
          description: "Default Price List",
        }),
      ])
    })

    it("should return priceLists and count when filtered", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists({
        id: ["price-list-1"],
      })

      expect(count).toEqual(1)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
          name: "Default Price List",
          description: "Default Price List",
        }),
      ])
    })

    it("list priceLists with relations and selects", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists(
        {
          id: ["price-list-1"],
        },
        {
          select: ["id", "name", "prices.id"],
          relations: ["prices"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceListResult))

      expect(count).toEqual(1)
      expect(serialized).toEqual([
        {
          id: "price-list-1",
          name: "Default Price List",
          prices: [
            {
              id: "pl-money-amount-USD",
              price_list_id: "price-list-1", // TODO: this is not correct
              price_list: { id: "price-list-1", name: "Default Price List" },
            },
            {
              id: "pl-money-amount-EUR",
              price_list_id: "price-list-1", // TODO:
              price_list: { id: "price-list-1", name: "Default Price List" },
            },
            {
              id: "pl-money-amount-CAD",
              price_list_id: "price-list-1", // TODO:
              price_list: { id: "price-list-1", name: "Default Price List" },
            },
          ],
        },
      ])
    })

    it("should return priceLists and count when using skip and take", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists(
        {},
        {
          take: 1,
          select: ["id"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceListResult))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        {
          id: "price-list-1",
        },
      ])
    })
  })

  describe("retrieve", () => {
    const id = "price-list-1"

    it("should return priceList for the given id", async () => {
      const priceList = await service.retrievePriceList(id)

      expect(priceList).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when priceList with id does not exist", async () => {
      let error

      try {
        await service.retrievePriceList("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "PriceList with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrievePriceList(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"priceListId" must be defined')
    })

    it("should return priceList based on config select param", async () => {
      const priceList = await service.retrievePriceList(id, {
        select: ["id", "name"],
      })

      const serialized = JSON.parse(JSON.stringify(priceList))

      expect(serialized).toEqual({
        id,
        name: "Default Price List",
      })
    })
  })

  describe("delete", () => {
    const id = "money-amount-USD"

    it("should delete the priceLists given an id successfully", async () => {
      await service.deletePriceLists([id])

      const priceLists = await service.listPriceLists({
        id: [id],
      })

      expect(priceLists).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "price-list-1"

    it("should update the name of the price list successfully", async () => {
      const name = "updated name"
      await service.updatePriceLists([
        {
          id,
          name,
        },
      ])

      const priceList = await service.retrievePriceList(id)

      expect(priceList.name).toEqual(name)
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.updatePriceLists([
          {
            id: "does-not-exist",
            title: "updated title",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'PriceList with id "does-not-exist" not found'
      )
    })
  })

  describe("create", () => {
    it("should create a price list successfully without prices", async () => {
      const data = {
        id: "price-list-3",
        name: "no prices",
        description: "created description",
        type: PriceListUtils.PriceListType.OVERRIDE,
        status: PriceListUtils.PriceListStatus.DRAFT,
        starts_at: new Date(),
      }
      await service.createPriceLists([data])

      const priceList = await service.retrievePriceList("price-list-3")

      expect(priceList).toEqual(
        expect.objectContaining({
          ...data,
        })
      )
    })

    it("should create a price list successfully with prices", async () => {
      const data = {
        name: "no prices",
        description: "created description",
        type: PriceListUtils.PriceListType.OVERRIDE,
        status: PriceListUtils.PriceListStatus.DRAFT,
        starts_at: new Date(),
      }

      const price = {
        currency_code: "USD",
        amount: 333,
      }

      const [pl] = await service.createPriceLists([{ ...data, prices: [price] }])

      const priceList = await service.retrievePriceList(pl.id, {
        relations: ["prices"],
      })

      expect(priceList.prices).toEqual([
        expect.objectContaining({ ...price, amount: "333" }),
      ])
      expect(priceList).toEqual(
        expect.objectContaining({
          ...data,
        })
      )
    })
  })
})
