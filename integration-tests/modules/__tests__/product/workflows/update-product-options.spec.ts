import {
  createAndLinkProductOptionsToProductWorkflow,
  setProductProductOptionsWorkflow,
  setProductProductOptionsWorkflowId,
  updateProductOptionsWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  IFulfillmentModuleService,
  IProductModuleService,
} from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: Update product options", () => {
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

      describe("updateProductOptionsWorkflow", () => {
        it("should fail to remove an option value that is associated with a product", async () => {
          const workflow = updateProductOptionsWorkflow(appContainer)

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

          expect(option.values).toHaveLength(3)

          const { errors } = await workflow.run({
            input: {
              selector: { id: option.id },
              update: {
                values: ["S", "M"], // Removing "L"
              },
            },
            throwOnError: false,
          })

          expect(errors).toHaveLength(1)
          const error = errors[0].error

          expect(error.message).toContain(
            "Cannot delete product option values that are associated with products."
          )

          // Verify the option still has all values
          const updatedOption = await service.listProductOptions(
            {
              id: [option.id],
            },
            { relations: ["values"] }
          )
          expect(updatedOption[0].values).toHaveLength(3)
          expect(updatedOption[0].values.map((v) => v.value)).toEqual(
            expect.arrayContaining(["S", "M", "L"])
          )
        })

        it("should successfully remove option values that are not associated with products", async () => {
          const workflow = updateProductOptionsWorkflow(appContainer)

          const option = await service.createProductOptions({
            title: "Color",
            is_exclusive: false,
            values: ["Red", "Blue", "Green"],
          })

          expect(option.values).toHaveLength(3)

          await workflow.run({
            input: {
              selector: { id: option.id },
              update: {
                values: ["Red", "Blue"], // Removing "Green"
              },
            },
          })

          const updatedOption = await service.listProductOptions(
            {
              id: [option.id],
            },
            { relations: ["values"] }
          )
          expect(updatedOption[0].values).toHaveLength(2)
          expect(updatedOption[0].values.map((v) => v.value)).toEqual(
            expect.arrayContaining(["Red", "Blue"])
          )
        })

        it("should successfully update option values when adding new values and removing unassociated ones", async () => {
          const workflow = updateProductOptionsWorkflow(appContainer)

          // Create a product with an option that has some values
          const product = await service.createProducts({
            title: "Test Product",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Material",
                values: ["Cotton", "Polyester"],
              },
            ],
          })

          const option = product.options[0]

          // Create a standalone option with values that we'll update
          const standaloneOption = await service.createProductOptions({
            title: "Pattern",
            is_exclusive: false,
            values: ["Striped", "Solid"],
          })

          expect(standaloneOption.values).toHaveLength(2)

          // Update: remove "Solid", add "New"
          await workflow.run({
            input: {
              selector: { id: standaloneOption.id },
              update: {
                values: ["Striped", "New"],
              },
            },
          })

          const updatedOption = await service.listProductOptions(
            {
              id: [standaloneOption.id],
            },
            { relations: ["values"] }
          )
          expect(updatedOption[0].values).toHaveLength(2)
          expect(updatedOption[0].values.map((v) => v.value)).toEqual(
            expect.arrayContaining(["Striped", "New"])
          )

          const productOption = await service.listProductOptions(
            {
              id: [option.id],
            },
            { relations: ["values"] }
          )
          expect(productOption[0].values).toHaveLength(2)
        })
      })

      describe("setProductProductOptionsWorkflow", () => {
        it("should fail to assign an already linked exclusive option to another product", async () => {
          const workflow = setProductProductOptionsWorkflow(appContainer)

          const product = await service.createProducts({
            title: "Exclusive Product",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Size",
                values: ["S", "M"],
              },
            ],
          })

          const otherProduct = await service.createProducts({
            title: "Other Product",
            shipping_profile_id: shippingProfile.id,
          })

          const option = product.options[0]
          expect(option.is_exclusive).toBe(true)

          const { errors } = await workflow.run({
            input: {
              product_id: otherProduct.id,
              add: [option.id],
            },
            throwOnError: false,
          })

          expect(errors).toHaveLength(1)
          expect(errors[0].error.message).toContain(
            "Product options are already assigned to another product"
          )

          const [reloadedOtherProduct] = await service.listProducts(
            { id: [otherProduct.id] },
            { relations: ["options"] }
          )
          expect(reloadedOtherProduct.options ?? []).toHaveLength(0)
        })

        it("should fail when adding the same exclusive option to two products in a single call", async () => {
          const productA = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
          })

          const productB = await service.createProducts({
            title: "Product B",
            shipping_profile_id: shippingProfile.id,
          })

          const option = await service.createProductOptions({
            title: "Color",
            is_exclusive: true,
            values: ["Red"],
          })

          await expect(
            service.addProductOptionToProduct([
              {
                product_id: productA.id,
                product_option_id: option.id,
              },
              {
                product_id: productB.id,
                product_option_id: option.id,
              },
            ])
          ).rejects.toThrow(
            "Product options are already assigned to another product"
          )

          const products = await service.listProducts(
            { id: [productA.id, productB.id] },
            { relations: ["options"] }
          )
          products.forEach((product) => {
            expect(product.options ?? []).toHaveLength(0)
          })
        })

        it("should fail when adding duplicate option pairs in a single call", async () => {
          const product = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
          })

          const option = await service.createProductOptions({
            title: "Color",
            is_exclusive: false,
            values: ["Red", "Blue"],
          })

          await expect(
            service.addProductOptionToProduct([
              {
                product_id: product.id,
                product_option_id: option.id,
              },
              {
                product_id: product.id,
                product_option_id: option.id,
              },
            ])
          ).rejects.toThrow(
            "Duplicate product option assignments are not allowed"
          )

          const [reloadedProduct] = await service.listProducts(
            { id: [product.id] },
            { relations: ["options"] }
          )
          expect(reloadedProduct.options ?? []).toHaveLength(0)
        })

        it("should allow assigning a mixed exclusive and non-exclusive option in a single call", async () => {
          const productA = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
          })

          const productB = await service.createProducts({
            title: "Product B",
            shipping_profile_id: shippingProfile.id,
          })

          const exclusiveOption = await service.createProductOptions({
            title: "Size",
            is_exclusive: true,
            values: ["S", "M"],
          })

          const globalOption = await service.createProductOptions({
            title: "Color",
            is_exclusive: false,
            values: ["Red", "Blue"],
          })

          await service.addProductOptionToProduct([
            {
              product_id: productA.id,
              product_option_id: exclusiveOption.id,
            },
            {
              product_id: productA.id,
              product_option_id: globalOption.id,
            },
            {
              product_id: productB.id,
              product_option_id: globalOption.id,
            },
          ])

          const products = await service.listProducts(
            { id: [productA.id, productB.id] },
            { relations: ["options"] }
          )

          const productAOptions =
            products.find((product) => product.id === productA.id)?.options ??
            []
          const productBOptions =
            products.find((product) => product.id === productB.id)?.options ??
            []

          expect(productAOptions.map((option) => option.id)).toEqual(
            expect.arrayContaining([exclusiveOption.id, globalOption.id])
          )
          expect(productBOptions.map((option) => option.id)).toEqual(
            expect.arrayContaining([globalOption.id])
          )
          expect(productBOptions.map((option) => option.id)).not.toEqual(
            expect.arrayContaining([exclusiveOption.id])
          )
        })

        it("should allow assigning two non-exclusive options to multiple products in a single call", async () => {
          const productA = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
          })

          const productB = await service.createProducts({
            title: "Product B",
            shipping_profile_id: shippingProfile.id,
          })

          const firstOption = await service.createProductOptions({
            title: "Color",
            is_exclusive: false,
            values: ["Red", "Blue"],
          })

          const secondOption = await service.createProductOptions({
            title: "Material",
            is_exclusive: false,
            values: ["Cotton", "Wool"],
          })

          await service.addProductOptionToProduct([
            {
              product_id: productA.id,
              product_option_id: firstOption.id,
            },
            {
              product_id: productA.id,
              product_option_id: secondOption.id,
            },
            {
              product_id: productB.id,
              product_option_id: firstOption.id,
            },
            {
              product_id: productB.id,
              product_option_id: secondOption.id,
            },
          ])

          const products = await service.listProducts(
            { id: [productA.id, productB.id] },
            { relations: ["options"] }
          )

          products.forEach((product) => {
            expect(product.options ?? []).toHaveLength(2)
            expect(product.options?.map((option) => option.id)).toEqual(
              expect.arrayContaining([firstOption.id, secondOption.id])
            )
          })
        })

        it("should allow adding a non-exclusive option to another product after it is already linked", async () => {
          const productA = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
          })

          const productB = await service.createProducts({
            title: "Product B",
            shipping_profile_id: shippingProfile.id,
          })

          const globalOption = await service.createProductOptions({
            title: "Material",
            is_exclusive: false,
            values: ["Cotton", "Wool"],
          })

          await service.addProductOptionToProduct({
            product_id: productA.id,
            product_option_id: globalOption.id,
          })

          await service.addProductOptionToProduct({
            product_id: productB.id,
            product_option_id: globalOption.id,
          })

          const products = await service.listProducts(
            { id: [productA.id, productB.id] },
            { relations: ["options"] }
          )

          products.forEach((product) => {
            expect(product.options).toHaveLength(1)
            expect(product.options?.[0].id).toBe(globalOption.id)
          })
        })

        it("should add an option link with the provided value ids", async () => {
          const product = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
          })

          const option = await service.createProductOptions({
            title: "Material",
            is_exclusive: false,
            values: ["Cotton", "Wool", "Linen"],
          })

          const valueToLink = option.values.find(
            (value) => value.value === "Cotton"
          )!

          await service.addProductOptionToProduct({
            product_id: product.id,
            product_option_id: option.id,
            product_option_value_ids: [valueToLink.id],
          })

          const [reloadedProduct] = await service.listProducts(
            { id: [product.id] },
            { relations: ["options.values"] }
          )

          const linkedValues = reloadedProduct.options[0].values.map(
            (value) => value.value
          )

          expect(linkedValues).toHaveLength(1)
          expect(linkedValues).toEqual(expect.arrayContaining(["Cotton"]))
        })

        it("should throw when adding an already linked option", async () => {
          const product = await service.createProducts({
            title: "Product A",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Size",
                values: ["S", "M", "L"],
              },
            ],
          })

          const option = product.options[0]

          await expect(
            service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
              product_option_value_ids: [option.values[0].id],
            })
          ).rejects.toThrow("Product options are already linked to products")
        })

        describe("compensation", () => {
          it("should restore only the linked option values after a failed removal", async () => {
            const workflow = setProductProductOptionsWorkflow(appContainer)

            workflow.appendAction("throw", setProductProductOptionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
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
            })

            const option = product.options[0]
            const valueToRemove = option.values?.find(
              (value) => value.value === "L"
            )

            await service.updateProductOptionValuesOnProduct({
              product_id: product.id,
              product_option_id: option.id,
              remove: [valueToRemove!.id],
            })

            const [productWithPartialValues] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            const initialValues =
              productWithPartialValues.options[0].values.map(
                (value) => value.value
              )

            expect(initialValues).toHaveLength(2)
            expect(initialValues).toEqual(expect.arrayContaining(["S", "M"]))

            const { errors } = await workflow.run({
              input: {
                product_id: product.id,
                remove: [option.id],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const [compensatedProduct] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            const compensatedValues = compensatedProduct.options[0].values.map(
              (value) => value.value
            )

            expect(compensatedValues).toHaveLength(2)
            expect(compensatedValues).toEqual(
              expect.arrayContaining(["S", "M"])
            )
          })

          it("should remove newly added values after a failed update", async () => {
            const workflow = setProductProductOptionsWorkflow(appContainer)

            workflow.appendAction("throw", setProductProductOptionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const product = await service.createProducts({
              title: "Test Product",
              shipping_profile_id: shippingProfile.id,
              options: [
                {
                  title: "Size",
                  values: ["S"],
                },
              ],
            })

            const option = product.options[0]

            const { errors } = await workflow.run({
              input: {
                product_id: product.id,
                update: [
                  {
                    product_option_id: option.id,
                    add: [{ value: "M" }],
                  },
                ],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const [compensatedProduct] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            const compensatedValues = compensatedProduct.options[0].values.map(
              (value) => value.value
            )

            expect(compensatedValues).toHaveLength(1)
            expect(compensatedValues).toEqual(expect.arrayContaining(["S"]))
          })

          it("should not invert no-op updates when compensating", async () => {
            const workflow = setProductProductOptionsWorkflow(appContainer)

            workflow.appendAction("throw", setProductProductOptionsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
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
            })

            const option = product.options[0]
            const valueToRemove = option.values?.find(
              (value) => value.value === "L"
            )
            const valueToRemoveExisting = option.values?.find(
              (value) => value.value === "S"
            )
            const valueToKeep = option.values?.find(
              (value) => value.value === "M"
            )

            await service.updateProductOptionValuesOnProduct({
              product_id: product.id,
              product_option_id: option.id,
              remove: [valueToRemove!.id],
            })

            const [productWithPartialValues] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            const initialValues =
              productWithPartialValues.options[0].values.map(
                (value) => value.value
              )

            expect(initialValues).toHaveLength(2)
            expect(initialValues).toEqual(expect.arrayContaining(["S", "M"]))

            const { errors } = await workflow.run({
              input: {
                product_id: product.id,
                update: [
                  {
                    product_option_id: option.id,
                    add: [valueToKeep!.id],
                    remove: [valueToRemove!.id, valueToRemoveExisting!.id],
                  },
                ],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const [compensatedProduct] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            const compensatedValues = compensatedProduct.options[0].values.map(
              (value) => value.value
            )

            expect(compensatedValues).toHaveLength(2)
            expect(compensatedValues).toEqual(
              expect.arrayContaining(["S", "M"])
            )
          })
        })
      })

      describe("createAndLinkProductOptionsToProductWorkflow", () => {
        it("should create and link option values with update.add", async () => {
          const workflow =
            createAndLinkProductOptionsToProductWorkflow(appContainer)

          const product = await service.createProducts({
            title: "Exclusive Option Product",
            shipping_profile_id: shippingProfile.id,
            options: [
              {
                title: "Size",
                values: ["S"],
              },
            ],
          })

          const option = product.options[0]
          const existingValueId = option.values[0].id

          await workflow.run({
            input: {
              product_id: product.id,
              update: [
                {
                  product_option_id: option.id,
                  add: [existingValueId, { value: "M" }], // this is a way to add a value to an existing option
                },
              ],
            },
          })

          const [reloadedProduct] = await service.listProducts(
            { id: [product.id] },
            { relations: ["options.values"] }
          )

          const linkedValues = reloadedProduct.options[0].values.map(
            (value) => value.value
          )

          expect(linkedValues).toHaveLength(2)
          expect(linkedValues).toEqual(expect.arrayContaining(["S", "M"]))

          const [reloadedOption] = await service.listProductOptions(
            { id: [option.id] },
            { relations: ["values"] }
          )

          const optionValues = reloadedOption.values.map((value) => value.value)
          expect(optionValues).toHaveLength(2)
          expect(optionValues).toEqual(expect.arrayContaining(["S", "M"]))
        })

        // todo: should we consider only allowing creation of new values for non-exclusive options with this product sepcific flow?
        it("should create values for non-exclusive options", async () => {
          const workflow =
            createAndLinkProductOptionsToProductWorkflow(appContainer)

          const product = await service.createProducts({
            title: "Global Option Product",
            shipping_profile_id: shippingProfile.id,
          })

          const option = await service.createProductOptions({
            title: "Material",
            is_exclusive: false,
            values: ["Cotton"],
          })

          await workflow.run({
            input: {
              product_id: product.id,
              add: [
                {
                  id: option.id,
                  value_ids: [option.values[0].id],
                },
              ],
              update: [
                {
                  product_option_id: option.id,
                  add: [{ value: "Wool" }],
                },
              ],
            },
          })

          const [reloadedOption] = await service.listProductOptions(
            { id: [option.id] },
            { relations: ["values"] }
          )
          expect(reloadedOption.values).toHaveLength(2)
          expect(reloadedOption.values.map((value) => value.value)).toEqual(
            expect.arrayContaining(["Cotton", "Wool"])
          )

          const [reloadedProduct] = await service.listProducts(
            { id: [product.id] },
            { relations: ["options.values"] }
          )
          const productOption = reloadedProduct.options.find(
            (productOption) => productOption.id === option.id
          )
          expect(productOption?.values.map((value) => value.value)).toEqual(
            expect.arrayContaining(["Cotton", "Wool"])
          )
        })

        it("should merge created values when adding an exclusive option with value ids", async () => {
          const workflow =
            createAndLinkProductOptionsToProductWorkflow(appContainer)

          const product = await service.createProducts({
            title: "Merge Values Product",
            shipping_profile_id: shippingProfile.id,
          })

          const option = await service.createProductOptions({
            title: "Size",
            is_exclusive: true,
            values: ["S"],
          })

          await workflow.run({
            input: {
              product_id: product.id,
              add: [
                {
                  id: option.id,
                  value_ids: [option.values[0].id],
                },
                {
                  // add new option
                  title: "Material",
                  is_exclusive: true,
                  values: ["Cotton"],
                },
              ],
              update: [
                {
                  product_option_id: option.id,
                  add: [{ value: "M" }], // add new value for Size
                },
              ],
            },
          })

          const [reloadedProduct] = await service.listProducts(
            { id: [product.id] },
            { relations: ["options.values"] }
          )

          const linkedOption = reloadedProduct.options.find(
            (productOption) => productOption.id === option.id
          )
          const materialOption = reloadedProduct.options.find(
            (productOption) => productOption.title === "Material"
          )

          const linkedValues = linkedOption?.values.map((value) => value.value)

          expect(linkedOption).toBeTruthy()
          expect(linkedValues).toHaveLength(2)
          expect(linkedValues).toEqual(expect.arrayContaining(["S", "M"]))
          expect(materialOption).toBeTruthy()
          expect(materialOption?.values.map((value) => value.value)).toEqual(
            expect.arrayContaining(["Cotton"])
          )
        })
      })
    })
  },
})
