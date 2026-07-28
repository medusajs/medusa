import {
  createAndLinkProductOptionsToProductWorkflow,
  setProductProductOptionsWorkflow,
  setProductProductOptionsWorkflowId,
  updateProductOptionsWorkflow,
  updateProductsWorkflow,
  updateProductsWorkflowId,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  IFulfillmentModuleService,
  IPricingModuleService,
  IProductModuleService,
} from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { asValue } from "awilix"

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

      describe("updateProductsWorkflow", () => {
        describe("compensation", () => {
          it("restores and re-links an exclusive option orphaned by an option_ids change on rollback", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const product = await service.createProducts({
              title: "Test Product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M", "L"] }],
            })
            const sizeOption = product.options[0]

            // A separate global option the update will link in place of the
            // product's exclusive option.
            const globalOption = await service.createProductOptions({
              title: "Color",
              values: ["Red"],
              is_exclusive: false,
            })

            const { errors } = await workflow.run({
              input: {
                products: [{ id: product.id, option_ids: [globalOption.id] }],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: `Fail` }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            // The exclusive "Size" option is restored and re-linked with its
            // exact prior values (product↔option and product↔option↔value).
            const restoredSize = compensated.options.find(
              (option) => option.title === "Size"
            )
            expect(restoredSize).toBeTruthy()
            expect(restoredSize?.id).toEqual(sizeOption.id)
            expect(
              restoredSize?.values.map((value) => value.value).sort()
            ).toEqual(["L", "M", "S"])

            // The option the update linked is rolled back off the product.
            expect(
              compensated.options.find((option) => option.title === "Color")
            ).toBeFalsy()

            // The restored option is live, not left soft-deleted.
            const sizeOptions = await service.listProductOptions({
              id: [sizeOption.id],
            })
            expect(sizeOptions).toHaveLength(1)
          })

          it("restores option links before compensating prior variants", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Option and variant rollback product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })

            const { errors } = await workflow.run({
              input: {
                products: [
                  {
                    id: product.id,
                    option_ids: [],
                    variants: [],
                  },
                ],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )
            expect(compensated.options[0]).toEqual(
              expect.objectContaining({ title: "Size" })
            )
            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Small",
                options: [expect.objectContaining({ value: "S" })],
              })
            )
          })

          it("re-links a dropped option with the product's prior value subset, not all the option's values, on rollback", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            // A global option with three values; the product links to only two.
            const globalOption = await service.createProductOptions({
              title: "Material",
              values: ["Cotton", "Wool", "Linen"],
              is_exclusive: false,
            })
            const subsetValueIds = globalOption.values
              .filter((value) => ["Cotton", "Wool"].includes(value.value))
              .map((value) => value.id)

            const product = await service.createProducts({
              title: "Test Product",
              shipping_profile_id: shippingProfile.id,
            })

            await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: globalOption.id,
              product_option_value_ids: subsetValueIds,
            })

            // Drop the option via the update, then fail so it compensates.
            const { errors } = await workflow.run({
              input: { products: [{ id: product.id, option_ids: [] }] },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: `Fail` }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )

            const material = compensated.options.find(
              (option) => option.title === "Material"
            )
            expect(material).toBeTruthy()
            // Only the product's prior subset is restored — NOT "Linen", which
            // the product never linked. (A blanket re-link by option_ids would
            // wrongly restore all three values.)
            expect(material?.values.map((value) => value.value).sort()).toEqual(
              ["Cotton", "Wool"]
            )
          })

          it("does not restore an empty-subset option soft-deleted before compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            const option = await service.createProductOptions({
              title: "Empty subset option",
              values: ["Unlinked"],
              is_exclusive: false,
            })
            const product = await service.createProducts({
              title: "Empty subset product",
              shipping_profile_id: shippingProfile.id,
            })
            await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
              product_option_value_ids: [],
            })

            const [linkedProduct] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )
            expect(
              linkedProduct.options.find(
                (productOption) => productOption.id === option.id
              )?.values
            ).toEqual([])

            workflow.appendAction(
              "soft-delete-and-throw",
              updateProductsWorkflowId,
              {
                invoke: async function failStep() {
                  await (service as any).softDeleteProductOptions(option.id)
                  throw new Error("Fail")
                },
              }
            )

            const { errors } = await workflow.run({
              input: { products: [{ id: product.id, option_ids: [] }] },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "soft-delete-and-throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )
            expect(
              compensated.options.some(
                (productOption) => productOption.id === option.id
              )
            ).toBe(false)
            expect(
              await service.listProductOptions({ id: [option.id] })
            ).toHaveLength(0)
          })

          it("restores discountable after compensating an is_giftcard update", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Gift card compensation product",
              shipping_profile_id: shippingProfile.id,
              is_giftcard: false,
              discountable: true,
            })

            const { errors } = await workflow.run({
              input: {
                products: [{ id: product.id, is_giftcard: true }],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const compensated = await service.retrieveProduct(product.id)
            expect(compensated).toEqual(
              expect.objectContaining({
                is_giftcard: false,
                discountable: true,
              })
            )
          })

          it("preserves concurrent values added to a retained option during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Retained option product",
              shipping_profile_id: shippingProfile.id,
              options: [
                { title: "Size", values: ["S"] },
                { title: "Material", values: ["Cotton"] },
              ],
            })
            const retainedOption = product.options.find(
              (option) => option.title === "Size"
            )!
            const droppedOption = product.options.find(
              (option) => option.title === "Material"
            )!
            const replacementOption = await service.createProductOptions({
              title: "Color",
              values: ["Red"],
              is_exclusive: false,
            })
            const concurrentOption = await service.createProductOptions({
              title: "Pattern",
              values: ["Striped"],
              is_exclusive: false,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentValueAdded = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!concurrentValueAdded) {
                  concurrentValueAdded = true
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: retainedOption.id,
                    add: [{ value: "M" }],
                  })
                  await service.addProductOptionToProduct({
                    product_id: product.id,
                    product_option_id: concurrentOption.id,
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_ids: [retainedOption.id, replacementOption.id],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )
            const retained = compensated.options.find(
              (option) => option.id === retainedOption.id
            )

            expect(retained?.values.map((value) => value.value).sort()).toEqual(
              ["M", "S"]
            )
            expect(
              compensated.options.some(
                (option) => option.id === droppedOption.id
              )
            ).toBe(true)
            expect(
              compensated.options.some(
                (option) => option.id === replacementOption.id
              )
            ).toBe(false)
            expect(
              compensated.options.some(
                (option) => option.id === concurrentOption.id
              )
            ).toBe(true)
          })

          it("preserves a forward-added option when its value links change concurrently", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Concurrent forward option product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S"] }],
            })
            const sizeOption = product.options[0]
            const colorOption = await service.createProductOptions({
              title: "Color",
              values: ["Red"],
              is_exclusive: false,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentValueAdded = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!concurrentValueAdded) {
                  concurrentValueAdded = true
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: colorOption.id,
                    add: [{ value: "Blue" }],
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_ids: [sizeOption.id, colorOption.id],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values"] }
            )
            const compensatedColor = compensated.options.find(
              (option) => option.id === colorOption.id
            )

            expect(compensatedColor).toBeTruthy()
            expect(
              compensatedColor?.values.map((value) => value.value).sort()
            ).toEqual(["Blue", "Red"])
          })

          it("preserves a concurrently removed shared option during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const option = await service.createProductOptions({
              title: "Size",
              values: ["S", "L"],
              is_exclusive: false,
            })
            const product = await service.createProducts({
              title: "Original title",
              shipping_profile_id: shippingProfile.id,
            })
            await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
              product_option_value_ids: option.values.map((value) => value.id),
            })
            const variant = await service.createProductVariants({
              title: "Small",
              product_id: product.id,
              options: { Size: "S" },
            })
            const sizeS = option.values.find((value) => value.value === "S")!
            const upsertProducts = service.upsertProducts.bind(service)
            let optionRemoved = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!optionRemoved) {
                  optionRemoved = true
                  await service.updateProducts(product.id, {
                    option_ids: [],
                    variants: [],
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      title: "Forward title",
                      option_value_updates: [
                        {
                          product_option_id: option.id,
                          remove: [sizeS.id],
                        },
                      ],
                      variants: [
                        {
                          id: variant.id,
                          title: "Large",
                          options: { Size: "L" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )
            expect(compensated).toEqual(
              expect.objectContaining({
                title: "Original title",
                options: [],
                variants: [],
              })
            )
          })

          it("restores variants and linked option values after a later workflow failure", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Atomic option value product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]
            const sizeS = option.values.find((value) => value.value === "S")!

            const upsertProductsSpy = jest.spyOn(service, "upsertProducts")
            const valueLinkUpdateSpy = jest.spyOn(
              service,
              "updateProductOptionValuesOnProduct"
            )
            let upsertProductCalls: any[] = []
            let valueLinkUpdateCallCount = 0

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_value_updates: [
                        {
                          product_option_id: option.id,
                          add: [{ value: " L " }],
                          remove: [sizeS.id],
                        },
                      ],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: product.variants[0].title,
                          options: { Size: "L" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => {
                upsertProductCalls = [...upsertProductsSpy.mock.calls]
                valueLinkUpdateCallCount = valueLinkUpdateSpy.mock.calls.length
                upsertProductsSpy.mockRestore()
                valueLinkUpdateSpy.mockRestore()
              })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const compensationCall = upsertProductCalls.find(
              ([, context]) => (context as any)?.variantUpdateCondition
            )
            expect(compensationCall?.[0][0].option_value_updates).toEqual([
              {
                product_option_id: option.id,
                add: [sizeS.id],
                remove: [expect.any(String)],
              },
            ])
            expect(
              (compensationCall?.[1] as any)?.optionValueUpdateExpectedRemovals
            ).toEqual([
              expect.objectContaining({
                product_id: product.id,
                product_option_id: option.id,
                value_id: expect.any(String),
                link_id: expect.any(String),
              }),
            ])
            expect(valueLinkUpdateCallCount).toBe(0)

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(
              compensated.options[0].values.map((value) => value.value).sort()
            ).toEqual(["M", "S"])
            expect(compensated.variants[0].options).toEqual([
              expect.objectContaining({ value: "S" }),
            ])
            expect(
              await service.listProductOptionValues({
                option_id: option.id,
                value: "L",
              })
            ).toHaveLength(0)
          })

          it("restores selector-updated variant options when update entries omit options", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Selector option value product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]

            const { errors } = await workflow.run({
              input: {
                selector: { id: product.id },
                update: {
                  option_value_updates: [
                    {
                      product_option_id: option.id,
                      add: [{ value: "L" }],
                    },
                  ],
                  variants: [
                    {
                      id: product.variants[0].id,
                      title: "Updated small",
                    },
                  ],
                },
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(
              compensated.options[0].values.map((value) => value.value).sort()
            ).toEqual(["M", "S"])
            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Small",
                options: [expect.objectContaining({ value: "S" })],
              })
            )
          })

          it("preserves concurrent product fields during selector compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Original product title",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentUpdateApplied = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!concurrentUpdateApplied) {
                  concurrentUpdateApplied = true
                  await service.updateProducts(product.id, {
                    title: "Concurrent product title",
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  selector: { id: product.id },
                  update: {
                    option_value_updates: [
                      {
                        product_option_id: option.id,
                        add: [{ value: "L" }],
                      },
                    ],
                    variants: [
                      {
                        id: product.variants[0].id,
                        title: "Large",
                        options: { Size: "L" },
                      },
                    ],
                  },
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(compensated.title).toBe("Concurrent product title")
            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Small",
                options: [expect.objectContaining({ value: "S" })],
              })
            )
          })

          it("preserves a concurrent title update when compensating a batch variant update", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Original batch product title",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentTitleApplied = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!concurrentTitleApplied) {
                  concurrentTitleApplied = true
                  await service.updateProducts(product.id, {
                    title: "Concurrent batch product title",
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: "Medium",
                          options: { Size: "M" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(compensated.title).toBe("Concurrent batch product title")
            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Small",
                options: [expect.objectContaining({ value: "S" })],
              })
            )
          })

          it("skips atomic variant rollback when a prior-only value changes", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Prior value drift product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]
            const sizeS = option.values.find((value) => value.value === "S")!
            const upsertProducts = service.upsertProducts.bind(service)
            let priorValueRenamed = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!priorValueRenamed) {
                  priorValueRenamed = true
                  await service.updateProductOptionValues(sizeS.id, {
                    value: "Renamed S",
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  selector: { id: product.id },
                  update: {
                    option_value_updates: [
                      {
                        product_option_id: option.id,
                        add: [{ value: "L" }],
                        remove: [sizeS.id],
                      },
                    ],
                    variants: [
                      {
                        id: product.variants[0].id,
                        title: "Large",
                        options: { Size: "L" },
                      },
                    ],
                  },
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Large",
                options: [expect.objectContaining({ value: "L" })],
              })
            )
            expect(
              compensated.options[0].values.map((value) => value.value).sort()
            ).toEqual(["L", "M"])
            expect(await service.retrieveProductOptionValue(sizeS.id)).toEqual(
              expect.objectContaining({ value: "Renamed S" })
            )
          })

          it("preserves concurrent variants for batch entries that omit variants", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const [variantProduct, scalarProduct] =
              await service.createProducts([
                {
                  title: "Variant product",
                  shipping_profile_id: shippingProfile.id,
                  options: [{ title: "Size", values: ["S", "M"] }],
                  variants: [{ title: "Small", options: { Size: "S" } }],
                },
                {
                  title: "Scalar product",
                  shipping_profile_id: shippingProfile.id,
                  options: [{ title: "Size", values: ["S", "M"] }],
                  variants: [{ title: "Small", options: { Size: "S" } }],
                },
              ])
            const option = variantProduct.options[0]
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentVariantApplied = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!concurrentVariantApplied) {
                  concurrentVariantApplied = true
                  await service.updateProductVariants(
                    scalarProduct.variants[0].id,
                    {
                      title: "Concurrent medium",
                      options: { Size: "M" },
                    }
                  )
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: variantProduct.id,
                      option_value_updates: [
                        {
                          product_option_id: option.id,
                          add: [{ value: "L" }],
                        },
                      ],
                      variants: [
                        {
                          id: variantProduct.variants[0].id,
                          title: "Large",
                          options: { Size: "L" },
                        },
                      ],
                    },
                    {
                      id: scalarProduct.id,
                      title: "Updated scalar product",
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const compensated = await service.listProducts(
              { id: [variantProduct.id, scalarProduct.id] },
              { relations: ["options.values", "variants.options"] }
            )
            const compensatedVariantProduct = compensated.find(
              (product) => product.id === variantProduct.id
            )!
            const compensatedScalarProduct = compensated.find(
              (product) => product.id === scalarProduct.id
            )!

            expect(
              compensatedVariantProduct.options[0].values
                .map((value) => value.value)
                .sort()
            ).toEqual(["M", "S"])
            expect(compensatedVariantProduct.variants[0].options).toEqual([
              expect.objectContaining({ value: "S" }),
            ])
            expect(compensatedScalarProduct).toEqual(
              expect.objectContaining({ title: "Scalar product" })
            )
            expect(compensatedScalarProduct.variants[0]).toEqual(
              expect.objectContaining({
                title: "Concurrent medium",
                options: [expect.objectContaining({ value: "M" })],
              })
            )
          })

          it("preserves concurrent option value link changes during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Concurrent option value product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]
            const sizeS = option.values.find((value) => value.value === "S")!
            const sizeM = option.values.find((value) => value.value === "M")!
            const upsertProducts = service.upsertProducts.bind(service)
            let injectedBefore = false
            let injectedAfter = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                if (!injectedBefore) {
                  injectedBefore = true
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                    add: [{ value: "L" }],
                  })
                  await service.updateProductVariants(product.variants[0].id, {
                    title: "Concurrent previous title",
                    options: { Size: "S" },
                  })
                }

                const result = await upsertProducts(...args)

                if (!injectedAfter) {
                  expect(
                    (
                      args[1] as
                        | {
                            optionValueUpdateCompensation?: unknown
                          }
                        | undefined
                    )?.optionValueUpdateCompensation
                  ).toEqual([
                    {
                      product_id: product.id,
                      product_option_id: option.id,
                      add: [
                        {
                          value_id: sizeS.id,
                          link_id: expect.any(String),
                          known_link_ids: [expect.any(String)],
                        },
                      ],
                    },
                  ])
                  injectedAfter = true
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                    add: [{ value: "XL" }],
                    remove: [sizeM.id],
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_value_updates: [
                        {
                          product_option_id: option.id,
                          add: [{ value: "L" }],
                          remove: [sizeS.id],
                        },
                      ],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: product.variants[0].title,
                          options: { Size: "L" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(
              compensated.options[0].values.map((value) => value.value).sort()
            ).toEqual(["L", "S", "XL"])
            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Concurrent previous title",
                options: [expect.objectContaining({ value: "S" })],
              })
            )
          })

          it("preserves a concurrent same-link replacement during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Concurrent link replacement product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]
            const sizeS = option.values.find((value) => value.value === "S")!
            const upsertProducts = service.upsertProducts.bind(service)
            let replacedLink = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!replacedLink) {
                  replacedLink = true
                  const [updated] = await service.listProducts(
                    { id: [product.id] },
                    { relations: ["options.values"] }
                  )
                  const sizeL = updated.options[0].values.find(
                    (value) => value.value === "L"
                  )!
                  await service.updateProducts(product.id, {
                    option_value_updates: [
                      {
                        product_option_id: option.id,
                        remove: [sizeL.id],
                      },
                    ],
                    variants: [
                      {
                        id: product.variants[0].id,
                        title: product.variants[0].title,
                        options: { Size: "M" },
                      },
                    ],
                  })
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                    add: [sizeL.id],
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_value_updates: [
                        {
                          product_option_id: option.id,
                          add: [{ value: "L" }],
                          remove: [sizeS.id],
                        },
                      ],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: product.variants[0].title,
                          options: { Size: "L" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(
              compensated.options[0].values.map((value) => value.value).sort()
            ).toEqual(["L", "M", "S"])
            expect(compensated.variants[0].options).toEqual([
              expect.objectContaining({ value: "M" }),
            ])
          })

          it("does not resurrect a request-deleted link after a concurrent add-remove cycle", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Concurrent deleted-link cycle product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const option = product.options[0]
            const sizeS = option.values.find((value) => value.value === "S")!
            const upsertProducts = service.upsertProducts.bind(service)
            let cycledLink = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!cycledLink) {
                  cycledLink = true
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                    add: [sizeS.id],
                  })
                  await service.updateProductOptionValuesOnProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                    remove: [sizeS.id],
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_value_updates: [
                        {
                          product_option_id: option.id,
                          remove: [sizeS.id],
                        },
                      ],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: "Medium",
                          options: { Size: "M" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )

            expect(
              compensated.options[0].values.map((value) => value.value).sort()
            ).toEqual(["M"])
            expect(compensated.variants[0].options).toEqual([
              expect.objectContaining({ value: "M" }),
            ])
            expect(compensated.variants[0].title).toBe("Medium")
          })

          it("preserves a concurrent title write when compensating a touched title", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Prior title",
              shipping_profile_id: shippingProfile.id,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentTitleWritten = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!concurrentTitleWritten) {
                  concurrentTitleWritten = true
                  await service.updateProducts(product.id, {
                    title: "Concurrent title",
                  })
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [{ id: product.id, title: "Forward title" }],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect((await service.retrieveProduct(product.id)).title).toBe(
              "Concurrent title"
            )
          })

          it("preserves a scalar write after an ABA cycle during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Prior ABA title",
              shipping_profile_id: shippingProfile.id,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let titleCycled = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!titleCycled) {
                  titleCycled = true
                  await service.updateProducts(product.id, {
                    title: "Concurrent intermediate title",
                  })
                  await service.updateProducts(product.id, {
                    title: "Forward ABA title",
                  })
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [{ id: product.id, title: "Forward ABA title" }],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect((await service.retrieveProduct(product.id)).title).toBe(
              "Forward ABA title"
            )
          })

          it("preserves a concurrently removed value link when variant compensation becomes invalid", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const option = await service.createProductOptions({
              title: "Size",
              values: ["S", "M"],
              is_exclusive: false,
            })
            const product = await service.createProducts({
              title: "Concurrent value unlink product",
              shipping_profile_id: shippingProfile.id,
            })
            const productOptionLink = await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
              product_option_value_ids: option.values.map((value) => value.id),
            })
            const variant = await service.createProductVariants({
              product_id: product.id,
              title: "Small",
              options: { Size: "S" },
            })
            const sizeS = option.values.find((value) => value.value === "S")!
            const valueLinkService = (service as any)
              .productProductOptionValueService_
            const upsertProducts = service.upsertProducts.bind(service)
            let valueLinkRemoved = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)

                if (!valueLinkRemoved) {
                  valueLinkRemoved = true
                  const [sizeSLink] = await valueLinkService.list({
                    product_product_option_id: productOptionLink.id,
                    product_option_value_id: sizeS.id,
                  })
                  await valueLinkService.softDelete([sizeSLink.id])
                }

                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      variants: [
                        {
                          id: variant.id,
                          title: "Medium",
                          options: { Size: "M" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options.values", "variants.options"] }
            )
            expect(
              compensated.options[0].values.map((value) => value.value)
            ).toEqual(["M"])
            expect(compensated.variants[0]).toEqual(
              expect.objectContaining({
                title: "Medium",
                options: [expect.objectContaining({ value: "M" })],
              })
            )
          })

          it("restores tags, categories, and images after a failed batch update", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const [priorTag, forwardTag] = await service.createProductTags([
              { value: "Prior tag" },
              { value: "Forward tag" },
            ])
            const [priorCategory, forwardCategory] =
              await service.createProductCategories([
                { name: "Prior category" },
                { name: "Forward category" },
              ])
            const product = await service.createProducts({
              title: "Association rollback product",
              shipping_profile_id: shippingProfile.id,
              tag_ids: [priorTag.id],
              category_ids: [priorCategory.id],
              images: [{ url: "https://example.com/prior.jpg" }],
            })

            const { errors } = await workflow.run({
              input: {
                products: [
                  {
                    id: product.id,
                    tag_ids: [forwardTag.id],
                    category_ids: [forwardCategory.id],
                    images: [{ url: "https://example.com/forward.jpg" }],
                  },
                ],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])

            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["tags", "categories", "images"] }
            )
            expect(compensated.tags.map((tag) => tag.id)).toEqual([priorTag.id])
            expect(
              compensated.categories.map((category) => category.id)
            ).toEqual([priorCategory.id])
            expect(compensated.images.map((image) => image.url)).toEqual([
              "https://example.com/prior.jpg",
            ])
          })

          it.each(["addition", "replacement"] as const)(
            "restores prior variants after nonempty option %s rollback",
            async (mode) => {
              const workflow = updateProductsWorkflow(appContainer)
              workflow.appendAction("throw", updateProductsWorkflowId, {
                invoke: async function failStep() {
                  throw new Error("Fail")
                },
              })

              const product = await service.createProducts({
                title: `Option ${mode} rollback product`,
                shipping_profile_id: shippingProfile.id,
                options: [{ title: "Size", values: ["S"] }],
                variants: [{ title: "Small", options: { Size: "S" } }],
              })
              const size = product.options[0]
              const color = await service.createProductOptions({
                title: "Color",
                values: ["Red"],
                is_exclusive: false,
              })
              const adding = mode === "addition"

              const { errors } = await workflow.run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_ids: adding ? [size.id, color.id] : [color.id],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: "Forward red",
                          options: adding
                            ? { Size: "S", Color: "Red" }
                            : { Color: "Red" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })

              expect(errors).toEqual([
                {
                  action: "throw",
                  handlerType: "invoke",
                  error: expect.objectContaining({ message: "Fail" }),
                },
              ])
              const [compensated] = await service.listProducts(
                { id: [product.id] },
                {
                  relations: ["options.values", "variants.options"],
                  options: { refresh: true },
                }
              )
              const activeLinks = await (
                service as any
              ).productProductOptionService_.list({ product_id: product.id })
              expect(
                activeLinks.map(
                  (link: { product_option_id: string }) =>
                    link.product_option_id
                )
              ).toEqual([size.id])
              expect(compensated.variants[0]).toEqual(
                expect.objectContaining({
                  title: "Small",
                  options: [expect.objectContaining({ value: "S" })],
                })
              )
            }
          )

          it("restores surviving products when a batch peer is concurrently deleted", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const [survivor, deleted] = await service.createProducts([
              {
                title: "Surviving compensation product",
                shipping_profile_id: shippingProfile.id,
              },
              {
                title: "Deleted compensation product",
                shipping_profile_id: shippingProfile.id,
              },
            ])
            const upsertProducts = service.upsertProducts.bind(service)
            let productDeleted = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!productDeleted) {
                  productDeleted = true
                  await service.softDeleteProducts(deleted.id)
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    { id: survivor.id, title: "Forward survivor" },
                    { id: deleted.id, title: "Forward deleted" },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect((await service.retrieveProduct(survivor.id)).title).toBe(
              "Surviving compensation product"
            )
            const [deletedProduct] = await service.listProducts(
              { id: [deleted.id] },
              { withDeleted: true } as any
            )
            expect(deletedProduct.deleted_at).not.toBeNull()
          })

          it("captures option links added after the workflow preload", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Authoritative option-link product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S"] }],
            })
            const retainedOption = product.options[0]
            const concurrentOption = await service.createProductOptions({
              title: "Concurrent color",
              values: ["Blue"],
              is_exclusive: false,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let optionLinked = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                if (!optionLinked) {
                  optionLinked = true
                  await service.addProductOptionToProduct({
                    product_id: product.id,
                    product_option_id: concurrentOption.id,
                  })
                }
                return await upsertProducts(...args)
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    { id: product.id, option_ids: [retainedOption.id] },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options"] }
            )
            expect(
              compensated.options.map((option) => option.id).sort()
            ).toEqual([retainedOption.id, concurrentOption.id].sort())
          })

          it("resolves selector membership once before the exact-id update", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const collection = await service.createProductCollections({
              title: "Selector membership collection",
            })
            const [initialMember, laterMember] = await service.createProducts([
              {
                title: "Initial selector member",
                shipping_profile_id: shippingProfile.id,
                collection_id: collection.id,
              },
              {
                title: "Later selector member",
                shipping_profile_id: shippingProfile.id,
              },
            ])
            const listProducts = service.listProducts.bind(service)
            let membershipChanged = false
            const listProductsSpy = jest
              .spyOn(service, "listProducts")
              .mockImplementation(async (...args) => {
                const result = await listProducts(...args)
                if (!membershipChanged) {
                  membershipChanged = true
                  await service.updateProducts(laterMember.id, {
                    collection_id: collection.id,
                  })
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  selector: { collection_id: collection.id },
                  update: { title: "Forward selector title" },
                },
                throwOnError: false,
              })
              .finally(() => listProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect(
              (await service.retrieveProduct(initialMember.id)).title
            ).toBe("Initial selector member")
            expect((await service.retrieveProduct(laterMember.id)).title).toBe(
              "Later selector member"
            )
          })

          it("uses one selector membership set for updates and variant-price ownership", async () => {
            const collection = await service.createProductCollections({
              title: "Selector price ownership collection",
            })
            const [initialMember, laterMember] = await service.createProducts([
              {
                title: "Initial priced selector member",
                shipping_profile_id: shippingProfile.id,
                collection_id: collection.id,
                variants: [{ title: "Initial priced variant" }],
              },
              {
                title: "Later priced selector member",
                shipping_profile_id: shippingProfile.id,
                variants: [{ title: "Later priced variant" }],
              },
            ])
            const initialVariant = initialMember.variants[0]
            const laterVariant = laterMember.variants[0]
            const pricingService: IPricingModuleService = appContainer.resolve(
              Modules.PRICING
            )
            const [initialPriceSet, laterPriceSet] =
              await pricingService.createPriceSets([
                { prices: [{ amount: 1000, currency_code: "usd" }] },
                { prices: [{ amount: 2000, currency_code: "usd" }] },
              ])
            const remoteLink = appContainer.resolve(
              ContainerRegistrationKeys.REMOTE_LINK
            )
            await remoteLink.create([
              {
                [Modules.PRODUCT]: { variant_id: initialVariant.id },
                [Modules.PRICING]: { price_set_id: initialPriceSet.id },
              },
              {
                [Modules.PRODUCT]: { variant_id: laterVariant.id },
                [Modules.PRICING]: { price_set_id: laterPriceSet.id },
              },
            ])

            const remoteQuery = appContainer.resolve(
              ContainerRegistrationKeys.REMOTE_QUERY
            )
            let membershipShifted = false
            appContainer.register({
              [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(
                async (...args: any[]) => {
                  const result = await remoteQuery(...args)
                  const query = args[0]
                  if (
                    !membershipShifted &&
                    query.entryPoint === "product" &&
                    query.variables?.filters?.collection_id === collection.id
                  ) {
                    membershipShifted = true
                    await service.updateProducts(laterMember.id, {
                      collection_id: collection.id,
                    })
                  }
                  return result
                }
              ),
            })

            try {
              const { errors } = await updateProductsWorkflow(appContainer).run(
                {
                  input: {
                    selector: { collection_id: collection.id },
                    update: { variants: [] },
                  },
                  throwOnError: false,
                }
              )
              expect(errors).toEqual([])
            } finally {
              appContainer.register({
                [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(remoteQuery),
              })
            }

            expect(membershipShifted).toBe(true)
            const reloaded = await service.listProducts(
              { id: [initialMember.id, laterMember.id] },
              { relations: ["variants"] }
            )
            const byId = new Map(
              reloaded.map((product) => [product.id, product])
            )
            expect(byId.get(initialMember.id)?.variants ?? []).toHaveLength(0)
            expect(
              (byId.get(laterMember.id)?.variants ?? []).map(
                (variant) => variant.id
              )
            ).toEqual([laterVariant.id])

            const links = await remoteQuery({
              entryPoint: "product_variant_price_set",
              fields: ["variant_id", "price_set_id"],
              variables: {
                filters: { variant_id: [initialVariant.id, laterVariant.id] },
              },
            })
            expect(links).toEqual([
              expect.objectContaining({
                variant_id: laterVariant.id,
                price_set_id: laterPriceSet.id,
              }),
            ])
          })

          it("keeps an option-only concurrent variant dependency during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Option-only rollback product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const color = await service.createProductOptions({
              title: "Color",
              values: ["Red"],
              is_exclusive: false,
            })
            const findMethodOwner = (target: any, method: string) => {
              for (
                let owner = target;
                owner;
                owner = Object.getPrototypeOf(owner)
              ) {
                if (Object.prototype.hasOwnProperty.call(owner, method)) {
                  return owner
                }
              }
              throw new Error(`Method ${method} not found`)
            }
            const removeOwner = findMethodOwner(
              service,
              "removeProductOptionFromProduct_"
            )
            const removeProductOptionFromProduct =
              removeOwner.removeProductOptionFromProduct_
            let unsafeColorRemovalAttempted = false
            removeOwner.removeProductOptionFromProduct_ = async function (
              data: any,
              ...args: any[]
            ) {
              const pairs = Array.isArray(data) ? data : [data]
              if (pairs.some((pair) => pair.product_option_id === color.id)) {
                unsafeColorRemovalAttempted = true
              }
              return await removeProductOptionFromProduct.call(
                this,
                data,
                ...args
              )
            }
            const upsertProducts = service.upsertProducts.bind(service)
            let variantCreated = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!variantCreated) {
                  variantCreated = true
                  await service.createProductVariants({
                    product_id: product.id,
                    title: "Concurrent red",
                    options: { Size: "S", Color: "Red" },
                  })
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_ids: [product.options[0].id, color.id],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => {
                upsertProductsSpy.mockRestore()
                removeOwner.removeProductOptionFromProduct_ =
                  removeProductOptionFromProduct
              })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect(unsafeColorRemovalAttempted).toBe(false)
            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options", "variants.options"] }
            )
            expect(compensated.options.map((option) => option.id)).toContain(
              color.id
            )
            expect(compensated.variants).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ title: "Concurrent red" }),
              ])
            )
          })

          it("does not restore removed options when a concurrent variant skips rollback", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Skipped structural restoration product",
              shipping_profile_id: shippingProfile.id,
              options: [
                { title: "Size", values: ["S", "M"] },
                { title: "Color", values: ["Red"] },
              ],
              variants: [
                { title: "Small red", options: { Size: "S", Color: "Red" } },
              ],
            })
            const size = product.options.find(
              (option) => option.title === "Size"
            )!
            const color = product.options.find(
              (option) => option.title === "Color"
            )!
            const upsertProducts = service.upsertProducts.bind(service)
            let concurrentVariantCreated = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!concurrentVariantCreated) {
                  concurrentVariantCreated = true
                  await service.createProductVariants({
                    product_id: product.id,
                    title: "Concurrent size-only variant",
                    options: { Size: "M" },
                  })
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_ids: [size.id],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: "Forward size-only variant",
                          options: { Size: "S" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            const [compensated] = await service.listProducts(
              { id: [product.id] },
              { relations: ["options", "variants.options"] }
            )
            expect(compensated.options.map((option) => option.id)).toEqual([
              size.id,
            ])
            expect(
              compensated.options.some((option) => option.id === color.id)
            ).toBe(false)
            expect(compensated.variants).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  title: "Concurrent size-only variant",
                  options: [expect.objectContaining({ value: "M" })],
                }),
              ])
            )
          })

          it("preserves concurrent discountable state after setting is_giftcard false", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Reverse gift-card compensation product",
              shipping_profile_id: shippingProfile.id,
              is_giftcard: true,
              discountable: false,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let discountableChanged = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!discountableChanged) {
                  discountableChanged = true
                  await service.updateProducts(product.id, {
                    discountable: true,
                  })
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [{ id: product.id, is_giftcard: false }],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect(await service.retrieveProduct(product.id)).toEqual(
              expect.objectContaining({
                is_giftcard: false,
                discountable: true,
              })
            )
          })

          it("restores the exact option link with pre-existing deleted history", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Exact option-link restoration product",
              shipping_profile_id: shippingProfile.id,
            })
            const option = await service.createProductOptions({
              title: "Historical option",
              values: ["One"],
              is_exclusive: false,
            })
            await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
            })
            await service.removeProductOptionFromProduct({
              product_id: product.id,
              product_option_id: option.id,
            })
            const activeLink = await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
            })

            const { errors } = await workflow.run({
              input: { products: [{ id: product.id, option_ids: [] }] },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            const [restoredLink] = await (
              service as any
            ).productProductOptionService_.list({
              product_id: product.id,
              product_option_id: option.id,
            })
            expect(restoredLink.id).toBe(activeLink.id)
          })

          it("does not restore an option link after a concurrent add-remove cycle", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Option-link ABA product",
              shipping_profile_id: shippingProfile.id,
            })
            const option = await service.createProductOptions({
              title: "ABA option",
              values: ["One"],
              is_exclusive: false,
            })
            await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: option.id,
            })
            const upsertProducts = service.upsertProducts.bind(service)
            let linkCycled = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!linkCycled) {
                  linkCycled = true
                  await service.addProductOptionToProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                  })
                  await service.removeProductOptionFromProduct({
                    product_id: product.id,
                    product_option_id: option.id,
                  })
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: { products: [{ id: product.id, option_ids: [] }] },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            const activeLinks = await (
              service as any
            ).productProductOptionService_.list(
              { product_id: product.id },
              { select: ["id"], options: { refresh: true } }
            )
            expect(activeLinks).toHaveLength(0)
          })

          it("uses only ABA-eligible links for the variant compensation target", async () => {
            const workflow = updateProductsWorkflow(appContainer)
            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "ABA target product",
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S"] }],
              variants: [{ title: "Small", options: { Size: "S" } }],
            })
            const size = product.options[0]
            const material = await service.createProductOptions({
              title: "Material",
              values: ["Cotton"],
              is_exclusive: false,
            })
            const materialLink = await service.addProductOptionToProduct({
              product_id: product.id,
              product_option_id: material.id,
            })

            const upsertProducts = service.upsertProducts.bind(service)
            const knex = appContainer.resolve(
              ContainerRegistrationKeys.PG_CONNECTION
            )
            let linkCycled = false
            const upsertProductsSpy = jest
              .spyOn(service, "upsertProducts")
              .mockImplementation(async (...args) => {
                const result = await upsertProducts(...args)
                if (!linkCycled) {
                  linkCycled = true
                  const restored = await knex("product_product_option")
                    .where({ id: materialLink.id })
                    .update({
                      deleted_at: null,
                      updated_at: new Date(Date.now() + 1000),
                    })
                  expect(restored).toBe(1)
                  const deleted = await knex("product_product_option")
                    .where({ id: materialLink.id })
                    .update({
                      deleted_at: new Date(),
                      updated_at: new Date(Date.now() + 2000),
                    })
                  expect(deleted).toBe(1)
                  const [historyLink] = await knex("product_product_option")
                    .where({ id: materialLink.id })
                    .select("deleted_at")
                  expect(historyLink.deleted_at).not.toBeNull()
                }
                return result
              })

            const { errors } = await workflow
              .run({
                input: {
                  products: [
                    {
                      id: product.id,
                      option_ids: [size.id],
                      variants: [
                        {
                          id: product.variants[0].id,
                          title: "Forward small",
                          options: { Size: "S" },
                        },
                      ],
                    },
                  ],
                },
                throwOnError: false,
              })
              .finally(() => upsertProductsSpy.mockRestore())

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            const [compensated] = await service.listProducts(
              { id: [product.id] },
              {
                relations: ["variants.options"],
                options: { refresh: true },
              }
            )
            const activeOptionLinks = await knex("product_product_option")
              .where({ product_id: product.id })
              .whereNull("deleted_at")
              .orderBy("product_option_id")
              .select("product_option_id")
            expect(
              activeOptionLinks.map((link) => link.product_option_id)
            ).toEqual([size.id])
            expect(compensated.variants).toEqual([
              expect.objectContaining({
                title: "Small",
                options: [expect.objectContaining({ value: "S" })],
              }),
            ])
          })

          it.each([
            {
              field: "metadata",
              update: { metadata: { concurrent: true } },
              expected: { metadata: { concurrent: true } },
            },
            {
              field: "rank",
              update: { rank: 37 },
              expected: { rank: 37 },
            },
          ])(
            "preserves concurrent option-value $field changes during compensation",
            async ({ update, expected }) => {
              const workflow = updateProductsWorkflow(appContainer)
              workflow.appendAction("throw", updateProductsWorkflowId, {
                invoke: async function failStep() {
                  throw new Error("Fail")
                },
              })

              const product = await service.createProducts({
                title: "Option-value semantic guard product",
                shipping_profile_id: shippingProfile.id,
                options: [{ title: "Size", values: ["S", "M"] }],
                variants: [{ title: "Small", options: { Size: "S" } }],
              })
              const option = product.options[0]
              const sizeS = option.values.find((value) => value.value === "S")!
              const upsertProducts = service.upsertProducts.bind(service)
              let valueChanged = false
              const upsertProductsSpy = jest
                .spyOn(service, "upsertProducts")
                .mockImplementation(async (...args) => {
                  const result = await upsertProducts(...args)
                  if (!valueChanged) {
                    valueChanged = true
                    await service.updateProductOptionValues(sizeS.id, update)
                  }
                  return result
                })

              const { errors } = await workflow
                .run({
                  input: {
                    products: [
                      {
                        id: product.id,
                        option_value_updates: [
                          {
                            product_option_id: option.id,
                            add: [{ value: "L" }],
                            remove: [sizeS.id],
                          },
                        ],
                        variants: [
                          {
                            id: product.variants[0].id,
                            title: "Large",
                            options: { Size: "L" },
                          },
                        ],
                      },
                    ],
                  },
                  throwOnError: false,
                })
                .finally(() => upsertProductsSpy.mockRestore())

              expect(errors).toEqual([
                {
                  action: "throw",
                  handlerType: "invoke",
                  error: expect.objectContaining({ message: "Fail" }),
                },
              ])
              const [compensated] = await service.listProducts(
                { id: [product.id] },
                { relations: ["options.values", "variants.options"] }
              )
              expect(
                compensated.options[0].values.map((value) => value.value).sort()
              ).toEqual(["L", "M"])
              expect(compensated.variants[0]).toEqual(
                expect.objectContaining({
                  title: "Large",
                  options: [expect.objectContaining({ value: "L" })],
                })
              )
              expect(
                await service.retrieveProductOptionValue(sizeS.id)
              ).toEqual(expect.objectContaining(expected))
            }
          )

          it("removes forward-added metadata keys during compensation", async () => {
            const workflow = updateProductsWorkflow(appContainer)

            workflow.appendAction("throw", updateProductsWorkflowId, {
              invoke: async function failStep() {
                throw new Error("Fail")
              },
            })

            const product = await service.createProducts({
              title: "Metadata rollback product",
              shipping_profile_id: shippingProfile.id,
              metadata: { keep: 1 },
            })

            const { errors } = await workflow.run({
              input: {
                products: [{ id: product.id, metadata: { added: 2 } }],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({ message: "Fail" }),
              },
            ])
            expect(
              (await service.retrieveProduct(product.id)).metadata
            ).toEqual({ keep: 1 })
          })
        })
      })
    })
  },
})
