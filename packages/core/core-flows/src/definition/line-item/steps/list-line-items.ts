import {
  CartLineItemDTO,
  FilterableLineItemProps,
  FindConfig,
  ICartModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  filters: FilterableLineItemProps
  config?: FindConfig<CartLineItemDTO>
}

export const listLineItemsStepId = "list-line-items"
export const listLineItemsStep = createStep(
  listLineItemsStepId,
  async (data: StepInput, { container }) => {
    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const items = await service.listLineItems(data.filters, data.config)

    return new StepResponse(items)
  }
)
