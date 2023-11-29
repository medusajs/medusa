import { IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { initialize } from "../../../../src"

import { createCurrencies } from "../../../__fixtures__/currency"
import { createPriceLists } from "../../../__fixtures__/price-list"
import { createPriceSets } from "../../../__fixtures__/price-set"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceList Service", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    await MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    testManager = await MikroOrmWrapper.forkManager()
    await createCurrencies(testManager)
    await createPriceSets(testManager)
    await createPriceLists(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("list priceLists", async () => {
      const priceListResult = await service.listPriceLists()

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("list pricelists by id", async () => {
      const priceListResult = await service.listPriceLists({
        id: ["price-list-1"],
      })

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return pricelists and count", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists()

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("should return pricelists and count when filtered", async () => {
      const [priceListResult, count] = await service.listAndCountPriceLists({
        id: ["price-list-1"],
      })

      expect(count).toEqual(1)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
      ])
    })

    it("should return pricelists and count when using skip and take", async () => {
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
      const priceListResult = await service.retrievePriceList(id)

      expect(priceListResult).toEqual(
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
  })

  describe("delete", () => {
    const id = "price-list-1"

    it("should delete the pricelists given an id successfully", async () => {
      await service.deletePriceLists([id])

      const priceListResult = await service.listPriceLists({
        id: [id],
      })

      expect(priceListResult).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "price-list-2"

    it("should update the starts_at date of the priceList successfully", async () => {
      const [created] = await service.createPriceLists([
        {
          title: "test",
          description: "test",
          starts_at: "10/01/2023",
          ends_at: "10/30/2023",
          rules: {
            customer_group_id: [
              "vip-customer-group-id",
              "another-vip-customer-group-id",
            ],
            region_id: ["DE", "DK"],
          },
          prices: [
            {
              amount: 400,
              currency_code: "EUR",
              price_set_id: "price-set-1",
            },
          ],
        },
      ])

      const updateDate = new Date()
      await service.updatePriceLists([
        {
          id: created.id,
          starts_at: updateDate.toISOString(),
          rules: {
            new_rule: ["new-rule-value"],
          },
        },
      ])

      const [priceList] = await service.listPriceLists(
        {
          id: [created.id],
        },
        {
          relations: [
            "price_set_money_amounts.money_amount",
            "price_set_money_amounts.price_set",
            "price_list_rules.price_list_rule_values",
            "price_list_rules.rule_type",
          ],
          select: [
            "id",
            "starts_at",
            "price_set_money_amounts.money_amount.amount",
            "price_set_money_amounts.money_amount.currency_code",
            "price_set_money_amounts.money_amount.price_list_id",
            "price_list_rules.price_list_rule_values.value",
            "price_list_rules.rule_type.rule_attribute",
          ],
        }
      )

      expect(priceList).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          starts_at: updateDate,
          price_set_money_amounts: expect.arrayContaining([
            expect.objectContaining({
              price_list: expect.objectContaining({
                id: expect.any(String),
              }),
              money_amount: expect.objectContaining({
                amount: 400,
                currency_code: "EUR",
              }),
            }),
          ]),
          price_list_rules: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              rule_type: expect.objectContaining({
                id: expect.any(String),
                rule_attribute: "new_rule",
              }),
              price_list_rule_values: [
                expect.objectContaining({
                  id: expect.any(String),
                  value: "new-rule-value",
                }),
              ],
            }),
          ]),
        })
      )
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.updatePriceLists([
          {
            id: "does-not-exist",
            number_rules: 2,
            rules: {},
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
    it("should create a priceList successfully", async () => {
      const [created] = await service.createPriceLists([
        {
          title: "test",
          description: "test",
          starts_at: "10/01/2023",
          ends_at: "10/30/2023",
          rules: {
            customer_group_id: [
              "vip-customer-group-id",
              "another-vip-customer-group-id",
            ],
            region_id: ["DE", "DK"],
          },
          prices: [
            {
              amount: 400,
              currency_code: "EUR",
              price_set_id: "price-set-1",
            },
          ],
        },
      ])

      const [priceList] = await service.listPriceLists(
        {
          id: [created.id],
        },
        {
          relations: [
            "price_set_money_amounts.money_amount",
            "price_set_money_amounts.price_set",
            "price_list_rules.price_list_rule_values",
            "price_list_rules.rule_type",
          ],
          select: [
            "id",
            "price_set_money_amounts.money_amount.amount",
            "price_set_money_amounts.money_amount.currency_code",
            "price_set_money_amounts.money_amount.price_list_id",
            "price_list_rules.price_list_rule_values.value",
            "price_list_rules.rule_type.rule_attribute",
          ],
        }
      )

      expect(priceList).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          price_set_money_amounts: expect.arrayContaining([
            expect.objectContaining({
              price_list: expect.objectContaining({
                id: expect.any(String),
              }),
              money_amount: expect.objectContaining({
                amount: 400,
                currency_code: "EUR",
              }),
            }),
          ]),
          price_list_rules: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              rule_type: expect.objectContaining({
                id: expect.any(String),
                rule_attribute: "customer_group_id",
              }),
              price_list_rule_values: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: "vip-customer-group-id",
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  value: "another-vip-customer-group-id",
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              rule_type: expect.objectContaining({
                id: expect.any(String),
                rule_attribute: "region_id",
              }),
              price_list_rule_values: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: "DE",
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  value: "DK",
                }),
              ]),
            }),
          ]),
        })
      )
    })
  })
})
