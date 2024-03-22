import { IStockLocationServiceNext } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
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

    describe.only("Get stock location", () => {
      let locationId
      const location = {
        name: "Test Location",
      }
      beforeEach(async () => {
        const createLocationRespones = await api.post(
          "/admin/stock-locations",
          {
            ...location,
          },
          adminHeaders
        )
        locationId = createLocationRespones.data.stock_location.id
      })

      it("should get a stock location", async () => {
        const response = await api.get(
          `/admin/stock-locations/${locationId}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location).toEqual(
          expect.objectContaining({ id: locationId, ...location })
        )
      })
    })
  },
})
