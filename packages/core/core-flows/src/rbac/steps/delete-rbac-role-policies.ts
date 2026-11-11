import {
  MedusaError,
  Modules,
  RBAC_SUPER_ADMIN_POLICY_ID,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * @since 2.22.4
 */
export type DeleteRbacRolePoliciesStepInput = string[]

/**
 * @since 2.22.4
 */
export const deleteRbacRolePoliciesStepId = "delete-rbac-role-policies"

/**
 * This step detaches one or more policies from roles. The built-in super admin
 * policy can't be detached from the super admin role.
 * @since 2.22.4
 */
export const deleteRbacRolePoliciesStep = createStep(
  { name: deleteRbacRolePoliciesStepId, noCompensation: true },
  async (ids: DeleteRbacRolePoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    const [superAdminRolePolicy] = await service.listRbacRolePolicies(
      {
        id: ids,
        role_id: RBAC_SUPER_ADMIN_ROLE_ID,
        policy_id: RBAC_SUPER_ADMIN_POLICY_ID,
      },
      { select: ["id"], take: 1 }
    )

    if (superAdminRolePolicy) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The super admin policy can't be detached from the super admin role"
      )
    }

    const deleted = await service.deleteRbacRolePolicies(ids)

    return new StepResponse(deleted, ids)
  },
  async (deletedRolePolicyIds, { container }) => {
    if (!deletedRolePolicyIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.restoreRbacRolePolicies(deletedRolePolicyIds)
  }
)
