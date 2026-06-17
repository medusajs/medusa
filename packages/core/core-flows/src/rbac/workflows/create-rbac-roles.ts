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
 * The data to create RBAC roles.
 */
export type CreateRbacRolesWorkflowInput = {
  /**
   * The ID of the actor (for example, a user) creating the roles. It's used to
   * validate that the actor has access to the policies they're assigning.
   */
  actor_id?: string
  /**
   * The type of the actor creating the roles, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The roles to create.
   */
  roles: {
    /**
     * The role's name.
     */
    name: string
    /**
     * The role's description.
     */
    description?: string | null
    /**
     * Custom key-value pairs to store with the role.
     */
    metadata?: Record<string, unknown> | null
    /**
     * The IDs of the roles that this role inherits from.
     */
    parent_ids?: string[]
    /**
     * The IDs of the policies to assign to the role.
     */
    policy_ids?: string[]
  }[]
}

/**
 * @featureFlag rbac
 */
export const createRbacRolesWorkflowId = "create-rbac-roles"

/**
 * This workflow creates one or more RBAC roles, optionally assigning policies and
 * parent roles to inherit permissions from. If an `actor_id` is provided, the workflow
 * validates that the actor has access to all the policies they're assigning before
 * creating the roles.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to create RBAC roles within your custom flows.
 *
 * @example
 * const { result } = await createRbacRolesWorkflow(container)
 * .run({
 *   input: {
 *     roles: [
 *       {
 *         name: "Order Manager",
 *         description: "Can manage orders",
 *         policy_ids: ["pol_123"],
 *         parent_ids: ["role_456"]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more RBAC roles.
 *
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
