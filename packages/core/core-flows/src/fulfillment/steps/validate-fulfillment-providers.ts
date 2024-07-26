import { ServiceZoneDTO, ShippingOptionDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type FulfillmentProviderValidationInput = {
  id?: string
  service_zone_id?: string
  provider_id?: string
}

export const validateFulfillmentProvidersStepId =
  "validate-fulfillment-providers-step"
export const validateFulfillmentProvidersStep = createStep(
  validateFulfillmentProvidersStepId,
  async (input: FulfillmentProviderValidationInput[], { container }) => {
    const dataToValidate: {
      service_zone_id: string
      provider_id: string
    }[] = []
    const shippingOptionIds = input.map((d) => d.id).filter(Boolean) as string[]
    const fulfillmentService = container.resolve(
      ModuleRegistrationName.FULFILLMENT
    )
    const shippingOptions = await fulfillmentService.listShippingOptions({
      id: shippingOptionIds,
    })

    const shippingOptionsMap = new Map<string, ShippingOptionDTO>(
      shippingOptions.map((so) => [so.id, so])
    )

    const invalidProviders: string[] = []
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    for (const data of input) {
      if ("id" in data) {
        const existingShippingOption = shippingOptionsMap.get(data.id!)

        dataToValidate.push({
          service_zone_id:
            data.service_zone_id! || existingShippingOption?.service_zone_id!,
          provider_id:
            data.provider_id! || existingShippingOption?.provider_id!,
        })

        continue
      }

      if (data.service_zone_id && data.provider_id) {
        dataToValidate.push({
          service_zone_id: data.service_zone_id!,
          provider_id: data.provider_id!,
        })

        continue
      }

      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `service_zone_id and provider_id are required to create a shipping option`
      )
    }

    const serviceZoneQuery = remoteQueryObjectFromString({
      entryPoint: "service_zone",
      fields: ["id", "fulfillment_set.locations.fulfillment_providers.*"],
    })

    const serviceZones = await remoteQuery(serviceZoneQuery, {
      id: input.map((d) => d.service_zone_id),
    })

    const serviceZonesMap = new Map<
      string,
      ServiceZoneDTO & {
        fulfillment_set: {
          locations: { fulfillment_providers: { id: string }[] }[]
        }
      }
    >(serviceZones.map((sz) => [sz.id, sz]))

    for (const data of dataToValidate) {
      const serviceZone = serviceZonesMap.get(data.service_zone_id)!
      const stockLocations = serviceZone.fulfillment_set.locations
      const fulfillmentProviders: string[] = []

      for (const stockLocation of stockLocations) {
        const providersForStockLocation =
          stockLocation.fulfillment_providers.map((fp) => fp.id)

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
