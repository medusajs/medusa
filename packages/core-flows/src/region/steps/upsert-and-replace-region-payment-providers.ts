import {
  ModuleRegistrationName,
  Modules,
  RemoteLink,
} from "@medusajs/modules-sdk"
import {
  FilterableRegionProps,
  IPaymentModuleService,
  IRegionModuleService,
  RemoteQueryFunction,
} from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export interface UpsertAndReplaceRegionPaymentProvidersStepInput {
  input:
    | {
        region_selector: FilterableRegionProps
        payment_providers: string[]
      }
    | {
        regions: { id: string }[]
        payment_providers: string[]
      }[]
}

type LinkItems = {
  [Modules.REGION]: { region_id: string }
  [Modules.PAYMENT]: { payment_provider_id: string }
}[]

async function validatePaymentProvidersExists(
  paymentService: IPaymentModuleService,
  paymentProviderIds: string[]
) {
  const paymentProviders = await paymentService.listPaymentProviders({
    id: { $in: paymentProviderIds },
    is_enabled: true,
  })

  const retrievedPaymentProviderIds = paymentProviders.map((p) => p.id)

  const missingProviders = arrayDifference(
    paymentProviderIds,
    retrievedPaymentProviderIds
  )

  if (missingProviders.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Payment providers with ids ${missingProviders.join(
        ", "
      )} not found or not enabled`
    )
  }
}

async function getCurrentRegionPaymentProvidersLinks(
  regionIds: string[],
  { remoteQuery }: { remoteQuery: RemoteQueryFunction }
): Promise<
  {
    [Modules.REGION]: { region_id: string }
    [Modules.PAYMENT]: { payment_provider_id: string }
  }[]
> {
  const query = remoteQueryObjectFromString({
    // TODO: use service: LINKS.RegionPaymentProvider, for that, the links.ts must be moved to the utils package, so that for link querying we can use link const instead of plain strings
    entryPoint: "region_payment_provider",
    variables: {
      filters: { region_id: regionIds },
      take: null,
    },
    fields: ["region_id", "payment_provider_id"],
  })

  const regionProviderLinks = (await remoteQuery(query)) as {
    region_id: string
    payment_provider_id: string
  }[]

  return regionProviderLinks.map((region) => {
    return {
      [Modules.REGION]: {
        region_id: region.region_id,
      },
      [Modules.PAYMENT]: {
        payment_provider_id: region.payment_provider_id,
      },
    }
  })
}

async function validateAndNormalizeRegionsProvidersData(
  input: UpsertAndReplaceRegionPaymentProvidersStepInput["input"],
  {
    regionService,
  }: {
    regionService: IRegionModuleService
  }
): Promise<Map<string, string[]>> {
  const normalizedInput = Array.isArray(input) ? input : [input]
  const predicate = "regions" in input[0] ? "regions" : "region_selector"

  const regionPaymentProvidersMap = new Map()

  for (const inputData of normalizedInput) {
    if ("regions" in inputData) {
      if (predicate === "region_selector") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid input, all input must either be regions or region_selector"
        )
      }

      inputData.regions.forEach((region) => {
        regionPaymentProvidersMap.set(region.id, inputData.payment_providers)
      })
    } else if ("region_selector" in inputData) {
      if (predicate === "regions") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid input, all input must either be regions or region_selector"
        )
      }

      const regions = await regionService.list(inputData.region_selector, {
        select: ["id"],
      })

      regions.forEach((region) => {
        regionPaymentProvidersMap.set(region.id, inputData.payment_providers)
      })
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid input, must provide either regions or region_selector"
      )
    }
  }

  return regionPaymentProvidersMap
}

export const upsertAndReplaceRegionPaymentProvidersStepId =
  "add-region-payment-providers-step"
export const upsertAndReplaceRegionPaymentProvidersStep = createStep(
  upsertAndReplaceRegionPaymentProvidersStepId,
  async (
    data: UpsertAndReplaceRegionPaymentProvidersStepInput,
    { container }
  ) => {
    const normalizedInput = Array.isArray(data.input)
      ? data.input
      : [data.input]

    if (!normalizedInput.length) {
      return new StepResponse(void 0)
    }

    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )
    const paymentService = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )
    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    const remoteQuery = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const allPaymentProviderIds = normalizedInput
      .map((inputData) => {
        return inputData.payment_providers
      })
      .flat()
    const uniquePaymentProviderIds = Array.from(new Set(allPaymentProviderIds))

    await validatePaymentProvidersExists(
      paymentService,
      uniquePaymentProviderIds
    )

    const normalizedData = await validateAndNormalizeRegionsProvidersData(
      data.input,
      {
        regionService,
      }
    )

    const currentExistingLinks = await getCurrentRegionPaymentProvidersLinks(
      [...normalizedData.keys()],
      { remoteQuery }
    )

    const linksToRemove = currentExistingLinks
      .filter((existingLink) => {
        const providers =
          normalizedData.get(existingLink[Modules.REGION].region_id) ?? []
        return !providers.includes(
          existingLink[Modules.PAYMENT].payment_provider_id
        )
      })
      .map((link) => {
        return {
          [Modules.REGION]: { region_id: link[Modules.REGION].region_id },
          [Modules.PAYMENT]: {
            payment_provider_id: link[Modules.PAYMENT].payment_provider_id,
          },
        }
      })

    const linksToCreate = Array.from(normalizedData.entries())
      .map(([regionId, providers]) => {
        const toCreate: LinkItems = []

        for (const provider of providers) {
          const exists = currentExistingLinks.some((existingLink) => {
            return (
              existingLink[Modules.REGION].region_id === regionId &&
              existingLink[Modules.PAYMENT].payment_provider_id === provider
            )
          })

          if (!exists) {
            toCreate.push({
              [Modules.REGION]: { region_id: regionId },
              [Modules.PAYMENT]: { payment_provider_id: provider },
            })
          }
        }

        return toCreate
      })
      .flat()
      .filter(Boolean)

    await promiseAll([
      remoteLink.dismiss(linksToRemove),
      remoteLink.create(linksToCreate),
    ])

    return new StepResponse(void 0, {
      linksToCreate: linksToRemove,
      linksToRemove: linksToCreate,
    })
  },
  async (rollbackData, { container }) => {
    if (!rollbackData) {
      return
    }

    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    await promiseAll([
      remoteLink.dismiss(rollbackData.linksToRemove),
      remoteLink.create(rollbackData.linksToCreate),
    ])
  }
)
