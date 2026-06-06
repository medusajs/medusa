import {
  CreateOrderChangeActionDTO,
  OrderChangeActionDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { createEntitiesStep } from "../../common/steps/create-entities"

export const createOrderChangeActionsWorkflowId = "create-order-change-actions"
/**
 * This workflow creates order change actions. It's used by other order-related workflows,
 * such as {@link requestItemReturnWorkflow} to create an order change action based on changes made to the order.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * creating an order change action.
 *
 * @summary
 *
 * Create an order change action.
 */
export const createOrderChangeActionsWorkflow = createWorkflow(
  createOrderChangeActionsWorkflowId,
  (
    input: WorkflowData<CreateOrderChangeActionDTO[]>
  ): WorkflowResponse<OrderChangeActionDTO[]> => {
    const orderChangeActions = createEntitiesStep({
      moduleRegistrationName: Modules.ORDER,
      invokeMethod: "addOrderAction",
      compensateMethod: "deleteOrderChangeActions",
      data: input,
    })

    return new WorkflowResponse(orderChangeActions)
  }
)
