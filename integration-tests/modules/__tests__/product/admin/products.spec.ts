import {
  CreateProductDTO,
  IPricingModuleService,
  IProductModuleService,
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  PriceListStatus,
  PriceListType,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

async function createProductsWithVariants(
  productModule: IProductModuleService,
  productsData: CreateProductDTO
): Promise<[ProductDTO, ProductVariantDTO[]]> {
  const { variants: variantsData, ...productData } = productsData

  const [product] = await productModule.createProducts([productData])

  const variantsDataWithProductId = variantsData?.map((variantData) => {
    return { ...variantData, product_id: product.id }
  })

  const variants = variantsDataWithProductId
    ? await productModule.createProductVariants(variantsDataWithProductId)
    : []

  return [product, variants]
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Products API", () => {
      let appContainer
      let product
      let product2
      let product3
      let variant
      let variant2
      let variant3
      let pricingModule: IPricingModuleService
      let productModule: IProductModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      describe("GET /admin/products", () => {
        describe("should filter products by price lists", () => {
          beforeEach(async () => {
            ;[product, [variant]] = await createProductsWithVariants(
              productModule,
              {
                title: "test product 1",
                variants: [{ title: "test variant 1" }],
              }
            )
            ;[product2, [variant2]] = await createProductsWithVariants(
              productModule,
              {
                title: "test product 2 uniquely",
                variants: [{ title: "test variant 2" }],
              }
            )
            ;[product3, [variant3]] = await createProductsWithVariants(
              productModule,
              {
                title: "product not in price list",
                variants: [{ title: "test variant 3" }],
              }
            )
          })

          it("should list all products in a price list", async () => {
            const priceSet = await createVariantPriceSet({
              container: appContainer,
              variantId: variant.id,
              prices: [],
              rules: [],
            })

            const priceSet2 = await createVariantPriceSet({
              container: appContainer,
              variantId: variant2.id,
              prices: [],
              rules: [],
            })

            const [priceList] = await pricingModule.createPriceLists([
              {
                title: "test price list",
                description: "test",
                ends_at: new Date(),
                starts_at: new Date(),
                status: PriceListStatus.ACTIVE,
                type: PriceListType.OVERRIDE,
                prices: [
                  {
                    amount: 5000,
                    currency_code: "usd",
                    price_set_id: priceSet.id,
                  },
                  {
                    amount: 6000,
                    currency_code: "usd",
                    price_set_id: priceSet2.id,
                  },
                ],
              },
            ])

            let response = await api.get(
              `/admin/products?price_list_id[]=${priceList.id}`,
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.count).toEqual(2)
            expect(response.data.products).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: product.id,
                  title: product.title,
                }),
                expect.objectContaining({
                  id: product2.id,
                  title: product2.title,
                }),
              ])
            )
          })

          it("should list all products constrained by search query in a price list", async () => {
            const priceSet = await createVariantPriceSet({
              container: appContainer,
              variantId: variant2.id,
              prices: [],
              rules: [],
            })

            const [priceList] = await pricingModule.createPriceLists([
              {
                title: "test price list",
                description: "test",
                ends_at: new Date(),
                starts_at: new Date(),
                status: PriceListStatus.ACTIVE,
                type: PriceListType.OVERRIDE,
                prices: [
                  {
                    amount: 5000,
                    currency_code: "usd",
                    price_set_id: priceSet.id,
                  },
                ],
              },
            ])

            let response = await api.get(
              `/admin/products?price_list_id[]=${priceList.id}&q=shouldnotreturnanything`,
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.count).toEqual(0)
            expect(response.data.products).toEqual([])

            response = await api.get(
              `/admin/products?price_list_id[]=${priceList.id}&q=uniquely`,
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.count).toEqual(1)
            expect(response.data.products).toEqual([
              expect.objectContaining({
                id: product2.id,
              }),
            ])
          })
        })
      })
    })
  },
})
