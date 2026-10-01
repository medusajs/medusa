import { createAndLinkProductOptionsToProductWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IProductModuleService } from "@medusajs/types"
import { MedusaError, Modules } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Product Options Removal Validation", () => {
      let appContainer
      let productModule: IProductModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        productModule = appContainer.resolve(Modules.PRODUCT)
      })

      describe("removeProductOptionFromProduct", () => {
        it("should detach the option from the variants using it", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Size",
                values: ["S", "M", "L"],
              },
            ],
          })

          const variant = await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant S",
            options: { Size: "S" },
          })

          await productModule.removeProductOptionFromProduct({
            product_id: product.id,
            product_option_id: product.options[0].id,
          })

          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            { relations: ["options", "variants", "variants.options"] }
          )

          expect(updatedProduct.options).toHaveLength(0)
          expect(updatedProduct.variants).toHaveLength(1)
          expect(updatedProduct.variants[0].id).toEqual(variant.id)
          expect(updatedProduct.variants[0].options).toHaveLength(0)
        })

        it("should detach only the removed option and keep the remaining ones on the variant", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              { title: "Default option", values: ["Default option value"] },
            ],
            variants: [
              {
                title: "Default variant",
                options: { "Default option": "Default option value" },
              },
            ],
          })

          const defaultOption = product.options[0]
          const variantId = product.variants[0].id

          const yearOption = await productModule.createProductOptions({
            title: "Year",
            values: ["2024", "2025"],
          })

          await productModule.addProductOptionToProduct({
            product_id: product.id,
            product_option_id: yearOption.id,
          })

          await productModule.updateProducts(product.id, {
            variants: [
              {
                id: variantId,
                options: {
                  "Default option": "Default option value",
                  Year: "2024",
                },
              },
            ],
          })

          await productModule.removeProductOptionFromProduct({
            product_id: product.id,
            product_option_id: defaultOption.id,
          })

          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            { relations: ["options", "variants", "variants.options"] }
          )

          expect(updatedProduct.options.map((o) => o.title)).toEqual(["Year"])
          expect(updatedProduct.variants[0].id).toEqual(variantId)
          expect(
            updatedProduct.variants[0].options.map((v) => v.value)
          ).toEqual(["2024"])
        })

        it("should successfully remove ProductOption when no variants use it", async () => {
          const product = await productModule.createProducts({
            title: "Test Product No Variants",
            options: [
              {
                title: "Color",
                values: ["Red", "Blue"],
              },
            ],
          })

          const optionId = product.options[0].id

          // Remove the option - should succeed
          await productModule.removeProductOptionFromProduct({
            product_id: product.id,
            product_option_id: optionId,
          })

          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            { relations: ["options"] }
          )
          expect(updatedProduct.options).toHaveLength(0)
        })
      })

      describe("updateProductOptionValuesOnProduct", () => {
        it("should throw error when trying to remove ProductOptionValue used by variant", async () => {
          // Create product with option having multiple values
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Size",
                values: ["S", "M", "L", "XL"],
              },
            ],
          })

          const option = product.options[0]
          const valueS = option.values.find((v) => v.value === "S")!

          // Create variant using value "S"
          await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant S",
            options: { Size: "S" },
          })

          await expect(
            productModule.updateProductOptionValuesOnProduct({
              product_id: product.id,
              product_option_id: option.id,
              remove: [valueS.id],
            })
          ).rejects.toThrow(
            "Cannot unassign option values from product because the following variant(s) are using it"
          )

          const error = await productModule
            .updateProductOptionValuesOnProduct({
              product_id: product.id,
              product_option_id: option.id,
              remove: [valueS.id],
            })
            .catch((error) => error)
          expect((error as MedusaError).message).toContain("Variant S")
        })

        it("should successfully remove ProductOptionValue when no variants use it", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Color",
                values: ["Red", "Blue", "Green"],
              },
            ],
          })

          const option = product.options[0]
          const valueGreen = option.values.find((v) => v.value === "Green")!

          // Create variant using only "Red"
          await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant Red",
            options: { Color: "Red" },
          })

          // First verify all 3 values are linked before removal
          const productBefore = await productModule.retrieveProduct(
            product.id,
            {
              relations: [
                "options",
                "options.values",
                "product_options",
                "product_options.values",
              ],
            }
          )
          expect(productBefore.options[0].values).toHaveLength(3)

          await productModule.updateProductOptionValuesOnProduct({
            product_id: product.id,
            product_option_id: option.id,
            remove: [valueGreen.id],
          })

          // Verify "Green" is removed
          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            {
              relations: [
                "options",
                "options.values",
                "product_options",
                "product_options.values",
              ],
            }
          )
          // Check the filtered option values (should only show linked values)
          const updatedOption = updatedProduct.options[0]
          expect(updatedOption.values).toHaveLength(2)
          expect(updatedOption.values.map((v) => v.value)).toEqual(
            expect.arrayContaining(["Red", "Blue"])
          )
          expect(updatedOption.values.map((v) => v.value)).not.toContain(
            "Green"
          )
        })
      })

      describe("createAndLinkProductOptionsToProductWorkflow", () => {
        it("should detach the option from the variants using it", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Size",
                values: ["S", "M"],
              },
            ],
          })

          await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant S",
            options: { Size: "S" },
          })

          const workflow =
            createAndLinkProductOptionsToProductWorkflow(appContainer)

          const { errors } = await workflow.run({
            input: {
              product_id: product.id,
              remove: [product.options[0].id],
            },
            throwOnError: false,
          })

          expect(errors).toHaveLength(0)

          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            { relations: ["options", "variants", "variants.options"] }
          )

          expect(updatedProduct.options).toHaveLength(0)
          expect(updatedProduct.variants[0].options).toHaveLength(0)
        })

        it("should throw error when detaching the option would collide two variants", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Size",
                values: ["S", "M"],
              },
            ],
          })

          await productModule.createProductVariants([
            {
              product_id: product.id,
              title: "Variant S",
              options: { Size: "S" },
            },
            {
              product_id: product.id,
              title: "Variant M",
              options: { Size: "M" },
            },
          ])

          const workflow =
            createAndLinkProductOptionsToProductWorkflow(appContainer)

          const { errors } = await workflow.run({
            input: {
              product_id: product.id,
              remove: [product.options[0].id],
            },
            throwOnError: false,
          })

          expect(errors).toHaveLength(1)
          expect(errors[0].error.message).toContain(
            "would end up with the same option combination"
          )
        })
      })

      describe("updateProducts with option_ids", () => {
        it("should detach the removed option from the variants using it", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Size",
                values: ["S", "M"],
              },
              {
                title: "Color",
                values: ["Red", "Blue"],
              },
            ],
          })

          const colorOption = product.options.find((o) => o.title === "Color")!

          const variant = await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant S Red",
            options: { Size: "S", Color: "Red" },
          })

          await productModule.updateProducts(product.id, {
            option_ids: [colorOption.id],
          })

          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            { relations: ["options", "variants", "variants.options"] }
          )

          expect(updatedProduct.options.map((o) => o.title)).toEqual(["Color"])
          expect(updatedProduct.variants[0].id).toEqual(variant.id)
          expect(
            updatedProduct.variants[0].options.map((v) => v.value)
          ).toEqual(["Red"])
        })

        it("should successfully remove option when no variants use it via product update", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Color",
                values: ["Red", "Blue"],
              },
            ],
          })

          const colorOption = product.options.find((o) => o.title === "Color")!

          // Create variant using only Color option
          await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant Red",
            options: { Color: "Red" },
          })

          const sizeOption = await productModule.createProductOptions({
            title: "Size",
            values: ["S", "M"],
          })

          await productModule.removeProductOptionFromProduct({
            product_id: product.id,
            product_option_id: sizeOption.id,
          })

          // Verify Size option is removed and Color option remains
          const updatedProduct = await productModule.retrieveProduct(
            product.id,
            { relations: ["options"] }
          )
          expect(updatedProduct.options).toHaveLength(1)
          expect(updatedProduct.options[0].id).toBe(colorOption.id)
        })
      })

      describe("Multiple variants using same option", () => {
        it("should list all colliding variants in error message", async () => {
          const product = await productModule.createProducts({
            title: "Test Product",
            options: [
              {
                title: "Size",
                values: ["S", "M", "L"],
              },
            ],
          })

          await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant Small",
            options: { Size: "S" },
          })

          await productModule.createProductVariants({
            product_id: product.id,
            title: "Variant Medium",
            options: { Size: "M" },
          })

          const error = await productModule
            .removeProductOptionFromProduct({
              product_id: product.id,
              product_option_id: product.options[0].id,
            })
            .catch((error) => error)
          expect(error).toBeInstanceOf(MedusaError)
          expect((error as MedusaError).message).toBe(
            "Cannot unassign product option from product because the following variant(s) would end up with the same option combination: Variant Small, Variant Medium"
          )
        })
      })
    })
  },
})
