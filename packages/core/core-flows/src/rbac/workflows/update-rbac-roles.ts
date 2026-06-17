import { isDefined } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { UpdateRbacRoleDTO } from "@medusajs/types"
import { createRbacRolePoliciesStep, setRoleParentStep } from "../steps"
import { updateRbacRolesStep } from "../steps/update-rbac-roles"
import { validateUserPermissionsStep } from "../steps/validate-user-permissions"

/**
 * The data to update RBAC roles.
 */
export type UpdateRbacRolesWorkflowInput = {
  /**
   * The ID of the actor (for example, a user) updating the roles. It's used to
   * validate that the actor has access to the policies they're assigning.
   */
  actor_id?: string
  /**
   * The type of the actor updating the roles, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The filters to select the roles to update.
   */
  selector: Record<string, any>
  /**
   * The data to update in the selected roles.
   */
  update: Omit<UpdateRbacRoleDTO, "id"> & {
    /**
     * The IDs of the roles that the selected roles inherit from. If provided,
     * the parent roles are replaced with the new set.
     */
    parent_ids?: string[]
    /**
     * The IDs of the policies to assign to the selected roles.
     */
    policy_ids?: string[]
  }
}

/**
 * @featureFlag rbac
 */
export const updateRbacRolesWorkflowId = "update-rbac-roles"

/**
 * This workflow updates one or more RBAC roles matching the specified filters. It can
 * also update the roles' parent roles and assigned policies. If an `actor_id` is
 * provided, the workflow validates that the actor has access to all the policies
 * they're assigning before updating the roles.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to update RBAC roles within your custom flows.
 *
 * @example
 * const { result } = await updateRbacRolesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "role_123"
 *     },
 *     update: {
 *       name: "Order Manager",
 *       policy_ids: ["pol_123"]
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more RBAC roles.
 *
 * @featureFlag rbac
 */
export const updateRbacRolesWorkflow = createWorkflow(
  updateRbacRolesWorkflowId,
  (input: WorkflowData<UpdateRbacRolesWorkflowInput>) => {
    const validationData = transform({ input }, ({ input }) => {
      const policyIds = input.update.policy_ids || []
      return {
        actor_id: input.actor_id!,
        policy_ids: policyIds,
        actor: input.actor,
      }
    })

    when({ validationData }, ({ validationData }) => {
      return !!validationData?.actor_id && !!validationData?.policy_ids?.length
    }).then(() => {
      validateUserPermissionsStep(validationData)
    })

    const roleUpdateData = transform({ input }, ({ input }) => ({
      selector: input.selector,
      update: {
        name: input.update.name,
        description: input.update.description,
        metadata: input.update.metadata,
      },
    }))

    const updatedRoles = updateRbacRolesStep(roleUpdateData)

    const parentUpdateData = transform(
      { input, updatedRoles },
      ({ input, updatedRoles }) => {
        if (!isDefined(input.update.parent_ids)) {
          return []
        }

        return updatedRoles.map((role) => ({
          role_id: role.id,
          parent_ids: input.update.parent_ids || [],
        }))
      }
    )

    setRoleParentStep(parentUpdateData)

    const policiesUpdateData = transform(
      { input, updatedRoles },
      ({ input, updatedRoles }) => {
        if (!isDefined(input.update.policy_ids)) {
          return { policies: [] }
        }

        const allPolicies: any[] = []
        updatedRoles.forEach((role) => {
          const policyIds = input.update.policy_ids || []
          policyIds.forEach((policyId) => {
            allPolicies.push({
              role_id: role.id,
              policy_id: policyId,
            })
          })
        })
        return { policies: allPolicies }
      }
    )

    createRbacRolePoliciesStep(policiesUpdateData)

    return new WorkflowResponse(updatedRoles)
  }
)
