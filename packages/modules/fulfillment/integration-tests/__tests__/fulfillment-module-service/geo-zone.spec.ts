import { Modules } from "@medusajs/modules-sdk"
import {
  CreateGeoZoneDTO,
  IFulfillmentModuleService,
  UpdateGeoZoneDTO,
} from "@medusajs/types"
import { GeoZoneType } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IFulfillmentModuleService>({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({ service }) => {
    describe("Fulfillment Module Service", () => {
      describe("read", () => {
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

      describe("mutations", () => {
        describe("on create", () => {
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

          it("should fail to create new geo zones that are not valid", async function () {
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            let data: CreateGeoZoneDTO = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.PROVINCE,
              country_code: "fr",
            } as any

            let err = await service.createGeoZones(data).catch((e) => e)
            expect(err.message).toBe(
              "Missing required property province_code for geo zone type province"
            )

            data = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.CITY,
              country_code: "fr",
              province_code: "test",
            } as any

            err = await service.createGeoZones(data).catch((e) => e)
            expect(err.message).toBe(
              "Missing required property city for geo zone type city"
            )

            data = {
              service_zone_id: serviceZone.id,
              type: GeoZoneType.ZIP,
              postal_expression: "test",
            } as any

            err = await service.createGeoZones(data).catch((e) => e)
            expect(err.message).toBe(
              "Missing required property country_code for geo zone type zip"
            )

            data = {
              service_zone_id: serviceZone.id,
              type: "unknown",
              postal_expression: "test",
            } as any

            err = await service.createGeoZones(data).catch((e) => e)
            expect(err.message).toBe(`Invalid geo zone type: unknown`)
          })
        })

        describe("on update", () => {
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
      })
    })
  },
})
