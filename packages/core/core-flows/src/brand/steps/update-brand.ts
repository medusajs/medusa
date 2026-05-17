import { IBrandModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateBrandStep = createStep(
  "update-brand",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const brandModule = container.resolve<IBrandModuleService>(Modules.BRAND)
    const brand = await brandModule.updateBrands(input.id, input)
    return new StepResponse(brand, brand)
  },
  async (originalBrand, { container }) => {
    if (!originalBrand) return
    const brandModule = container.resolve<IBrandModuleService>(Modules.BRAND)
    await brandModule.updateBrands(originalBrand.id, originalBrand)
  }
)
