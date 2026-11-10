import {
  deleteProductsWorkflow,
  deleteProductVariantsWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IProductModuleService } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import path from "path"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../../__fixtures__/custom-links-test"),
  testSuite: ({ getContainer }) => {
    describe("Workflows: Delete product variants", () => {
      let appContainer
      let productService: IProductModuleService
      let customRecordService: any
      let product

      beforeAll(async () => {
        appContainer = getContainer()
        productService = appContainer.resolve(Modules.PRODUCT)
        customRecordService = appContainer.resolve("custom_record")
      })

      beforeEach(async () => {
        product = await productService.createProducts({
          title: "Test Product",
          options: [{ title: "Size", values: ["S", "M"] }],
          variants: [
            { title: "Small", options: { Size: "S" } },
            { title: "Medium", options: { Size: "M" } },
          ],
        })
      })

      const linkCustomRecordToVariant = async (variantId: string) => {
        const customRecord = await customRecordService.createCustomRecords({
          key: `variant-${variantId}`,
        })

        await appContainer.resolve(ContainerRegistrationKeys.LINK).create({
          [Modules.PRODUCT]: { product_variant_id: variantId },
          custom_record: { custom_record_id: customRecord.id },
        })

        return customRecord
      }

      it("should cascade delete records linked to the deleted variants with deleteCascade", async () => {
        const [small, medium] = product.variants
        const smallCustomRecord = await linkCustomRecordToVariant(small.id)
        const mediumCustomRecord = await linkCustomRecordToVariant(medium.id)

        await deleteProductVariantsWorkflow(appContainer).run({
          input: { ids: [small.id] },
        })

        const [customRecords] =
          await customRecordService.listAndCountCustomRecords({
            id: [smallCustomRecord.id, mediumCustomRecord.id],
          })

        expect(customRecords).toEqual([
          expect.objectContaining({ id: mediumCustomRecord.id }),
        ])
      })

      it("should cascade delete records linked to the variants of deleted products with deleteCascade", async () => {
        const [small] = product.variants
        const smallCustomRecord = await linkCustomRecordToVariant(small.id)

        await deleteProductsWorkflow(appContainer).run({
          input: { ids: [product.id] },
        })

        const [customRecords] =
          await customRecordService.listAndCountCustomRecords({
            id: [smallCustomRecord.id],
          })

        expect(customRecords).toHaveLength(0)
      })
    })
  },
})
