import { Modules } from "@medusajs/modules-sdk"
import {
  CreateFulfillmentSetDTO,
  CreateGeoZoneDTO,
  CreateServiceZoneDTO,
  CreateShippingOptionDTO,
  CreateShippingProfileDTO,
  GeoZoneDTO,
  IFulfillmentModuleService,
  ServiceZoneDTO,
  UpdateFulfillmentSetDTO,
  UpdateGeoZoneDTO,
  UpdateServiceZoneDTO,
} from "@medusajs/types"
import { GeoZoneType } from "@medusajs/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IFulfillmentModuleService>) => {
    describe("Fulfillment Module Service", () => {
      describe("read", () => {
        describe("fulfillment set", () => {
          it("should list fulfillment sets with a filter", async function () {
            const createdSet1 = await service.create({
              name: "test",
              type: "test-type",
            })
            const createdSet2 = await service.create({
              name: "test2",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "fr",
                    },
                  ],
                },
                {
                  name: "test2",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "fr",
                    },
                  ],
                },
                {
                  name: "_test",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "fr",
                    },
                  ],
                },
              ],
            })

            let listedSets = await service.list(
              {
                type: createdSet1.type,
              },
              {
                relations: ["service_zones"],
              }
            )

            const listedSets2 = await service.list(
              {
                type: createdSet1.type,
              },
              {
                relations: ["service_zones"],
              }
            )

            expect(listedSets).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet1.id }),
                expect.objectContaining({ id: createdSet2.id }),
              ])
            )

            // Respecting order id by default
            expect(listedSets[1].service_zones).toEqual([
              expect.objectContaining({ name: "test" }),
              expect.objectContaining({ name: "test2" }),
              expect.objectContaining({ name: "_test" }),
            ])

            expect(listedSets2).toEqual(listedSets2)

            listedSets = await service.list({
              name: createdSet2.name,
            })

            expect(listedSets).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet2.id }),
              ])
            )
            expect(listedSets).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet1.id }),
              ])
            )

            listedSets = await service.list({
              service_zones: { name: "test" },
            })

            expect(listedSets).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet2.id }),
              ])
            )
            expect(listedSets).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet1.id }),
              ])
            )

            listedSets = await service.list({
              service_zones: { geo_zones: { country_code: "fr" } },
            })

            expect(listedSets).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet2.id }),
              ])
            )
            expect(listedSets).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet1.id }),
              ])
            )
          })
        })

        describe("service zones", () => {
          it("should list service zones with a filter", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const createdZone1 = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const createdZone2 = await service.createServiceZones({
              name: "test2",
              fulfillment_set_id: fulfillmentSet.id,
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "fr",
                },
              ],
            })

            let listedZones = await service.listServiceZones({
              name: createdZone2.name,
            })

            expect(listedZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone2.id }),
              ])
            )
            expect(listedZones).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone1.id }),
              ])
            )

            listedZones = await service.listServiceZones({
              geo_zones: { country_code: "fr" },
            })

            expect(listedZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone2.id }),
              ])
            )
            expect(listedZones).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone1.id }),
              ])
            )
          })
        })

        describe("geo zones", () => {
          it("should list geo zones with a filter", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const createdZone1 = await service.createGeoZones({
              service_zone_id: serviceZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "fr",
            })
            const createdZone2 = await service.createGeoZones({
              service_zone_id: serviceZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "us",
            })

            let listedZones = await service.listGeoZones({
              type: createdZone1.type,
            })

            expect(listedZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone1.id }),
                expect.objectContaining({ id: createdZone2.id }),
              ])
            )

            listedZones = await service.listGeoZones({
              country_code: createdZone2.country_code,
            })

            expect(listedZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone2.id }),
              ])
            )
            expect(listedZones).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone1.id }),
              ])
            )
          })
        })
      })

      describe("mutations", () => {
        describe("on create", () => {
          it("should create a new fulfillment set", async function () {
            const data: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
            }

            const fulfillmentSet = await service.create(data)

            expect(fulfillmentSet).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                name: data.name,
                type: data.type,
              })
            )
          })

          it("should create a collection of fulfillment sets", async function () {
            const data = [
              {
                name: "test",
                type: "test-type",
              },
              {
                name: "test2",
                type: "test-type2",
              },
            ]

            const fulfillmentSets = await service.create(data)

            expect(fulfillmentSets).toHaveLength(2)

            let i = 0
            for (const data_ of data) {
              expect(fulfillmentSets[i]).toEqual(
                expect.objectContaining({
                  id: expect.any(String),
                  name: data_.name,
                  type: data_.type,
                })
              )
              ++i
            }
          })

          it("should create a new fulfillment set with new service zones", async function () {
            const data = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                },
              ],
            }

            const fulfillmentSet = await service.create(data)

            expect(fulfillmentSet).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                name: data.name,
                type: data.type,
                service_zones: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    name: data.service_zones[0].name,
                  }),
                ]),
              })
            )
          })

          it("should create a collection of fulfillment sets with new service zones", async function () {
            const data = [
              {
                name: "test",
                type: "test-type",
                service_zones: [
                  {
                    name: "test",
                  },
                ],
              },
              {
                name: "test2",
                type: "test-type2",
                service_zones: [
                  {
                    name: "test2",
                  },
                ],
              },
              {
                name: "test3",
                type: "test-type3",
                service_zones: [
                  {
                    name: "test3",
                  },
                ],
              },
            ]

            const fulfillmentSets = await service.create(data)

            expect(fulfillmentSets).toHaveLength(3)

            let i = 0
            for (const data_ of data) {
              expect(fulfillmentSets[i]).toEqual(
                expect.objectContaining({
                  id: expect.any(String),
                  name: data_.name,
                  type: data_.type,
                  service_zones: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      name: data_.service_zones[0].name,
                    }),
                  ]),
                })
              )
              ++i
            }
          })

          it("should create a new fulfillment set with new service zones and new geo zones", async function () {
            const data: CreateFulfillmentSetDTO = {
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
                  ],
                },
              ],
            }

            const fulfillmentSet = await service.create(data)

            expect(fulfillmentSet).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                name: data.name,
                type: data.type,
                service_zones: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    name: (data.service_zones![0] as any).name,
                    geo_zones: expect.arrayContaining([
                      expect.objectContaining({
                        type: (data.service_zones![0] as any).geo_zones[0].type,
                        country_code: (data.service_zones![0] as any)
                          .geo_zones[0].country_code,
                      }),
                    ]),
                  }),
                ]),
              })
            )
          })

          it("should create a collection of fulfillment sets with new service zones and new geo zones", async function () {
            const data: CreateFulfillmentSetDTO[] = [
              {
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
                    ],
                  },
                ],
              },
              {
                name: "test2",
                type: "test-type2",
                service_zones: [
                  {
                    name: "test2",
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "fr",
                      },
                    ],
                  },
                ],
              },
              {
                name: "test3",
                type: "test-type3",
                service_zones: [
                  {
                    name: "test3",
                    geo_zones: [
                      {
                        type: GeoZoneType.CITY,
                        country_code: "fr",
                        city: "lyon",
                      },
                    ],
                  },
                ],
              },
            ]

            const fulfillmentSets = await service.create(data)

            expect(fulfillmentSets).toHaveLength(3)

            let i = 0
            for (const data_ of data) {
              expect(fulfillmentSets[i]).toEqual(
                expect.objectContaining({
                  id: expect.any(String),
                  name: data_.name,
                  type: data_.type,
                  service_zones: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      name: (data_.service_zones![0] as any).name,
                      geo_zones: expect.arrayContaining([
                        expect.objectContaining({
                          type: (data_.service_zones![0] as any).geo_zones[0]
                            .type,
                          country_code: (data_.service_zones![0] as any)
                            .geo_zones[0].country_code,
                        }),
                      ]),
                    }),
                  ]),
                })
              )
              ++i
            }
          })

          it(`should fail on duplicated fulfillment set name`, async function () {
            const data: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
            }

            await service.create(data)
            const err = await service.create(data).catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_fulfillment_set_name_unique")
          })
        })

        describe("on create service zones", () => {
          it("should create a new service zone", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const data: CreateServiceZoneDTO = {
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "fr",
                },
              ],
            }

            const serviceZone = await service.createServiceZones(data)

            expect(serviceZone).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                name: data.name,
                geo_zones: expect.arrayContaining([
                  expect.objectContaining({
                    type: (data.geo_zones![0] as GeoZoneDTO).type,
                    country_code: (data.geo_zones![0] as GeoZoneDTO)
                      .country_code,
                  }),
                ]),
              })
            )
          })

          it("should create a collection of service zones", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const data: CreateServiceZoneDTO[] = [
              {
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "fr",
                  },
                ],
              },
              {
                name: "test2",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "fr",
                  },
                ],
              },
              {
                name: "test3",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "uk",
                  },
                ],
              },
            ]

            const serviceZones = await service.createServiceZones(data)

            expect(serviceZones).toHaveLength(3)

            let i = 0
            for (const data_ of data) {
              expect(serviceZones[i]).toEqual(
                expect.objectContaining({
                  id: expect.any(String),
                  name: data_.name,
                  geo_zones: expect.arrayContaining([
                    expect.objectContaining({
                      type: (data_.geo_zones![0] as GeoZoneDTO).type,
                      country_code: (data_.geo_zones![0] as GeoZoneDTO)
                        .country_code,
                    }),
                  ]),
                })
              )
              ++i
            }
          })

          it("should fail on duplicated service zone name", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const data: CreateServiceZoneDTO = {
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "fr",
                },
              ],
            }

            await service.createServiceZones(data)
            const err = await service.createServiceZones(data).catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_service_zone_name_unique")
          })
        })

        describe("on create geo zones", () => {
          it("should create a new geo zone", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const data: CreateGeoZoneDTO = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "fr",
            }

            const geoZone = await service.createGeoZones(data)

            expect(geoZone).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                type: data.type,
                country_code: data.country_code,
              })
            )
          })

          it("should create a collection of geo zones", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const data: CreateGeoZoneDTO[] = [
              {
                service_zone_id: serviceZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: "fr",
              },
              {
                service_zone_id: serviceZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: "us",
              },
            ]

            const geoZones = await service.createGeoZones(data)

            expect(geoZones).toHaveLength(2)

            let i = 0
            for (const data_ of data) {
              expect(geoZones[i]).toEqual(
                expect.objectContaining({
                  id: expect.any(String),
                  type: data_.type,
                  country_code: data_.country_code,
                })
              )
              ++i
            }
          })
        })

        describe("on create shipping profiles", () => {
          it("should create a new shipping profile", async function () {
            const createData: CreateShippingProfileDTO = {
              name: "test-default-profile",
              type: "default",
            }

            const createdShippingProfile = await service.createShippingProfiles(
              createData
            )

            expect(createdShippingProfile).toEqual(
              expect.objectContaining({
                name: createData.name,
                type: createData.type,
              })
            )
          })

          it("should create multiple new shipping profiles", async function () {
            const createData: CreateShippingProfileDTO[] = [
              {
                name: "test-profile-1",
                type: "default",
              },
              {
                name: "test-profile-2",
                type: "custom",
              },
            ]

            const createdShippingProfiles =
              await service.createShippingProfiles(createData)

            expect(createdShippingProfiles).toHaveLength(2)

            let i = 0
            for (const data_ of createData) {
              expect(createdShippingProfiles[i]).toEqual(
                expect.objectContaining({
                  name: data_.name,
                  type: data_.type,
                })
              )
              ++i
            }
          })

          it("should fail on duplicated shipping profile name", async function () {
            const createData: CreateShippingProfileDTO = {
              name: "test-default-profile",
              type: "default",
            }

            await service.createShippingProfiles(createData)

            const err = await service
              .createShippingProfiles(createData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_shipping_profile_name_unique")
          })
        })

        describe("on create shipping options", () => {
          it("should create a new shipping option", async function () {
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

            // TODO: change that for a real provider instead of fake data manual inserted data
            const [{ id: providerId }] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const createData: CreateShippingOptionDTO = {
              name: "test-option",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: providerId,
              type: {
                code: "test-type",
                description: "test-description",
                label: "test-label",
              },
              data: {
                amount: 1000,
              },
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "in",
                  value: "test-value",
                },
              ],
            }

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
                service_provider_id: createData.service_provider_id,
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

            // TODO: change that for a real provider instead of fake data manual inserted data
            const [{ id: providerId }] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const createData: CreateShippingOptionDTO[] = [
              {
                name: "test-option",
                price_type: "flat",
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                service_provider_id: providerId,
                type: {
                  code: "test-type",
                  description: "test-description",
                  label: "test-label",
                },
                data: {
                  amount: 1000,
                },
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: "test-value",
                  },
                ],
              },
              {
                name: "test-option-2",
                price_type: "calculated",
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                service_provider_id: providerId,
                type: {
                  code: "test-type",
                  description: "test-description",
                  label: "test-label",
                },
                data: {
                  amount: 1000,
                },
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: "test-value",
                  },
                ],
              },
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
                  service_provider_id: data_.service_provider_id,
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

            // service provider
            const [{ id: providerId }] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOption = await service.createShippingOptions({
              name: "test-option",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: providerId,
              type: {
                code: "test-type",
                description: "test-description",
                label: "test-label",
              },
              data: {
                amount: 1000,
              },
              rules: [
                {
                  attribute: "test-attribute",
                  operator: "in",
                  value: "test-value",
                },
              ],
            })

            const ruleData = {
              attribute: "test-attribute",
              operator: "in",
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

        describe("on update", () => {
          it("should update an existing fulfillment set", async function () {
            const createData: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
            }

            const createdFulfillmentSet = await service.create(createData)

            const updateData = {
              id: createdFulfillmentSet.id,
              name: "updated-test",
              type: "updated-test-type",
            }

            const updatedFulfillmentSets = await service.update(updateData)

            expect(updatedFulfillmentSets).toEqual(
              expect.objectContaining({
                id: createdFulfillmentSet.id,
                name: updateData.name,
                type: updateData.type,
              })
            )
          })

          it("should update a collection of fulfillment sets", async function () {
            const createData = [
              {
                name: "test",
                type: "test-type",
              },
              {
                name: "test2",
                type: "test-type2",
              },
            ]

            const createdFulfillmentSets = await service.create(createData)

            const updateData = createdFulfillmentSets.map(
              (fulfillmentSet, index) => ({
                id: fulfillmentSet.id,
                name: `updated-test${index + 1}`,
                type: `updated-test-type${index + 1}`,
              })
            )

            const updatedFulfillmentSets = await service.update(updateData)
            const fullfillmentSets = await service.list({
              id: updateData.map((ud) => ud.id),
            })

            expect(updatedFulfillmentSets).toHaveLength(2)

            for (const data_ of updateData) {
              const currentFullfillmentSet = fullfillmentSets.find(
                (fs) => fs.id === data_.id
              )

              expect(currentFullfillmentSet).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  name: data_.name,
                  type: data_.type,
                })
              )
            }
          })

          it("should update an existing fulfillment set and replace old service zones by a new one", async function () {
            const createData: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "service-zone-test",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "fr",
                    },
                  ],
                },
              ],
            }

            const createdFulfillmentSet = await service.create(createData)

            const createServiceZoneData: CreateServiceZoneDTO = {
              fulfillment_set_id: createdFulfillmentSet.id,
              name: "service-zone-test2",
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "us",
                },
              ],
            }

            const updateData: UpdateFulfillmentSetDTO = {
              id: createdFulfillmentSet.id,
              name: "updated-test",
              type: "updated-test-type",
              service_zones: [createServiceZoneData],
            }

            const updatedFulfillmentSet = await service.update(updateData)

            expect(updatedFulfillmentSet).toEqual(
              expect.objectContaining({
                id: updateData.id,
                name: updateData.name,
                type: updateData.type,
                service_zones: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    name: (updateData.service_zones![0] as ServiceZoneDTO).name,
                    geo_zones: expect.arrayContaining([
                      expect.objectContaining({
                        id: expect.any(String),
                        type: (updateData.service_zones![0] as ServiceZoneDTO)
                          .geo_zones[0].type,
                        country_code: (
                          updateData.service_zones![0] as ServiceZoneDTO
                        ).geo_zones[0].country_code,
                      }),
                    ]),
                  }),
                ]),
              })
            )

            const serviceZones = await service.listServiceZones()

            expect(serviceZones).toHaveLength(1)
            expect(serviceZones[0]).toEqual(
              expect.objectContaining({
                id: updatedFulfillmentSet.service_zones[0].id,
              })
            )
          })

          it("should update an existing fulfillment set and add a new service zone", async function () {
            const createData: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "service-zone-test",
                  geo_zones: [
                    {
                      type: GeoZoneType.COUNTRY,
                      country_code: "fr",
                    },
                  ],
                },
              ],
            }

            const createdFulfillmentSet = await service.create(createData)

            const createServiceZoneData: CreateServiceZoneDTO = {
              fulfillment_set_id: createdFulfillmentSet.id,
              name: "service-zone-test2",
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "us",
                },
              ],
            }

            const updateData: UpdateFulfillmentSetDTO = {
              id: createdFulfillmentSet.id,
              name: "updated-test",
              type: "updated-test-type",
              service_zones: [
                { id: createdFulfillmentSet.service_zones[0].id },
                createServiceZoneData,
              ],
            }

            const updatedFulfillmentSet = await service.update(updateData)

            expect(updatedFulfillmentSet).toEqual(
              expect.objectContaining({
                id: updateData.id,
                name: updateData.name,
                type: updateData.type,
                service_zones: expect.arrayContaining([
                  expect.objectContaining({
                    id: createdFulfillmentSet.service_zones[0].id,
                  }),
                  expect.objectContaining({
                    id: expect.any(String),
                    name: (updateData.service_zones![1] as ServiceZoneDTO).name,
                    geo_zones: expect.arrayContaining([
                      expect.objectContaining({
                        id: expect.any(String),
                        type: (updateData.service_zones![1] as ServiceZoneDTO)
                          .geo_zones[0].type,
                        country_code: (
                          updateData.service_zones![1] as ServiceZoneDTO
                        ).geo_zones[0].country_code,
                      }),
                    ]),
                  }),
                ]),
              })
            )
          })

          it("should fail on duplicated fulfillment set name", async function () {
            const createData = [
              {
                name: "test",
                type: "test-type",
              },
              {
                name: "test2",
                type: "test-type2",
              },
            ]

            const createdFulfillmentSets = await service.create(createData)

            const updateData = {
              id: createdFulfillmentSets[1].id,
              name: "test", // This is the name of the first fulfillment set
              type: "updated-test-type2",
            }

            const err = await service.update(updateData).catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_fulfillment_set_name_unique")
          })

          it("should update a collection of fulfillment sets and replace old service zones by new ones", async function () {
            const createData: CreateFulfillmentSetDTO[] = [
              {
                name: "test1",
                type: "test-type1",
                service_zones: [
                  {
                    name: "service-zone-test1",
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "fr",
                      },
                    ],
                  },
                ],
              },
              {
                name: "test2",
                type: "test-type2",
                service_zones: [
                  {
                    name: "service-zone-test2",
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "us",
                      },
                    ],
                  },
                ],
              },
            ]

            const createdFulfillmentSets = await service.create(createData)

            const updateData: UpdateFulfillmentSetDTO[] =
              createdFulfillmentSets.map((fulfillmentSet, index) => ({
                id: fulfillmentSet.id,
                name: `updated-test${index + 1}`,
                type: `updated-test-type${index + 1}`,
                service_zones: [
                  {
                    name: `new-service-zone-test${index + 1}`,
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "test",
                      },
                    ],
                  },
                ],
              }))

            const updatedFulfillmentSets = await service.update(updateData)

            expect(updatedFulfillmentSets).toHaveLength(2)

            for (const data_ of updateData) {
              const expectedFulfillmentSet = updatedFulfillmentSets.find(
                (f) => f.id === data_.id
              )
              expect(expectedFulfillmentSet).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  name: data_.name,
                  type: data_.type,
                  service_zones: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      name: (data_.service_zones![0] as ServiceZoneDTO).name,
                      geo_zones: expect.arrayContaining([
                        expect.objectContaining({
                          id: expect.any(String),
                          type: (data_.service_zones![0] as ServiceZoneDTO)
                            .geo_zones[0].type,
                          country_code: (
                            data_.service_zones![0] as ServiceZoneDTO
                          ).geo_zones[0].country_code,
                        }),
                      ]),
                    }),
                  ]),
                })
              )
            }

            const serviceZones = await service.listServiceZones()

            expect(serviceZones).toHaveLength(2)
            expect(serviceZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  name: (updateData[0].service_zones![0] as ServiceZoneDTO)
                    .name,
                }),
                expect.objectContaining({
                  name: (updateData[1].service_zones![0] as ServiceZoneDTO)
                    .name,
                }),
              ])
            )
          })

          it("should update a collection of fulfillment sets and add new service zones", async function () {
            const createData: CreateFulfillmentSetDTO[] = [
              {
                name: "test1",
                type: "test-type1",
                service_zones: [
                  {
                    name: "service-zone-test1",
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "fr",
                      },
                    ],
                  },
                ],
              },
              {
                name: "test2",
                type: "test-type2",
                service_zones: [
                  {
                    name: "service-zone-test2",
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "us",
                      },
                    ],
                  },
                ],
              },
            ]

            const createdFulfillmentSets = await service.create(createData)

            const updateData: UpdateFulfillmentSetDTO[] =
              createdFulfillmentSets.map((fulfillmentSet, index) => ({
                id: fulfillmentSet.id,
                name: `updated-test${index + 1}`,
                type: `updated-test-type${index + 1}`,
                service_zones: [
                  ...fulfillmentSet.service_zones,
                  {
                    name: `added-service-zone-test${index + 1}`,
                    geo_zones: [
                      {
                        type: GeoZoneType.COUNTRY,
                        country_code: "test",
                      },
                    ],
                  },
                ],
              }))

            const updatedFulfillmentSets = await service.update(updateData)

            expect(updatedFulfillmentSets).toHaveLength(2)

            for (const data_ of updateData) {
              const expectedFulfillmentSet = updatedFulfillmentSets.find(
                (f) => f.id === data_.id
              )
              expect(expectedFulfillmentSet).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  name: data_.name,
                  type: data_.type,
                  service_zones: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                    }),
                    expect.objectContaining({
                      id: expect.any(String),
                      name: (data_.service_zones![1] as ServiceZoneDTO).name,
                      geo_zones: expect.arrayContaining([
                        expect.objectContaining({
                          id: expect.any(String),
                          type: (data_.service_zones![1] as ServiceZoneDTO)
                            .geo_zones[0].type,
                          country_code: (
                            data_.service_zones![1] as ServiceZoneDTO
                          ).geo_zones[0].country_code,
                        }),
                      ]),
                    }),
                  ]),
                })
              )
            }

            const serviceZones = await service.listServiceZones()

            expect(serviceZones).toHaveLength(4)
            expect(serviceZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  name: createdFulfillmentSets[0].service_zones![0].name,
                }),
                expect.objectContaining({
                  name: createdFulfillmentSets[1].service_zones![0].name,
                }),
                expect.objectContaining({
                  name: (updateData[0].service_zones![1] as ServiceZoneDTO)
                    .name,
                }),
                expect.objectContaining({
                  name: (updateData[1].service_zones![1] as ServiceZoneDTO)
                    .name,
                }),
              ])
            )
          })
        })

        describe("on update service zones", () => {
          it("should update an existing service zone", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const createData: CreateServiceZoneDTO = {
              name: "service-zone-test",
              fulfillment_set_id: fulfillmentSet.id,
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "fr",
                },
              ],
            }

            const createdServiceZone = await service.createServiceZones(
              createData
            )

            const updateData = {
              id: createdServiceZone.id,
              name: "updated-service-zone-test",
              geo_zones: [
                {
                  id: createdServiceZone.geo_zones[0].id,
                  type: GeoZoneType.COUNTRY,
                  country_code: "us",
                },
              ],
            }

            const updatedServiceZone = await service.updateServiceZones(
              updateData
            )

            expect(updatedServiceZone).toEqual(
              expect.objectContaining({
                id: updateData.id,
                name: updateData.name,
                geo_zones: expect.arrayContaining([
                  expect.objectContaining({
                    id: updateData.geo_zones[0].id,
                    type: updateData.geo_zones[0].type,
                    country_code: updateData.geo_zones[0].country_code,
                  }),
                ]),
              })
            )
          })

          it("should update a collection of service zones", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const createData: CreateServiceZoneDTO[] = [
              {
                name: "service-zone-test",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "fr",
                  },
                ],
              },
              {
                name: "service-zone-test2",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "us",
                  },
                ],
              },
            ]

            const createdServiceZones = await service.createServiceZones(
              createData
            )

            const updateData: UpdateServiceZoneDTO[] = createdServiceZones.map(
              (serviceZone, index) => ({
                id: serviceZone.id,
                name: `updated-service-zone-test${index + 1}`,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: index % 2 === 0 ? "us" : "fr",
                  },
                ],
              })
            )

            const updatedServiceZones = await service.updateServiceZones(
              updateData
            )

            expect(updatedServiceZones).toHaveLength(2)

            for (const data_ of updateData) {
              const expectedServiceZone = updatedServiceZones.find(
                (serviceZone) => serviceZone.id === data_.id
              )
              expect(expectedServiceZone).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  name: data_.name,
                  geo_zones: expect.arrayContaining([
                    expect.objectContaining({
                      type: (data_.geo_zones![0] as GeoZoneDTO).type,
                      country_code: (data_.geo_zones![0] as GeoZoneDTO)
                        .country_code,
                    }),
                  ]),
                })
              )
            }
          })

          it("should fail on duplicated service zone name", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const createData: CreateServiceZoneDTO[] = [
              {
                name: "service-zone-test",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "fr",
                  },
                ],
              },
              {
                name: "service-zone-test2",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "us",
                  },
                ],
              },
            ]

            const createdServiceZones = await service.createServiceZones(
              createData
            )

            const updateData: UpdateServiceZoneDTO = {
              id: createdServiceZones[1].id,
              name: "service-zone-test",
              geo_zones: [
                {
                  type: GeoZoneType.COUNTRY,
                  country_code: "us",
                },
              ],
            }

            const err = await service
              .updateServiceZones(updateData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_service_zone_name_unique")
          })
        })

        describe("on update geo zones", () => {
          it("should update an existing geo zone", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const createData: CreateGeoZoneDTO = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "fr",
            }

            const createdGeoZone = await service.createGeoZones(createData)

            const updateData: UpdateGeoZoneDTO = {
              id: createdGeoZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "us",
            }

            const updatedGeoZone = await service.updateGeoZones(updateData)

            expect(updatedGeoZone).toEqual(
              expect.objectContaining({
                id: updateData.id,
                type: updateData.type,
                country_code: updateData.country_code,
              })
            )
          })

          it("should update a collection of geo zones", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })

            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            const createData: CreateGeoZoneDTO[] = [
              {
                service_zone_id: serviceZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: "fr",
              },
              {
                service_zone_id: serviceZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: "us",
              },
            ]

            const createdGeoZones = await service.createGeoZones(createData)

            const updateData: UpdateGeoZoneDTO[] = createdGeoZones.map(
              (geoZone, index) => ({
                id: geoZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: index % 2 === 0 ? "us" : "fr",
              })
            )

            const updatedGeoZones = await service.updateGeoZones(updateData)

            expect(updatedGeoZones).toHaveLength(2)

            for (const data_ of updateData) {
              const expectedGeoZone = updatedGeoZones.find(
                (geoZone) => geoZone.id === data_.id
              )
              expect(expectedGeoZone).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  type: data_.type,
                  country_code: data_.country_code,
                })
              )
            }
          })
        })

        describe("on update shipping options", () => {
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

            const [serviceProvider] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOptionData = {
              name: "test",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
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
                  operator: "test",
                  value: "test",
                },
              ],
            }

            const shippingOption = await service.createShippingOptions(
              shippingOptionData
            )

            const updateData = {
              id: shippingOption.id,
              name: "updated-test",
              price_type: "calculated",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
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
                  operator: "new-test",
                  value: "new-test",
                },
              ],
            }

            const updatedShippingOption = await service.updateShippingOptions(
              updateData
            )

            expect(updatedShippingOption).toEqual(
              expect.objectContaining({
                id: updateData.id,
                name: updateData.name,
                price_type: updateData.price_type,
                service_zone_id: updateData.service_zone_id,
                shipping_profile_id: updateData.shipping_profile_id,
                service_provider_id: updateData.service_provider_id,
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
                    id: expect.any(String),
                    attribute: updateData.rules[0].attribute,
                    operator: updateData.rules[0].operator,
                    value: updateData.rules[0].value,
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

            const [serviceProvider] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOptionData = {
              name: "test",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
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
                  operator: "test",
                  value: "test",
                },
              ],
            }

            const shippingOption = await service.createShippingOptions(
              shippingOptionData
            )

            const updateData = {
              id: shippingOption.id,
              name: "updated-test",
              price_type: "calculated",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
              data: {
                amount: 2000,
              },
            }

            await service.updateShippingOptions(updateData)

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
                service_provider_id: updateData.service_provider_id,
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

            const [serviceProvider] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOptionData = [
              {
                name: "test",
                price_type: "flat",
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                service_provider_id: serviceProvider.id,
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
                    operator: "test",
                    value: "test",
                  },
                ],
              },
              {
                name: "test2",
                price_type: "calculated",
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                service_provider_id: serviceProvider.id,
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
                    operator: "test",
                    value: "test",
                  },
                ],
              },
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
                service_provider_id: serviceProvider.id,
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
                    operator: "new-test",
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
                service_provider_id: serviceProvider.id,
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
                    operator: "new-test",
                    value: "new-test",
                  },
                ],
              },
            ]

            const updatedShippingOption = await service.updateShippingOptions(
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
                  service_provider_id: data_.service_provider_id,
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

            const [serviceProvider] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOptionData = {
              id: "sp_jdafwfleiwuonl",
              name: "test",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
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
                  operator: "test",
                  value: "test",
                },
              ],
            }

            const err = await service
              .updateShippingOptions(shippingOptionData)
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

            const [serviceProvider] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOptionData = {
              name: "test",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
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
                  operator: "test",
                  value: "test",
                },
              ],
            }

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
              .updateShippingOptions(updateData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              `The following rules does not exists: ${updateData[0].rules[0].id} on shipping option ${shippingOption.id}`
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
            const [serviceProvider] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOption = await service.createShippingOptions({
              name: "test",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
              service_provider_id: serviceProvider.id,
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
                  operator: "test",
                  value: "test",
                },
              ],
            })

            const updateData = {
              id: shippingOption.rules[0].id,
              attribute: "updated-test",
              operator: "updated-test",
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
              operator: "updated-test",
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
