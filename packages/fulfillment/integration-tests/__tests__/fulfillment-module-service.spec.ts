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

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  testSuite: (testRunnerOptions: SuiteOptions<IFulfillmentModuleService>) => {
    describe("Fulfillment Module Service", () => {
      describe("read", () => {
        describe("fulfillment set", () => {
          it("should list fulfillment sets with a filter", async function () {
            const createdSet1 = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const createdSet2 = await testRunnerOptions.service.create({
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
              ],
            })

            let listedSets = await testRunnerOptions.service.list({
              type: createdSet1.type,
            })

            expect(listedSets).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdSet1.id }),
                expect.objectContaining({ id: createdSet2.id }),
              ])
            )

            listedSets = await testRunnerOptions.service.list({
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

            listedSets = await testRunnerOptions.service.list({
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

            listedSets = await testRunnerOptions.service.list({
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
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })

            const createdZone1 =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })
            const createdZone2 =
              await testRunnerOptions.service.createServiceZones({
                name: "test2",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                  {
                    type: GeoZoneType.COUNTRY,
                    country_code: "fr",
                  },
                ],
              })

            let listedZones = await testRunnerOptions.service.listServiceZones({
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

            listedZones = await testRunnerOptions.service.listServiceZones({
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
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })

            const createdZone1 = await testRunnerOptions.service.createGeoZones(
              {
                service_zone_id: serviceZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: "fr",
              }
            )
            const createdZone2 = await testRunnerOptions.service.createGeoZones(
              {
                service_zone_id: serviceZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: "us",
              }
            )

            let listedZones = await testRunnerOptions.service.listGeoZones({
              type: createdZone1.type,
            })

            expect(listedZones).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ id: createdZone1.id }),
                expect.objectContaining({ id: createdZone2.id }),
              ])
            )

            listedZones = await testRunnerOptions.service.listGeoZones({
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

            const fulfillmentSet = await testRunnerOptions.service.create(data)

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

            const fulfillmentSets = await testRunnerOptions.service.create(data)

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

            const fulfillmentSet = await testRunnerOptions.service.create(data)

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

            const fulfillmentSets = await testRunnerOptions.service.create(data)

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

            const fulfillmentSet = await testRunnerOptions.service.create(data)

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

            const fulfillmentSets = await testRunnerOptions.service.create(data)

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

            await testRunnerOptions.service.create(data)
            const err = await testRunnerOptions.service
              .create(data)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_fulfillment_set_name_unique")
          })
        })

        describe("on create service zones", () => {
          it("should create a new service zone", async function () {
            const fulfillmentSet = await testRunnerOptions.service.create({
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

            const serviceZone =
              await testRunnerOptions.service.createServiceZones(data)

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
            const fulfillmentSet = await testRunnerOptions.service.create({
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

            const serviceZones =
              await testRunnerOptions.service.createServiceZones(data)

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
            const fulfillmentSet = await testRunnerOptions.service.create({
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

            await testRunnerOptions.service.createServiceZones(data)
            const err = await testRunnerOptions.service
              .createServiceZones(data)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_service_zone_name_unique")
          })
        })

        describe("on create geo zones", () => {
          it("should create a new geo zone", async function () {
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })

            const data: CreateGeoZoneDTO = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "fr",
            }

            const geoZone = await testRunnerOptions.service.createGeoZones(data)

            expect(geoZone).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                type: data.type,
                country_code: data.country_code,
              })
            )
          })

          it("should create a collection of geo zones", async function () {
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
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

            const geoZones = await testRunnerOptions.service.createGeoZones(
              data
            )

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

            const createdShippingProfile =
              await testRunnerOptions.service.createShippingProfiles(createData)

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
              await testRunnerOptions.service.createShippingProfiles(createData)

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

            await testRunnerOptions.service.createShippingProfiles(createData)

            const err = await testRunnerOptions.service
              .createShippingProfiles(createData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_shipping_profile_name_unique")
          })
        })

        describe("on create shipping options", () => {
          it("should create a new shipping option", async function () {
            const [defaultShippingProfile] =
              await testRunnerOptions.service.listShippingProfiles({
                type: "default",
              })
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })

            // TODO: change that for a real provider instead of fake data manual inserted data
            const [{ id: providerId }] =
              await testRunnerOptions.MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const createData: CreateShippingOptionDTO = {
              name: "test-option",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: defaultShippingProfile.id,
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

            const createdShippingOption =
              await testRunnerOptions.service.createShippingOptions(createData)

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
            const [defaultShippingProfile] =
              await testRunnerOptions.service.listShippingProfiles({
                type: "default",
              })
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })

            // TODO: change that for a real provider instead of fake data manual inserted data
            const [{ id: providerId }] =
              await testRunnerOptions.MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const createData: CreateShippingOptionDTO[] = [
              {
                name: "test-option",
                price_type: "flat",
                service_zone_id: serviceZone.id,
                shipping_profile_id: defaultShippingProfile.id,
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
                shipping_profile_id: defaultShippingProfile.id,
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

            const createdShippingOptions =
              await testRunnerOptions.service.createShippingOptions(createData)

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

          it("should fail on duplicated shipping option name", async function () {
            const [defaultShippingProfile] =
              await testRunnerOptions.service.listShippingProfiles({
                type: "default",
              })
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })

            // TODO: change that for a real provider instead of fake data manual inserted data
            const [{ id: providerId }] =
              await testRunnerOptions.MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const createData: CreateShippingOptionDTO = {
              name: "test-option",
              price_type: "flat",
              service_zone_id: serviceZone.id,
              shipping_profile_id: defaultShippingProfile.id,
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

            await testRunnerOptions.service.createShippingOptions(createData)

            const err = await testRunnerOptions.service
              .createShippingOptions(createData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_shipping_option_name_unique")
          })
        })

        describe("on update", () => {
          it("should update an existing fulfillment set", async function () {
            const createData: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
            }

            const createdFulfillmentSet =
              await testRunnerOptions.service.create(createData)

            const updateData = {
              id: createdFulfillmentSet.id,
              name: "updated-test",
              type: "updated-test-type",
            }

            const updatedFulfillmentSets =
              await testRunnerOptions.service.update(updateData)

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

            const createdFulfillmentSets =
              await testRunnerOptions.service.create(createData)

            const updateData = createdFulfillmentSets.map(
              (fulfillmentSet, index) => ({
                id: fulfillmentSet.id,
                name: `updated-test${index + 1}`,
                type: `updated-test-type${index + 1}`,
              })
            )

            const updatedFulfillmentSets =
              await testRunnerOptions.service.update(updateData)

            expect(updatedFulfillmentSets).toHaveLength(2)

            let i = 0
            for (const data_ of updateData) {
              expect(updatedFulfillmentSets[i]).toEqual(
                expect.objectContaining({
                  id: createdFulfillmentSets[i].id,
                  name: data_.name,
                  type: data_.type,
                })
              )
              ++i
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

            const createdFulfillmentSet =
              await testRunnerOptions.service.create(createData)

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

            const updatedFulfillmentSet =
              await testRunnerOptions.service.update(updateData)

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

            const serviceZones =
              await testRunnerOptions.service.listServiceZones()

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

            const createdFulfillmentSet =
              await testRunnerOptions.service.create(createData)

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

            const updatedFulfillmentSet =
              await testRunnerOptions.service.update(updateData)

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

            const createdFulfillmentSets =
              await testRunnerOptions.service.create(createData)

            const updateData = {
              id: createdFulfillmentSets[1].id,
              name: "test", // This is the name of the first fulfillment set
              type: "updated-test-type2",
            }

            const err = await testRunnerOptions.service
              .update(updateData)
              .catch((e) => e)

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

            const createdFulfillmentSets =
              await testRunnerOptions.service.create(createData)

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

            const updatedFulfillmentSets =
              await testRunnerOptions.service.update(updateData)

            expect(updatedFulfillmentSets).toHaveLength(2)

            let i = 0
            for (const data_ of updateData) {
              expect(updatedFulfillmentSets[i]).toEqual(
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
              ++i
            }

            const serviceZones =
              await testRunnerOptions.service.listServiceZones()

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

            const createdFulfillmentSets =
              await testRunnerOptions.service.create(createData)

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

            const updatedFulfillmentSets =
              await testRunnerOptions.service.update(updateData)

            expect(updatedFulfillmentSets).toHaveLength(2)

            let i = 0
            for (const data_ of updateData) {
              expect(updatedFulfillmentSets[i]).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  name: data_.name,
                  type: data_.type,
                  service_zones: expect.arrayContaining([
                    expect.objectContaining({
                      id: createdFulfillmentSets[i].service_zones[0].id,
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
              ++i
            }

            const serviceZones =
              await testRunnerOptions.service.listServiceZones()

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
            const fulfillmentSet = await testRunnerOptions.service.create({
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

            const createdServiceZone =
              await testRunnerOptions.service.createServiceZones(createData)

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

            const updatedServiceZone =
              await testRunnerOptions.service.updateServiceZones(updateData)

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
            const fulfillmentSet = await testRunnerOptions.service.create({
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

            const createdServiceZones =
              await testRunnerOptions.service.createServiceZones(createData)

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

            const updatedServiceZones =
              await testRunnerOptions.service.updateServiceZones(updateData)

            expect(updatedServiceZones).toHaveLength(2)

            let i = 0
            for (const data_ of updateData) {
              expect(updatedServiceZones[i]).toEqual(
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
              ++i
            }
          })

          it("should fail on duplicated service zone name", async function () {
            const fulfillmentSet = await testRunnerOptions.service.create({
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

            const createdServiceZones =
              await testRunnerOptions.service.createServiceZones(createData)

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

            const err = await testRunnerOptions.service
              .updateServiceZones(updateData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.constraint).toBe("IDX_service_zone_name_unique")
          })
        })

        describe("on update geo zones", () => {
          it("should update an existing geo zone", async function () {
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })

            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
                name: "test",
                fulfillment_set_id: fulfillmentSet.id,
              })

            const createData: CreateGeoZoneDTO = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "fr",
            }

            const createdGeoZone =
              await testRunnerOptions.service.createGeoZones(createData)

            const updateData: UpdateGeoZoneDTO = {
              id: createdGeoZone.id,
              type: GeoZoneType.COUNTRY,
              country_code: "us",
            }

            const updatedGeoZone =
              await testRunnerOptions.service.updateGeoZones(updateData)

            expect(updatedGeoZone).toEqual(
              expect.objectContaining({
                id: updateData.id,
                type: updateData.type,
                country_code: updateData.country_code,
              })
            )
          })

          it("should update a collection of geo zones", async function () {
            const fulfillmentSet = await testRunnerOptions.service.create({
              name: "test",
              type: "test-type",
            })

            const serviceZone =
              await testRunnerOptions.service.createServiceZones({
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

            const createdGeoZones =
              await testRunnerOptions.service.createGeoZones(createData)

            const updateData: UpdateGeoZoneDTO[] = createdGeoZones.map(
              (geoZone, index) => ({
                id: geoZone.id,
                type: GeoZoneType.COUNTRY,
                country_code: index % 2 === 0 ? "us" : "fr",
              })
            )

            const updatedGeoZones =
              await testRunnerOptions.service.updateGeoZones(updateData)

            expect(updatedGeoZones).toHaveLength(2)

            let i = 0
            for (const data_ of updateData) {
              expect(updatedGeoZones[i]).toEqual(
                expect.objectContaining({
                  id: data_.id,
                  type: data_.type,
                  country_code: data_.country_code,
                })
              )
              ++i
            }
          })
        })
      })
    })
  },
})
