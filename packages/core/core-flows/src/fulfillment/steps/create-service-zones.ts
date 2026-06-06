import {
  CreateServiceZoneDTO,
  IFulfillmentModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The service zones to create.
 */
export type CreateServiceZonesStepInput = CreateServiceZoneDTO[]

export const createServiceZonesStepId = "create-service-zones"
/**
 * This step creates one or more service zones.
 */
export const createServiceZonesStep = createStep(
  createServiceZonesStepId,
  async (input: CreateServiceZonesStepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
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
      Modules.FULFILLMENT
    )

    await service.deleteServiceZones(createdServiceZones)
  }
)
