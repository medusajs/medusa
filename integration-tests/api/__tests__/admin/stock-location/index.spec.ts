import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

import { IStockLocationServiceNext } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

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
  },
})
