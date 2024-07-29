import { IOrderModuleService, OrderChangeActionDTO } from "@medusajs/types"
import { ChangeActionType, ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateOrderClaimItemsInput = {
  changes: OrderChangeActionDTO[]
  claimId: string
}

export const createOrderClaimItemsStep = createStep(
  "create-claim-items",
  async (input: CreateOrderClaimItemsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
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
      ModuleRegistrationName.ORDER
    )

    await orderModuleService.deleteOrderClaimItems(ids)
  }
)
