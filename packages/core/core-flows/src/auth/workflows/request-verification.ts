import type { AuthTypes } from "@medusajs/framework/types"
import { AuthWorkflowEvents } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { requestVerificationStep } from "../steps"

/**
 * The ID of the request verification workflow.
 *
 * @since 2.15.5
 */
export const requestVerificationWorkflowId = "request-verification-workflow"

/**
 * This workflow requests authentication verification.
 *
 * @since 2.15.5
 */
export const requestVerificationWorkflow = createWorkflow(
  requestVerificationWorkflowId,
  (
    input: WorkflowData<AuthTypes.RequestAuthVerificationDTO>
  ): WorkflowResponse<AuthTypes.AuthVerificationDTO> => {
    const result = requestVerificationStep(input)

    const eventData = transform({ input, result }, ({ input, result }) => {
      return {
        entity_id: result.entity_id,
        entity_type: result.entity_type,
        code_provider: result.code_provider,
        auth_identity_id: result.auth_identity_id,
        code: result.code,
        expires_at: result.expires_at,
        metadata: result.metadata ?? {},
      }
    })

    emitEventStep({
      eventName: AuthWorkflowEvents.VERIFICATION_REQUESTED,
      data: eventData,
    })

    const verification = transform({ result }, (data) => {
      return {
        ...data.result,
        code: undefined,
        expires_at: undefined,
      }
    })

    return new WorkflowResponse(verification)
  }
)
