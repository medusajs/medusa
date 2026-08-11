import type {
  AdditionalData,
  CreatePromotionDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createPromotionsStep } from "../steps"

/**
 * The data to create one or more promotions, along with custom data that's passed to the workflow's hooks.
 */
export type CreatePromotionsWorkflowInput = {
  /**
   * The promotions to create.
   */
  promotionsData: CreatePromotionDTO[]
} & AdditionalData

export const createPromotionsWorkflowId = "create-promotions"
/**
 * This workflow creates one or more promotions. It's used by the [Create Promotion Admin API Route](https://docs.medusajs.com/api/admin/promotions/create-promotion).
 *
 * This workflow has a hook that allows you to perform custom actions on the created promotion. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the promotions.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around creating promotions.
 *
 * @example
 * const { result } = await createPromotionsWorkflow(container)
 * .run({
 *   input: {
 *     promotionsData: [
 *       {
 *         code: "10OFF",
 *         type: "standard",
 *         status: "active",
 *         application_method: {
 *           type: "percentage",
 *           target_type: "items",
 *           allocation: "across",
 *           value: 10,
 *           currency_code: "usd"
 *         }
 *       }
 *     ],
 *     additional_data: {
 *       external_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create one or more promotions.
 *
 * @property hooks.promotionsCreated - This hook is executed after the promotions are created. You can consume this hook to perform custom actions on the created promotions.
 */
export const createPromotionsWorkflow = createWorkflow(
  createPromotionsWorkflowId,
  (input: WorkflowData<CreatePromotionsWorkflowInput>) => {
    const createdPromotions = createPromotionsStep(input.promotionsData)
    const promotionsCreated = createHook("promotionsCreated", {
      promotions: createdPromotions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdPromotions, {
      hooks: [promotionsCreated],
    })
  }
)
