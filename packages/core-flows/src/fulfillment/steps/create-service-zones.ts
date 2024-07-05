import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateServiceZoneDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = CreateServiceZoneDTO[]

export const createServiceZonesStepId = "create-service-zones"
export const createServiceZonesStep = createStep(
  createServiceZonesStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const createdServiceZones = await service.createServiceZones(input)

    return new StepResponse(
      createdServiceZones,
      createdServiceZones.map((createdZone) => createdZone.id)
    )
  },
  async (createdServiceZones, { container }) => {
    if (!createdServiceZones?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.deleteServiceZones(createdServiceZones)
  }
)
