import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"
import { ModuleRegistrationName } from "@medusajs/utils"
import { IStoreModuleService } from "@medusajs/types"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let store
    let product1
    let product2
    let product3

    beforeEach(async () => {
      const appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      const storeModule: IStoreModuleService = appContainer.resolve(
        ModuleRegistrationName.STORE
      )
      // A default store is created when the app is started, so we want to delete that one and create one specifically for our tests.
      const defaultId = (await api.get("/admin/stores", adminHeaders)).data
        .stores?.[0]?.id
      if (defaultId) {
        storeModule.delete(defaultId)
      }

      store = await storeModule.create({
        name: "New store",
        supported_currency_codes: ["usd", "dkk"],
        default_currency_code: "usd",
      })

      product1 = (
        await api.post(
          "/admin/products",
          getProductFixture({ title: "test1", status: "published" }),
          adminHeaders
        )
      ).data.product
      product2 = (
        await api.post(
          "/admin/products",
          getProductFixture({ title: "test2", status: "published" }),
          adminHeaders
        )
      ).data.product
      product3 = (
        await api.post(
          "/admin/products",
          getProductFixture({ title: "test3", status: "published" }),
          adminHeaders
        )
      ).data.product
    })

    describe("Get products based on publishable key", () => {
      let pubKey1
      let salesChannel1
      let salesChannel2

      beforeEach(async () => {
        pubKey1 = (
          await api.post(
            "/admin/api-keys",
            { title: "sample key", type: "publishable" },
            adminHeaders
          )
        ).data.api_key

        salesChannel1 = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name",
              description: "test description",
            },
            adminHeaders
          )
        ).data.sales_channel

        salesChannel2 = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name 2",
              description: "test description 2",
            },
            adminHeaders
          )
        ).data.sales_channel

        await api.post(
          `/admin/sales-channels/${salesChannel1.id}/products`,
          { add: [product1.id] },
          adminHeaders
        )
        await api.post(
          `/admin/sales-channels/${salesChannel2.id}/products`,
          { add: [product2.id] },
          adminHeaders
        )
        await api.post(
          `/admin/stores/${store.id}`,
          { default_sales_channel_id: salesChannel1.id },
          adminHeaders
        )
      })

      it("returns products from a specific channel associated with a publishable key", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const response = await api.get(`/store/products`, {
          headers: {
            ...adminHeaders.headers,
            "x-publishable-api-key": pubKey1.token,
          },
        })

        expect(response.data.products.length).toBe(1)
        expect(response.data.products).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: product1.id,
            }),
          ])
        )
      })

      it("returns products from multiples sales channels associated with a publishable key", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id, salesChannel2.id],
          },
          adminHeaders
        )

        const response = await api.get(`/store/products`, {
          headers: {
            ...adminHeaders.headers,
            "x-publishable-api-key": pubKey1.token,
          },
        })

        expect(response.data.products.length).toBe(2)
        expect(response.data.products).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: product2.id,
            }),
            expect.objectContaining({
              id: product1.id,
            }),
          ])
        )
      })

      it("SC param overrides PK channels (but SK still needs to be in the PK's scope", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id, salesChannel2.id],
          },
          adminHeaders
        )

        const response = await api.get(
          `/store/products?sales_channel_id[0]=${salesChannel2.id}`,
          {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          }
        )

        expect(response.data.products.length).toBe(1)
        expect(response.data.products).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: product2.id,
            }),
          ])
        )
      })

      it("returns default product from default sales channel if PK is not passed", async () => {
        await api.post(
          `/admin/stores/${store.id}`,
          { default_sales_channel_id: salesChannel2.id },
          adminHeaders
        )

        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id, salesChannel2.id],
          },
          adminHeaders
        )

        const response = await api.get(`/store/products`, {
          adminHeaders,
        })

        expect(response.data.products.length).toBe(1)
        expect(response.data.products).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: product2.id,
            }),
          ])
        )
      })

      // TODO: Decide if this is the behavior we want to keep in v2, as it seems a bit strange
      it.skip("returns all products if passed PK doesn't have associated channels", async () => {
        const response = await api.get(`/store/products`, {
          headers: {
            ...adminHeaders.headers,
            "x-publishable-api-key": pubKey1.token,
          },
        })

        expect(response.data.products.length).toBe(3)
        expect(response.data.products).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: product1.id,
            }),
            expect.objectContaining({
              id: product2.id,
            }),
            expect.objectContaining({
              id: product3.id,
            }),
          ])
        )
      })

      it("throws because sales channel param is not in the scope of passed PK", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const err = await api
          .get(`/store/products?sales_channel_id[]=${salesChannel2.id}`, {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          })
          .catch((e) => e)

        expect(err.response.status).toEqual(400)
        expect(err.response.data.message).toEqual(
          `Requested sales channel is not part of the publishable key mappings`
        )
      })

      it("retrieve a product from a specific channel associated with a publishable key", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const response = await api.get(`/store/products/${product1.id}`, {
          headers: {
            ...adminHeaders.headers,
            "x-publishable-api-key": pubKey1.token,
          },
        })

        expect(response.data.product).toEqual(
          expect.objectContaining({
            id: product1.id,
          })
        )
      })

      // BREAKING: If product not in sales channel we used to return 400, we return 404 instead.
      it("return 404 because requested product is not in the SC associated with a publishable key", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const err = await api
          .get(`/store/products/${product2.id}`, {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          })
          .catch((e) => e)

        expect(err.response.status).toEqual(404)
      })

      // TODO: Add variant endpoints to the store API (if that is what we want)
      it.skip("should return 404 when the requested variant doesn't exist", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const response = await api
          .get(`/store/variants/does-not-exist`, {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          })
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          "Variant with id: does-not-exist was not found"
        )
      })

      it("should return 404 when the requested product doesn't exist", async () => {
        await api.post(
          `/admin/api-keys/${pubKey1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const response = await api
          .get(`/store/products/does-not-exist`, {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          })
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          "Product with id: does-not-exist was not found"
        )
      })

      //   TODO: Similar to above, decide what the behavior should be in v2
      it.skip("correctly returns a product if passed PK has no associated SCs", async () => {
        let response = await api
          .get(`/store/products/${product1.id}`, {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          })
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)

        response = await api
          .get(`/store/products/${product2.id}`, {
            headers: {
              ...adminHeaders.headers,
              "x-publishable-api-key": pubKey1.token,
            },
          })
          .catch((err) => {
            return err.response
          })

        expect(response.status).toEqual(200)
      })
    })
  },
})
