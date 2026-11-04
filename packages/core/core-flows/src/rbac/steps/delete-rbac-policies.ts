import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  RBAC_SUPER_ADMIN_POLICY_ID,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService, MedusaContainer } from "@medusajs/types"

/**
 * @ignore
 */
export type DeleteRbacPoliciesStepInput = string[]

/**
 * @ignore
 */
export const deleteRbacPoliciesStepId = "delete-rbac-policies"

/**
 * Throws when any of the policies is still held by a role, naming the roles,
 * so that deleting a policy never silently changes what a role grants.
 */
async function ensurePoliciesNotHeldByRoles(
  container: MedusaContainer,
  ids: string[]
): Promise<void> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: rolePolicies } = await query.graph({
    entity: "rbac_role_policy",
    fields: ["policy.key", "role.name"],
    filters: { policy_id: ids },
  })

  const rolesByPolicyKey = new Map<string, Set<string>>()
  for (const { policy, role } of rolePolicies) {
    if (!policy || !role) {
      continue
    }
    const roles = rolesByPolicyKey.get(policy.key) ?? new Set<string>()
    rolesByPolicyKey.set(policy.key, roles.add(role.name))
  }

  if (!rolesByPolicyKey.size) {
    return
  }

  const details = Array.from(rolesByPolicyKey)
    .map(
      ([key, roles]) =>
        `Policy ${key} can't be deleted while roles hold it. Remove it from these roles first: ${Array.from(
          roles
        )
          .sort()
          .join(", ")}`
    )
    .join("\n")

  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, details)
}

/**
 * This step deletes one or more RBAC policies. The built-in super admin policy
 * can't be deleted, and neither can a policy that a role still holds.
 * @ignore
 */
export const deleteRbacPoliciesStep = createStep(
  { name: deleteRbacPoliciesStepId, noCompensation: true },
  async (ids: DeleteRbacPoliciesStepInput, { container }) => {
    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    if (ids.includes(RBAC_SUPER_ADMIN_POLICY_ID)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The super admin policy can't be deleted"
      )
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await ensurePoliciesNotHeldByRoles(container, ids)

    await service.softDeleteRbacPolicies(ids)

    return new StepResponse(ids, ids)
  },
  async (deletedPoliciesIds, { container }) => {
    if (!deletedPoliciesIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await service.restoreRbacPolicies(deletedPoliciesIds)
  }
)
