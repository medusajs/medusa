import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateComboItemStep = createStep(
  "update-combo-item",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const comboItem = await materialModule.updateComboItems(input.id, input)
    return new StepResponse(comboItem, comboItem)
  },
  async (originalComboItem, { container }) => {
    if (!originalComboItem) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.updateComboItems(
      originalComboItem.id,
      originalComboItem
    )
  }
)
