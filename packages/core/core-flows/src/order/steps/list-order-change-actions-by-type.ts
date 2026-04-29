import { IOrderModuleService } from "@medusajs/framework/types"
import { ChangeActionType, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * This step lists order change actions filtered by action type.
 * 
 * @since 2.12.0
 */
export const listOrderChangeActionsByTypeStep = createStep(
  "list-order-change-actions-by-type",
  async function (
    {
      order_change_id,
      action_type,
    }: {
      order_change_id: string
      action_type: ChangeActionType
    },
    { container }
  ) {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const actions = await service.listOrderChangeActions(
      {
        order_change_id,
      },
      {
        select: ["id", "action"],
      }
    )

    const filteredActions = actions.filter(
      (action) => action.action === action_type
    )

    return new StepResponse(filteredActions.map((action) => action.id))
  }
)
