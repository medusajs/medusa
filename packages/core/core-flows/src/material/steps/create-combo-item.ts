import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createComboItemStep = createStep(
  "create-combo-item",
  async (
    input: {
      parent_material_id: string
      child_material_id: string
      [key: string]: unknown
    },
    { container }
  ) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const comboItem = await materialModule.createComboItems(input)
    return new StepResponse(comboItem, comboItem.id)
  },
  async (comboItemId, { container }) => {
    if (!comboItemId) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.deleteComboItems(comboItemId)
  }
)
