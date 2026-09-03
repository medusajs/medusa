import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"
import { LIFT_HEADER } from "../../../__fixtures__/disallowed-fields/src/api/middlewares"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../../../__fixtures__/disallowed-fields"),
  testSuite: ({ dbConnection, api, getContainer }) => {
    describe("Disallowed fields on Store API routes", () => {
      let storeHeaders
      let liftHeaders
      let product

      beforeAll(async () => {
        const appContainer = getContainer()
        const publishableKey = await generatePublishableKey(appContainer)

        storeHeaders = generateStoreHeaders({ publishableKey })
        liftHeaders = {
          headers: { ...storeHeaders.headers, [LIFT_HEADER]: "true" },
        }

        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const shippingProfile = (
          await api.post(
            "/admin/shipping-profiles",
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        product = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "test product",
              status: "published",
              shipping_profile_id: shippingProfile.id,
            }),
            adminHeaders
          )
        ).data.product

        const salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "test channel" },
            adminHeaders
          )
        ).data.sales_channel

        await api.post(
          `/admin/sales-channels/${salesChannel.id}/products`,
          { add: [product.id] },
          adminHeaders
        )

        await api.post(
          `/admin/api-keys/${publishableKey.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )
      })

      it("should strip a field disallowed by the route's query config", async () => {
        const response = await api.get(
          "/store/products?fields=id,*sales_channels",
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products).toHaveLength(1)
        expect(response.data.products[0]).toEqual({ id: product.id })
      })

      it("should resolve a field lifted by a global middleware", async () => {
        const response = await api.get(
          "/store/products?fields=id,*sales_channels",
          liftHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products[0]).toEqual({
          id: product.id,
          sales_channels: [expect.objectContaining({ name: "test channel" })],
        })
      })

      it("should keep enforcing the fields left in the override", async () => {
        const response = await api.get(
          "/store/products?fields=id,*sales_channels,*publishable_api_keys",
          liftHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products[0].publishable_api_keys).toBeUndefined()
        expect(response.data.products[0].sales_channels).toBeDefined()
      })

      it("should not apply the override to a request that doesn't set it", async () => {
        await api.get("/store/products?fields=id,*sales_channels", liftHeaders)

        const response = await api.get(
          "/store/products?fields=id,*sales_channels",
          storeHeaders
        )

        expect(response.data.products[0]).toEqual({ id: product.id })
      })
    })
  },
})
