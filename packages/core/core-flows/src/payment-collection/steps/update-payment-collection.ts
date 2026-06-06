import {
  FilterablePaymentCollectionProps,
  IPaymentModuleService,
  PaymentCollectionUpdatableFields,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  isPresent,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update a payment collection.
 */
export interface UpdatePaymentCollectionStepInput {
  /**
   * The filters to select the payment collections to update.
   */
  selector: FilterablePaymentCollectionProps
  /**
   * The data to update in the selected payment collections.
   */
  update: PaymentCollectionUpdatableFields
}

export const updatePaymentCollectionStepId = "update-payment-collection"
/**
 * This step updates payment collections matching the specified filters.
 * 
 * @example
 * const data = updatePaymentCollectionStep({
 *   selector: {
 *     id: "paycol_123",
 *   },
 *   update: {
 *     amount: 10,
 *   }
 * })
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
