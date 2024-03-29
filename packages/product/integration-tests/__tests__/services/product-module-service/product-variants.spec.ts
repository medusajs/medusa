import { Modules } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { Product, ProductVariant } from "@models"

import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PRODUCT,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IProductModuleService>) => {
    describe("ProductModuleService product variants", () => {
      let variantOne: ProductVariant
      let variantTwo: ProductVariant
      let productOne: Product
      let productTwo: Product

      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()

        productOne = testManager.create(Product, {
          id: "product-1",
          title: "product 1",
          status: ProductTypes.ProductStatus.PUBLISHED,
        })

        productTwo = testManager.create(Product, {
          id: "product-2",
          title: "product 2",
          status: ProductTypes.ProductStatus.PUBLISHED,
        })

        variantOne = testManager.create(ProductVariant, {
          id: "test-1",
          title: "variant 1",
          inventory_quantity: 10,
          product: productOne,
        })

        variantTwo = testManager.create(ProductVariant, {
          id: "test-2",
          title: "variant",
          inventory_quantity: 10,
          product: productTwo,
        })

        await testManager.persistAndFlush([variantOne, variantTwo])
      })

      describe("listAndCountVariants", () => {
        it("should return variants and count queried by ID", async () => {
          const results = await service.listAndCountVariants({
            id: variantOne.id,
          })

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: variantOne.id,
            }),
          ])
        })

        it("should return variants and count based on the options and filter parameter", async () => {
          let results = await service.listAndCountVariants(
            {
              id: variantOne.id,
            },
            {
              take: 1,
            }
          )

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: variantOne.id,
            }),
          ])

          results = await service.listAndCountVariants({}, { take: 1 })

          expect(results[1]).toEqual(2)

          results = await service.listAndCountVariants({}, { take: 1, skip: 1 })

          expect(results[1]).toEqual(2)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: variantTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for variants", async () => {
          const results = await service.listAndCountVariants(
            {
              id: variantOne.id,
            },
            {
              select: ["id", "title", "product.title"] as any,
              relations: ["product"],
            }
          )

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "variant 1",
              // TODO: investigate why this is returning more than the expected results
              product: expect.objectContaining({
                id: "product-1",
                title: "product 1",
              }),
            }),
          ])
        })
      })

      describe("retrieveVariant", () => {
        it("should return the requested variant", async () => {
          const result = await service.retrieveVariant(variantOne.id)

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              title: "variant 1",
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const result = await service.retrieveVariant(variantOne.id, {
            select: ["id", "title", "product.title"] as any,
            relations: ["product"],
          })

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              title: "variant 1",
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
            await service.retrieveVariant("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductVariant with id: does-not-exist was not found"
          )
        })
      })
    })
  },
})
