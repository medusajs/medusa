import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteSalesMaterialStep = createStep(
  "delete-sales-material",
  async (input: { id: string }, { container }) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const salesMaterial = await materialModule.retrieveSalesMaterial(input.id)
    await materialModule.deleteSalesMaterials(input.id)
    return new StepResponse(void 0, salesMaterial)
  },
  async (salesMaterial, { container }) => {
    if (!salesMaterial) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.createSalesMaterials(salesMaterial)
  }
)
