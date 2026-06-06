import {
  batchImageVariantsWorkflow,
  batchVariantImagesWorkflow,
} from "@zjedene-medusa/core-flows"
import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { IProductModuleService } from "@zjedene-medusa/types"
import { Modules } from "@zjedene-medusa/utils"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("Workflows: Batch variant image management", () => {
      let appContainer
      let productModule: IProductModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        productModule = appContainer.resolve(Modules.PRODUCT)
      })

      const createVariantWithImage = async (
        imageUrl: string,
        suffix: string
      ) => {
        const [createdProduct] = await productModule.createProducts([
          {
            title: `test-product-${suffix}`,
            images: [{ url: imageUrl }],
            variants: [
              {
                title: `test-variant-${suffix}`,
                sku: `test-variant-sku-${suffix}`,
              },
            ],
          },
        ])

        const [product] = await productModule.listProducts(
          { id: createdProduct.id },
          {
            relations: ["variants", "images"],
          }
        )

        const variant = product.variants[0]!
        const image = product.images[0]!

        await productModule.updateProductVariants(variant.id, {
          thumbnail: imageUrl,
        })

        await productModule.addImageToVariant([
          {
            variant_id: variant.id,
            image_id: image.id,
          },
        ])

        const [variantWithThumbnail] = await productModule.listProductVariants(
          { id: variant.id },
          {
            select: ["id", "thumbnail"],
          }
        )

        expect(variantWithThumbnail.thumbnail).toEqual(imageUrl)

        return {
          variantId: variant.id,
          imageId: image.id,
          imageUrl,
        }
      }

      it("clears the variant thumbnail when removing images via batchVariantImagesWorkflow", async () => {
        const imageUrl = "https://test-image-url.com/image-1.png"
        const { variantId, imageId } = await createVariantWithImage(
          imageUrl,
          "variant-workflow"
        )

        const workflow = batchVariantImagesWorkflow(appContainer)
        const { result } = await workflow.run({
          input: {
            variant_id: variantId,
            remove: [imageId],
          },
        })

        expect(result.removed).toEqual([imageId])

        const [updatedVariant] = await productModule.listProductVariants(
          { id: variantId },
          {
            select: ["id", "thumbnail"],
          }
        )

        expect(updatedVariant.thumbnail).toBeNull()
      })

      it("clears the variant thumbnail when removing variants via batchImageVariantsWorkflow", async () => {
        const imageUrl = "https://test-image-url.com/image-2.png"
        const { variantId, imageId } = await createVariantWithImage(
          imageUrl,
          "image-workflow"
        )

        const workflow = batchImageVariantsWorkflow(appContainer)
        const { result } = await workflow.run({
          input: {
            image_id: imageId,
            remove: [variantId],
          },
        })

        expect(result.removed).toEqual([variantId])

        const [updatedVariant] = await productModule.listProductVariants(
          { id: variantId },
          {
            select: ["id", "thumbnail"],
          }
        )

        expect(updatedVariant.thumbnail).toBeNull()
      })
    })
  },
})
