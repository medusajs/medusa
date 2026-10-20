import { deleteProductsWorkflow } from "@medusajs/core-flows"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  IFulfillmentModuleService,
  IProductModuleService,
} from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: Delete products", () => {
      let appContainer
      let service: IProductModuleService
      let fulfillmentService: IFulfillmentModuleService
      let shippingProfile

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(Modules.PRODUCT)
        fulfillmentService = appContainer.resolve(Modules.FULFILLMENT)
      })

      beforeEach(async () => {
        shippingProfile = await fulfillmentService.createShippingProfiles({
          name: "Test",
          type: "default",
        })
      })

      describe("deleteProductsWorkflow", () => {
        it("should delete exclusive option when deleting its only associated product", async () => {
          const workflow = deleteProductsWorkflow(appContainer)

          const product = await service.createProducts({
            title: "Test Product",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Size",
                values: ["S", "M", "L"],
              },
            ],
          })

          const option = product.options[0]

          expect(option.is_exclusive).toBe(true)

          await workflow.run({
            input: {
              ids: [product.id],
            },
          })

          const options = await service.listProductOptions({ id: [option.id] })
          expect(options).toHaveLength(0)
        })

        it("should not delete non-exclusive option when deleting a product", async () => {
          const workflow = deleteProductsWorkflow(appContainer)

          const globalOption = await service.createProductOptions({
            title: "Color",
            is_exclusive: false,
            values: ["Red", "Blue"],
          })

          expect(globalOption.is_exclusive).toBe(false)

          // Create a product and associate the global option
          const product = await service.createProducts({
            title: "Test Product",
            shipping_profile_id: shippingProfile.id,
          })

          await service.addProductOptionToProduct({
            product_id: product.id,
            product_option_id: globalOption.id,
          })

          await workflow.run({
            input: {
              ids: [product.id],
            },
          })

          const options = await service.listProductOptions({
            id: [globalOption.id],
          })
          expect(options).toHaveLength(1)
          expect(options[0].id).toBe(globalOption.id)
        })

        it("should delete exclusive option but keep non-exclusive option when deleting a product", async () => {
          const workflow = deleteProductsWorkflow(appContainer)

          const globalOption = await service.createProductOptions({
            title: "Material",
            is_exclusive: false,
            values: ["Cotton", "Polyester"],
          })

          const product = await service.createProducts({
            title: "Test Product",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Size",
                values: ["S", "M", "L"],
              },
            ],
            variants: [
              {
                title: "Small",
                options: {
                  Size: "S",
                },
              },
            ],
          })

          const exclusiveOption = product.options[0]
          expect(exclusiveOption.is_exclusive).toBe(true)

          await service.addProductOptionToProduct({
            product_id: product.id,
            product_option_id: globalOption.id,
          })

          await workflow.run({
            input: {
              ids: [product.id],
            },
          })

          const exclusiveOptions = await service.listProductOptions({
            id: [exclusiveOption.id],
          })
          expect(exclusiveOptions).toHaveLength(0)

          const nonExclusiveOptions = await service.listProductOptions({
            id: [globalOption.id],
          })
          expect(nonExclusiveOptions).toHaveLength(1)
          expect(nonExclusiveOptions[0].id).toBe(globalOption.id)
        })

        it("should restore options and product data when a failure step is added at the end", async () => {
          const product = await service.createProducts({
            title: "Test Product",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Size",
                values: ["S", "M", "L"],
              },
            ],
            variants: [
              {
                title: "Small",
                options: {
                  Size: "S",
                },
              },
            ],
          })

          const option = product.options[0]
          expect(option.is_exclusive).toBe(true)

          const failStep = createStep("throw", async () => {
            throw new Error(`Failed after product deletion`)
          })
          const failingWorkflow = createWorkflow(
            "test-delete-products-then-fail",
            (input: { ids: string[] }) => {
              const result = deleteProductsWorkflow.runAsStep({ input })
              failStep(result)
              return new WorkflowResponse(result)
            }
          )
          await appContainer
            .resolve(Modules.WORKFLOW_ENGINE)
            .registerWorkflows([failingWorkflow])

          const { errors } = await failingWorkflow(appContainer).run({
            input: {
              ids: [product.id],
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "throw",
              handlerType: "invoke",
              error: expect.objectContaining({
                message: `Failed after product deletion`,
              }),
            },
          ])

          const restoredProducts = await service.listProducts(
            {
              id: [product.id],
            },
            {
              relations: ["options", "options.values", "variants"],
            }
          )
          expect(restoredProducts).toHaveLength(1)
          expect(restoredProducts[0].id).toBe(product.id)
          expect(restoredProducts[0].deleted_at).toBeNull()

          expect(restoredProducts[0].variants).toHaveLength(1)

          expect(restoredProducts[0].options).toHaveLength(1)
          expect(restoredProducts[0].options[0].id).toBe(option.id)
          expect(
            restoredProducts[0].options[0].values.map((v) => v.id)
          ).toEqual(expect.arrayContaining(option.values.map((v) => v.id)))

          const restoredOptions = await service.listProductOptions({
            id: [option.id],
          })
          expect(restoredOptions).toHaveLength(1)
          expect(restoredOptions[0].id).toBe(option.id)
          expect(restoredOptions[0].deleted_at).toBeNull()
        })
      })
    })
  },
})
