import { Modules } from "@zjedene-medusa/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { deleteEntitiesStep } from "../../common/steps/delete-entities"

export const deleteCartCreditLinesWorkflowId = "delete-cart-credit-lines"
/**
 * This workflow deletes one or more credit lines from a cart.
 */
export const deleteCartCreditLinesWorkflow = createWorkflow(
  deleteCartCreditLinesWorkflowId,
  (input: WorkflowData<{
    /**
     * The IDs of the credit lines to delete.
     */ 
    id: string[]
  }>) => {
    deleteEntitiesStep({
      moduleRegistrationName: Modules.CART,
      invokeMethod: "softDeleteCreditLines",
      compensateMethod: "restoreCreditLines",
      data: input.id,
    })

    return new WorkflowResponse(void 0)
  }
)
