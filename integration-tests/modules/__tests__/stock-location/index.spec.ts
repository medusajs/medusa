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

    describe.only("Delete stock location", () => {
      let stockLocationId
      beforeEach(async () => {
        const stockLocationCreateResponse = await api.post(
          `/admin/stock-locations`,
          { name: "test location" },
          adminHeaders
        )

        stockLocationId = stockLocationCreateResponse.data.stock_location.id
      })

      it("should successfully delete stock location", async () => {
        const stockLocationDeleteResponse = await api.delete(
          `/admin/stock-locations/${stockLocationId}`,
          adminHeaders
        )

        expect(stockLocationDeleteResponse.status).toEqual(200)
        expect(stockLocationDeleteResponse.data).toEqual({
          id: stockLocationId,
          object: "stock_location",
          deleted: true,
        })
      })

      it("should successfully delete stock location associations", async () => {
        const remoteLink = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        await remoteLink.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: "default",
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: stockLocationId,
            },
          },
        ])

        await api.delete(
          `/admin/stock-locations/${stockLocationId}`,
          adminHeaders
        )

        const linkService = remoteLink.getLinkModule(
          Modules.SALES_CHANNEL,
          "sales_channel_id",
          Modules.STOCK_LOCATION,
          "stock_location_id"
        )

        const stockLocationLinks = await linkService.list()
        expect(stockLocationLinks).toHaveLength(0)
      })
    })
  },
})
