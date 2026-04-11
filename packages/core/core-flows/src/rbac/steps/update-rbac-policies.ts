import {
  getSelectsAndRelationsFromObjectArray,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService, UpdateRbacPolicyDTO } from "@medusajs/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UpdateRbacPoliciesStepInput = {
  selector: Record<string, any>
  update: Omit<UpdateRbacPolicyDTO, "id">
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacPoliciesStepId = "update-rbac-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacPoliciesStep = createStep(
  updateRbacPoliciesStepId,
  async (data: UpdateRbacPoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listRbacPolicies(data.selector, {
      select: selects,
      relations,
    })

    // Normalize resource and operation to lowercase if present
    const normalizedUpdate = { ...data.update }
    if (normalizedUpdate.resource) {
      normalizedUpdate.resource = normalizedUpdate.resource.toLowerCase()
    }
    if (normalizedUpdate.operation) {
      normalizedUpdate.operation = normalizedUpdate.operation.toLowerCase()
    }

    const updates = (prevData ?? []).map((p) => ({
      id: p.id,
      ...normalizedUpdate,
    })) as UpdateRbacPolicyDTO[]

    const updated = await service.updateRbacPolicies(updates)

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

    const updates = compensationData.prevData.map((p) => {
      const payload: Record<string, any> = { id: p.id }
      for (const key of compensationData.updateKeys) {
        payload[key] = p[key]
      }
      return payload
    }) as UpdateRbacPolicyDTO[]

    await service.updateRbacPolicies(updates)
  }
)
