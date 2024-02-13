import { Modules } from "@medusajs/modules-sdk"
import { initModules } from "medusa-test-utils/dist"
import {
  CreateFulfillmentSetDTO,
  CreateGeoZoneDTO,
  CreateServiceZoneDTO,
  GeoZoneDTO,
  IFulfillmentModuleService,
  ServiceZoneDTO,
  UpdateFulfillmentSetDTO,
  UpdateGeoZoneDTO,
} from "@medusajs/types"
import { getInitModuleConfig, MikroOrmWrapper } from "../utils"
import { GeoZoneType } from "@medusajs/utils"

describe("fulfillment module service", function () {
  let service: IFulfillmentModuleService
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.FULFILLMENT]

    shutdownFunc = shutdown
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  afterAll(async () => {
    await shutdownFunc()
  })

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
          ],
        })

        let listedSets = await service.list({ type: createdSet1.type })

        expect(listedSets).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: createdSet1.id }),
            expect.objectContaining({ id: createdSet2.id }),
          ])
        )

        listedSets = await service.list({ name: createdSet2.name })

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

        listedSets = await service.list({ service_zones: { name: "test" } })

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
        const createdZone1 = await service.createServiceZones({
          name: "test",
        })
        const createdZone2 = await service.createServiceZones({
          name: "test2",
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
        const createdZone1 = await service.createGeoZones({
          type: GeoZoneType.COUNTRY,
          country_code: "fr",
        })
        const createdZone2 = await service.createGeoZones({
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
                name: "test",
              },
            ],
          },
          {
            name: "test3",
            type: "test-type3",
            service_zones: [
              {
                name: "test2",
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

        // expect the first and second fulfillment set to have the same service zone
        expect(fulfillmentSets[0].service_zones[0].id).toEqual(
          fulfillmentSets[1].service_zones[0].id
        )
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
                    country_code: (data.service_zones![0] as any).geo_zones[0]
                      .country_code,
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
                      type: (data_.service_zones![0] as any).geo_zones[0].type,
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

        // expect the first and second fulfillment set to have the same geo zone for their service zone
        expect(fulfillmentSets[0].service_zones[0].geo_zones[0].id).toEqual(
          fulfillmentSets[1].service_zones[0].geo_zones[0].id
        )
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
        const data: CreateServiceZoneDTO = {
          name: "test",
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
                country_code: (data.geo_zones![0] as GeoZoneDTO).country_code,
              }),
            ]),
          })
        )
      })

      it("should create a collection of service zones", async function () {
        const data: CreateServiceZoneDTO[] = [
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
            name: "test3",
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

        // expect the first and second service zone to have the same geo zone
        expect(serviceZones[0].geo_zones[0].id).toEqual(
          serviceZones[1].geo_zones[0].id
        )
      })

      it("should fail on duplicated service zone name", async function () {
        const data: CreateServiceZoneDTO = {
          name: "test",
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

        const createdFulfillmentSet = await service.create(createData)

        const createServiceZoneData: CreateServiceZoneDTO = {
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
                name: `new-service-zone-test`,
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
                      country_code: (data_.service_zones![0] as ServiceZoneDTO)
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
                name: `added-service-zone-test`,
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
                      country_code: (data_.service_zones![1] as ServiceZoneDTO)
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
    })

    describe("on update service zones", () => {
      it("should update an existing service zone", async function () {
        const createData: CreateServiceZoneDTO = {
          name: "service-zone-test",
          geo_zones: [
            {
              type: GeoZoneType.COUNTRY,
              country_code: "fr",
            },
          ],
        }

        const createdServiceZone = await service.createServiceZones(createData)

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

        const updatedServiceZone = await service.updateServiceZones(updateData)

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
        const createData: CreateServiceZoneDTO[] = [
          {
            name: "service-zone-test",
            geo_zones: [
              {
                type: GeoZoneType.COUNTRY,
                country_code: "fr",
              },
            ],
          },
          {
            name: "service-zone-test2",
            geo_zones: [
              {
                type: GeoZoneType.COUNTRY,
                country_code: "us",
              },
            ],
          },
        ]

        const createdServiceZones = await service.createServiceZones(createData)

        const updateData = createdServiceZones.map((serviceZone, index) => ({
          id: serviceZone.id,
          name: `updated-service-zone-test${index + 1}`,
          geo_zones: [
            {
              id: serviceZone.geo_zones[0].id,
              type: GeoZoneType.COUNTRY,
              country_code: index % 2 === 0 ? "us" : "fr",
            },
          ],
        }))

        const updatedServiceZones = await service.updateServiceZones(updateData)

        expect(updatedServiceZones).toHaveLength(2)

        let i = 0
        for (const data_ of updateData) {
          expect(updatedServiceZones[i]).toEqual(
            expect.objectContaining({
              id: data_.id,
              name: data_.name,
              geo_zones: expect.arrayContaining([
                expect.objectContaining({
                  id: data_.geo_zones[0].id,
                  type: data_.geo_zones[0].type,
                  country_code: data_.geo_zones[0].country_code,
                }),
              ]),
            })
          )
          ++i
        }
      })

      it("should fail on duplicated service zone name", async function () {
        const createData: CreateServiceZoneDTO[] = [
          {
            name: "service-zone-test",
            geo_zones: [
              {
                type: GeoZoneType.COUNTRY,
                country_code: "fr",
              },
            ],
          },
          {
            name: "service-zone-test2",
            geo_zones: [
              {
                type: GeoZoneType.COUNTRY,
                country_code: "us",
              },
            ],
          },
        ]

        const createdServiceZones = await service.createServiceZones(createData)

        const updateData = {
          id: createdServiceZones[1].id,
          name: "service-zone-test", // This is the name of the first service zone
          geo_zones: [
            {
              id: createdServiceZones[1].geo_zones[0].id,
              type: GeoZoneType.COUNTRY,
              country_code: "us",
            },
          ],
        }

        const err = await service.updateServiceZones(updateData).catch((e) => e)

        expect(err).toBeDefined()
        expect(err.constraint).toBe("IDX_service_zone_name_unique")
      })
    })

    describe("on create geo zones", () => {
      it("should create a new geo zone", async function () {
        const data: CreateGeoZoneDTO = {
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
        const data: CreateGeoZoneDTO[] = [
          {
            type: GeoZoneType.COUNTRY,
            country_code: "fr",
          },
          {
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

    describe("on update geo zones", () => {
      it("should update an existing geo zone", async function () {
        const createData: CreateGeoZoneDTO = {
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
        const createData: CreateGeoZoneDTO[] = [
          {
            type: GeoZoneType.COUNTRY,
            country_code: "fr",
          },
          {
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
