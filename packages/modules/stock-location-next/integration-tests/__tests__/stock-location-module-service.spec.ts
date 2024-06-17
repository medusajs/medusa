import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"

import { IStockLocationService } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.STOCK_LOCATION,
  resolve: "@medusajs/stock-location-next",
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IStockLocationService>) => {
    describe("Stock Location Module Service", () => {
      describe("create", () => {
        it("should create a stock location", async () => {
          const data = { name: "location" }
          const location = await service.create(data)

          expect(location).toEqual(
            expect.objectContaining({ id: expect.any(String), ...data })
          )
        })

        it("should create stock locations for arrray", async () => {
          const data = [{ name: "location" }, { name: "location-1" }]
          const locations = await service.create(data)

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
          const location = await service.create(data)

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
          const location = await service.create(data)

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
          stockLocation = await service.create({ name: "location" })
        })

        it("should update a stock location", async () => {
          const data = {
            id: stockLocation.id,
            name: "updated location",
          }
          const location = await service.upsert(data)

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

          const location = await service.upsert(data)

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
          stockLocation = await service.create({
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
          const location = await service.updateStockLocationAddress(data)

          expect(location).toEqual(expect.objectContaining(data))
        })
      })
    })
  },
})
