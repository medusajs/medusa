import { SqlEntityManager } from "@mikro-orm/postgresql"

import { PriceSet } from "@models"
import { PriceSetRepository } from "@repositories"
import { PriceSetService } from "@services"

import { createPriceSets } from "../../../__fixtures__/price-set"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceSet Service", () => {
  let service: PriceSetService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: PriceSet[]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const priceSetRepository = new PriceSetRepository({
      manager: repositoryManager,
    })

    service = new PriceSetService({
      priceSetRepository,
    })

    testManager = await MikroOrmWrapper.forkManager()
    data = await createPriceSets(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("list priceSets", async () => {
      const priceSetsResult = await service.list()

      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
        expect.objectContaining({
          id: "price-set-2",
        }),
        expect.objectContaining({
          id: "price-set-3",
        }),
      ])
    })

    it("list priceSets by id", async () => {
      const priceSetsResult = await service.list({
        id: ["price-set-1"],
      })

      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
      ])
    })

    it("list priceSets with relations and selects", async () => {
      const priceSetsResult = await service.list(
        {
          id: ["price-set-1"],
        },
        {
          select: ["id"],
          relations: ["money_amounts"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceSetsResult))

      expect(serialized).toEqual([
        {
          id: "price-set-1",
          money_amounts: [],
        },
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return priceSets and count", async () => {
      const [priceSetsResult, count] = await service.listAndCount()

      expect(count).toEqual(3)
      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
        expect.objectContaining({
          id: "price-set-2",
        }),
        expect.objectContaining({
          id: "price-set-3",
        }),
      ])
    })

    it("should return priceSets and count when filtered", async () => {
      const [priceSetsResult, count] = await service.listAndCount({
        id: ["price-set-1"],
      })

      expect(count).toEqual(1)
      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
      ])
    })

    it("list priceSets with relations and selects", async () => {
      const [priceSetsResult, count] = await service.listAndCount(
        {
          id: ["price-set-1"],
        },
        {
          select: ["id", "min_quantity", "money_amounts.id"],
          relations: ["money_amounts"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceSetsResult))

      expect(count).toEqual(1)
      expect(serialized).toEqual([
        {
          id: "price-set-1",
          money_amounts: [],
        },
      ])
    })

    it("should return priceSets and count when using skip and take", async () => {
      const [priceSetsResult, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(3)
      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceSetsResult, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["id"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceSetsResult))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "price-set-1",
        },
      ])
    })
  })

  describe("retrieve", () => {
    const id = "price-set-1"

    it("should return priceSet for the given id", async () => {
      const priceSet = await service.retrieve(id)

      expect(priceSet).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when priceSet with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "PriceSet with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"priceSetId" must be defined')
    })

    it("should return priceSet based on config select param", async () => {
      const priceSet = await service.retrieve(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(priceSet))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("delete", () => {
    const id = "price-set-1"

    it("should delete the priceSets given an id successfully", async () => {
      await service.delete([id])

      const priceSets = await service.list({
        id: [id],
      })

      expect(priceSets).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "price-set-1"

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            id: "does-not-exist",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'PriceSet with id "does-not-exist" not found'
      )
    })
  })

  describe("create", () => {
    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            random: "does-not-exist",
          } as any,
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('PriceSet with id "undefined" not found')
    })

    it("should create a priceSet successfully", async () => {
      await service.create([
        {
          id: "price-set-new",
        },
      ])

      const [priceSet] = await service.list({
        id: ["price-set-new"],
      })

      expect(priceSet).toEqual(
        expect.objectContaining({
          id: "price-set-new",
        })
      )
    })
  })
})
