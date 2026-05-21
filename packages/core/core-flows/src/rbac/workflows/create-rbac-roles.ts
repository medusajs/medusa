import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createRbacRoleParentsStep,
  createRbacRolePoliciesStep,
  createRbacRolesStep,
} from "../steps"
import { validateUserPermissionsStep } from "../steps/validate-user-permissions"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacRolesWorkflowInput = {
  actor_id?: string
  actor?: string
  roles: {
    name: string
    description?: string | null
    metadata?: Record<string, unknown> | null
    parent_ids?: string[]
    policy_ids?: string[]
  }[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacRolesWorkflowId = "create-rbac-roles"

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacRolesWorkflow = createWorkflow(
  createRbacRolesWorkflowId,
  (input: WorkflowData<CreateRbacRolesWorkflowInput>) => {
    const validationData = transform({ input }, ({ input }) => {
      const allPolicyIds = new Set<string>()
      input.roles.forEach((role) => {
        role.policy_ids?.forEach((policyId) => allPolicyIds.add(policyId))
      })
      return {
        actor_id: input.actor_id!,
        actor: input.actor,
        policy_ids: Array.from(allPolicyIds),
      }
    })

    when({ validationData }, ({ validationData }) => {
      return !!validationData?.actor_id && !!validationData?.policy_ids?.length
    }).then(() => {
      validateUserPermissionsStep(validationData)
    })

    const roleData = transform({ input }, ({ input }) => ({
      roles: input.roles.map((r) => ({
        name: r.name,
        description: r.description,
        metadata: r.metadata,
      })),
    }))

    const createdRoles = createRbacRolesStep(roleData)

    const parentData = transform(
      { input, createdRoles },
      ({ input, createdRoles }) => {
        const parents: any[] = []

        createdRoles.forEach((role, index) => {
          const inheritedRoleIds = input.roles[index].parent_ids || []
          inheritedRoleIds.forEach((inheritedRoleId) => {
            parents.push({
              role_id: role.id,
              parent_id: inheritedRoleId,
            })
          })
        })

        return { role_parents: parents }
      }
    )

    const policiesData = transform(
      { input, createdRoles },
      ({ input, createdRoles }) => {
        const allPolicies: any[] = []
        createdRoles.forEach((role, index) => {
          const policyIds = input.roles[index].policy_ids || []
          policyIds.forEach((policy_id) => {
            allPolicies.push({
              role_id: role.id,
              policy_id: policy_id,
            })
          })
        })
        return { policies: allPolicies }
      }
    )

    createRbacRoleParentsStep(parentData)

    createRbacRolePoliciesStep(policiesData)

    return new WorkflowResponse(createdRoles)
  }
)
