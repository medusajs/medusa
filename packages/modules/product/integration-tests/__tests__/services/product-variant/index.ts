import {
  InternalModuleService,
  IProductModuleService,
  ProductTypes,
} from "@medusajs/types"
import { Collection } from "@mikro-orm/core"
import { Product, ProductOption, ProductTag, ProductVariant } from "@models"
import {
  createOptions,
  createProductAndTags,
  createProductVariants,
} from "../../../__fixtures__/product"
import { productsData, variantsData } from "../../../__fixtures__/product/data"
import { buildProductVariantOnlyData } from "../../../__fixtures__/variant/data/create-variant"

import { Modules } from "@medusajs/modules-sdk"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PRODUCT,
  testSuite: ({
    MikroOrmWrapper,
    medusaApp,
  }: SuiteOptions<IProductModuleService>) => {
    describe.skip("ProductVariant Service", () => {
      let variantOne: ProductVariant
      let variantTwo: ProductVariant
      let productOne: Product
      const productVariantTestOne = "test-1"
      let service: InternalModuleService<any>

      beforeEach(() => {
        service = medusaApp.modules["productService"].productVariantService_
      })

      describe("list", () => {
        beforeEach(async () => {
          const testManager = await MikroOrmWrapper.forkManager()

          productOne = testManager.create(Product, {
            id: "product-1",
            title: "product 1",
            status: ProductTypes.ProductStatus.PUBLISHED,
          })

          variantOne = testManager.create(ProductVariant, {
            id: productVariantTestOne,
            title: "variant 1",
            product: productOne,
          })

          variantTwo = testManager.create(ProductVariant, {
            id: "test-2",
            title: "variant",
            product: productOne,
          })

          await testManager.persistAndFlush([variantOne, variantTwo])
        })

        it("selecting by properties, scopes out the results", async () => {
          const results = await service.list({
            id: variantOne.id,
          })

          expect(results).toEqual([
            expect.objectContaining({
              id: variantOne.id,
              title: "variant 1",
            }),
          ])
        })

        it("passing a limit, scopes the result to the limit", async () => {
          const results = await service.list(
            {},
            {
              take: 1,
            }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: variantOne.id,
            }),
          ])
        })

        it("passing populate, scopes the results of the response", async () => {
          const results = await service.list(
            {
              id: productVariantTestOne,
            },
            {
              select: ["id", "title", "product.title"] as any,
              relations: ["product"],
            }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: productVariantTestOne,
              title: "variant 1",
              product: expect.objectContaining({
                id: "product-1",
                title: "product 1",
                tags: expect.any(Collection<ProductTag>),
                variants: expect.any(Collection<ProductVariant>),
              }),
            }),
          ])

          expect(JSON.parse(JSON.stringify(results))).toEqual([
            {
              id: productVariantTestOne,
              title: "variant 1",
              product: {
                id: "product-1",
                title: "product 1",
              },
            },
          ])
        })
      })

      describe("relation: options", () => {
        let products: Product[]
        let variants: ProductVariant[]
        let options: ProductOption[]

        beforeEach(async () => {
          const testManager = await MikroOrmWrapper.forkManager()

          products = (await createProductAndTags(
            testManager,
            productsData
          )) as Product[]
          variants = (await createProductVariants(
            testManager,
            variantsData
          )) as ProductVariant[]

          options = await createOptions(testManager, [
            {
              id: "test-option-1",
              title: "size",
              product: products[0],
              values: [
                {
                  id: "value-1",
                  value: "XS",
                  variant: products[0].variants[0],
                },
                {
                  id: "value-1",
                  value: "XL",
                  variant: products[0].variants[0],
                },
              ],
            },
            {
              id: "test-option-2",
              title: "color",
              product: products[0],
              value: "blue",
              variant: products[0].variants[0],
            },
          ])
        })

        it("filter by options relation", async () => {
          const variants = await service.list(
            { options: { id: ["value-1"] } },
            { relations: ["options"] }
          )

          expect(JSON.parse(JSON.stringify(variants))).toEqual([
            expect.objectContaining({
              id: productVariantTestOne,
              title: "variant title",
              sku: "sku 1",
            }),
          ])
        })
      })

      describe("create", function () {
        let products: Product[]
        let productOptions!: ProductOption[]

        beforeEach(async () => {
          const testManager = await MikroOrmWrapper.forkManager()

          products = (await createProductAndTags(
            testManager,
            productsData
          )) as Product[]

          productOptions = await createOptions(testManager, [
            {
              id: "test-option-1",
              title: "size",
              product: products[0],
            },
          ])
        })

        it("should create a variant", async () => {
          const data = buildProductVariantOnlyData({
            options: [
              {
                option: productOptions[0],
                value: "XS",
              },
            ],
          })

          const variants = await service.create(products[0].id, [data])

          expect(variants).toHaveLength(1)
          expect(variants[0].options).toHaveLength(1)

          expect(JSON.parse(JSON.stringify(variants[0]))).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: data.title,
              sku: data.sku,
              allow_backorder: false,
              manage_inventory: true,
              variant_rank: 0,
              product: expect.objectContaining({
                id: products[0].id,
              }),
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: data.options![0].value,
                }),
              ]),
            })
          )
        })
      })

      describe("retrieve", () => {
        beforeEach(async () => {
          const testManager = await MikroOrmWrapper.forkManager()

          productOne = testManager.create(Product, {
            id: "product-1",
            title: "product 1",
            status: ProductTypes.ProductStatus.PUBLISHED,
          })

          variantOne = testManager.create(ProductVariant, {
            id: productVariantTestOne,
            title: "variant 1",
            product: productOne,
          })

          await testManager.persistAndFlush([variantOne])
        })

        it("should return the requested variant", async () => {
          const result = await service.retrieve(variantOne.id)

          expect(result).toEqual(
            expect.objectContaining({
              id: productVariantTestOne,
              title: "variant 1",
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const result = await service.retrieve(variantOne.id, {
            select: ["id", "title", "product.title"] as any,
            relations: ["product"],
          })

          expect(result).toEqual(
            expect.objectContaining({
              id: productVariantTestOne,
              title: "variant 1",
              product_id: "product-1",
              product: expect.objectContaining({
                id: "product-1",
                title: "product 1",
              }),
            })
          )
        })

        it("should throw an error when a variant with ID does not exist", async () => {
          let error

          try {
            await service.retrieve("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductVariant with id: does-not-exist was not found"
          )
        })

        it("should throw an error when an id is not provided", async () => {
          let error

          try {
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("productVariant - id must be defined")
        })
      })
    })
  },
})
