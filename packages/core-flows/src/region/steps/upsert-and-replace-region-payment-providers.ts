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
        payment_provider_ids: string[]
      }
    | {
        regions: { id: string }[]
        payment_provider_ids: string[]
      }
}

async function validatePaymentProvidersExists(
  paymentService: IPaymentModuleService,
  data: UpsertAndReplaceRegionPaymentProvidersStepInput["input"]
) {
  const paymentProviderIds = Array.from(new Set(data.payment_provider_ids))

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

export const upsertAndReplaceRegionPaymentProvidersStepId =
  "add-region-payment-providers-step"
export const upsertAndReplaceRegionPaymentProvidersStep = createStep(
  upsertAndReplaceRegionPaymentProvidersStepId,
  async (
    data: UpsertAndReplaceRegionPaymentProvidersStepInput,
    { container }
  ) => {
    if (!data.input?.payment_provider_ids) {
      return
    }

    const { input } = data

    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )
    const paymentService = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    await validatePaymentProvidersExists(paymentService, input)

    const paymentProviderIds = Array.from(new Set(input.payment_provider_ids))
    let regions: { id: string }[] = []

    if ("regions" in input) {
      regions = input.regions
    } else if ("region_selector" in input) {
      regions = await regionService.list(input.region_selector, {
        select: ["id"],
      })
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid input, must provide either regions or region_selector"
      )
    }

    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    const remoteQuery = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const currentExistingLinks = await getCurrentRegionPaymentProvidersLinks(
      regions.map((r) => r.id),
      { remoteQuery }
    )

    const existingPaymentProviderIdLink = currentExistingLinks.map(
      (existingLink) => existingLink[Modules.PAYMENT].payment_provider_id
    )

    const linksToRemove = arrayDifference(
      existingPaymentProviderIdLink,
      paymentProviderIds
    ).map((paymentProviderId) => {
      return currentExistingLinks.find(
        (existingLink) =>
          existingLink[Modules.PAYMENT].payment_provider_id ===
          paymentProviderId
      )!
    })

    const linksToCreate = arrayDifference(
      paymentProviderIds,
      existingPaymentProviderIdLink
    )
      .map((paymentProviderId) => {
        return regions.map((region) => {
          return {
            [Modules.REGION]: {
              region_id: region.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: paymentProviderId as string,
            },
          }
        })
      })
      .flat()

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
