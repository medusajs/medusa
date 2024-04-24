import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateProductDTO,
  IPricingModuleService,
  IProductModuleService,
  ISalesChannelModuleService,
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

async function createProductsWithVariants(
  productModule: IProductModuleService,
  productsData: CreateProductDTO
): Promise<[ProductDTO, ProductVariantDTO[]]> {
  const { variants: variantsData, ...productData } = productsData

  const [product] = await productModule.create([productData])
  const variantsDataWithProductId = variantsData?.map((variantData) => {
    return { ...variantData, product_id: product.id }
  })

  const variants = variantsDataWithProductId
    ? await productModule.createVariants(variantsDataWithProductId)
    : []

  return [product, variants]
}

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
      let pricingModule: IPricingModuleService
      let productModule: IProductModuleService
      let salesChannelModule: ISalesChannelModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        salesChannelModule = appContainer.resolve(
          ModuleRegistrationName.SALES_CHANNEL
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        await createDefaultRuleTypes(appContainer)
      })

      describe("GET /store/products", () => {
        beforeEach(async () => {
          ;[product, [variant]] = await createProductsWithVariants(
            productModule,
            {
              title: "test product 1",
              status: ProductStatus.PUBLISHED,
              variants: [{ title: "test variant 1" }],
            }
          )
          ;[product2, [variant2]] = await createProductsWithVariants(
            productModule,
            {
              title: "test product 2 uniquely",
              status: ProductStatus.PUBLISHED,
              variants: [{ title: "test variant 2" }],
            }
          )
          ;[product3, [variant3]] = await createProductsWithVariants(
            productModule,
            {
              title: "product not in price list",
              status: ProductStatus.PUBLISHED,
              variants: [{ title: "test variant 3" }],
            }
          )
          ;[product4, [variant4]] = await createProductsWithVariants(
            productModule,
            {
              title: "draft product",
              status: ProductStatus.DRAFT,
              variants: [{ title: "test variant 4" }],
            }
          )
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
          const salesChannel = await salesChannelModule.create({
            name: "sales channel test",
          })

          const remoteLink = appContainer.resolve(
            ContainerRegistrationKeys.REMOTE_LINK
          )

          await remoteLink.create([
            {
              [Modules.PRODUCT]: { product_id: product.id },
              [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
            },
          ])

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

        it("should throw error when calculating prices without context", async () => {
          let error = await api
            .get(`/store/products?fields=*variants.prices`)
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            message:
              "Pricing parameters (currency_code or region_id) are required to calculate prices",
            type: "invalid_data",
          })
        })

        it("should list products with prices when context is present", async () => {
          await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
            rules: [],
          })

          let response = await api.get(
            `/store/products?fields=*variants.prices&currency_code=usd`
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(3)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: product.id,
                variants: [
                  expect.objectContaining({
                    price: {
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
              expect.objectContaining({
                id: product2.id,
                variants: [
                  expect.objectContaining({
                    price: null,
                  }),
                ],
              }),
              expect.objectContaining({
                id: product3.id,
              }),
            ])
          )
        })
      })

      describe("GET /store/products/:id", () => {
        beforeEach(async () => {
          ;[product, [variant]] = await createProductsWithVariants(
            productModule,
            {
              title: "test product 1",
              status: ProductStatus.PUBLISHED,
              variants: [{ title: "test variant 1" }],
            }
          )
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

        it("should throw error when calculating prices without context", async () => {
          let error = await api
            .get(`/store/products/${product.id}?fields=*variants.prices`)
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            message:
              "Pricing parameters (currency_code or region_id) are required to calculate prices",
            type: "invalid_data",
          })
        })

        it("should get product with prices when context is present", async () => {
          await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
            rules: [],
          })

          let response = await api.get(
            `/store/products/${product.id}?fields=*variants.prices&currency_code=usd`
          )

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              id: product.id,
              variants: [
                expect.objectContaining({
                  price: {
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
