import { RbacScope } from "@medusajs/framework/types"
import { isDefined } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { UpdateRbacRoleDTO } from "@medusajs/framework/types"
import { createRbacRolePoliciesStep, setRoleParentStep } from "../steps"
import { updateRbacRolesStep } from "../steps/update-rbac-roles"
import { validateActorPermissionsStep } from "../steps/validate-actor-permissions"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UpdateRbacRolesWorkflowInput = {
  actor_id?: string
  actor?: string
  /**
   * Scope context the grant happens within. Omitted = the
   * actor's full scope-union.
   */
  scope?: RbacScope
  selector: Record<string, any>
  update: Omit<UpdateRbacRoleDTO, "id"> & {
    parent_ids?: string[]
    policy_ids?: string[]
  }
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacRolesWorkflowId = "update-rbac-roles"

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacRolesWorkflow = createWorkflow(
  updateRbacRolesWorkflowId,
  (input: WorkflowData<UpdateRbacRolesWorkflowInput>) => {
    // TODO: [rbac] revisit this when we implement role resolution
    const validationData = transform({ input }, ({ input }) => {
      const policyIds = input.update.policy_ids || []
      return {
        actor_id: input.actor_id!,
        policy_ids: policyIds,
        actor: input.actor,
        scope: input.scope,
      }
    })

    when({ validationData }, ({ validationData }) => {
      return !!validationData?.actor_id && !!validationData?.policy_ids?.length
    }).then(() => {
      validateActorPermissionsStep(validationData)
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
