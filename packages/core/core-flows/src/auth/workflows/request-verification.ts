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

export const requestVerificationWorkflowId = "request-verification-workflow"

export const requestVerificationWorkflow = createWorkflow(
  requestVerificationWorkflowId,
  (
    input: WorkflowData<AuthTypes.RequestAuthVerificationDTO>
  ): WorkflowResponse<
    AuthTypes.RequestAuthVerificationResponse["verification"]
  > => {
    const result = requestVerificationStep(input)

    const eventData = transform({ input, result }, ({ input, result }) => {
      return {
        entity_id: result.verification.entity_id,
        actor_type: input.actor_type ?? null,
        provider: input.provider,
        auth_identity_id: result.verification.auth_identity_id,
        provider_identity_id: result.verification.provider_identity_id,
        token: result.token,
        expires_at: result.verification.expires_at,
        metadata: result.verification.metadata ?? {},
      }
    })

    emitEventStep({
      eventName: AuthWorkflowEvents.VERIFICATION_REQUESTED,
      data: eventData,
    })

    const verification = transform({ result }, ({ result }) => {
      return result.verification
    })

    return new WorkflowResponse(verification)
  }
)
