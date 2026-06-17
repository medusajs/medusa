import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * The data to create a role-parent association, establishing that a role inherits
 * permissions from a parent role.
 */
export type CreateRbacRoleParentDTO = {
  /**
   * The ID of the role that inherits permissions.
   */
  role_id: string
  /**
   * The ID of the parent role whose permissions are inherited.
   */
  parent_id: string
  /**
   * Custom key-value pairs to store with the association.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The input to create one or more role-parent associations, establishing role inheritance
 * where a role inherits the permissions of its parent roles.
 */
export type CreateRbacRoleParentsStepInput = {
  /**
   * The role-parent associations to create.
   */
  role_parents: CreateRbacRoleParentDTO[]
}

/**
 */
export const createRbacRoleParentsStepId = "create-rbac-role-parents"

/**
 * This step creates one or more role-parent associations, establishing role inheritance
 * where a role inherits the permissions of its parent roles.
 *
 * @example
 * const data = createRbacRoleParentsStep({
 *   role_parents: [
 *     {
 *       role_id: "role_123",
 *       parent_id: "role_456"
 *     }
 *   ]
 * })
 *
 * @featureFlag rbac
 */
export const createRbacRoleParentsStep = createStep(
  createRbacRoleParentsStepId,
  async (data: CreateRbacRoleParentsStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!data.role_parents?.length) {
      return new StepResponse([], [])
    }

    const created = await service.createRbacRoleParents(data.role_parents)

    return new StepResponse(
      created,
      (created ?? []).map((ri) => ri.id)
    )
  },
  async (createdIds: string[] | undefined, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.deleteRbacRoleParents(createdIds)
  }
)
