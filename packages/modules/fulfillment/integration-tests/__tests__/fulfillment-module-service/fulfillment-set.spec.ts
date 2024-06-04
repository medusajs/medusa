import { Modules } from "@medusajs/modules-sdk"
import {
  CreateFulfillmentSetDTO,
  CreateServiceZoneDTO,
  IFulfillmentModuleService,
  ServiceZoneDTO,
  UpdateFulfillmentSetDTO,
} from "@medusajs/types"
import { FulfillmentEvents, GeoZoneType } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { MockEventBusService } from "medusa-test-utils/dist"
import { buildExpectedEventMessageShape } from "../../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IFulfillmentModuleService>({
  moduleName: Modules.FULFILLMENT,
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

            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.created,
                action: "created",
                object: "fulfillment_set",
                data: { id: fulfillmentSet.id },
              }),
            ])
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

              expect(eventBusEmitSpy).toHaveBeenCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.created,
                    action: "created",
                    object: "fulfillment_set",
                    data: { id: fulfillmentSets[i].id },
                  }),
                ])
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

            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.created,
                action: "created",
                object: "fulfillment_set",
                data: { id: fulfillmentSet.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.service_zone_created,
                action: "created",
                object: "service_zone",
                data: { id: fulfillmentSet.service_zones[0].id },
              }),
            ])
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

              expect(eventBusEmitSpy).toHaveBeenCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.created,
                    action: "created",
                    object: "fulfillment_set",
                    data: { id: fulfillmentSets[i].id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.service_zone_created,
                    action: "created",
                    object: "service_zone",
                    data: { id: fulfillmentSets[i].service_zones[0].id },
                  }),
                ])
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

            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.created,
                action: "created",
                object: "fulfillment_set",
                data: { id: fulfillmentSet.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.service_zone_created,
                action: "created",
                object: "service_zone",
                data: { id: fulfillmentSet.service_zones[0].id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.geo_zone_created,
                action: "created",
                object: "geo_zone",
                data: { id: fulfillmentSet.service_zones[0].geo_zones[0].id },
              }),
            ])
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
                        province_code: "test",
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

              expect(eventBusEmitSpy).toHaveBeenCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.created,
                    action: "created",
                    object: "fulfillment_set",
                    data: { id: fulfillmentSets[i].id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.service_zone_created,
                    action: "created",
                    object: "service_zone",
                    data: { id: fulfillmentSets[i].service_zones[0].id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.geo_zone_created,
                    action: "created",
                    object: "geo_zone",
                    data: {
                      id: fulfillmentSets[i].service_zones[0].geo_zones[0].id,
                    },
                  }),
                ])
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
            expect(err.message).toContain("exists")
          })

          it("should fail on creating a new fulfillment set with new service zones and new geo zones that are not valid", async function () {
            let data: CreateFulfillmentSetDTO = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.PROVINCE,
                      country_code: "fr",
                    } as any,
                  ],
                },
              ],
            }

            let err = await service.create(data).catch((e) => e)
            expect(err.message).toBe(
              "Missing required property province_code for geo zone type province"
            )

            data = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.CITY,
                      country_code: "fr",
                      province_code: "test",
                    } as any,
                  ],
                },
              ],
            }

            err = await service.create(data).catch((e) => e)
            expect(err.message).toBe(
              "Missing required property city for geo zone type city"
            )

            data = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: GeoZoneType.ZIP,
                      postal_expression: "test",
                    } as any,
                  ],
                },
              ],
            }

            err = await service.create(data).catch((e) => e)
            expect(err.message).toBe(
              "Missing required property country_code for geo zone type zip"
            )

            data = {
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                  geo_zones: [
                    {
                      type: "unknown",
                      postal_expression: "test",
                    } as any,
                  ],
                },
              ],
            }

            err = await service.create(data).catch((e) => e)
            expect(err.message).toBe(`Invalid geo zone type: unknown`)
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

            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.updated,
                action: "updated",
                object: "fulfillment_set",
                data: { id: updatedFulfillmentSets.id },
              }),
            ])
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
            expect(eventBusEmitSpy.mock.calls[1][0]).toHaveLength(2)

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

              expect(eventBusEmitSpy).toHaveBeenLastCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.updated,
                    action: "updated",
                    object: "fulfillment_set",
                    data: { id: currentFullfillmentSet.id },
                  }),
                ])
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

            expect(eventBusEmitSpy.mock.calls[1][0]).toHaveLength(5)
            expect(eventBusEmitSpy).toHaveBeenLastCalledWith(
              expect.arrayContaining([
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.updated,
                  action: "updated",
                  object: "fulfillment_set",
                  data: { id: updatedFulfillmentSet.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.service_zone_created,
                  action: "created",
                  object: "service_zone",
                  data: { id: updatedFulfillmentSet.service_zones[0].id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.geo_zone_created,
                  action: "created",
                  object: "geo_zone",
                  data: {
                    id: updatedFulfillmentSet.service_zones[0].geo_zones[0].id,
                  },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.service_zone_deleted,
                  action: "deleted",
                  object: "service_zone",
                  data: { id: createdFulfillmentSet.service_zones[0].id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.geo_zone_deleted,
                  action: "deleted",
                  object: "geo_zone",
                  data: {
                    id: createdFulfillmentSet.service_zones[0].geo_zones[0].id,
                  },
                }),
              ])
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

            const createdServiceZone = updatedFulfillmentSet.service_zones.find(
              (s) => s.name === "service-zone-test2"
            )

            expect(eventBusEmitSpy.mock.calls[1][0]).toHaveLength(3)
            expect(eventBusEmitSpy).toHaveBeenLastCalledWith(
              expect.arrayContaining([
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.updated,
                  action: "updated",
                  object: "fulfillment_set",
                  data: { id: updatedFulfillmentSet.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.service_zone_created,
                  action: "created",
                  object: "service_zone",
                  data: { id: createdServiceZone.id },
                }),
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.geo_zone_created,
                  action: "created",
                  object: "geo_zone",
                  data: {
                    id: createdServiceZone.geo_zones[0].id,
                  },
                }),
              ])
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
            expect(err.message).toContain("exists")
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
            expect(eventBusEmitSpy.mock.calls[1][0]).toHaveLength(10)

            for (const data_ of updateData) {
              const expectedFulfillmentSet = updatedFulfillmentSets.find(
                (f) => f.id === data_.id
              )
              const originalFulfillmentSet = createdFulfillmentSets.find(
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

              expect(eventBusEmitSpy).toHaveBeenLastCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.updated,
                    action: "updated",
                    object: "fulfillment_set",
                    data: { id: expectedFulfillmentSet.id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.service_zone_created,
                    action: "created",
                    object: "service_zone",
                    data: { id: expectedFulfillmentSet.service_zones[0].id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.geo_zone_created,
                    action: "created",
                    object: "geo_zone",
                    data: {
                      id: expectedFulfillmentSet.service_zones[0].geo_zones[0]
                        .id,
                    },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.service_zone_deleted,
                    action: "deleted",
                    object: "service_zone",
                    data: { id: originalFulfillmentSet.service_zones[0].id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.geo_zone_deleted,
                    action: "deleted",
                    object: "geo_zone",
                    data: {
                      id: originalFulfillmentSet.service_zones[0].geo_zones[0]
                        .id,
                    },
                  }),
                ])
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
            expect(eventBusEmitSpy.mock.calls[1][0]).toHaveLength(6)

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

              const createdServiceZone =
                expectedFulfillmentSet.service_zones.find((s) =>
                  s.name.includes(`added-service-zone-test`)
                )

              expect(eventBusEmitSpy).toHaveBeenLastCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.updated,
                    action: "updated",
                    object: "fulfillment_set",
                    data: { id: expectedFulfillmentSet.id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.service_zone_created,
                    action: "created",
                    object: "service_zone",
                    data: { id: createdServiceZone.id },
                  }),
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.geo_zone_created,
                    action: "created",
                    object: "geo_zone",
                    data: {
                      id: createdServiceZone.geo_zones[0].id,
                    },
                  }),
                ])
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
      })
    })
  },
})
