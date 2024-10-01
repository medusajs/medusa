import {
  FilterablePaymentCollectionProps,
  IPaymentModuleService,
  PaymentCollectionUpdatableFields,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  isPresent,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface UpdatePaymentCollectionStepInput {
  selector: FilterablePaymentCollectionProps
  update: PaymentCollectionUpdatableFields
}

export const updatePaymentCollectionStepId = "update-payment-collection"
/**
 * This step updates payment collections matching the specified filters.
 */
export const updatePaymentCollectionStep = createStep(
  updatePaymentCollectionStepId,
  async (data: UpdatePaymentCollectionStepInput, { container }) => {
    if (!isPresent(data) || !isPresent(data.selector)) {
      return new StepResponse([], [])
    }

    const paymentModuleService = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await paymentModuleService.listPaymentCollections(
      data.selector,
      {
        select: selects,
        relations,
      }
    )

    const updated = await paymentModuleService.updatePaymentCollections(
      data.selector,
      data.update
    )

    return new StepResponse(updated, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }
    const paymentModuleService = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    await paymentModuleService.upsertPaymentCollections(
      prevData.map((pc) => ({
        id: pc.id,
        amount: pc.amount,
        currency_code: pc.currency_code,
        metadata: pc.metadata,
      }))
    )
  }
)
