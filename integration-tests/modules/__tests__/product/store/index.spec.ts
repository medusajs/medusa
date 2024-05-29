import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ApiKeyType, ProductStatus } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store: Products API", () => {
      let appContainer
      let product
      let product2
      let product3
      let product4
      let variant
      let variant2
      let variant3
      let variant4

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

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        await createDefaultRuleTypes(appContainer)
      })

      describe("GET /store/products", () => {
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
          ;[product2, [variant2]] = await createProducts({
            title: "test product 2 uniquely",
            status: ProductStatus.PUBLISHED,
            variants: [{ title: "test variant 2", prices: [] }],
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
              message: `Invalid sales channel filters provided - does-not-exist`,
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
              message: `Invalid sales channel filters provided - ${salesChannel2.id}`,
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
              "Pricing parameters (currency_code or region_id) are required to calculate prices",
            type: "invalid_data",
          })
        })

        it("should list products with prices when context is present", async () => {
          let response = await api.get(
            `/store/products?fields=*variants.calculated_price&currency_code=usd`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(3)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
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
          )
        })

        describe("with inventory items", () => {
          let inventoryItem1
          let inventoryItem2
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

            const inventoryItem1 = (
              await api.post(
                `/admin/inventory-items`,
                { variant_id: variant.id, sku: variant.sku },
                adminHeaders
              )
            ).data.inventory
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
              "Pricing parameters (currency_code or region_id) are required to calculate prices",
            type: "invalid_data",
          })
        })

        it("should get product with prices when context is present", async () => {
          let response = await api.get(
            `/store/products/${product.id}?fields=*variants.calculated_price&currency_code=usd`
          )

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
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
            })
          )
        })
      })
    })
  },
})
