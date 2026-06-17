import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * The data to create an RBAC role.
 */
export type CreateRbacRoleDTO = {
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
}

/**
 * The input to create RBAC roles.
 */
export type CreateRbacRolesStepInput = {
  /**
   * The roles to create.
   */
  roles: CreateRbacRoleDTO[]
}

/**
 * @featureFlag rbac
 */
export const createRbacRolesStepId = "create-rbac-roles"

/**
 * This step creates one or more RBAC roles.
 *
 * @example
 * const data = createRbacRolesStep({
 *   roles: [
 *     {
 *       name: "Order Manager",
 *       description: "Can manage orders"
 *     }
 *   ]
 * })
 *
 * @featureFlag rbac
 */
export const createRbacRolesStep = createStep(
  createRbacRolesStepId,
  async (data: CreateRbacRolesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!data.roles?.length) {
      return new StepResponse([], [])
    }
    const created = await service.createRbacRoles(data.roles)

    return new StepResponse(
      created,
      (created ?? []).map((r) => r.id)
    )
  },
  async (createdIds: string[] | undefined, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.deleteRbacRoles(createdIds)
  }
)
