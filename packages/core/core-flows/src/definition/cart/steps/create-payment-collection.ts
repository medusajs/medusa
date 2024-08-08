import { BigNumberInput, IPaymentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type CreatePaymentCollectionCartStepInput = {
  region_id: string
  currency_code: string
  amount: BigNumberInput
  metadata?: Record<string, unknown>
}

export const createPaymentCollectionsStepId = "create-payment-collections"
/**
 * This step creates payment collections in a cart.
 */
export const createPaymentCollectionsStep = createStep(
  createPaymentCollectionsStepId,
  async (data: CreatePaymentCollectionCartStepInput[], { container }) => {
    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const created = await service.createPaymentCollections(data)

    return new StepResponse(
      created,
      created.map((collection) => collection.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    await service.deletePaymentCollections(createdIds)
  }
)
