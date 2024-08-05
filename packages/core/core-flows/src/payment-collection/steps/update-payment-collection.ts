import {
  FilterablePaymentCollectionProps,
  IPaymentModuleService,
  PaymentCollectionUpdatableFields,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
  isPresent,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  selector: FilterablePaymentCollectionProps
  update: PaymentCollectionUpdatableFields
}

export const updatePaymentCollectionStepId = "update-payment-collection"
export const updatePaymentCollectionStep = createStep(
  updatePaymentCollectionStepId,
  async (data: StepInput, { container }) => {
    if (!isPresent(data) || !isPresent(data.selector)) {
      return new StepResponse([], [])
    }

    const paymentModuleService = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
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
      ModuleRegistrationName.PAYMENT
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
