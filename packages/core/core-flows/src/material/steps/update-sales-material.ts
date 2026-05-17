import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateSalesMaterialStep = createStep(
  "update-sales-material",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const salesMaterial = await materialModule.updateSalesMaterials(
      input.id,
      input
    )
    return new StepResponse(salesMaterial, salesMaterial)
  },
  async (originalSalesMaterial, { container }) => {
    if (!originalSalesMaterial) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.updateSalesMaterials(
      originalSalesMaterial.id,
      originalSalesMaterial
    )
  }
)
