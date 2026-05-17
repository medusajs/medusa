import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteBasicMaterialStep = createStep(
  "delete-basic-material",
  async (input: { id: string }, { container }) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const basicMaterial = await materialModule.retrieveBasicMaterial(input.id)
    await materialModule.deleteBasicMaterials(input.id)
    return new StepResponse(void 0, basicMaterial)
  },
  async (basicMaterial, { container }) => {
    if (!basicMaterial) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.createBasicMaterials(basicMaterial)
  }
)
