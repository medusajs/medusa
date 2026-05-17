import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateBasicMaterialStep = createStep(
  "update-basic-material",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const basicMaterial = await materialModule.updateBasicMaterials(
      input.id,
      input
    )
    return new StepResponse(basicMaterial, basicMaterial)
  },
  async (originalBasicMaterial, { container }) => {
    if (!originalBasicMaterial) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.updateBasicMaterials(
      originalBasicMaterial.id,
      originalBasicMaterial
    )
  }
)
