import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

import { IStockLocationService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { StockLocationModuleService } from "../../src/services"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IStockLocationService>({
  moduleName: Modules.STOCK_LOCATION,
  testSuite: ({ service }) => {
    describe("Stock Location Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.STOCK_LOCATION, {
          service: StockLocationModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "stockLocationAddress",
          "stockLocation",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          stockLocationAddress: {
            id: {
              linkable: "stock_location_address_id",
              entity: "StockLocationAddress",
              primaryKey: "id",
              serviceName: "stock_location",
              field: "stockLocationAddress",
            },
          },
          stockLocation: {
            id: {
              field: "stockLocation",
              entity: "StockLocation",
              linkable: "stock_location_id",
              primaryKey: "id",
              serviceName: "stock_location",
            },
            location_id: {
              linkable: "location_id",
              entity: "StockLocation",
              primaryKey: "location_id",
              serviceName: "stock_location",
              field: "stockLocation",
            },
          },
        })
      })

      describe("create", () => {
        it("should create a stock location", async () => {
          const data = { name: "location" }
          const location = await service.createStockLocations(data)

          expect(location).toEqual(
            expect.objectContaining({ id: expect.any(String), ...data })
          )
        })

        it("should create stock locations for arrray", async () => {
          const data = [{ name: "location" }, { name: "location-1" }]
          const locations = await service.createStockLocations(data)

          expect(locations).toEqual([
            expect.objectContaining({ id: expect.any(String), ...data[0] }),
            expect.objectContaining({ id: expect.any(String), ...data[1] }),
          ])
        })

        it("should create a stock location with addresses", async () => {
          const data = {
            name: "location",
            address: { city: "city", address_1: "street", country_code: "US" },
          }
          const location = await service.createStockLocations(data)

          expect(location).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              ...data,
              address: expect.objectContaining({
                id: expect.any(String),
                ...data.address,
              }),
            })
          )
        })

        it("should create stock locations with addresses", async () => {
          const data = [
            {
              name: "location",
              address: {
                city: "city",
                address_1: "street",
                country_code: "US",
              },
            },
            {
              name: "location-1",
              address: {
                city: "city 1",
                address_1: "street 1",
                country_code: "US",
              },
            },
          ]
          const location = await service.createStockLocations(data)

          expect(location).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                ...data[0],
                address: expect.objectContaining({
                  id: expect.any(String),
                  ...data[0].address,
                }),
              }),
              expect.objectContaining({
                id: expect.any(String),
                ...data[1],
                address: expect.objectContaining({
                  id: expect.any(String),
                  ...data[1].address,
                }),
              }),
            ])
          )
        })
      })

      describe("update", () => {
        let stockLocation
        beforeEach(async () => {
          stockLocation = await service.createStockLocations({
            name: "location",
          })
        })

        it("should update a stock location", async () => {
          const data = {
            id: stockLocation.id,
            name: "updated location",
          }
          const location = await service.upsertStockLocations(data)

          expect(location).toEqual(expect.objectContaining(data))
        })

        it("should update a stock location with an address", async () => {
          const data = {
            id: stockLocation.id,
            address: {
              address_1: "street",
              city: "city",
              country_code: "US",
            },
          }

          const location = await service.upsertStockLocations(data)

          expect(location).toEqual(
            expect.objectContaining({
              address: expect.objectContaining(data.address),
            })
          )
        })
      })

      describe("updateStockLocationAddress", () => {
        let stockLocation
        beforeEach(async () => {
          stockLocation = await service.createStockLocations({
            name: "location",
            address: { city: "city", address_1: "street", country_code: "US" },
          })
        })

        it("should update an address", async () => {
          const data = {
            id: stockLocation.address.id,
            city: "updated city",
            address_1: "updated address_1",
            country_code: "updated country_code",
          }
          const location = await (service as any).updateStockLocationAddresses(
            data
          )

          expect(location).toEqual(expect.objectContaining(data))
        })
      })
    })
  },
})
