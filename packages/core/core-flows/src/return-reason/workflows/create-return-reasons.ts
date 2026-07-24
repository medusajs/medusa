import {
  CreateOrderReturnReasonDTO,
  OrderReturnReasonDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createReturnReasonsStep } from "../steps"

/**
 * The data to create return reasons.
 */
export type CreateReturnReasonsWorkflowInput = {
  /**
   * The return reasons to create.
   */
  data: CreateOrderReturnReasonDTO[]
}

/**
 * The created return reasons.
 */
export type CreateReturnReasonsWorkflowOutput = OrderReturnReasonDTO[]

export const createReturnReasonsWorkflowId = "create-return-reasons"
/**
 * This workflow creates one or more return reasons. It's used by the
 * [Create Return Reason Admin API Route](https://docs.medusajs.com/api/admin/return-reasons/create-return-reason).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create return reasons within your custom flows.
 * 
 * @example
 * const { result } = await createReturnReasonsWorkflow(container)
 * .run({
 *   input: {
 *     data: [
 *       {
 *         label: "Damaged",
 *         value: "damaged",
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Create return reasons.
 */
export const createReturnReasonsWorkflow = createWorkflow(
  createReturnReasonsWorkflowId,
  (
    input: WorkflowData<CreateReturnReasonsWorkflowInput>
  ): WorkflowResponse<CreateReturnReasonsWorkflowOutput> => {
    return new WorkflowResponse(createReturnReasonsStep(input.data))
  }
)
