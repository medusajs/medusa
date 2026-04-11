import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacRoleDTO = {
  name: string
  description?: string | null
  metadata?: Record<string, unknown> | null
}

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacRolesStepInput = {
  roles: CreateRbacRoleDTO[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacRolesStepId = "create-rbac-roles"

/**
 * @ignore
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
