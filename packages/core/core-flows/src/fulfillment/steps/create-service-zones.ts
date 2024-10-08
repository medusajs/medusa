import {
  CreateServiceZoneDTO,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createServiceZonesStepId = "create-service-zones"
/**
 * This step creates one or more service zones.
 */
export const createServiceZonesStep = createStep(
  createServiceZonesStepId,
  async (input: CreateServiceZoneDTO[], { container }) => {
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
