import { IPricingModuleService } from "@medusajs/types"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { createPriceLists } from "../../../__fixtures__/price-list"
import { createPriceSets } from "../../../__fixtures__/price-set"
import {
  CommonEvents,
  composeMessage,
  Modules,
  PricingEvents,
} from "@medusajs/utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IPricingModuleService>({
  moduleName: Modules.PRICING,
  testSuite: ({ MikroOrmWrapper, service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("PriceList Service", () => {
      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()
        await createPriceSets(testManager)
        await createPriceLists(testManager)
        await service.createRuleTypes([
          {
            name: "Region ID",
            rule_attribute: "region_id",
          },
          {
            name: "Customer Group ID",
            rule_attribute: "customer_group_id",
          },
        ])
      })

      describe("list", () => {
        it("should list priceLists", async () => {
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

        it("should list pricelists by id", async () => {
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
          const [priceListResult, count] =
            await service.listAndCountPriceLists()

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
          const [priceListResult, count] = await service.listAndCountPriceLists(
            {
              id: ["price-list-1"],
            }
          )

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

          expect(error.message).toEqual("priceList - id must be defined")
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
        let createdId
        const id = "price-list-2"

        beforeEach(async () => {
          const [created] = await service.createPriceLists([
            {
              title: "test",
              description: "test",
              starts_at: new Date("10/01/2023"),
              ends_at: new Date("10/30/2023"),
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
          createdId = created.id
        })

        it("should fail to update a priceList with invalid starts_at date", async () => {
          let error
          try {
            await service.updatePriceLists([
              {
                id: createdId,
                starts_at: "invalid-date",
              },
            ])
          } catch (err) {
            error = err
          }

          expect(error.message).toEqual(
            "Cannot set price list starts at with with invalid date string: invalid-date"
          )
        })

        it("should fail to update a priceList with invalid ends_at date", async () => {
          let error
          try {
            await service.updatePriceLists([
              {
                id: createdId,
                ends_at: "invalid-date",
              },
            ])
          } catch (err) {
            error = err
          }

          expect(error.message).toEqual(
            "Cannot set price list ends at with with invalid date string: invalid-date"
          )
        })

        it("should update a priceList with starts_at and ends_at dates given as string", async () => {
          let [priceList] = await service.updatePriceLists([
            {
              id: createdId,
              starts_at: "10/10/2010",
              ends_at: "10/20/2030",
            },
          ])
          expect(priceList).toEqual(
            expect.objectContaining({
              starts_at: new Date("10/10/2010").toISOString(),
              ends_at: new Date("10/20/2030").toISOString(),
            })
          )
        })

        it("should update the starts_at date of the priceList successfully", async () => {
          const updateDate = new Date()
          await service.updatePriceLists([
            {
              id: createdId,
              starts_at: updateDate,
              rules: {
                new_rule: ["new-rule-value"],
              },
            },
          ])

          const [priceList] = await service.listPriceLists(
            { id: [createdId] },
            {
              relations: [
                "prices",
                "prices.price_set",
                "price_list_rules.price_list_rule_values",
                "price_list_rules.rule_type",
              ],
              select: [
                "id",
                "starts_at",
                "prices.amount",
                "prices.currency_code",
                "prices.price_list_id",
                "price_list_rules.price_list_rule_values.value",
                "price_list_rules.rule_type.rule_attribute",
              ],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              starts_at: updateDate,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 400,
                  currency_code: "EUR",
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
                rules_count: 2,
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

      describe("createPriceLists", () => {
        it("should fail to create a priceList with invalid starts_at date", async () => {
          let error
          try {
            await service.createPriceLists([
              {
                title: "test",
                description: "test",
                starts_at: "invalid-date",
              },
            ])
          } catch (err) {
            error = err
          }

          expect(error.message).toEqual(
            "Cannot set price list starts at with with invalid date string: invalid-date"
          )
        })

        it("should fail to create a priceList with invalid ends_at date", async () => {
          let error
          try {
            await service.createPriceLists([
              {
                title: "test",
                description: "test",
                ends_at: "invalid-date",
              },
            ])
          } catch (err) {
            error = err
          }

          expect(error.message).toEqual(
            "Cannot set price list ends at with with invalid date string: invalid-date"
          )
        })

        it("should create a priceList with starts_at and ends_at dates given as string", async () => {
          let [priceList] = await service.createPriceLists([
            {
              title: "test",
              description: "test",
              starts_at: "10/10/2010",
              ends_at: "10/20/2030",
            },
          ])
          expect(priceList).toEqual(
            expect.objectContaining({
              starts_at: new Date("10/10/2010").toISOString(),
              ends_at: new Date("10/20/2030").toISOString(),
            })
          )
        })

        it("should create a priceList successfully", async () => {
          const [created] = await service.createPriceLists([
            {
              title: "test",
              description: "test",
              starts_at: new Date("10/01/2023").toISOString(),
              ends_at: new Date("10/30/2023").toISOString(),
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
                "prices",
                "prices.price_set",
                "price_list_rules.price_list_rule_values",
                "price_list_rules.rule_type",
              ],
              select: [
                "id",
                "prices.amount",
                "prices.currency_code",
                "prices.price_list_id",
                "price_list_rules.price_list_rule_values.value",
                "price_list_rules.rule_type.rule_attribute",
              ],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 400,
                  currency_code: "EUR",
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

          const events = eventBusEmitSpy.mock.calls[0][0]
          expect(events).toHaveLength(4)
          expect(events[0]).toEqual(
            composeMessage(PricingEvents.price_list_created, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_list",
              data: { id: priceList.id },
            })
          )
          expect(events[1]).toEqual(
            composeMessage(PricingEvents.price_list_rule_created, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_list_rule",
              data: { id: priceList.price_list_rules?.[0].id },
            })
          )
          expect(events[2]).toEqual(
            composeMessage(PricingEvents.price_list_rule_created, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_list_rule",
              data: { id: priceList.price_list_rules?.[1].id },
            })
          )
          expect(events[3]).toEqual(
            composeMessage(PricingEvents.price_created, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price",
              data: { id: priceList.prices![0].id },
            })
          )
        })

        it("should create a price list with granular rules within prices", async () => {
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
                  rules: {
                    region_id: "DE",
                  },
                },
                {
                  amount: 600,
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
                "prices",
                "prices.price_set",
                "prices.price_rules",
                "price_list_rules.price_list_rule_values",
                "price_list_rules.rule_type",
              ],
              select: [
                "id",
                "prices.price_rules.value",
                "prices.rules_count",
                "prices.amount",
                "prices.currency_code",
                "prices.price_list_id",
                "price_list_rules.price_list_rule_values.value",
                "price_list_rules.rule_type.rule_attribute",
              ],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  rules_count: 1,
                  price_rules: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      value: "DE",
                    }),
                  ]),
                  amount: 400,
                  currency_code: "EUR",
                }),
                expect.objectContaining({
                  rules_count: 0,
                  price_rules: [],
                  amount: 600,
                  currency_code: "EUR",
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

        it("should throw error when rule type does not exist", async () => {
          const error = await service
            .createPriceLists([
              {
                title: "test",
                description: "test",
                rules: {
                  region_id: ["DE", "DK"],
                  missing_1: ["test-missing-1"],
                },
                prices: [
                  {
                    amount: 400,
                    currency_code: "EUR",
                    price_set_id: "price-set-1",
                    rules: {
                      region_id: "DE",
                      missing_2: "test-missing-2",
                    },
                  },
                ],
              },
            ])
            .catch((e) => e)

          expect(error.message).toEqual(
            "Cannot find RuleTypes with rule_attribute - missing_1, missing_2"
          )
        })
      })

      describe("addPriceListPrices", () => {
        it("should add a price to a priceList successfully", async () => {
          await service.addPriceListPrices([
            {
              price_list_id: "price-list-1",
              prices: [
                {
                  amount: 123,
                  currency_code: "EUR",
                  price_set_id: "price-set-1",
                },
              ],
            },
          ])

          const [priceList] = await service.listPriceLists(
            {
              id: ["price-list-1"],
            },
            {
              relations: [
                "prices",
                "prices.price_set",
                "prices.price_rules",
                "price_list_rules.price_list_rule_values",
                "price_list_rules.rule_type",
              ],
              select: [
                "id",
                "prices.price_rules.value",
                "prices.rules_count",
                "prices.amount",
                "prices.currency_code",
                "prices.price_list_id",
                "price_list_rules.price_list_rule_values.value",
                "price_list_rules.rule_type.rule_attribute",
              ],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  rules_count: 0,
                  amount: 123,
                  currency_code: "EUR",
                }),
              ]),
              price_list_rules: [],
            })
          )
        })

        it("should fail to add a price with non-existing rule-types in the price-set to a priceList", async () => {
          await service.createRuleTypes([
            {
              name: "twitter_handle",
              rule_attribute: "twitter_handle",
            },
          ])

          let error
          try {
            await service.addPriceListPrices([
              {
                price_list_id: "price-list-1",
                prices: [
                  {
                    amount: 123,
                    currency_code: "EUR",
                    price_set_id: "price-set-1",
                    rules: {
                      twitter_handle: "owjuhl",
                    },
                  },
                ],
              },
            ])
          } catch (err) {
            error = err
          }

          expect(error.message).toEqual(
            "" +
              `Invalid rule type configuration: Price set rules doesn't exist for rule_attribute "twitter_handle" in price set price-set-1`
          )
        })

        it("should add a price with rules to a priceList successfully", async () => {
          await service.createRuleTypes([
            {
              name: "region_id",
              rule_attribute: "region_id",
            },
          ])

          const r = await service.addRules([
            {
              priceSetId: "price-set-1",
              rules: [{ attribute: "region_id" }],
            },
          ])

          jest.clearAllMocks()

          await service.addPriceListPrices([
            {
              price_list_id: "price-list-1",
              prices: [
                {
                  amount: 123,
                  currency_code: "EUR",
                  price_set_id: "price-set-1",
                  rules: {
                    region_id: "EU",
                  },
                },
              ],
            },
          ])

          const [priceList] = await service.listPriceLists(
            {
              id: ["price-list-1"],
            },
            {
              relations: [
                "prices",
                "prices.price_set",
                "prices.price_rules",
                "prices.price_rules.rule_type",
                "price_list_rules.price_list_rule_values",
                "price_list_rules.rule_type",
              ],
              select: [
                "id",
                "prices.price_rules.value",
                "prices.price_rules.rule_type.rule_attribute",
                "prices.rules_count",
                "prices.amount",
                "prices.currency_code",
                "prices.price_list_id",
                "price_list_rules.price_list_rule_values.value",
                "price_list_rules.rule_type.rule_attribute",
              ],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  rules_count: 1,
                  price_rules: [
                    expect.objectContaining({
                      value: "EU",
                      rule_type: expect.objectContaining({
                        rule_attribute: "region_id",
                      }),
                    }),
                  ],
                  amount: 123,
                  currency_code: "EUR",
                }),
              ]),
              price_list_rules: [],
            })
          )

          const events = eventBusEmitSpy.mock.calls[0][0]

          expect(events).toHaveLength(2)
          expect(events[0]).toEqual(
            composeMessage(PricingEvents.price_created, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price",
              data: { id: priceList.prices![0].id },
            })
          )
          expect(events[1]).toEqual(
            composeMessage(PricingEvents.price_rule_created, {
              source: Modules.PRICING,
              action: CommonEvents.CREATED,
              object: "price_rule",
              data: { id: priceList.prices![0].price_rules![0].id },
            })
          )
        })
      })

      describe("updatePriceListPrices", () => {
        it("should update a price to a priceList successfully", async () => {
          const [priceSet] = await service.createPriceSets([
            {
              rules: [
                { rule_attribute: "region_id" },
                { rule_attribute: "customer_group_id" },
              ],
            },
          ])

          await service.addPriceListPrices([
            {
              price_list_id: "price-list-1",
              prices: [
                {
                  id: "test-price-id",
                  amount: 123,
                  currency_code: "EUR",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: "test",
                  },
                } as any,
              ],
            },
          ])

          await service.updatePriceListPrices([
            {
              price_list_id: "price-list-1",
              prices: [
                {
                  id: "test-price-id",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: "new test",
                    customer_group_id: "new test",
                  },
                },
              ],
            },
          ])

          const [priceList] = await service.listPriceLists(
            { id: ["price-list-1"] },
            {
              relations: [
                "prices",
                "prices.price_set",
                "prices.price_rules",
                "prices.price_rules.rule_type",
                "price_list_rules.price_list_rule_values",
                "price_list_rules.rule_type",
              ],
              select: [
                "id",
                "prices.price_rules.value",
                "prices.price_rules.rule_type.rule_attribute",
                "prices.rules_count",
                "prices.amount",
                "prices.currency_code",
                "prices.price_list_id",
                "price_list_rules.price_list_rule_values.value",
                "price_list_rules.rule_type.rule_attribute",
              ],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  rules_count: 2,
                  price_rules: expect.arrayContaining([
                    expect.objectContaining({
                      value: "new test",
                      rule_type: expect.objectContaining({
                        rule_attribute: "region_id",
                      }),
                    }),
                    expect.objectContaining({
                      value: "new test",
                      rule_type: expect.objectContaining({
                        rule_attribute: "customer_group_id",
                      }),
                    }),
                  ]),
                  amount: 123,
                  currency_code: "EUR",
                }),
              ]),
              price_list_rules: [],
            })
          )
        })

        it("should fail to add a price with non-existing rule-types in the price-set to a priceList", async () => {
          await service.createRuleTypes([
            { name: "twitter_handle", rule_attribute: "twitter_handle" },
            { name: "region_id", rule_attribute: "region_id" },
          ])

          const [priceSet] = await service.createPriceSets([
            { rules: [{ rule_attribute: "region_id" }] },
          ])

          await service.addPriceListPrices([
            {
              price_list_id: "price-list-1",
              prices: [
                {
                  id: "test-price-id",
                  amount: 123,
                  currency_code: "EUR",
                  price_set_id: priceSet.id,
                  rules: { region_id: "test" },
                } as any,
              ],
            },
          ])

          const error = await service
            .updatePriceListPrices([
              {
                price_list_id: "price-list-1",
                prices: [
                  {
                    id: "test-price-id",
                    amount: 123,
                    price_set_id: priceSet.id,
                    rules: { twitter_handle: "owjuhl" },
                  },
                ],
              },
            ])
            .catch((e) => e)

          expect(error.message).toEqual(
            `Invalid rule type configuration: Price set rules doesn't exist for rule_attribute "twitter_handle" in price set ${priceSet.id}`
          )
        })
      })

      describe("removePrices", () => {
        it("should remove prices from a priceList successfully", async () => {
          const [priceSet] = await service.createPriceSets([
            { rules: [{ rule_attribute: "region_id" }] },
          ])

          await service.addPriceListPrices([
            {
              price_list_id: "price-list-1",
              prices: [
                {
                  amount: 123,
                  currency_code: "EUR",
                  price_set_id: priceSet.id,
                },
              ],
            },
          ])

          let [priceList] = await service.listPriceLists(
            { id: ["price-list-1"] },
            {
              relations: ["prices"],
              select: ["prices.id"],
            }
          )

          await service.removePrices(priceList.prices!.map((price) => price.id))
          ;[priceList] = await service.listPriceLists(
            { id: ["price-list-1"] },
            {
              relations: ["prices"],
              select: ["id", "prices.id"],
            }
          )

          expect(priceList).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: [],
            })
          )
        })
      })
    })
  },
})
