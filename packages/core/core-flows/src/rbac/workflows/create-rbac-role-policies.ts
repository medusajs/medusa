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
 * The data to assign policies to roles.
 */
export type CreateRbacRolePoliciesWorkflowInput = {
  /**
   * The ID of the actor (for example, a user) creating the role-policy assignments.
   * It's used to validate that the actor has access to the policies they're assigning.
   */
  actor_id?: string
  /**
   * The type of the actor, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The role-policy assignments to create.
   */
  policies: {
    /**
     * The ID of the role to assign the policy to.
     */
    role_id: string
    /**
     * The ID of the policy to assign to the role.
     */
    policy_id: string
  }[]
}

/**
 * @featureFlag rbac
 */
export const createRbacRolePoliciesWorkflowId = "create-rbac-role-policies"

/**
 * This workflow assigns one or more policies to roles by creating role-policy
 * associations. If an `actor_id` is provided, the workflow validates that the actor
 * has access to all the policies they're assigning before creating the associations.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to assign policies to RBAC roles within your custom flows.
 *
 * @example
 * const { result } = await createRbacRolePoliciesWorkflow(container)
 * .run({
 *   input: {
 *     policies: [
 *       {
 *         role_id: "role_123",
 *         policy_id: "pol_123"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Assign one or more policies to RBAC roles.
 *
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
