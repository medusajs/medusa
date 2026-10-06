import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../../../__fixtures__/allowed-fields"),
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store Carts API - allowFields overrides", () => {
      let storeHeaders
      let cart

      beforeAll(async () => {
        const appContainer = getContainer()
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        cart = (
          await api.post(
            "/store/carts",
            { region_id: region.id, email: "tony@stark.com" },
            storeHeaders
          )
        ).data.cart
      })

      it("should honour a middleware allowing extra fields", async () => {
        const response = await api.get(
          `/store/carts/${cart.id}?fields=%2Bregion.created_at`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.region.created_at).toBeDefined()
      })

      it("should still strip fields that were not allowed", async () => {
        const response = await api.get(
          `/store/carts/${cart.id}?fields=%2Bregion.metadata`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.region.metadata).toBeUndefined()
      })
    })
  },
})
