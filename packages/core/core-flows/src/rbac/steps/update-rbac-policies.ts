import {
  getSelectsAndRelationsFromObjectArray,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService, UpdateRbacPolicyDTO } from "@medusajs/types"

/**
 * The input to update RBAC policies.
 */
export type UpdateRbacPoliciesStepInput = {
  /**
   * The filters to select the policies to update.
   */
  selector: Record<string, any>
  /**
   * The data to update in the selected policies.
   */
  update: Omit<UpdateRbacPolicyDTO, "id">
}

/**
 * @featureFlag rbac
 */
export const updateRbacPoliciesStepId = "update-rbac-policies"

/**
 * This step updates the RBAC policies matching the specified filters. If the update
 * includes a `resource` or `operation`, they're normalized to lowercase.
 *
 * @example
 * const data = updateRbacPoliciesStep({
 *   selector: {
 *     id: "pol_123"
 *   },
 *   update: {
 *     operation: "write"
 *   }
 * })
 *
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
