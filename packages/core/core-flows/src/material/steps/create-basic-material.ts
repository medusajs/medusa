import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createBasicMaterialStep = createStep(
  "create-basic-material",
  async (
    input: {
      material_code: string
      material_name: string
      [key: string]: unknown
    },
    { container }
  ) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const basicMaterial = await materialModule.createBasicMaterials(input)
    return new StepResponse(basicMaterial, basicMaterial.id)
  },
  async (basicMaterialId, { container }) => {
    if (!basicMaterialId) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.deleteBasicMaterials(basicMaterialId)
  }
)
