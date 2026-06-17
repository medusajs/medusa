import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { CreateRbacPolicyDTO, IRbacModuleService } from "@medusajs/types"

/**
 * The input to create one or more RBAC policies.
 */
export type CreateRbacPoliciesStepInput = {
  /**
   * The policies to create.
   */
  policies: CreateRbacPolicyDTO[]
}

/**
 */
export const createRbacPoliciesStepId = "create-rbac-policies"

/**
 * This step creates one or more RBAC policies. The `resource` and `operation` of each
 * policy are normalized to lowercase before they're created.
 *
 * @example
 * const data = createRbacPoliciesStep({
 *   policies: [
 *     {
 *       resource: "order",
 *       operation: "read"
 *     }
 *   ]
 * })
 *
 * @featureFlag rbac
 */
export const createRbacPoliciesStep = createStep(
  createRbacPoliciesStepId,
  async (data: CreateRbacPoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    // Normalize resource and operation to lowercase
    const normalizedPolicies = data.policies.map((policy) => ({
      ...policy,
      resource: policy.resource.toLowerCase(),
      operation: policy.operation.toLowerCase(),
    }))

    const created = await service.createRbacPolicies(normalizedPolicies)

    return new StepResponse(
      created,
      (created ?? []).map((p) => p.id)
    )
  },
  async (createdIds: string[] | undefined, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.deleteRbacPolicies(createdIds)
  }
)
