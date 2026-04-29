import {
  getSelectsAndRelationsFromObjectArray,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService, UpdateRbacRoleDTO } from "@medusajs/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UpdateRbacRolesStepInput = {
  selector: Record<string, any>
  update: Omit<UpdateRbacRoleDTO, "id">
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacRolesStepId = "update-rbac-roles"

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacRolesStep = createStep(
  updateRbacRolesStepId,
  async (data: UpdateRbacRolesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listRbacRoles(data.selector, {
      select: selects,
      relations,
    })

    const updates = (prevData ?? []).map((r) => ({
      id: r.id,
      ...data.update,
    })) as UpdateRbacRoleDTO[]

    const updated = await service.updateRbacRoles(updates)

    return new StepResponse(updated, {
      prevData,
      updateKeys: Object.keys(data.update ?? {}),
    })
  },
  async (
    compensationData: { prevData: any[]; updateKeys: string[] } | undefined,
    { container }
  ) => {
    if (!compensationData?.prevData?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const updates = compensationData.prevData.map((r) => {
      const payload: Record<string, any> = { id: r.id }
      for (const key of compensationData.updateKeys) {
        payload[key] = r[key]
      }
      return payload
    }) as UpdateRbacRoleDTO[]

    await service.updateRbacRoles(updates)
  }
)
