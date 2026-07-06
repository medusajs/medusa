import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { createRbacRolePoliciesStep } from "../steps"
import { validateUserPermissionsStep } from "../steps/validate-user-permissions"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacRolePoliciesWorkflowInput = {
  actor_id?: string
  actor?: string
  policies: {
    role_id: string
    policy_id: string
  }[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacRolePoliciesWorkflowId = "create-rbac-role-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacRolePoliciesWorkflow = createWorkflow(
  createRbacRolePoliciesWorkflowId,
  (input: WorkflowData<CreateRbacRolePoliciesWorkflowInput>) => {
    const validationData = transform({ input }, ({ input }) => {
      if (!input.actor_id) {
        return null
      }

      const policyIds = new Set<string>()
      input.policies.forEach((rp) => policyIds.add(rp.policy_id))

      return {
        actor_id: input.actor_id,
        actor: input.actor,
        policy_ids: Array.from(policyIds),
      }
    })

    when({ validationData }, ({ validationData }) => {
      return !!validationData?.actor_id && !!validationData?.policy_ids?.length
    }).then(() => {
      validateUserPermissionsStep(validationData)
    })

    const rolePolicies = createRbacRolePoliciesStep({
      policies: input.policies,
    })

    return new WorkflowResponse(rolePolicies)
  }
)
