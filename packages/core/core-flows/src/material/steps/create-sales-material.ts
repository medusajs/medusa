import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createSalesMaterialStep = createStep(
  "create-sales-material",
  async (
    input: {
      shop_id: string
      sales_code: string
      sales_name: string
      [key: string]: unknown
    },
    { container }
  ) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const salesMaterial = await materialModule.createSalesMaterials(input)
    return new StepResponse(salesMaterial, salesMaterial.id)
  },
  async (salesMaterialId, { container }) => {
    if (!salesMaterialId) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.deleteSalesMaterials(salesMaterialId)
  }
)
