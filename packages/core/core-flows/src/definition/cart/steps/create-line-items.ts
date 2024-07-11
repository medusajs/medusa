import { CreateLineItemForCartDTO, ICartModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  id: string
  items: CreateLineItemForCartDTO[]
}

export const createLineItemsStepId = "create-line-items-step"
export const createLineItemsStep = createStep(
  createLineItemsStepId,
  async (data: StepInput, { container }) => {
    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const createdItems = data.items.length
      ? await cartModule.addLineItems(data.items)
      : []

    return new StepResponse(createdItems, createdItems)
  },
  async (createdItems, { container }) => {
    if (!createdItems?.length) {
      return
    }

    const cartModule: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    await cartModule.deleteLineItems(createdItems.map((c) => c.id))
  }
)
