import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { service } from "@medusajs/event-bus-local"

export interface StepInput {
  region_id: string
  payment_provider_id: string[]
}

export const addRegionPaymentProvidersStepId =
  "add-region-payment-providers-step"
export const addRegionPaymentProvidersStep = createStep(
  addRegionPaymentProvidersStepId,
  async (data: StepInput[], { container }) => {
    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )
    const paymentService = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.REGION
    )

    const created = await service.create(data)

    return new StepResponse(
      created,
      created.map((region) => region.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    await service.delete(createdIds)
  }
)
