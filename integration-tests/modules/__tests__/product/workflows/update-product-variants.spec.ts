import { updateProductVariantsWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IProductModuleService } from "@medusajs/types"
import { MedusaError, Modules } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer }) => {
    describe("Workflows: Update product variants", () => {
      let appContainer
      let service: IProductModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(Modules.PRODUCT)
      })

      describe("updateProductVariantsWorkflow", () => {
        beforeAll(() => {
          updateProductVariantsWorkflow.hooks.productVariantsUpdated(() => {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "product variants updated hook failed"
            )
          })
        })

        describe("invocation", () => {
          it("should not call listProductVariants when update array is empty", async () => {
            const workflow = updateProductVariantsWorkflow(appContainer)
            const listProductVariantsSpy = jest.spyOn(
              service,
              "listProductVariants"
            )

            const { result } = await workflow.run({
              input: { product_variants: [] },
              throwOnError: false,
            })

            expect(result).toHaveLength(0)

            expect(listProductVariantsSpy).not.toHaveBeenCalled()
            listProductVariantsSpy.mockRestore()
          })
        })
        describe("compensation", () => {
          it("should revert the updated variants using product_variants if the hook fails", async () => {
            const workflow = updateProductVariantsWorkflow(appContainer)

            const [product1, product2] = await service.createProducts([
              {
                title: "test1",
                variants: [
                  {
                    title: "variant1",
                    sku: "variant1",
                  },
                ],
              },
              {
                title: "test2",
                variants: [
                  {
                    title: "variant2",
                    sku: "variant2",
                  },
                ],
              },
            ])

            const { errors } = await workflow.run({
              input: {
                product_variants: [
                  {
                    id: product1.variants[0].id,
                    title: "variant1-updated",
                  },
                ],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "productVariantsUpdated",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `product variants updated hook failed`,
                }),
              },
            ])

            const products = await service.listProducts(
              {},
              {
                relations: ["variants"],
              }
            )

            expect(products).toHaveLength(2)
            expect(products).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  title: product1.title,
                  variants: [
                    expect.objectContaining({
                      title: product1.variants[0].title,
                      sku: product1.variants[0].sku,
                    }),
                  ],
                }),
                expect.objectContaining({
                  title: product2.title,
                  variants: [
                    expect.objectContaining({
                      title: product2.variants[0].title,
                      sku: product2.variants[0].sku,
                    }),
                  ],
                }),
              ])
            )
          })

          it("should revert the updated variants using selector/update if the hook fails", async () => {
            const workflow = updateProductVariantsWorkflow(appContainer)

            const [product1, product2] = await service.createProducts([
              {
                title: "test1",
                variants: [
                  {
                    title: "variant1",
                    sku: "variant1",
                  },
                ],
              },
              {
                title: "test2",
                variants: [
                  {
                    title: "variant2",
                    sku: "variant2",
                  },
                ],
              },
            ])

            const { errors } = await workflow.run({
              input: {
                selector: {
                  id: product1.variants[0].id,
                },
                update: {
                  title: "variant1-updated",
                },
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "productVariantsUpdated",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `product variants updated hook failed`,
                }),
              },
            ])

            const products = await service.listProducts(
              {},
              {
                relations: ["variants"],
              }
            )

            expect(products).toHaveLength(2)
            expect(products).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  title: product1.title,
                  variants: [
                    expect.objectContaining({
                      title: product1.variants[0].title,
                      sku: product1.variants[0].sku,
                    }),
                  ],
                }),
                expect.objectContaining({
                  title: product2.title,
                  variants: [
                    expect.objectContaining({
                      title: product2.variants[0].title,
                      sku: product2.variants[0].sku,
                    }),
                  ],
                }),
              ])
            )
          })
        })
      })
    })
  },
})
