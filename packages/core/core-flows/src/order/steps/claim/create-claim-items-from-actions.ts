import {
  IOrderModuleService,
  OrderChangeActionDTO,
} from "@zjedene-medusa/framework/types"
import { ChangeActionType, Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of creating the claim items from a change action.
 */
export type CreateOrderClaimItemsFromActionsInput = {
  /**
   * The change actions to create claim items from.
   */
  changes: OrderChangeActionDTO[]
  /**
   * The ID of the claim to create the items for.
   */
  claimId: string
}

/**
 * This step creates claim items from a change action.
 * 
 * :::note
 * 
 * You can retrieve an order change action details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = createOrderClaimItemsFromActionsStep({
 *   claimId: "claim_123",
 *   changes: [
 *     {
 *       id: "orchact_123",
 *       // other order change action details...
 *     }
 *   ]
 * })
 */
export const createOrderClaimItemsFromActionsStep = createStep(
  "create-claim-items-from-change-actions",
  async (input: CreateOrderClaimItemsFromActionsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
    )

    const claimItems = input.changes.map((item) => {
      let additionalFields
      if (item.action === ChangeActionType.ITEM_ADD) {
        additionalFields = {
          is_additional_item: true,
        }
      } else if (item.action === ChangeActionType.WRITE_OFF_ITEM) {
        additionalFields = {
          reason: item.details?.reason,
        }
      }

      return {
        claim_id: input.claimId,
        item_id: item.details?.reference_id! as string,
        quantity: item.details?.quantity as number,
        note: item.internal_note,
        metadata: (item.details?.metadata as Record<string, unknown>) ?? {},
        ...additionalFields,
      }
    })

    const createdClaimItems = await orderModuleService.createOrderClaimItems(
      claimItems
    )

    return new StepResponse(
      createdClaimItems,
      createdClaimItems.map((i) => i.id)
    )
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const orderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
    )

    await orderModuleService.deleteOrderClaimItems(ids)
  }
)
