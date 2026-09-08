import {
  AdditionalData,
  PromotionDTO,
  PromotionStatusValues,
  UpdatePromotionDTO,
} from "@medusajs/framework/types"
import { isString } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { updatePromotionsStep } from "../steps"
import { updatePromotionsStatusWorkflow } from "./update-promotions-status"

/**
 * The data to update one or more promotions, along with custom data that's passed to the workflow's hooks.
 */
export type UpdatePromotionsWorkflowInput = {
  /**
   * The promotions to update.
   */
  promotionsData: UpdatePromotionDTO[]
} & AdditionalData

export const updatePromotionsWorkflowId = "update-promotions"
/**
 * This workflow updates one or more promotions. It's used by the [Update Promotion Admin API Route](https://docs.medusajs.com/api/admin/promotions/update-a-promotion).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated promotion. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the promotions.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around updating promotions.
 *
 * @example
 * const { result } = await updatePromotionsWorkflow(container)
 * .run({
 *   input: {
 *     promotionsData: [
 *       {
 *         id: "promo_123",
 *         code: "10OFF",
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
 * Update one or more promotions.
 *
 * @property hooks.promotionsUpdated - This hook is executed after the promotions are updated. You can consume this hook to perform custom actions on the updated promotions.
 */
export const updatePromotionsWorkflow = createWorkflow(
  updatePromotionsWorkflowId,
  (input: WorkflowData<UpdatePromotionsWorkflowInput>) => {
    const promotionIds = transform({ input }, ({ input }) =>
      input.promotionsData.map((pd) => pd.id)
    )

    const promotions = useRemoteQueryStep({
      entry_point: "promotion",
      variables: { id: promotionIds },
      fields: ["id", "status"],
      list: true,
      throw_if_key_not_found: true,
    }).config({ name: "get-promotions" })

    const promotionInputs = transform(
      { promotions, input },
      ({ promotions, input }) => {
        const promotionMap: Record<string, PromotionDTO> = {}
        const promotionsUpdateInput: UpdatePromotionsWorkflowInput["promotionsData"] =
          []
        const promotionsStatusUpdateInput: {
          id: string
          status: PromotionStatusValues
        }[] = []

        for (const promotion of promotions) {
          promotionMap[promotion.id] = promotion
        }

        for (const promotionUpdateData of input.promotionsData) {
          const promotion = promotionMap[promotionUpdateData.id]
          const { status, ...rest } = promotionUpdateData

          promotionsUpdateInput.push(rest)

          if (
            isString(status) &&
            promotionUpdateData.status !== promotion.status
          ) {
            promotionsStatusUpdateInput.push({
              id: promotionUpdateData.id,
              status,
            })
          }
        }

        return { promotionsUpdateInput, promotionsStatusUpdateInput }
      }
    )

    const updatedPromotions = updatePromotionsStep(
      promotionInputs.promotionsUpdateInput
    )

    when({ promotionInputs }, ({ promotionInputs }) => {
      return !!promotionInputs.promotionsStatusUpdateInput?.length
    }).then(() => {
      updatePromotionsStatusWorkflow.runAsStep({
        input: {
          promotionsData: promotionInputs.promotionsStatusUpdateInput,
        },
      })
    })

    const promotionsUpdated = createHook("promotionsUpdated", {
      promotions: updatedPromotions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedPromotions, {
      hooks: [promotionsUpdated],
    })
  }
)
