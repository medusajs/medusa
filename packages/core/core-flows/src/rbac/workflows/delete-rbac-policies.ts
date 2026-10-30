import {
  WorkflowData,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { deleteRbacPoliciesStep } from "../steps"
import { validateActorPermissionsStep } from "../steps/validate-actor-permissions"

/**
 * @ignore
 */
export type DeleteRbacPoliciesWorkflowInput = {
  ids: string[]
  /**
   * The actor deleting the policies. When provided, the actor must hold every
   * policy being deleted, mirroring the check applied when attaching them.
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
 */
export const deleteRbacPoliciesWorkflowId = "delete-rbac-policies"

/**
 * This workflow deletes RBAC policies. When an actor is provided, it validates
 * that the actor holds every policy being deleted.
 * @ignore
 */
export const deleteRbacPoliciesWorkflow = createWorkflow(
  deleteRbacPoliciesWorkflowId,
  (
    input: WorkflowData<DeleteRbacPoliciesWorkflowInput>
  ): WorkflowData<void> => {
    when(
      { input },
      ({ input }) => !!input.actor_id && !!input.ids?.length
    ).then(() => {
      const validationData = transform({ input }, ({ input }) => ({
        actor_id: input.actor_id!,
        actor: input.actor,
        policy_ids: input.ids,
      }))

      validateActorPermissionsStep(validationData)
    })

    deleteRbacPoliciesStep(input.ids)
  }
)
