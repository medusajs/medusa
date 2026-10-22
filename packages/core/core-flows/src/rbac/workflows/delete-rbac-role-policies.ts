import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { deleteRbacRolePoliciesStep } from "../steps"
import { validateActorPermissionsStep } from "../steps/validate-actor-permissions"

/**
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRbacRolePoliciesWorkflowInput = {
  role_policy_ids: string[]
  /**
   * The actor detaching the policies. When provided, the actor must hold every
   * policy being detached, mirroring the check applied when attaching them.
   * Omit for trusted system code.
   */
  actor_id?: string
  /**
   * The actor's type. Defaults to `user`.
   */
  actor?: string
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesWorkflowId = "delete-rbac-role-policies"

/**
 * This workflow detaches policies from roles. When an actor is provided, it
 * validates that the actor holds every policy being detached, so that an
 * actor cannot strip a role of permissions they do not have themselves.
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesWorkflow = createWorkflow(
  deleteRbacRolePoliciesWorkflowId,
  (input: WorkflowData<DeleteRbacRolePoliciesWorkflowInput>) => {
    when(
      { input },
      ({ input }) => !!input.actor_id && !!input.role_policy_ids?.length
    ).then(() => {
      const { data: rolePolicies } = useQueryGraphStep({
        entity: "rbac_role_policy",
        fields: ["policy_id"],
        filters: { id: input.role_policy_ids },
      }).config({ name: "query-role-policies-to-detach" })

      const validationData = transform(
        { input, rolePolicies },
        ({ input, rolePolicies }) => ({
          actor_id: input.actor_id!,
          actor: input.actor,
          policy_ids: Array.from(
            new Set(rolePolicies.map((rolePolicy) => rolePolicy.policy_id))
          ),
        })
      )

      validateActorPermissionsStep(validationData)
    })

    const deletedRolePolicies = deleteRbacRolePoliciesStep(
      input.role_policy_ids
    )

    return new WorkflowResponse(deletedRolePolicies)
  }
)
