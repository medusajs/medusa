import { SqlEntityManager } from "@mikro-orm/postgresql"

import { PriceListRuleRepository } from "@repositories"
import { PriceListRuleService } from "@services"

import { createPriceLists } from "../../../__fixtures__/price-list"
import { createPriceListRules } from "../../../__fixtures__/price-list-rules"
import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceListRule Service", () => {
  let service: PriceListRuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const priceListRuleRepository = new PriceListRuleRepository({
      manager: repositoryManager,
    })

    service = new PriceListRuleService({
      priceListRuleRepository,
    })

    testManager = await MikroOrmWrapper.forkManager()
    await createRuleTypes(testManager)
    await createPriceLists(testManager)
    await createPriceListRules(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list all priceListRules", async () => {
      const priceListRuleResult = await service.list()

      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-1",
        }),
        expect.objectContaining({
          id: "price-list-rule-2",
        }),
      ])
    })

    it("should list priceListRules scoped by priceListRule id", async () => {
      const priceListRuleResult = await service.list({
        id: ["price-list-rule-1"],
      })

      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return pricelistrules and count", async () => {
      const [priceListRuleResult, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-1",
        }),
        expect.objectContaining({
          id: "price-list-rule-2",
        }),
      ])
    })

    it("should return pricelistrules and count when filtered", async () => {
      const [priceListRuleResult, count] = await service.listAndCount({
        id: ["price-list-rule-1"],
      })

      expect(count).toEqual(1)
      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-1",
        }),
      ])
    })

    it("should return pricelistrules and count when using skip and take", async () => {
      const [priceListRuleResult, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(2)
      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceListRuleResult, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["id"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceListRuleResult))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        {
          id: "price-list-rule-1",
        },
      ])
    })
  })

  describe("retrieve", () => {
    const id = "price-list-rule-1"

    it("should return priceList for the given id", async () => {
      const priceListRuleResult = await service.retrieve(id)

      expect(priceListRuleResult).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when priceListRule with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "PriceListRule with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"priceListRuleId" must be defined')
    })
  })

  describe("delete", () => {
    const id = "price-list-rule-1"

    it("should delete the pricelists given an id successfully", async () => {
      await service.delete([id])

      const priceListResult = await service.list({
        id: [id],
      })

      expect(priceListResult).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "price-list-rule-2"

    it("should update the value of the priceListRule successfully", async () => {
      await service.update([
        {
          id,
          price_list_id: "price-list-1",
        },
      ])

      const priceList = await service.retrieve(id, {
        relations: ["price_list"],
      })

      expect(priceList.price_list.id).toEqual("price-list-1")
    })

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
        'PriceListRule with id(s) "does-not-exist" not found'
      )
    })
  })

  describe("create", () => {
    it("should create a priceListRule successfully", async () => {
      const [created] = await service.create([
        {
          price_list_id: "price-list-2",
          rule_type_id: "rule-type-1",
        },
      ])

      const [priceListRule] = await service.list(
        {
          id: [created.id],
        },
        {
          relations: ["price_list", "rule_type"],
          select: ["price_list.id", "rule_type.id"],
        }
      )

      expect(priceListRule.price_list.id).toEqual("price-list-2")
      expect(priceListRule.rule_type.id).toEqual("rule-type-1")
    })
  })
})
