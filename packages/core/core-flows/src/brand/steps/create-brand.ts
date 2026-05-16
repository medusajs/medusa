import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createBrandStep = createStep(
  "create-brand",
  async (input: { name: string; slug: string; [key: string]: unknown }, { container }) => {
    const brandModule = container.resolve(Modules.BRAND)
    const brand = await brandModule.createBrands(input)
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) return
    const brandModule = container.resolve(Modules.BRAND)
    await brandModule.deleteBrands(brandId)
  }
)
