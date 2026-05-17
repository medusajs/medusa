import { IBrandModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteBrandStep = createStep(
  "delete-brand",
  async (input: { id: string }, { container }) => {
    const brandModule = container.resolve<IBrandModuleService>(Modules.BRAND)
    const brand = await brandModule.retrieveBrand(input.id)
    await brandModule.deleteBrands(input.id)
    return new StepResponse(void 0, brand)
  },
  async (brand, { container }) => {
    if (!brand) return
    const brandModule = container.resolve<IBrandModuleService>(Modules.BRAND)
    await brandModule.createBrands(brand)
  }
)
