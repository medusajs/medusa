import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let location

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      location = (
        await api.post(
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
      ).data.stock_location
    })

    describe("POST /admin/stock-locations/:id/fulfillment-providers/batch", () => {
      it("should add a fulfillment provider to a stock location successfully", async () => {
        const response = await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-providers?fields=id,*fulfillment_providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location.fulfillment_providers).toEqual([
          { id: "manual_test-provider", is_enabled: true },
        ])
      })

      it("should detach a fulfillment provider from a stock location successfully", async () => {
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        const response = await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-providers?fields=id,*fulfillment_providers`,
          { remove: ["manual_test-provider"] },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location.fulfillment_providers).toHaveLength(
          0
        )
      })
    })
  },
})
