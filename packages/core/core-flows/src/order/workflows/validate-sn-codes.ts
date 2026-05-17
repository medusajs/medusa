import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  ValidateSnCodesStepInput,
  validateSnCodesStep,
} from "../steps/validate-sn-codes"

export const validateSnCodesWorkflowId = "validate-sn-codes"

/**
 * This workflow validates SN codes for items during order fulfillment.
 *
 * @example
 * const { result } = await validateSnCodesWorkflow(container)
 *   .run({
 *     input: {
 *       items: [
 *         {
 *           variant_id: "variant_123",
 *           quantity: 2,
 *           sn_codes: ["SN001", "SN002"]
 *         }
 *       ]
 *     }
 *   })
 */
export const validateSnCodesWorkflow = createWorkflow(
  validateSnCodesWorkflowId,
  (input: WorkflowData<ValidateSnCodesStepInput>) => {
    validateSnCodesStep(input)
    return new WorkflowResponse(void 0)
  }
)
