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
  cwd: path.join(__dirname, "../../__fixtures__/translation-test"),
  testSuite: ({ getContainer }) => {
    describe("Workflows: Delete product variants", () => {
      let appContainer
      let productService: IProductModuleService
      let translationService: any
      let product

      beforeAll(async () => {
        appContainer = getContainer()
        productService = appContainer.resolve(Modules.PRODUCT)
        translationService = appContainer.resolve("translation")
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

      const linkTranslationToVariant = async (variantId: string) => {
        const translation = await translationService.createTranslations({
          key: `variant-${variantId}`,
        })

        await appContainer.resolve(ContainerRegistrationKeys.LINK).create({
          [Modules.PRODUCT]: { product_variant_id: variantId },
          translation: { translation_id: translation.id },
        })

        return translation
      }

      it("should cascade delete records linked to the deleted variants with deleteCascade", async () => {
        const [small, medium] = product.variants
        const smallTranslation = await linkTranslationToVariant(small.id)
        const mediumTranslation = await linkTranslationToVariant(medium.id)

        await deleteProductVariantsWorkflow(appContainer).run({
          input: { ids: [small.id] },
        })

        const [translations] =
          await translationService.listAndCountTranslations({
            id: [smallTranslation.id, mediumTranslation.id],
          })

        expect(translations).toEqual([
          expect.objectContaining({ id: mediumTranslation.id }),
        ])
      })

      it("should cascade delete records linked to the variants of deleted products with deleteCascade", async () => {
        const [small] = product.variants
        const smallTranslation = await linkTranslationToVariant(small.id)

        await deleteProductsWorkflow(appContainer).run({
          input: { ids: [product.id] },
        })

        const [translations] =
          await translationService.listAndCountTranslations({
            id: [smallTranslation.id],
          })

        expect(translations).toHaveLength(0)
      })
    })
  },
})
