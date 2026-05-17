import { IMaterialModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteComboItemStep = createStep(
  "delete-combo-item",
  async (input: { id: string }, { container }) => {
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    const comboItem = await materialModule.retrieveComboItem(input.id)
    await materialModule.deleteComboItems(input.id)
    return new StepResponse(void 0, comboItem)
  },
  async (comboItem, { container }) => {
    if (!comboItem) return
    const materialModule = container.resolve<IMaterialModuleService>(
      Modules.MATERIAL
    )
    await materialModule.createComboItems(comboItem)
  }
)
