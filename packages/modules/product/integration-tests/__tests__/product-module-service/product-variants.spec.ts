import {
  CreateProductDTO,
  CreateProductVariantDTO,
  IProductModuleService,
  ProductDTO,
  ProductVariantDTO,
  UpdateProductVariantDTO,
} from "@medusajs/framework/types"
import {
  CommonEvents,
  composeMessage,
  Modules,
  ProductEvents,
  ProductStatus,
} from "@medusajs/framework/utils"

import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  testSuite: ({ service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("ProductModuleService product variants", () => {
      let variantOne: ProductVariantDTO
      let variantTwo: ProductVariantDTO
      let productOne: ProductDTO
      let productTwo: ProductDTO

      beforeEach(async () => {
        productOne = await service.createProducts({
          id: "product-1",
          title: "product 1",
          status: ProductStatus.PUBLISHED,
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
        } as CreateProductDTO)

        productTwo = await service.createProducts({
          id: "product-2",
          title: "product 2",
          status: ProductStatus.PUBLISHED,
        } as CreateProductDTO)

        variantOne = await service.createProductVariants({
          id: "test-1",
          title: "variant 1",
          product_id: productOne.id,
          options: { size: "large", color: "red" },
        } as CreateProductVariantDTO)

        variantTwo = await service.createProductVariants({
          id: "test-2",
          title: "variant",
          product_id: productTwo.id,
        } as CreateProductVariantDTO)

        jest.clearAllMocks()
      })

      describe("listAndCountVariants", () => {
        it("should return variants and count queried by ID", async () => {
          const results = await service.listAndCountProductVariants({
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
          let results = await service.listAndCountProductVariants(
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

          results = await service.listAndCountProductVariants({}, { take: 1 })

          expect(results[1]).toEqual(2)

          results = await service.listAndCountProductVariants(
            {},
            { take: 1, skip: 1 }
          )

          expect(results[1]).toEqual(2)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: variantTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for variants", async () => {
          const results = await service.listAndCountProductVariants(
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
          const result = await service.retrieveProductVariant(variantOne.id)

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              title: "variant 1",
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const result = await service.retrieveProductVariant(variantOne.id, {
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
            await service.retrieveProductVariant("does-not-exist")
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
          await service.upsertProductVariants([
            {
              id: variantOne.id,
              title: "new test",
            },
          ])

          const productVariant = await service.retrieveProductVariant(
            variantOne.id
          )
          expect(productVariant.title).toEqual("new test")

          expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
          expect(eventBusEmitSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_VARIANT_UPDATED, {
                data: { id: variantOne.id },
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should do a partial update on the options of a variant successfully", async () => {
          await service.updateProductVariants(variantOne.id, {
            options: { size: "small", color: "red" },
          })

          const productVariant = await service.retrieveProductVariant(
            variantOne.id,
            {
              relations: ["options"],
            }
          )

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
            await service.updateProductVariants("does-not-exist", {})
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `Cannot update non-existing variants with ids: does-not-exist`
          )
        })
      })

      describe("createVariants", () => {
        it("should create variants successfully", async () => {
          jest.clearAllMocks()

          const data: CreateProductVariantDTO = {
            title: "variant 3",
            product_id: productOne.id,
            options: { size: "small", color: "blue" },
          }

          const variant = await service.createProductVariants(data)

          expect(variant).toEqual(
            expect.objectContaining({
              title: "variant 3",
              product_id: productOne.id,
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "small",
                }),
                expect.objectContaining({
                  value: "blue",
                }),
              ]),
            })
          )

          expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
          expect(eventBusEmitSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_VARIANT_CREATED, {
                data: { id: variant.id },
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should correctly associate variants with own product options", async () => {
          jest.clearAllMocks()
          const productThree = await service.createProducts({
            id: "product-3",
            title: "product 3",
            status: ProductStatus.PUBLISHED,
            options: [
              {
                title: "size",
                values: ["large", "small"],
              },
              {
                title: "color",
                values: ["red", "yellow"],
              },
            ],
          } as CreateProductDTO)

          const data: CreateProductVariantDTO[] = [
            {
              title: "new variant",
              product_id: productOne.id,
              options: { size: "small", color: "red" },
            },
            {
              title: "new variant",
              product_id: productThree.id,
              options: { size: "small", color: "yellow" },
            },
          ]

          const variants = await service.createProductVariants(data)

          expect(variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: "new variant",
                product_id: productOne.id,
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: productOne.options
                      .find((o) => o.title === "size")
                      ?.values?.find((v) => v.value === "small")?.id,
                    value: "small",
                  }),
                  expect.objectContaining({
                    id: productOne.options
                      .find((o) => o.title === "color")
                      ?.values?.find((v) => v.value === "red")?.id,
                    value: "red",
                  }),
                ]),
              }),
              expect.objectContaining({
                title: "new variant",
                product_id: productThree.id,
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: productThree.options
                      .find((o) => o.title === "size")
                      ?.values?.find((v) => v.value === "small")?.id,
                    value: "small",
                  }),
                  expect.objectContaining({
                    id: productThree.options
                      .find((o) => o.title === "color")
                      ?.values?.find((v) => v.value === "yellow")?.id,
                    value: "yellow",
                  }),
                ]),
              }),
            ])
          )
        })

        it("should throw if there is an existing variant with same options combination", async () => {
          let error

          const productFour = await service.createProducts({
            id: "product-4",
            title: "product 4",
            status: ProductStatus.PUBLISHED,
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
          } as CreateProductDTO)

          const data: CreateProductVariantDTO[] = [
            {
              title: "new variant",
              product_id: productFour.id,
              options: { size: "small", color: "red" },
            },
          ]

          const [variant] = await service.createProductVariants(data)

          expect(variant).toEqual(
            expect.objectContaining({
              title: "new variant",
              product_id: productFour.id,
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: productFour.options
                    .find((o) => o.title === "size")
                    ?.values?.find((v) => v.value === "small")?.id,
                  value: "small",
                }),
                expect.objectContaining({
                  id: productFour.options
                    .find((o) => o.title === "color")
                    ?.values?.find((v) => v.value === "red")?.id,
                  value: "red",
                }),
              ]),
            })
          )

          try {
            await service.createProductVariants([
              {
                title: "new variant",
                product_id: productFour.id,
                options: { size: "small", color: "red" },
              },
            ] as CreateProductVariantDTO[])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `Variant (${variant.title}) with provided options already exists.`
          )
        })

        it("should throw if there is an existing variant with same options combination (on update)", async () => {
          const productFour = await service.createProducts({
            id: "product-4",
            title: "product 4",
            status: ProductStatus.PUBLISHED,
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
            variants: [
              {
                title: "new variant 1",
                options: { size: "small", color: "red" },
              },
              {
                title: "new variant 2",
                options: { size: "small", color: "blue" },
              },
            ],
          } as CreateProductDTO)

          const error = await service
            .updateProductVariants(
              productFour.variants.find((v) => v.title === "new variant 2")!.id,
              {
                options: { size: "small", color: "red" },
              } as UpdateProductVariantDTO
            )
            .catch((err) => err)

          expect(error.message).toEqual(
            `Variant (new variant 1) with provided options already exists.`
          )
        })
      })

      describe("softDelete variant", () => {
        it("should soft delete a variant and its relations", async () => {
          const beforeDeletedVariants = await service.listProductVariants(
            { id: variantOne.id },
            {
              relations: ["options"],
            }
          )

          await service.softDeleteProductVariants([variantOne.id])
          const deletedVariants = await service.listProductVariants(
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
