import path from "path"
import { randomUUID } from "crypto"
import { deleteProductVariantsWorkflow } from "@medusajs/core-flows"
import { Link } from "@medusajs/framework/modules-sdk"
import {
  IInventoryService,
  IPricingModuleService,
  IProductModuleService,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { BrandModuleService } from "../../src/modules/brand/service"

jest.setTimeout(60000)

const failAfterDeletion = createStep(
  "fail-after-variant-link-deletion",
  async (input: { deleted: void; brandId: string }, { container }) => {
    const brands = container.resolve<BrandModuleService>("brand")
    if ((await brands.listBrands({ id: input.brandId })).length) {
      throw new Error("Linked record was not deleted before compensation")
    }
    throw new Error("Downstream operation failed")
  }
)

const deleteThenFailWorkflow = createWorkflow(
  "test-variant-link-compensation",
  (input: { ids: string[]; brandId: string }) => {
    const deleted = deleteProductVariantsWorkflow.runAsStep({ input })
    failAfterDeletion({ deleted, brandId: input.brandId })
    return new WorkflowResponse(deleted)
  }
)

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../__fixtures__/variant-link"),
  testSuite: ({ getContainer }) => {
    async function createLinkedVariant() {
      const container = getContainer()
      const product = container.resolve<IProductModuleService>(Modules.PRODUCT)
      const pricing = container.resolve<IPricingModuleService>(Modules.PRICING)
      const brands = container.resolve<BrandModuleService>("brand")
      const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)
      const createdProduct = await product.createProducts({
        title: "Linked variant",
        handle: `link-${randomUUID()}`,
        variants: [{ title: "Variant", manage_inventory: false }],
      })
      const variant = createdProduct.variants[0]
      const brand = await brands.createBrands({ name: "Linked record" })
      const priceSet = await pricing.createPriceSets({
        prices: [{ amount: 100, currency_code: "usd" }],
      })
      await link.create([
        {
          [Modules.PRODUCT]: { product_variant_id: variant.id },
          brand: { brand_id: brand.id },
        },
        {
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.PRICING]: { price_set_id: priceSet.id },
        },
      ])
      return { product, pricing, brands, link, variant, brand, priceSet }
    }

    it("deletes and restores the standard custom link through Link", async () => {
      const { brands, link, variant, brand } = await createLinkedVariant()
      const input = { [Modules.PRODUCT]: { product_variant_id: variant.id } }

      const [deleteErrors] = await link.delete(input)
      expect(deleteErrors).toBeNull()
      expect(await brands.listBrands({ id: brand.id })).toEqual([])

      const [restoreErrors] = await link.restore(input)
      expect(restoreErrors).toBeNull()
      expect(await brands.listBrands({ id: brand.id })).toEqual([
        expect.objectContaining({ id: brand.id }),
      ])
      expect(
        await link.list({
          [Modules.PRODUCT]: { product_variant_id: variant.id },
          brand: { brand_id: brand.id },
        })
      ).toHaveLength(1)
    })

    it("deletes standard custom links and native price links through the variant workflow", async () => {
      const { product, pricing, brands, variant, brand, priceSet } =
        await createLinkedVariant()
      const other = await createLinkedVariant()

      await deleteProductVariantsWorkflow(getContainer()).run({
        input: { ids: [variant.id] },
      })

      expect(await product.listProductVariants({ id: variant.id })).toEqual([])
      expect(await pricing.listPriceSets({ id: [priceSet.id] })).toEqual([])
      expect(await brands.listBrands({ id: brand.id })).toEqual([])
      expect(await brands.listBrands({ id: other.brand.id })).toHaveLength(1)
      expect(
        await pricing.listPriceSets({ id: [other.priceSet.id] })
      ).toHaveLength(1)
      expect(
        await product.listProductVariants({ id: other.variant.id })
      ).toHaveLength(1)
    })

    it("restores the variant, both link types and linked records after a later step fails", async () => {
      const { product, pricing, brands, link, variant, brand, priceSet } =
        await createLinkedVariant()

      const { errors } = await deleteThenFailWorkflow(getContainer()).run({
        input: { ids: [variant.id], brandId: brand.id },
        throwOnError: false,
      })
      expect(errors).toEqual([
        expect.objectContaining({
          error: expect.objectContaining({
            message: "Downstream operation failed",
          }),
        }),
      ])

      expect(
        await product.listProductVariants({ id: variant.id })
      ).toHaveLength(1)
      expect(await pricing.listPriceSets({ id: [priceSet.id] })).toHaveLength(1)
      expect(await brands.listBrands({ id: brand.id })).toHaveLength(1)
      expect(
        await link.list({
          [Modules.PRODUCT]: { product_variant_id: variant.id },
          brand: { brand_id: brand.id },
        })
      ).toHaveLength(1)
      expect(
        await link.list({
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.PRICING]: { price_set_id: priceSet.id },
        })
      ).toHaveLength(1)
    })

    it("still deletes inventory owned exclusively by the deleted variant", async () => {
      const { product, link, variant } = await createLinkedVariant()
      const inventory = getContainer().resolve<IInventoryService>(
        Modules.INVENTORY
      )
      const item = await inventory.createInventoryItems({
        title: "Variant stock",
      })
      await product.updateProductVariants(variant.id, {
        manage_inventory: true,
      })
      await link.create({
        [Modules.PRODUCT]: { variant_id: variant.id },
        [Modules.INVENTORY]: { inventory_item_id: item.id },
      })

      await deleteProductVariantsWorkflow(getContainer()).run({
        input: { ids: [variant.id] },
      })

      expect(await inventory.listInventoryItems({ id: item.id })).toEqual([])
      expect(
        await link.list({
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.INVENTORY]: { inventory_item_id: item.id },
        })
      ).toEqual([])
    })
  },
})
