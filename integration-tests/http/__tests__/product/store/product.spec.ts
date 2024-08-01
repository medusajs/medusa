import { IStoreModuleService } from "@medusajs/types"
import {
  ApiKeyType,
  ModuleRegistrationName,
  ProductStatus,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let store
    let appContainer
    let collection
    let product
    let product1
    let product2
    let product3
    let product4
    let variant
    let variant2
    let variant3
    let variant4
    let inventoryItem1
    let inventoryItem2

    const createProducts = async (data) => {
      const response = await api.post(
        "/admin/products?fields=*variants",
        data,
        adminHeaders
      )

      return [response.data.product, response.data.product.variants || []]
    }

    const createCategory = async (data, productIds) => {
      const response = await api.post(
        "/admin/product-categories",
        data,
        adminHeaders
      )

      await api.post(
        `/admin/product-categories/${response.data.product_category.id}/products`,
        { add: productIds },
        adminHeaders
      )

      const response2 = await api.get(
        `/admin/product-categories/${response.data.product_category.id}?fields=*products`,
        adminHeaders
      )

      return response2.data.product_category
    }

    const createSalesChannel = async (data, productIds) => {
      const response = await api.post(
        "/admin/sales-channels",
        data,
        adminHeaders
      )

      const salesChannel = response.data.sales_channel

      await api.post(
        `/admin/sales-channels/${salesChannel.id}/products`,
        { add: productIds },
        adminHeaders
      )

      return salesChannel
    }

    beforeEach(async () => {
      appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      const storeModule: IStoreModuleService = appContainer.resolve(
        ModuleRegistrationName.STORE
      )
      // A default store is created when the app is started, so we want to delete that one and create one specifically for our tests.
      const defaultId = (await api.get("/admin/stores", adminHeaders)).data
        .stores?.[0]?.id
      if (defaultId) {
        storeModule.deleteStores(defaultId)
      }

      store = await storeModule.createStores({
        name: "New store",
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "dkk" },
        ],
      })
    })

    describe("Get products based on publishable key", () => {
      let pubKey1
      let salesChannel1
      let salesChannel2

      beforeEach(async () => {
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

    describe("GET /store/products", () => {
      beforeEach(async () => {
        inventoryItem1 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-sku" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItem2 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-sku-2" },
            adminHeaders
          )
        ).data.inventory_item

        collection = (
          await api.post(
            "/admin/collections",
            { title: "base-collection" },
            adminHeaders
          )
        ).data.collection
        ;[product, [variant]] = await createProducts({
          title: "test product 1",
          collection_id: collection.id,
          status: ProductStatus.PUBLISHED,
          options: [
            { title: "size", values: ["large", "small"] },
            { title: "color", values: ["green"] },
          ],
          tags: [{ value: "tag1" }],
          variants: [
            {
              title: "test variant 1",
              manage_inventory: true,
              options: {
                size: "large",
                color: "green",
              },
              inventory_items: [
                {
                  inventory_item_id: inventoryItem1.id,
                  required_quantity: 20,
                },
                {
                  inventory_item_id: inventoryItem2.id,
                  required_quantity: 20,
                },
              ],
              prices: [{ amount: 3000, currency_code: "usd" }],
            },
          ],
        })
        ;[product2, [variant2]] = await createProducts({
          title: "test product 2 uniquely",
          status: ProductStatus.PUBLISHED,
          options: [
            { title: "size", values: ["large", "small"] },
            { title: "material", values: ["cotton", "polyester"] },
          ],
          variants: [
            {
              title: "test variant 2",
              options: {
                size: "large",
                material: "cotton",
              },
              manage_inventory: false,
              prices: [],
            },
          ],
        })
        ;[product3, [variant3]] = await createProducts({
          title: "product not in price list",
          status: ProductStatus.PUBLISHED,
          variants: [{ title: "test variant 3", prices: [] }],
        })
        ;[product4, [variant4]] = await createProducts({
          title: "draft product",
          status: ProductStatus.DRAFT,
          variants: [{ title: "test variant 4", prices: [] }],
        })

        const defaultSalesChannel = await createSalesChannel(
          { name: "default sales channel" },
          [product.id, product2.id, product3.id, product4.id]
        )

        const service = appContainer.resolve(ModuleRegistrationName.STORE)
        const [store] = await service.listStores()

        if (store) {
          await service.deleteStores(store.id)
        }

        await service.createStores({
          supported_currencies: [
            { currency_code: "usd", is_default: true },
            { currency_code: "dkk" },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        })
      })

      it("should list all published products", async () => {
        let response = await api.get(`/store/products`)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(3)
        expect(response.data.products).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: product.id,
            }),
            expect.objectContaining({
              id: product2.id,
            }),
            expect.objectContaining({
              id: product3.id,
            }),
          ])
        )

        response = await api.get(`/store/products?q=uniquely`)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({
            id: product2.id,
          }),
        ])
      })

      it("should list all products for a sales channel", async () => {
        const salesChannel = await createSalesChannel(
          { name: "sales channel test" },
          [product.id]
        )

        let response = await api.get(
          `/store/products?sales_channel_id[]=${salesChannel.id}`
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({
            id: product.id,
          }),
        ])
      })

      it("should list all products for a category", async () => {
        const category = await createCategory(
          { name: "test", is_internal: false, is_active: true },
          [product.id]
        )

        const category2 = await createCategory(
          { name: "test2", is_internal: true, is_active: true },
          [product4.id]
        )

        const response = await api.get(
          `/store/products?category_id[]=${category.id}&category_id[]=${category2.id}`
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({
            id: product.id,
          }),
        ])
      })

      it("returns a list of ordered products by id ASC", async () => {
        const response = await api.get("/store/products?order=id")
        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual(
          [product.id, product2.id, product3.id]
            .sort((p1, p2) => p1.localeCompare(p2))
            .map((id) => expect.objectContaining({ id }))
        )
      })

      it("returns a list of ordered products by id DESC", async () => {
        const response = await api.get("/store/products?order=-id")

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual(
          [product.id, product2.id, product3.id]
            .sort((p1, p2) => p2.localeCompare(p1))
            .map((id) => expect.objectContaining({ id }))
        )
      })

      // TODO: This doesn't work currently, but worked in v1
      it.skip("returns a list of ordered products by variants title DESC", async () => {
        const response = await api.get("/store/products?order=-variants.title")

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: product3.id }),
          expect.objectContaining({ id: product2.id }),
          expect.objectContaining({ id: product.id }),
        ])
      })

      // TODO: This doesn't work currently, but worked in v1
      it.skip("returns a list of ordered products by variants title ASC", async () => {
        const response = await api.get("/store/products?order=variants.title")

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: product3.id }),
          expect.objectContaining({ id: product2.id }),
          expect.objectContaining({ id: product.id }),
        ])
      })

      // TODO: This doesn't work currently, but worked in v1
      it.skip("returns a list of ordered products by variants prices DESC", async () => {
        let response = await api.get(
          "/store/products?order=-variants.prices.amount"
        )
      })

      // TODO: This doesn't work currently, but worked in v1
      it.skip("returns a list of ordered products by variants prices ASC", async () => {})

      it("products contain only fields defined with `fields` param", async () => {
        const response = await api.get("/store/products?fields=handle")
        expect(response.status).toEqual(200)
        expect(Object.keys(response.data.products[0])).toEqual(["handle", "id"])
      })

      it("returns a list of products in collection", async () => {
        const response = await api.get(
          `/store/products?collection_id[]=${collection.id}`
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: product.id }),
        ])
      })

      it("returns a list of products with a given tag", async () => {
        const response = await api.get(
          `/store/products?tags[]=${product.tags[0].id}`
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: product.id }),
        ])
      })

      // TODO: Not implemented yet
      it.skip("returns gift card product", async () => {
        const response = await api
          .get("/store/products?is_giftcard=true")
          .catch((err) => {
            console.log(err)
          })
      })

      // TODO: Not implemented yet
      it.skip("returns non gift card products", async () => {
        const response = await api
          .get("/store/products?is_giftcard=false")
          .catch((err) => {
            console.log(err)
          })
      })

      it("returns a list of products in with a given handle", async () => {
        const response = await api.get(
          `/store/products?handle=${product.handle}`
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: product.id }),
        ])
      })

      it("returns a list of products filtered by variant options", async () => {
        const option = product.options.find((o) => o.title === "size")
        const response = await api.get(
          `/store/products?variants.options[option_id]=${option?.id}&variants.options[value]=large`
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: product.id }),
        ])
      })

      describe("with publishable keys", () => {
        let salesChannel1
        let salesChannel2
        let publishableKey1

        beforeEach(async () => {
          salesChannel1 = await createSalesChannel(
            { name: "sales channel test" },
            [product.id]
          )

          salesChannel2 = await createSalesChannel(
            { name: "sales channel test 2" },
            [product2.id]
          )

          const api1Res = await api.post(
            `/admin/api-keys`,
            { title: "Test publishable KEY", type: ApiKeyType.PUBLISHABLE },
            adminHeaders
          )

          publishableKey1 = api1Res.data.api_key

          await api.post(
            `/admin/api-keys/${publishableKey1.id}/sales-channels`,
            { add: [salesChannel1.id] },
            adminHeaders
          )
        })

        it("should list all products for a sales channel", async () => {
          let response = await api.get(
            `/store/products?sales_channel_id[]=${salesChannel1.id}`,
            { headers: { "x-publishable-api-key": publishableKey1.token } }
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.products).toEqual([
            expect.objectContaining({
              id: product.id,
            }),
          ])
        })

        it("should list products by id", async () => {
          let response = await api.get(`/store/products?id[]=${product.id}`)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.products).toEqual([
            expect.objectContaining({
              id: product.id,
            }),
          ])
        })

        it("should throw error when publishable key is invalid", async () => {
          let error = await api
            .get(`/store/products?sales_channel_id[]=does-not-exist`, {
              headers: { "x-publishable-api-key": "does-not-exist" },
            })
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            message: `Publishable API key not found`,
            type: "invalid_data",
          })
        })

        it("should throw error when sales channel does not exist", async () => {
          let error = await api
            .get(`/store/products?sales_channel_id[]=does-not-exist`, {
              headers: { "x-publishable-api-key": publishableKey1.token },
            })
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            message: `Requested sales channel is not part of the publishable key mappings`,
            type: "invalid_data",
          })
        })

        it("should throw error when sales channel not in publishable key", async () => {
          let error = await api
            .get(`/store/products?sales_channel_id[]=${salesChannel2.id}`, {
              headers: { "x-publishable-api-key": publishableKey1.token },
            })
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            message: `Requested sales channel is not part of the publishable key mappings`,
            type: "invalid_data",
          })
        })
      })

      it("should throw error when calculating prices without context", async () => {
        let error = await api
          .get(`/store/products?fields=*variants.calculated_price`)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          message:
            "Missing required pricing context to calculate prices - region_id",
          type: "invalid_data",
        })
      })

      it("should list products with prices when context is present", async () => {
        const region = (
          await api.post(
            "/admin/regions",
            { name: "Test Region", currency_code: "usd" },
            adminHeaders
          )
        ).data.region

        let response = await api.get(
          `/store/products?fields=*variants.calculated_price&region_id=${region.id}`
        )

        const expectation = expect.arrayContaining([
          expect.objectContaining({
            id: product.id,
            variants: [
              expect.objectContaining({
                calculated_price: {
                  id: expect.any(String),
                  is_calculated_price_price_list: false,
                  is_calculated_price_tax_inclusive: false,
                  calculated_amount: 3000,
                  raw_calculated_amount: {
                    value: "3000",
                    precision: 20,
                  },
                  is_original_price_price_list: false,
                  is_original_price_tax_inclusive: false,
                  original_amount: 3000,
                  raw_original_amount: {
                    value: "3000",
                    precision: 20,
                  },
                  currency_code: "usd",
                  calculated_price: {
                    id: expect.any(String),
                    price_list_id: null,
                    price_list_type: null,
                    min_quantity: null,
                    max_quantity: null,
                  },
                  original_price: {
                    id: expect.any(String),
                    price_list_id: null,
                    price_list_type: null,
                    min_quantity: null,
                    max_quantity: null,
                  },
                },
              }),
            ],
          }),
        ])

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(3)
        expect(response.data.products).toEqual(expectation)

        // with only region_id
        response = await api.get(`/store/products?region_id=${region.id}`)

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual(expectation)
      })

      describe("with inventory items", () => {
        let location1
        let location2
        let salesChannel1
        let publishableKey1

        beforeEach(async () => {
          location1 = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          location2 = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location 2" },
              adminHeaders
            )
          ).data.stock_location

          salesChannel1 = await createSalesChannel(
            { name: "sales channel test" },
            [product.id, product2.id]
          )

          const api1Res = await api.post(
            `/admin/api-keys`,
            { title: "Test publishable KEY", type: ApiKeyType.PUBLISHABLE },
            adminHeaders
          )

          publishableKey1 = api1Res.data.api_key

          await api.post(
            `/admin/api-keys/${publishableKey1.id}/sales-channels`,
            { add: [salesChannel1.id] },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: location1.id,
              stocked_quantity: 20,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem2.id}/location-levels`,
            {
              location_id: location2.id,
              stocked_quantity: 30,
            },
            adminHeaders
          )

          await api.post(
            `/admin/stock-locations/${location1.id}/sales-channels`,
            { add: [salesChannel1.id] },
            adminHeaders
          )

          await api.post(
            `/admin/stock-locations/${location2.id}/sales-channels`,
            { add: [salesChannel1.id] },
            adminHeaders
          )
        })

        it("should list all inventory items for a variant", async () => {
          let response = await api.get(
            `/store/products?sales_channel_id[]=${salesChannel1.id}&fields=variants.inventory_items.inventory.location_levels.*`,
            { headers: { "x-publishable-api-key": publishableKey1.token } }
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: product.id,
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    inventory_items: expect.arrayContaining([
                      expect.objectContaining({
                        inventory_item_id: inventoryItem1.id,
                      }),
                      expect.objectContaining({
                        inventory_item_id: inventoryItem2.id,
                      }),
                    ]),
                  }),
                ]),
              }),
            ])
          )
        })

        it("should return inventory quantity when variant's manage_inventory is true", async () => {
          await api.post(
            `/admin/products/${product.id}/variants/${variant.id}/inventory-items`,
            { required_quantity: 20, inventory_item_id: inventoryItem1.id },
            adminHeaders
          )

          await api.post(
            `/admin/products/${product.id}/variants/${variant.id}/inventory-items`,
            { required_quantity: 20, inventory_item_id: inventoryItem2.id },
            adminHeaders
          )

          let response = await api.get(
            `/store/products?sales_channel_id[]=${salesChannel1.id}&fields=%2bvariants.inventory_quantity`,
            { headers: { "x-publishable-api-key": publishableKey1.token } }
          )

          const product1Res = response.data.products.find(
            (p) => p.id === product.id
          )

          const product2Res = response.data.products.find(
            (p) => p.id === product2.id
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(product1Res).toEqual(
            expect.objectContaining({
              id: product.id,
              variants: expect.arrayContaining([
                expect.objectContaining({
                  inventory_quantity: 1,
                  manage_inventory: true,
                }),
              ]),
            })
          )
          expect(product2Res).toEqual(
            expect.objectContaining({
              id: product2.id,
              variants: expect.arrayContaining([
                expect.objectContaining({
                  manage_inventory: false,
                }),
              ]),
            })
          )
          expect(product2Res.variants[0].inventory_quantity).toEqual(undefined)
        })
      })
    })

    describe("GET /store/products/:id", () => {
      beforeEach(async () => {
        ;[product, [variant]] = await createProducts({
          title: "test product 1",
          status: ProductStatus.PUBLISHED,
          variants: [
            {
              title: "test variant 1",
              prices: [{ amount: 3000, currency_code: "usd" }],
            },
          ],
        })

        const defaultSalesChannel = await createSalesChannel(
          { name: "default sales channel" },
          [product.id]
        )

        const service = appContainer.resolve(ModuleRegistrationName.STORE)
        const [store] = await service.listStores()

        if (store) {
          await service.deleteStores(store.id)
        }

        await service.createStores({
          supported_currencies: [
            { currency_code: "usd", is_default: true },
            { currency_code: "dkk" },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        })
      })

      it("should retrieve product successfully", async () => {
        let response = await api.get(`/store/products/${product.id}`)

        expect(response.status).toEqual(200)
        expect(response.data.product).toEqual(
          expect.objectContaining({
            id: product.id,
            variants: [
              expect.objectContaining({
                id: expect.any(String),
              }),
            ],
          })
        )
      })

      // TODO: There are 2 problems that need to be solved to enable this test
      // 1. When adding product to another category, the product is being removed from earlier assigned categories
      // 2. MikroORM seems to be doing a join strategy to load relationships, we need to send a separate query to fetch relationships
      // to scope the relationships
      it.skip("should list only categories that are public and active", async () => {
        const category = await createCategory(
          { name: "test 1", is_internal: true, is_active: true },
          [product.id]
        )

        await createCategory(
          { name: "test 2", is_internal: false, is_active: true },
          [product.id]
        )

        const response = await api.get(
          `/store/products/${product.id}?fields=*categories`
        )

        expect(response.status).toEqual(200)
        expect(response.data.product).toEqual(
          expect.objectContaining({
            id: product.id,
            categories: [expect.objectContaining({ id: category.id })],
          })
        )
      })

      it("should throw error when calculating prices without context", async () => {
        let error = await api
          .get(
            `/store/products/${product.id}?fields=*variants.calculated_price`
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          message:
            "Missing required pricing context to calculate prices - region_id",
          type: "invalid_data",
        })
      })

      it("should get product with prices when context is present", async () => {
        const region = (
          await api.post(
            "/admin/regions",
            { name: "Test Region", currency_code: "usd" },
            adminHeaders
          )
        ).data.region

        let response = await api.get(
          `/store/products/${product.id}?fields=*variants.calculated_price&region_id=${region.id}`
        )

        const expectation = expect.objectContaining({
          id: product.id,
          variants: [
            expect.objectContaining({
              calculated_price: {
                id: expect.any(String),
                is_calculated_price_price_list: false,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 3000,
                raw_calculated_amount: {
                  value: "3000",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 3000,
                raw_original_amount: {
                  value: "3000",
                  precision: 20,
                },
                currency_code: "usd",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
            }),
          ],
        })

        expect(response.status).toEqual(200)
        expect(response.data.product).toEqual(expectation)

        // with only region_id
        response = await api.get(
          `/store/products/${product.id}?region_id=${region.id}`
        )

        expect(response.status).toEqual(200)
        expect(response.data.product).toEqual(expectation)
      })
    })

    describe("Tax handling", () => {
      let usRegion
      let euRegion
      let dkRegion
      let euCart

      beforeEach(async () => {
        const store = (await api.get("/admin/stores", adminHeaders)).data
          .stores[0]
        if (store) {
          await api.post(
            `/admin/stores/${store.id}`,
            {
              supported_currencies: [
                {
                  currency_code: "usd",
                  is_tax_inclusive: true,
                  is_default: true,
                },
                { currency_code: "eur", is_tax_inclusive: false },
                { currency_code: "dkk", is_tax_inclusive: true },
              ],
            },
            adminHeaders
          )
        } else {
          await api.post(
            "/admin/stores",
            {
              name: "Test store",
              supported_currencies: [
                {
                  currency_code: "usd",
                  is_tax_inclusive: true,
                  is_default: true,
                },
                { currency_code: "eur", is_tax_inclusive: false },
                { currency_code: "dkk", is_tax_inclusive: true },
              ],
            },
            adminHeaders
          )
        }

        usRegion = (
          await api.post(
            "/admin/regions",
            {
              name: "Test Region",
              currency_code: "usd",
              countries: ["us"],
              is_tax_inclusive: false,
              automatic_taxes: false,
            },
            adminHeaders
          )
        ).data.region

        euRegion = (
          await api.post(
            "/admin/regions",
            {
              name: "Test Region",
              currency_code: "eur",
              countries: ["it", "de"],
              is_tax_inclusive: true,
              automatic_taxes: true,
            },
            adminHeaders
          )
        ).data.region

        dkRegion = (
          await api.post(
            "/admin/regions",
            {
              name: "Test Region",
              currency_code: "dkk",
              countries: ["dk"],
              is_tax_inclusive: false,
              automatic_taxes: true,
            },
            adminHeaders
          )
        ).data.region

        product1 = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "test1",
              status: "published",
              variants: [
                {
                  title: "Test taxes",
                  prices: [
                    {
                      amount: 45,
                      currency_code: "eur",
                      rules: { region_id: euRegion.id },
                    },
                    {
                      amount: 100,
                      currency_code: "usd",
                      rules: { region_id: usRegion.id },
                    },
                    {
                      amount: 30,
                      currency_code: "dkk",
                      rules: { region_id: dkRegion.id },
                    },
                  ],
                },
              ],
            }),
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

        euCart = (await api.post("/store/carts", { region_id: euRegion.id }))
          .data.cart

        await api.post(
          `/admin/tax-regions`,
          {
            country_code: "us",
            default_tax_rate: {
              code: "default",
              rate: 5,
              name: "default rate",
            },
          },
          adminHeaders
        )

        await api.post(
          `/admin/tax-regions`,
          {
            country_code: "it",
            default_tax_rate: {
              code: "default",
              rate: 10,
              name: "default rate",
            },
          },
          adminHeaders
        )

        await api.post(
          `/admin/tax-regions`,
          {
            country_code: "dk",
            default_tax_rate: {
              code: "default",
              rate: 20,
              name: "default rate",
            },
          },
          adminHeaders
        )
      })

      it("should not return tax pricing if the context is not sufficient when listing products", async () => {
        const products = (
          await api.get(
            `/store/products?fields=id,*variants.calculated_price&region_id=${usRegion.id}`
          )
        ).data.products

        expect(products.length).toBe(2)
        expect(products[0].variants[0].calculated_price).not.toHaveProperty(
          "calculated_amount_with_tax"
        )
        expect(products[0].variants[0].calculated_price).not.toHaveProperty(
          "calculated_amount_without_tax"
        )
      })

      it("should not return tax pricing if automatic taxes are off when listing products", async () => {
        const products = (
          await api.get(
            `/store/products?fields=id,*variants.calculated_price&region_id=${usRegion.id}&country_code=us`
          )
        ).data.products

        expect(products.length).toBe(2)
        expect(products[0].variants[0].calculated_price).not.toHaveProperty(
          "calculated_amount_with_tax"
        )
        expect(products[0].variants[0].calculated_price).not.toHaveProperty(
          "calculated_amount_without_tax"
        )
      })

      it("should return prices with and without tax for a tax inclusive region when listing products", async () => {
        const products = (
          await api.get(
            `/store/products?fields=id,*variants.calculated_price&region_id=${euRegion.id}&country_code=it`
          )
        ).data.products

        expect(products.length).toBe(2)
        expect(products[0].variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "eur",
                calculated_amount: 45,
                calculated_amount_with_tax: 45,
              }),
            }),
          ])
        )

        // TODO: Return an integer instead of a float for the pricing
        expect(
          products[0].variants[0].calculated_price.calculated_amount_without_tax.toFixed(
            1
          )
        ).toEqual("40.9")

        expect(products[1].variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "eur",
                calculated_amount: 45,
                calculated_amount_without_tax: 45,
                calculated_amount_with_tax: 49.5,
              }),
            }),
          ])
        )
      })

      it("should return prices with and without tax for a tax exclusive region when listing products", async () => {
        const products = (
          await api.get(
            `/store/products?fields=id,*variants.calculated_price&region_id=${dkRegion.id}&country_code=dk`
          )
        ).data.products

        expect(products.length).toBe(2)
        expect(products[0].variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "dkk",
                calculated_amount: 30,
                calculated_amount_with_tax: 36,
                calculated_amount_without_tax: 30,
              }),
            }),
          ])
        )
        expect(products[1].variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "dkk",
                calculated_amount: 30,
                calculated_amount_with_tax: 30,
                calculated_amount_without_tax: 25,
              }),
            }),
          ])
        )
      })

      it("should return prices with and without tax when the cart is available and a country is passed when listing products", async () => {
        const products = (
          await api.get(
            `/store/products?fields=id,*variants.calculated_price&cart_id=${euCart.id}&country_code=it`
          )
        ).data.products

        expect(products.length).toBe(2)
        expect(products[0].variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "eur",
                calculated_amount: 45,
                calculated_amount_with_tax: 45,
              }),
            }),
          ])
        )

        // TODO: Return an integer instead of a float for the pricing
        expect(
          products[0].variants[0].calculated_price.calculated_amount_without_tax.toFixed(
            1
          )
        ).toEqual("40.9")
      })

      it("should return prices with and without tax when the cart context is available when listing products", async () => {
        await api.post(`/store/carts/${euCart.id}`, {
          shipping_address: {
            country_code: "it",
          },
        })

        const products = (
          await api.get(
            `/store/products?fields=id,*variants.calculated_price&cart_id=${euCart.id}`
          )
        ).data.products

        expect(products.length).toBe(2)
        expect(products[0].variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "eur",
                calculated_amount: 45,
                calculated_amount_with_tax: 45,
              }),
            }),
          ])
        )

        // TODO: Return an integer instead of a float for the pricing
        expect(
          products[0].variants[0].calculated_price.calculated_amount_without_tax.toFixed(
            1
          )
        ).toEqual("40.9")
      })

      it("should not return tax pricing if the context is not sufficient when fetching a single product", async () => {
        const product = (
          await api.get(
            `/store/products/${product1.id}?fields=id,*variants.calculated_price&region_id=${usRegion.id}`
          )
        ).data.product

        expect(product.variants[0].calculated_price).not.toHaveProperty(
          "calculated_amount_with_tax"
        )
        expect(product.variants[0].calculated_price).not.toHaveProperty(
          "calculated_amount_without_tax"
        )
      })

      it("should return prices with and without tax for a tax inclusive region when fetching a single product", async () => {
        const product = (
          await api.get(
            `/store/products/${product1.id}?fields=id,*variants.calculated_price&region_id=${euRegion.id}&country_code=it`
          )
        ).data.product

        expect(product.variants).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              calculated_price: expect.objectContaining({
                currency_code: "eur",
                calculated_amount: 45,
                calculated_amount_with_tax: 45,
              }),
            }),
          ])
        )

        // TODO: Return an integer instead of a float for the pricing
        expect(
          product.variants[0].calculated_price.calculated_amount_without_tax.toFixed(
            1
          )
        ).toEqual("40.9")
      })
    })
  },
})
