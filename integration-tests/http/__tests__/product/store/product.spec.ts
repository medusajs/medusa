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
import { createDefaultRuleTypes } from "../../../../modules/helpers/create-default-rule-types"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let store
    let appContainer
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
      await createDefaultRuleTypes(appContainer)

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
        ;[product, [variant]] = await createProducts({
          title: "test product 1",
          status: ProductStatus.PUBLISHED,
          variants: [
            {
              title: "test variant 1",
              manage_inventory: true,
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
          variants: [
            { title: "test variant 2", manage_inventory: false, prices: [] },
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
        const [store] = await service.list()

        if (store) {
          await service.delete(store.id)
        }

        await service.create({
          supported_currency_codes: ["usd", "dkk"],
          default_currency_code: "usd",
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
            "Missing required pricing context to calculate prices - currency_code or region_id",
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
          `/store/products?fields=*variants.calculated_price&currency_code=usd`
        )

        const expectation = expect.arrayContaining([
          expect.objectContaining({
            id: product.id,
            variants: [
              expect.objectContaining({
                calculated_price: {
                  id: expect.any(String),
                  is_calculated_price_price_list: false,
                  calculated_amount: 3000,
                  is_original_price_price_list: false,
                  original_amount: 3000,
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

        // Without calculated_price fields
        response = await api.get(`/store/products?currency_code=usd`)

        expect(response.status).toEqual(200)
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
        const [store] = await service.list()

        if (store) {
          await service.delete(store.id)
        }

        await service.create({
          supported_currency_codes: ["usd", "dkk"],
          default_currency_code: "usd",
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
            "Missing required pricing context to calculate prices - currency_code or region_id",
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
          `/store/products/${product.id}?fields=*variants.calculated_price&currency_code=usd`
        )

        const expectation = expect.objectContaining({
          id: product.id,
          variants: [
            expect.objectContaining({
              calculated_price: {
                id: expect.any(String),
                is_calculated_price_price_list: false,
                calculated_amount: 3000,
                is_original_price_price_list: false,
                original_amount: 3000,
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

        // Without calculated_price fields
        response = await api.get(
          `/store/products/${product.id}?currency_code=usd`
        )

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
  },
})
