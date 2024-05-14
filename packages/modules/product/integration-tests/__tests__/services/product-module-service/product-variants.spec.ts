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
        productOne = await service.create({
          id: "product-1",
          title: "product 1",
          status: ProductTypes.ProductStatus.PUBLISHED,
          options: [
            {
              title: "size",
              values: ["large", "small"],
            },
            {
              title: "color",
              values: ["red", "blue"],
            },
          ],
        })

        productTwo = await service.create({
          id: "product-2",
          title: "product 2",
          status: ProductTypes.ProductStatus.PUBLISHED,
        })

        variantOne = await service.createVariants({
          id: "test-1",
          title: "variant 1",
          product_id: productOne.id,
          options: { size: "large" },
        })

        variantTwo = await service.createVariants({
          id: "test-2",
          title: "variant",
          product_id: productTwo.id,
        })
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

      describe("updateVariants", () => {
        it("should update the title of the variant successfully", async () => {
          await service.upsertVariants([
            {
              id: variantOne.id,
              title: "new test",
            },
          ])

          const productVariant = await service.retrieveVariant(variantOne.id)
          expect(productVariant.title).toEqual("new test")
        })

        it("should upsert the options of a variant successfully", async () => {
          await service.upsertVariants([
            {
              id: variantOne.id,
              options: { size: "small" },
            },
          ])

          const productVariant = await service.retrieveVariant(variantOne.id, {
            relations: ["options"],
          })
          expect(productVariant.options).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                value: "small",
              }),
            ])
          )
        })

        it("should do a partial update on the options of a variant successfully", async () => {
          await service.updateVariants(variantOne.id, {
            options: { size: "small", color: "red" },
          })

          const productVariant = await service.retrieveVariant(variantOne.id, {
            relations: ["options"],
          })

          expect(productVariant.options).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                value: "small",
              }),
              expect.objectContaining({
                value: "red",
              }),
            ])
          )
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.updateVariants("does-not-exist", {})
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `Cannot update non-existing variants with ids: does-not-exist`
          )
        })
      })

      describe("softDelete variant", () => {
        it("should soft delete a variant and its relations", async () => {
          const beforeDeletedVariants = await service.listVariants(
            { id: variantOne.id },
            {
              relations: ["options"],
            }
          )

          await service.softDeleteVariants([variantOne.id])
          const deletedVariants = await service.listVariants(
            { id: variantOne.id },
            {
              relations: ["options"],
              withDeleted: true,
            }
          )

          expect(deletedVariants).toHaveLength(1)
          expect(deletedVariants[0].deleted_at).not.toBeNull()

          for (const variantOption of deletedVariants[0].options) {
            expect(variantOption?.deleted_at).toBeNull()
          }
        })
      })
    })
  },
})
