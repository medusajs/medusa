import {
  CreateShippingOptionDTO,
  IFulfillmentModuleService,
  UpdateShippingOptionDTO,
} from "@zjedene-medusa/framework/types"
import {
  FulfillmentEvents,
  GeoZoneType,
  Modules,
} from "@zjedene-medusa/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@zjedene-medusa/test-utils"
import { FulfillmentProviderService } from "@services"
import { resolve } from "path"
import {
  buildExpectedEventMessageShape,
  generateCreateShippingOptionsData,
} from "../../__fixtures__"
import { FulfillmentProviderServiceFixtures } from "../../__fixtures__/providers"

jest.setTimeout(1000000)

const moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      id: "test-provider",
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
          const fulfillmentSet = await service.createFulfillmentSets({
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
          const fulfillmentSet = await service.createFulfillmentSets({
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
                    value: ["true"],
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
                    value: "true",
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
              "test-attribute": "true",
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
          const fulfillmentSet = await service.createFulfillmentSets({
            name: "test",
            type: "test-type",
            service_zones: [
              {
                name: "test",
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "fr",
                  },
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
            },
          })

          expect(shippingOptions).toHaveLength(3)

          shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "fr",
              province_code: "rhone",
            },
          })

          expect(shippingOptions).toHaveLength(3)

          shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "fr",
            },
          })

          expect(shippingOptions).toHaveLength(3)

          shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "fr",
              postal_expression: "75006",
            },
          })

          expect(shippingOptions).toHaveLength(3)

          shippingOptions = await service.listShippingOptionsForContext({
            address: {
              country_code: "us",
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
        const fulfillmentSet = await service.createFulfillmentSets({
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
          it("should create a new shipping option", async function () {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.createFulfillmentSets({
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
            expect(eventBusEmitSpy).toHaveBeenCalledWith(
              expect.arrayContaining([
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_CREATED,
                  action: "created",
                  object: "shipping_option",
                  data: { id: createdShippingOption.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_TYPE_CREATED,
                  action: "created",
                  object: "shipping_option_type",
                  data: { id: createdShippingOption.type.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_CREATED,
                  action: "created",
                  object: "shipping_option_rule",
                  data: { id: createdShippingOption.rules[0].id },
                }),
              ]),
              {
                internal: true,
              }
            )
          })

          it("should create multiple new shipping options", async function () {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.createFulfillmentSets({
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

            jest.clearAllMocks()

            const createdShippingOptions = await service.createShippingOptions(
              createData
            )

            expect(createdShippingOptions).toHaveLength(2)
            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(6)

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

              expect(eventBusEmitSpy).toHaveBeenCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.SHIPPING_OPTION_CREATED,
                    action: "created",
                    object: "shipping_option",
                    data: {
                      id: createdShippingOptions[i].id,
                    },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.SHIPPING_OPTION_TYPE_CREATED,
                    action: "created",
                    object: "shipping_option_type",
                    data: {
                      id: createdShippingOptions[i].type.id,
                    },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_CREATED,
                    action: "created",
                    object: "shipping_option_rule",
                    data: {
                      id: createdShippingOptions[i].rules[0].id,
                    },
                  }),
                ]),
                {
                  internal: true,
                }
              )

              ++i
            }
          })

          it("should fail to create a new shipping option with invalid rules", async function () {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.createFulfillmentSets({
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
            const fulfillmentSet = await service.createFulfillmentSets({
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

            const updateData: UpdateShippingOptionDTO & {
              type: {
                code: string
                description: string
                label: string
              }
              rules: {
                attribute: string
                operator: string
                value: string
              }[]
            } = {
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

            jest.clearAllMocks()

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
                    value: "false",
                  }),
                  expect.objectContaining({
                    id: expect.any(String),
                    attribute: updateData.rules![1].attribute,
                    operator: updateData.rules![1].operator,
                    value: updateData.rules![1].value,
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
            expect(types).toHaveLength(2)
            expect(types).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  code: updateData.type.code,
                  description: updateData.type.description,
                  label: updateData.type.label,
                }),
              ])
            )

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(4)
            expect(eventBusEmitSpy).toHaveBeenCalledWith(
              expect.arrayContaining([
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_UPDATED,
                  action: "updated",
                  object: "shipping_option",
                  data: { id: updatedShippingOption.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_TYPE_CREATED,
                  action: "created",
                  object: "shipping_option_type",
                  data: { id: updatedShippingOption.type.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_CREATED,
                  action: "created",
                  object: "shipping_option_rule",
                  data: { id: updatedShippingOption.rules[1].id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_UPDATED,
                  action: "updated",
                  object: "shipping_option_rule",
                  data: { id: updatedShippingOption.rules[0].id },
                }),
              ]),
              {
                internal: true,
              }
            )
          })

          it("should update a shipping option without updating the rules or the type", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
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
            const fulfillmentSet = await service.createFulfillmentSets({
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
            expect(types).toHaveLength(4)
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
            const fulfillmentSet = await service.createFulfillmentSets({
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

            const shippingOptionData: UpdateShippingOptionDTO = {
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
            const fulfillmentSet = await service.createFulfillmentSets({
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
            const fulfillmentSet = await service.createFulfillmentSets({
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
            const fulfillmentSet = await service.createFulfillmentSets({
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

            jest.clearAllMocks()

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

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
            expect(eventBusEmitSpy).toHaveBeenCalledWith(
              [
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_CREATED,
                  action: "created",
                  object: "shipping_option_rule",
                  data: { id: rule.id },
                }),
              ],
              {
                internal: true,
              }
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

        describe("buildGeoZoneConstraintsFromAddress", () => {
          it("should build correct constraints for full address with postal expression", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                      postal_expression: "90210",
                    },
                    {
                      type: GeoZoneType.CITY,
                      country_code: "US",
                      province_code: "CA",
                      city: "San Francisco",
                    },
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "US",
                      province_code: "NY",
                    },
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "CA",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Test with full address including postal expression
            const shippingOptions = await service.listShippingOptionsForContext(
              {
                address: {
                  country_code: "US",
                  province_code: "CA",
                  city: "Los Angeles",
                  postal_expression: "90210",
                },
              }
            )

            expect(shippingOptions).toHaveLength(1)
          })

          it("should build correct constraints for address with city but no postal expression", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.CITY,
                      country_code: "US",
                      province_code: "CA",
                      city: "San Francisco",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Test with city but no postal expression
            const shippingOptions = await service.listShippingOptionsForContext(
              {
                address: {
                  country_code: "US",
                  province_code: "CA",
                  city: "San Francisco",
                },
              }
            )

            expect(shippingOptions).toHaveLength(1)
          })

          it("should build correct constraints for address with province but no city", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "US",
                      province_code: "NY",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Test with province but no city
            const shippingOptions = await service.listShippingOptionsForContext(
              {
                address: {
                  country_code: "US",
                  province_code: "NY",
                },
              }
            )

            expect(shippingOptions).toHaveLength(1)
          })

          it("should build correct constraints for address with only country", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "CA",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Test with only country
            const shippingOptions = await service.listShippingOptionsForContext(
              {
                address: {
                  country_code: "CA",
                },
              }
            )

            expect(shippingOptions).toHaveLength(1)
          })

          it("should handle hierarchical geo zone matching correctly", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                      postal_expression: "90210",
                    },
                    {
                      type: GeoZoneType.CITY,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                    },
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "US",
                      province_code: "CA",
                    },
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "US",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Test with full address - should match all levels
            let shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "Los Angeles",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(1)

            // Test with partial address - should still match broader zones
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
              },
            })
            expect(shippingOptions).toHaveLength(1)

            // Test with only country - should match country zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
              },
            })
            expect(shippingOptions).toHaveLength(1)
          })

          it("should not match zones when address doesn't satisfy requirements", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                      postal_expression: "90210",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Wrong postal code - should not match
            let shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "Los Angeles",
                postal_expression: "90211",
              },
            })
            expect(shippingOptions).toHaveLength(0)

            // Wrong city - should not match
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "San Francisco",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(0)

            // Wrong province - should not match
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "NY",
                city: "Los Angeles",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(0)

            // Wrong country - should not match
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "CA",
                province_code: "CA",
                city: "Los Angeles",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(0)
          })

          it("should handle partial address matching correctly", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "US",
                      province_code: "CA",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Full address with matching province should match
            let shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "Any City",
                postal_expression: "12345",
              },
            })
            expect(shippingOptions).toHaveLength(1)

            // Minimal matching address should match
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
              },
            })
            expect(shippingOptions).toHaveLength(1)

            // Address with only country should not match province-level zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
              },
            })
            expect(shippingOptions).toHaveLength(0)
          })

          it("should handle empty or null address fields correctly", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "US",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Address with undefined fields should still match if country matches
            const shippingOptions = await service.listShippingOptionsForContext(
              {
                address: {
                  country_code: "US",
                  province_code: undefined,
                  city: undefined,
                  postal_expression: undefined,
                },
              }
            )
            expect(shippingOptions).toHaveLength(1)
          })

          it("should correctly match addresses across multiple service zones", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "US Zones",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                      postal_expression: "90210",
                    },
                    {
                      type: GeoZoneType.CITY,
                      country_code: "US",
                      province_code: "NY",
                      city: "New York",
                    },
                  ],
                },
                {
                  name: "Europe Zones",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "FR",
                    },
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "DE",
                      province_code: "BY",
                    },
                  ],
                },
                {
                  name: "Canada Zones",
                  geo_zones: [
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "CA",
                      province_code: "ON",
                    },
                    {
                      type: GeoZoneType.CITY,
                      country_code: "CA",
                      province_code: "BC",
                      city: "Vancouver",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            // Create shipping options for each zone
            const [usOption, europeOption, canadaOption] =
              await service.createShippingOptions([
                generateCreateShippingOptionsData({
                  name: "US Shipping",
                  service_zone_id: fulfillmentSet.service_zones[0].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: providerId,
                }),
                generateCreateShippingOptionsData({
                  name: "Europe Shipping",
                  service_zone_id: fulfillmentSet.service_zones[1].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: providerId,
                }),
                generateCreateShippingOptionsData({
                  name: "Canada Shipping",
                  service_zone_id: fulfillmentSet.service_zones[2].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: providerId,
                }),
              ])

            // Test US ZIP code - should only match US zone
            let shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "Los Angeles",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(usOption.id)

            // Test New York city - should only match US zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "NY",
                city: "New York",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(usOption.id)

            // Test France - should only match Europe zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "FR",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(europeOption.id)

            // Test German province - should only match Europe zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "DE",
                province_code: "BY",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(europeOption.id)

            // Test Canadian province - should only match Canada zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "CA",
                province_code: "ON",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(canadaOption.id)

            // Test Vancouver - should only match Canada zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "CA",
                province_code: "BC",
                city: "Vancouver",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(canadaOption.id)

            // Test non-matching address - should return no options
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "JP",
                city: "Tokyo",
              },
            })
            expect(shippingOptions).toHaveLength(0)
          })

          it("should handle overlapping zones across multiple service zones", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "Broad US Zone",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "US",
                    },
                  ],
                },
                {
                  name: "Specific California Zone",
                  geo_zones: [
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "US",
                      province_code: "CA",
                    },
                  ],
                },
                {
                  name: "Specific LA Zone",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                      postal_expression: "90210",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            // Create shipping options with different prices for each zone
            const [broadOption, californiaOption, laOption] =
              await service.createShippingOptions([
                generateCreateShippingOptionsData({
                  name: "Standard US Shipping",
                  service_zone_id: fulfillmentSet.service_zones[0].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: providerId,
                }),
                generateCreateShippingOptionsData({
                  name: "California Express",
                  service_zone_id: fulfillmentSet.service_zones[1].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: providerId,
                }),
                generateCreateShippingOptionsData({
                  name: "LA Premium",
                  service_zone_id: fulfillmentSet.service_zones[2].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: providerId,
                }),
              ])

            // Test LA ZIP code - should match all three zones
            let shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "Los Angeles",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(3)
            const laIds = shippingOptions.map((opt) => opt.id)
            expect(laIds).toContain(broadOption.id)
            expect(laIds).toContain(californiaOption.id)
            expect(laIds).toContain(laOption.id)

            // Test California (not LA) - should match broad US and California zones
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "San Francisco",
              },
            })
            expect(shippingOptions).toHaveLength(2)
            const caIds = shippingOptions.map((opt) => opt.id)
            expect(caIds).toContain(broadOption.id)
            expect(caIds).toContain(californiaOption.id)
            expect(caIds).not.toContain(laOption.id)

            // Test US (not California) - should only match broad US zone
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "NY",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(broadOption.id)

            // Test non-US address - should match nothing
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "CA",
              },
            })
            expect(shippingOptions).toHaveLength(0)
          })

          it("should handle mixed granularity zones across service zones", async () => {
            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "Mixed Zone 1",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      country_code: "US",
                      province_code: "CA",
                      city: "Los Angeles",
                      postal_expression: "90210",
                    },
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "FR",
                    },
                  ],
                },
                {
                  name: "Mixed Zone 2",
                  geo_zones: [
                    {
                      type: GeoZoneType.CITY,
                      country_code: "US",
                      province_code: "NY",
                      city: "New York",
                    },
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "CA",
                      province_code: "ON",
                    },
                  ],
                },
              ],
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const [option1, option2] = await service.createShippingOptions([
              generateCreateShippingOptionsData({
                name: "Mixed Option 1",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
              generateCreateShippingOptionsData({
                name: "Mixed Option 2",
                service_zone_id: fulfillmentSet.service_zones[1].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: providerId,
              }),
            ])

            // Test LA ZIP - should match zone 1
            let shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "CA",
                city: "Los Angeles",
                postal_expression: "90210",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(option1.id)

            // Test France - should match zone 1
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "FR",
                city: "Paris",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(option1.id)

            // Test New York - should match zone 2
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "US",
                province_code: "NY",
                city: "New York",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(option2.id)

            // Test Ontario, Canada - should match zone 2
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "CA",
                province_code: "ON",
                city: "Toronto",
              },
            })
            expect(shippingOptions).toHaveLength(1)
            expect(shippingOptions[0].id).toBe(option2.id)

            // Test unmatched location
            shippingOptions = await service.listShippingOptionsForContext({
              address: {
                country_code: "UK",
              },
            })
            expect(shippingOptions).toHaveLength(0)
          })
        })

        describe("on update shipping option rules", () => {
          it("should update a shipping option rule", async () => {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.createFulfillmentSets({
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

            jest.clearAllMocks()

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

            expect(eventBusEmitSpy).toHaveBeenCalledWith(
              [
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_UPDATED,
                  action: "updated",
                  object: "shipping_option_rule",
                  data: { id: updatedRule.id },
                }),
              ],
              {
                internal: true,
              }
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
