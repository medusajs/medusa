import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { IRbacModuleService } from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 */
export type EnsureSuperAdminRemainsStepInput = {
  /**
   * The IDs of the role assignments about to be removed.
   */
  excluded_assignment_ids: string[]
}

/**
 * @ignore
 */
export const ensureSuperAdminRemainsStepId = "ensure-super-admin-remains"

/**
 * This step ensures that at least one user keeps the unscoped super admin role
 * once the given role assignments are removed, so that no operation can lock
 * every user out of the RBAC administration.
 *
 * It's a no-op when RBAC is not installed.
 *
 * @ignore
 */
export const ensureSuperAdminRemainsStep = createStep(
  ensureSuperAdminRemainsStepId,
  async (input: EnsureSuperAdminRemainsStepInput, { container }) => {
    if (!MedusaModule.isInstalled(Modules.RBAC)) {
      return new StepResponse(void 0)
    }

    const excludedIds = new Set(input.excluded_assignment_ids)

    if (!excludedIds.size) {
      return new StepResponse(void 0)
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const superAdminAssignments = await service.listRbacRoleAssignments(
      {
        role_id: RBAC_SUPER_ADMIN_ROLE_ID,
        reference: "user",
        scope: null,
        scope_id: null,
      },
      { select: ["id"] }
    )

    const remaining = superAdminAssignments.filter(
      (assignment) => !excludedIds.has(assignment.id)
    )

    if (!remaining.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot remove the last super admin. Assign the super admin role to another user first."
      )
    }

    return new StepResponse(void 0)
  }
)
