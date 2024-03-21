import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"
import { IStockLocationServiceNext } from "@medusajs/types"
import { createAdminUser } from "../../../helpers/create-admin-user"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let service: IStockLocationServiceNext

    beforeEach(async () => {
      appContainer = getContainer()

      await createAdminUser(dbConnection, adminHeaders, appContainer)

      service = appContainer.resolve(ModuleRegistrationName.STOCK_LOCATION)
    })

    describe("create stock location", () => {
      it("should create a stock location with a name and address", async () => {
        const address = {
          address_1: "Test Address",
          country_code: "US",
        }
        const location = {
          name: "Test Location",
        }

        const response = await api.post(
          "/admin/stock-locations",
          {
            ...location,
            address,
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location).toEqual(
          expect.objectContaining({
            ...location,
            address: expect.objectContaining(address),
          })
        )
      })
    })

    describe("list stock locations", () => {
      let location1
      let location2
      beforeEach(async () => {
        const location1Response = await api.post(
          `/admin/stock-locations`,
          {
            name: "Test Location 1",
            address: {
              address_1: "Test Address",
              country_code: "US",
            },
          },
          adminHeaders
        )
        location1 = location1Response.data.stock_location
        const location2Response = await api.post(
          `/admin/stock-locations`,
          {
            name: "Test Location 2",
            address: {
              address_1: "Test Address",
              country_code: "US",
            },
          },
          adminHeaders
        )
        location2 = location2Response.data.stock_location
      })

      it("should list stock locations", async () => {
        const response = await api.get("/admin/stock-locations", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.stock_locations).toEqual([
          expect.objectContaining(location1),
          expect.objectContaining(location2),
        ])
      })

      it("should filter stock locations on name", async () => {
        const response = await api.get(
          "/admin/stock-locations?name=Test%20Location%201",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })

      it("should filter stock locations on partial name with query", async () => {
        const response = await api.get(
          "/admin/stock-locations?q=ation%201",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })

      it("should filter stock locations on sales_channel_id", async () => {
        const remoteLink = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        await remoteLink.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: "default",
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: location1.id,
            },
          },
        ])

        const response = await api.get(
          "/admin/stock-locations?sales_channel_id=default",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })
    })
  },
})
