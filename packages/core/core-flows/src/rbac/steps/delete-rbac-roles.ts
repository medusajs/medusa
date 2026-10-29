import {
  MedusaError,
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * @ignore
 */
export type DeleteRbacRolesStepInput = string[]

/**
 * @ignore
 */
export const deleteRbacRolesStepId = "delete-rbac-roles"

/**
 * This step soft-deletes one or more RBAC roles. The built-in super admin role
 * can't be deleted.
 * @param ids - The IDs of the roles to delete
 * @param container - The workflow container
 * @returns A step response with the deleted role IDs
 * @ignore
 */
export const deleteRbacRolesStep = createStep(
  deleteRbacRolesStepId,
  async (ids: DeleteRbacRolesStepInput, { container }) => {
    if (!ids?.length) {
      return new StepResponse([], [])
    }

    if (ids.includes(RBAC_SUPER_ADMIN_ROLE_ID)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The super admin role can't be deleted"
      )
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await service.softDeleteRbacRoles(ids)

    return new StepResponse(ids, ids)
  },
  async (deletedRoleIds, { container }) => {
    if (!deletedRoleIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await service.restoreRbacRoles(deletedRoleIds)
  }
)
