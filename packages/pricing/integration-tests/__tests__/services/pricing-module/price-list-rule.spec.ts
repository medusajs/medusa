import { SqlEntityManager } from "@mikro-orm/postgresql"

import { initialize } from "../../../../src"

import { IPricingModuleService } from "@medusajs/types"
import { createPriceLists } from "../../../__fixtures__/price-list"
import { createPriceListRules } from "../../../__fixtures__/price-list-rules"
import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceListRule Service", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
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
    it("list priceListRules", async () => {
      const priceListRuleResult = await service.listPriceListRules()

      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-1",
        }),
        expect.objectContaining({
          id: "price-list-rule-2",
        }),
      ])
    })

    it("list priceListRules by pricelist id", async () => {
      const priceListRuleResult = await service.listPriceListRules({
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
      const [priceListRuleResult, count] =
        await service.listAndCountPriceListRules()

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
      const [priceListRuleResult, count] =
        await service.listAndCountPriceListRules({
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
      const [priceListRuleResult, count] =
        await service.listAndCountPriceListRules({}, { skip: 1, take: 1 })

      expect(count).toEqual(2)
      expect(priceListRuleResult).toEqual([
        expect.objectContaining({
          id: "price-list-rule-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceListRuleResult, count] =
        await service.listAndCountPriceListRules(
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
      const priceListRuleResult = await service.retrievePriceListRule(id)

      expect(priceListRuleResult).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when priceListRule with id does not exist", async () => {
      let error

      try {
        await service.retrievePriceListRule("does-not-exist")
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
        await service.retrievePriceListRule(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"priceListRuleId" must be defined')
    })
  })

  describe("delete", () => {
    const id = "price-list-rule-1"

    it("should delete the pricelists given an id successfully", async () => {
      await service.deletePriceListRules([id])

      const priceListResult = await service.listPriceListRules({
        id: [id],
      })

      expect(priceListResult).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "price-list-rule-2"

    it("should update the value of the priceListRule successfully", async () => {
      await service.updatePriceListRules([
        {
          id,
          price_list_id: "price-list-2",
          rule_type_id: "rule-type-2",
        },
      ])

      const priceList = await service.retrievePriceListRule(id, {
        relations: ["price_list", "rule_type"],
      })

      expect(priceList.price_list.id).toEqual("price-list-2")
      expect(priceList.rule_type.id).toEqual("rule-type-2")
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.updatePriceListRules([
          {
            id: "does-not-exist",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'PriceListRule with id "does-not-exist" not found'
      )
    })
  })

  describe("create", () => {
    it("should create a priceListRule successfully", async () => {
      const [created] = await service.createPriceListRules([
        {
          price_list_id: "price-list-1",
          rule_type_id: "rule-type-1",
        },
      ])

      const [priceListRule] = await service.listPriceListRules(
        {
          id: [created.id],
        },
        {
          relations: ["price_list", "rule_type"],
        }
      )

      expect(priceListRule.price_list.id).toEqual("price-list-1")
      expect(priceListRule.rule_type.id).toEqual("rule-type-1")
    })
  })
})
