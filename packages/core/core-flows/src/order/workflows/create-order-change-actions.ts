import {
  CreateOrderChangeActionDTO,
  OrderChangeActionDTO,
} from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createEntitiesStep } from "../../common/steps/create-entities"

export const createOrderChangeActionsWorkflowId = "create-order-change-actions"
/**
 * This workflow creates order change actions.
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
