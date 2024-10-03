import { ServiceZoneDTO, ShippingOptionDTO } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type FulfillmentProviderValidationWorkflowInput = {
  id?: string
  service_zone_id?: string
  provider_id?: string
}

export const validateFulfillmentProvidersStepId =
  "validate-fulfillment-providers-step"
/**
 * This step validates that the specified fulfillment providers are available in the
 * specified service zones.
 */
export const validateFulfillmentProvidersStep = createStep(
  validateFulfillmentProvidersStepId,
  async (
    input: FulfillmentProviderValidationWorkflowInput[],
    { container }
  ) => {
    const dataToValidate: {
      service_zone_id: string
      provider_id: string
    }[] = []
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)

    const shippingOptions = await fulfillmentService.listShippingOptions(
      {
        id: input.map((d) => d.id).filter(Boolean) as string[],
      },
      {
        select: ["id", "service_zone_id", "provider_id"],
      }
    )

    const shippingOptionsMap = new Map<string, ShippingOptionDTO>(
      shippingOptions.map((so) => [so.id, so])
    )

    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    for (const data of input) {
      if ("id" in data) {
        const existingShippingOption = shippingOptionsMap.get(data.id!)

        if (!data.service_zone_id) {
          data.service_zone_id = existingShippingOption?.service_zone_id!
        }

        if (!data.provider_id) {
          data.provider_id = existingShippingOption?.provider_id!
        }

        dataToValidate.push({
          service_zone_id: data.service_zone_id!,
          provider_id: data.provider_id!,
        })

        continue
      }

      if (data.service_zone_id && data.provider_id) {
        dataToValidate.push({
          service_zone_id: data.service_zone_id,
          provider_id: data.provider_id,
        })

        continue
      }

      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `service_zone_id and provider_id are required to create a shipping option`
      )
    }

    const serviceZones = await remoteQuery({
      entryPoint: "service_zone",
      fields: ["id", "fulfillment_set.locations.fulfillment_providers.id"],
      variables: {
        id: input.map((d) => d.service_zone_id),
      },
    })

    const serviceZonesMap = new Map<
      string,
      ServiceZoneDTO & {
        fulfillment_set: {
          locations: { fulfillment_providers: { id: string }[] }[]
        }
      }
    >(serviceZones.map((sz) => [sz.id, sz]))

    const invalidProviders: string[] = []

    for (const data of dataToValidate) {
      const serviceZone = serviceZonesMap.get(data.service_zone_id)
      const stockLocations = serviceZone?.fulfillment_set?.locations ?? []
      const fulfillmentProviders: string[] = []

      for (const stockLocation of stockLocations) {
        const providersForStockLocation = (
          stockLocation.fulfillment_providers ?? []
        )
          .filter(Boolean)
          .map((fp) => fp.id)

        fulfillmentProviders.push(...providersForStockLocation)
      }

      if (!fulfillmentProviders.includes(data.provider_id)) {
        invalidProviders.push(data.provider_id)
      }
    }

    if (invalidProviders.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Providers (${invalidProviders.join(
          ","
        )}) are not enabled for the service location`
      )
    }

    return new StepResponse(void 0)
  }
)
