import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { IRbacModuleService } from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @since 2.22.4
 */
export type EnsureSuperAdminRemainsStepInput = {
  /**
   * The IDs of the role assignments about to be removed.
   */
  excluded_assignment_ids: string[]
}

/**
 * @since 2.22.4
 */
export const ensureSuperAdminRemainsStepId = "ensure-super-admin-remains"

/**
 * The lock key serializing the last-super-admin check with the removal it
 * guards, so that concurrent removals can't both pass the check.
 */
export const SUPER_ADMIN_GUARD_LOCK_KEY = "rbac-super-admin-guard"

/**
 * This step ensures that at least one user keeps the unscoped super admin role
 * once the given role assignments are removed, so that no operation can lock
 * every user out of the RBAC administration.
 *
 * It's a no-op when RBAC is not installed.
 *
 * @since 2.22.4
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

    // Only removals that take the super admin role away from a user can lock
    // everyone out. Other removals pass, even when no user is a super admin.
    if (remaining.length === superAdminAssignments.length) {
      return new StepResponse(void 0)
    }

    if (!remaining.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot remove the last super admin. Assign the super admin role to another user first."
      )
    }

    return new StepResponse(void 0)
  }
)
