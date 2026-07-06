import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 */
export const validateRolesExistStepId = "validate-roles-exist-step"

/**
 * This step validates that the provided role IDs exist in the RBAC module.
 * Throws an error if any role is not found.
 *
 * @example
 * validateRolesExistStep(["role_123", "role_456"])
 * @ignore
 * @featureFlag rbac
 */
export const validateRolesExistStep = createStep(
  validateRolesExistStepId,
  async (roleIds: string[], { container }) => {
    if (!roleIds.length) {
      return new StepResponse(undefined)
    }

    const rbacService = container.resolve(Modules.RBAC)
    const existingRoles = await rbacService.listRbacRoles({
      id: roleIds,
    })

    const existingRoleIds = new Set(existingRoles.map((r) => r.id))
    const missingRoles = roleIds.filter((id) => !existingRoleIds.has(id))

    if (missingRoles.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The following role IDs do not exist: ${missingRoles.join(", ")}`
      )
    }

    return new StepResponse(undefined)
  }
)
