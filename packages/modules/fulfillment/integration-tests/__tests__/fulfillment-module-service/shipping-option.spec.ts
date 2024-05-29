import { Modules } from "@medusajs/modules-sdk"
import {
  CreateShippingOptionDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import {
  buildExpectedEventMessageShape,
  generateCreateShippingOptionsData,
} from "../../__fixtures__"
import { resolve } from "path"
import { FulfillmentProviderService } from "@services"
import { FulfillmentProviderServiceFixtures } from "../../__fixtures__/providers"
import { FulfillmentEvents, GeoZoneType } from "@medusajs/utils"
import { UpdateShippingOptionDTO } from "@medusajs/types/src"

jest.setTimeout(100000)

const moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      options: {
        config: {
          "test-provider": {},
        },
      },
    },
  ],
}

const providerId = FulfillmentProviderService.getRegistrationIdentifier(
  FulfillmentProviderServiceFixtures,
  "test-provider"
)

moduleIntegrationTestRunner<IFulfillmentModuleService>({
  moduleName: Modules.FULFILLMENT,
  moduleOptions,
  testSuite: ({ service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("Fulfillment Module Service", () => {
      describe("read", () => {
        it("should list shipping options with a filter", async function () {
          const fulfillmentSet = await service.create({
            name: "test",
            type: "test-type",
            service_zones: [
              {
                name: "test",
              },
            ],
          })

          const shippingProfile = await service.createShippingProfiles({
            name: "test",
            type: "default",
          })

          const [shippingOption1] = await service.createShippingOptions([
            generateCreateShippingOptionsData({
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "in",
                  value: ["test"],
                },
              ],
            }),
            generateCreateShippingOptionsData({
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "eq",
                  value: "test",
                },
                {
                  attribute: "test-attribute2.options",
                  operator: "in",
                  value: ["test", "test2"],
                },
              ],
            }),
          ])

          const listedOptions = await service.listShippingOptions({
            name: shippingOption1.name,
          })

          expect(listedOptions).toHaveLength(1)
          expect(listedOptions[0].id).toEqual(shippingOption1.id)
        })

        it("should list shipping options with a context", async function () {
          const fulfillmentSet = await service.create({
            name: "test",
            type: "test-type",
            service_zones: [
              {
                name: "test",
              },
            ],
          })

          const shippingProfile = await service.createShippingProfiles({
            name: "test",
            type: "default",
          })

          const [shippingOption1, , shippingOption3] =
            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: ["test"],
                  },
                ],
              }),
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: ["test-test"],
                  },
                ],
              }),
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "eq",
                    value: "test",
                  },
                  {
                    attribute: "test-attribute2.options",
                    operator: "in",
                    value: ["test", "test2"],
                  },
                ],
              }),
            ])

          let listedOptions = await service.listShippingOptionsForContext({
            context: {
              "test-attribute": "test",
              "test-attribute2": {
                options: "test2",
              },
            },
          })

          expect(listedOptions).toHaveLength(2)
          expect(listedOptions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: shippingOption1.id }),
              expect.objectContaining({ id: shippingOption3.id }),
            ])
          )

          listedOptions = await service.listShippingOptionsForContext({
            service_zone: {
              fulfillment_set: {
                id: { $ne: fulfillmentSet.id },
              },
            },
            context: {
              "test-attribute": "test",
              "test-attribute2": {
                options: "test2",
              },
            },
          })

          expect(listedOptions).toHaveLength(0)

          listedOptions = await service.listShippingOptionsForContext({
            service_zone: {
              fulfillment_set: {
                type: "non-existing-type",
              },
            },
            context: {
              "test-attribute": "test",
              "test-attribute2": {
                options: "test2",
              },
            },
          })

          expect(listedOptions).toHaveLength(0)
        })

        it(`should list the shipping options for a context with a specific address`, async function () {
          const fulfillmentSet = await service.create({
            name: "test",
            type: "test-type",
            service_zones: [
              {
                name: "test",
                geo_zones: [
                  {
                    type: GeoZoneType.ZIP,
                    country_code: "fr",
                    province_code: "rhone",
                    city: "paris",
                    postal_expression: "75006",
                  },
                ],
              },
            ],
          })

          const shippingProfile = await service.createShippingProfiles({
            name: "test",
            type: "default",
          })

          const [shippingOption1, , shippingOption3] =
            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: ["test"],
                  },
                ],
              }),
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: ["test-test"],
                  },
                ],
              }),
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "eq",
                    value: "test",
                  },
                  {
                    attribute: "test-attribute2.options",
                    operator: "in",
                    value: ["test", "test2"],
                  },
                ],
              }),
            ])

          let shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "fr",
              province_code: "rhone",
              city: "paris",
              postal_expression: "75006",
            },
          })

          expect(shippingOptions).toHaveLength(3)

          shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "fr",
              province_code: "rhone",
              city: "paris",
              postal_expression: "75001",
            },
          })

          expect(shippingOptions).toHaveLength(0)

          shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "fr",
              province_code: "rhone",
              city: "paris",
              postal_expression: "75006",
            },
            context: {
              "test-attribute": "test",
              "test-attribute2": {
                options: "test2",
              },
            },
          })

          expect(shippingOptions).toHaveLength(2)
          expect(shippingOptions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: shippingOption1.id }),
              expect.objectContaining({ id: shippingOption3.id }),
            ])
          )
        })
      })

      it("should validate if a shipping option is applicable to a context", async function () {
        const fulfillmentSet = await service.create({
          name: "test",
          type: "test-type",
          service_zones: [
            {
              name: "test",
            },
          ],
        })

        const shippingProfile = await service.createShippingProfiles({
          name: "test",
          type: "default",
        })

        const [shippingOption1, shippingOption2, shippingOption3] =
          await service.createShippingOptions([
            generateCreateShippingOptionsData({
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "in",
                  value: ["test"],
                },
              ],
            }),
            generateCreateShippingOptionsData({
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "in",
                  value: ["test-test"],
                },
              ],
            }),
            generateCreateShippingOptionsData({
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "eq",
                  value: "test",
                },
                {
                  attribute: "test-attribute2.options",
                  operator: "in",
                  value: ["test", "test2"],
                },
              ],
            }),
          ])

        let listedOptions = await service.listShippingOptions()

        expect(listedOptions).toHaveLength(3)

        const context = {
          "test-attribute": "test",
          "test-attribute2": {
            options: "test2",
          },
        }

        const isShippingOption1Applicable =
          await service.validateShippingOption(shippingOption1.id, context)
        expect(isShippingOption1Applicable).toBeTruthy()

        const isShippingOption2Applicable =
          await service.validateShippingOption(shippingOption2.id, context)
        expect(isShippingOption2Applicable).toBeFalsy()

        const isShippingOption3Applicable =
          await service.validateShippingOption(shippingOption3.id, context)
        expect(isShippingOption3Applicable).toBeTruthy()
      })

      describe("mutations", () => {
        describe("on create", () => {
          it.only("should create a new shipping option", async function () {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const createData: CreateShippingOptionDTO =
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              })

            jest.clearAllMocks()

            const createdShippingOption = await service.createShippingOptions(
              createData
            )

            expect(createdShippingOption).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                name: createData.name,
                price_type: createData.price_type,
                service_zone_id: createData.service_zone_id,
                shipping_profile_id: createData.shipping_profile_id,
                provider_id: createData.provider_id,
                shipping_option_type_id: expect.any(String),
                type: expect.objectContaining({
                  id: expect.any(String),
                  code: createData.type.code,
                  description: createData.type.description,
                  label: createData.type.label,
                }),
                data: createData.data,
                rules: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    attribute: createData.rules![0].attribute,
                    operator: createData.rules![0].operator,
                    value: createData.rules![0].value,
                  }),
                ]),
              })
            )

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(3)
            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.shipping_option_created,
                action: "created",
                object: "shipping_option",
                data: { id: createdShippingOption.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.shipping_option_type_created,
                action: "created",
                object: "shipping_option_type",
                data: { id: createdShippingOption.type.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.shipping_option_rule_created,
                action: "created",
                object: "shipping_option_rule",
                data: { id: createdShippingOption.rules[0].id },
              }),
            ])
          })

          it("should create multiple new shipping options", async function () {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const createData: CreateShippingOptionDTO[] = [
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ]

            const createdShippingOptions = await service.createShippingOptions(
              createData
            )

            expect(createdShippingOptions).toHaveLength(2)

            let i = 0
            for (const data_ of createData) {
              expect(createdShippingOptions[i]).toEqual(
                expect.objectContaining({
                  id: expect.any(String),
                  name: data_.name,
                  price_type: data_.price_type,
                  service_zone_id: data_.service_zone_id,
                  shipping_profile_id: data_.shipping_profile_id,
                  provider_id: data_.provider_id,
                  shipping_option_type_id: expect.any(String),
                  type: expect.objectContaining({
                    id: expect.any(String),
                    code: data_.type.code,
                    description: data_.type.description,
                    label: data_.type.label,
                  }),
                  data: data_.data,
                  rules: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      attribute: data_.rules![0].attribute,
                      operator: data_.rules![0].operator,
                      value: data_.rules![0].value,
                    }),
                  ]),
                })
              )
              ++i
            }
          })

          it("should fail to create a new shipping option with invalid rules", async function () {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const createData: CreateShippingOptionDTO =
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "invalid" as any,
                    value: "test-value",
                  },
                ],
              })

            const err = await service
              .createShippingOptions(createData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              "Rule operator invalid is not supported. Must be one of in, eq, ne, gt, gte, lt, lte, nin"
            )
          })
        })

        describe("on update", () => {
          it("should update a shipping option", async () => {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const shippingOptionData = generateCreateShippingOptionsData({
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
            })

            const shippingOption = await service.createShippingOptions(
              shippingOptionData
            )

            const existingRule = shippingOption.rules[0]!

            const updateData: UpdateShippingOptionDTO = {
              id: shippingOption.id,
              name: "updated-test",
              price_type: "calculated",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              type: {
                code: "updated-test",
                description: "updated-test",
                label: "updated-test",
              },
              data: {
                amount: 2000,
              },
              rules: [
                {
                  ...existingRule,
                  value: "false",
                },
                {
                  attribute: "new-test",
                  operator: "eq",
                  value: "new-test",
                },
              ],
            }

            const updatedShippingOption = await service.updateShippingOptions(
              updateData.id!,
              updateData
            )

            expect(updatedShippingOption).toEqual(
              expect.objectContaining({
                id: updateData.id,
                name: updateData.name,
                price_type: updateData.price_type,
                service_zone_id: updateData.service_zone_id,
                shipping_profile_id: updateData.shipping_profile_id,
                provider_id: updateData.provider_id,
                shipping_option_type_id: expect.any(String),
                type: expect.objectContaining({
                  id: expect.any(String),
                  code: updateData.type.code,
                  description: updateData.type.description,
                  label: updateData.type.label,
                }),
                data: updateData.data,
                rules: expect.arrayContaining([
                  expect.objectContaining({
                    id: existingRule.id,
                    value: '"false"',
                  }),
                  expect.objectContaining({
                    id: expect.any(String),
                    attribute: updateData.rules[1].attribute,
                    operator: updateData.rules[1].operator,
                    value: updateData.rules[1].value,
                  }),
                ]),
              })
            )

            const rules = await service.listShippingOptionRules()
            expect(rules).toHaveLength(2)
            expect(rules).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: updatedShippingOption.rules[0].id,
                }),
                expect.objectContaining({
                  id: updatedShippingOption.rules[1].id,
                }),
              ])
            )

            const types = await service.listShippingOptionTypes()
            expect(types).toHaveLength(1)
            expect(types[0]).toEqual(
              expect.objectContaining({
                code: updateData.type.code,
                description: updateData.type.description,
                label: updateData.type.label,
              })
            )
          })

          it("should update a shipping option without updating the rules or the type", async () => {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const shippingOptionData = generateCreateShippingOptionsData({
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
            })

            const shippingOption = await service.createShippingOptions(
              shippingOptionData
            )

            const updateData: Partial<UpdateShippingOptionDTO> = {
              id: shippingOption.id,
              name: "updated-test",
              price_type: "calculated",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              data: {
                amount: 2000,
              },
            }

            await service.updateShippingOptions(updateData.id!, updateData)

            const updatedShippingOption = await service.retrieveShippingOption(
              shippingOption.id,
              {
                relations: ["rules", "type"],
              }
            )

            expect(updatedShippingOption).toEqual(
              expect.objectContaining({
                id: updateData.id,
                name: updateData.name,
                price_type: updateData.price_type,
                service_zone_id: updateData.service_zone_id,
                shipping_profile_id: updateData.shipping_profile_id,
                provider_id: updateData.provider_id,
                shipping_option_type_id: expect.any(String),
                type: expect.objectContaining({
                  id: expect.any(String),
                  code: shippingOptionData.type.code,
                  description: shippingOptionData.type.description,
                  label: shippingOptionData.type.label,
                }),
                data: updateData.data,
                rules: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    attribute: shippingOptionData.rules[0].attribute,
                    operator: shippingOptionData.rules[0].operator,
                    value: shippingOptionData.rules[0].value,
                  }),
                ]),
              })
            )

            const rules = await service.listShippingOptionRules()
            expect(rules).toHaveLength(1)
            expect(rules[0]).toEqual(
              expect.objectContaining({
                id: updatedShippingOption.rules[0].id,
              })
            )

            const types = await service.listShippingOptionTypes()
            expect(types).toHaveLength(1)
            expect(types[0]).toEqual(
              expect.objectContaining({
                code: shippingOptionData.type.code,
                description: shippingOptionData.type.description,
                label: shippingOptionData.type.label,
              })
            )
          })

          it("should update a collection of shipping options", async () => {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const shippingOptionData = [
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ]

            const shippingOptions = await service.createShippingOptions(
              shippingOptionData
            )

            const updateData = [
              {
                id: shippingOptions[0].id,
                name: "updated-test",
                price_type: "calculated",
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                type: {
                  code: "updated-test",
                  description: "updated-test",
                  label: "updated-test",
                },
                data: {
                  amount: 2000,
                },
                rules: [
                  {
                    attribute: "new-test",
                    operator: "eq",
                    value: "new-test",
                  },
                ],
              },
              {
                id: shippingOptions[1].id,
                name: "updated-test",
                price_type: "calculated",
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
                type: {
                  code: "updated-test",
                  description: "updated-test",
                  label: "updated-test",
                },
                data: {
                  amount: 2000,
                },
                rules: [
                  {
                    attribute: "new-test",
                    operator: "eq",
                    value: "new-test",
                  },
                ],
              },
            ]

            const updatedShippingOption = await service.upsertShippingOptions(
              updateData
            )

            for (const data_ of updateData) {
              const expectedShippingOption = updatedShippingOption.find(
                (shippingOption) => shippingOption.id === data_.id
              )
              expect(expectedShippingOption).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  name: data_.name,
                  price_type: data_.price_type,
                  service_zone_id: data_.service_zone_id,
                  shipping_profile_id: data_.shipping_profile_id,
                  provider_id: data_.provider_id,
                  shipping_option_type_id: expect.any(String),
                  type: expect.objectContaining({
                    id: expect.any(String),
                    code: data_.type.code,
                    description: data_.type.description,
                    label: data_.type.label,
                  }),
                  data: data_.data,
                  rules: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      attribute: data_.rules[0].attribute,
                      operator: data_.rules[0].operator,
                      value: data_.rules[0].value,
                    }),
                  ]),
                })
              )
            }

            const rules = await service.listShippingOptionRules()
            expect(rules).toHaveLength(2)
            expect(rules).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: updatedShippingOption[0].rules[0].id,
                }),
                expect.objectContaining({
                  id: updatedShippingOption[1].rules[0].id,
                }),
              ])
            )

            const types = await service.listShippingOptionTypes()
            expect(types).toHaveLength(2)
            expect(types).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  code: updateData[0].type.code,
                  description: updateData[0].type.description,
                  label: updateData[0].type.label,
                }),
                expect.objectContaining({
                  code: updateData[1].type.code,
                  description: updateData[1].type.description,
                  label: updateData[1].type.label,
                }),
              ])
            )
          })

          it("should fail to update a non-existent shipping option", async () => {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const shippingOptionData = {
              id: "sp_jdafwfleiwuonl",
              name: "test",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
              type: {
                code: "test",
                description: "test",
                label: "test",
              },
              data: {
                amount: 1000,
              },
              rules: [
                {
                  attribute: "test",
                  operator: "eq",
                  value: "test",
                },
              ],
            }

            const err = await service
              .updateShippingOptions(shippingOptionData.id!, shippingOptionData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              `The following shipping options do not exist: ${shippingOptionData.id}`
            )
          })

          it("should fail to update a shipping option when adding non existing rules", async () => {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const shippingOptionData = generateCreateShippingOptionsData({
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
            })

            const shippingOption = await service.createShippingOptions(
              shippingOptionData
            )

            const updateData = [
              {
                id: shippingOption.id,
                rules: [
                  {
                    id: "sp_jdafwfleiwuonl",
                  },
                ],
              },
            ]

            const err = await service
              .updateShippingOptions(updateData[0].id!, updateData[0])
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              `The following rules does not exists: ${updateData[0].rules[0].id} on shipping option ${shippingOption.id}`
            )
          })

          it("should fail to update a shipping option when adding invalid rules", async () => {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const shippingOptionData = generateCreateShippingOptionsData({
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              provider_id: providerId,
            })

            const shippingOption = await service.createShippingOptions(
              shippingOptionData
            )

            const updateData = [
              {
                id: shippingOption.id,
                rules: [
                  {
                    attribute: "test",
                    operator: "invalid",
                    value: "test",
                  },
                ],
              },
            ]

            const err = await service
              .updateShippingOptions(updateData[0].id!, updateData[0])
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              `Rule operator invalid is not supported. Must be one of in, eq, ne, gt, gte, lt, lte, nin`
            )
          })
        })

        describe("on create shipping option rules", () => {
          it("should create a new rule", async () => {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const shippingOption = await service.createShippingOptions(
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              })
            )

            const ruleData = {
              attribute: "test-attribute",
              operator: "eq",
              value: "test-value",
              shipping_option_id: shippingOption.id,
            }

            const rule = await service.createShippingOptionRules(ruleData)

            expect(rule).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                attribute: ruleData.attribute,
                operator: ruleData.operator,
                value: ruleData.value,
                shipping_option_id: ruleData.shipping_option_id,
              })
            )

            const rules = await service.listShippingOptionRules()
            expect(rules).toHaveLength(2)
            expect(rules).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: rule.id,
                  attribute: ruleData.attribute,
                  operator: ruleData.operator,
                  value: ruleData.value,
                  shipping_option_id: shippingOption.id,
                }),
                expect.objectContaining({
                  id: shippingOption.rules[0].id,
                  attribute: shippingOption.rules[0].attribute,
                  operator: shippingOption.rules[0].operator,
                  value: shippingOption.rules[0].value,
                  shipping_option_id: shippingOption.id,
                }),
              ])
            )
          })
        })

        describe("on update shipping option rules", () => {
          it("should update a shipping option rule", async () => {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const shippingOption = await service.createShippingOptions(
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              })
            )

            const updateData = {
              id: shippingOption.rules[0].id,
              attribute: "updated-test",
              operator: "eq",
              value: "updated-test",
            }

            const updatedRule = await service.updateShippingOptionRules(
              updateData
            )

            expect(updatedRule).toEqual(
              expect.objectContaining({
                id: updateData.id,
                attribute: updateData.attribute,
                operator: updateData.operator,
                value: updateData.value,
              })
            )
          })

          it("should fail to update a non-existent shipping option rule", async () => {
            const updateData = {
              id: "sp_jdafwfleiwuonl",
              attribute: "updated-test",
              operator: "eq",
              value: "updated-test",
            }

            const err = await service
              .updateShippingOptionRules(updateData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              `ShippingOptionRule with id "${updateData.id}" not found`
            )
          })
        })
      })
    })
  },
})
