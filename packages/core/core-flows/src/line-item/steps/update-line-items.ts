import {
  ICartModuleService,
  UpdateLineItemWithSelectorDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
  removeUndefined,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateLineItemsStepWithSelectorId =
  "update-line-items-with-selector"
/**
 * This step updates line items.
 */
export const updateLineItemsStepWithSelector = createStep(
  updateLineItemsStepWithSelectorId,
  async (input: UpdateLineItemWithSelectorDTO, { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.data,
    ])

    const itemsBefore = await service.listLineItems(input.selector, {
      select: selects,
      relations,
    })

    const items = await service.updateLineItems(input.selector, input.data)

    return new StepResponse(items, itemsBefore)
  },
  async (itemsBefore, { container }) => {
    if (!itemsBefore) {
      return
    }

    const service = container.resolve<ICartModuleService>(Modules.CART)

    await promiseAll(
      itemsBefore.map(async (i) =>
        service.updateLineItems(
          i.id,
          removeUndefined({
            quantity: i.quantity,
            title: i.title,
            metadata: i.metadata,
            unit_price: i.unit_price,
            tax_lines: i.tax_lines,
            adjustments: i.adjustments,
          })
        )
      )
    )
  }
)
