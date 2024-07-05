import { ModuleRegistrationName, RemoteLink } from "@medusajs/modules-sdk"
import { IPaymentModuleService, RemoteQueryFunction } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  LINKS,
  MedusaError,
  Modules,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export interface SetRegionsPaymentProvidersStepInput {
  input: {
    id: string
    payment_providers?: string[]
  }[]
}

interface FilteredSetRegionsPaymentProvidersStepInput {
  id: string
  payment_providers: string[]
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
    service: LINKS.RegionPaymentProvider,
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

export const setRegionsPaymentProvidersStepId =
  "add-region-payment-providers-step"
export const setRegionsPaymentProvidersStep = createStep(
  setRegionsPaymentProvidersStepId,
  async (data: SetRegionsPaymentProvidersStepInput, { container }) => {
    const dataInputToProcess = data.input.filter((inputData) => {
      return inputData.payment_providers?.length
    }) as FilteredSetRegionsPaymentProvidersStepInput[]

    if (!dataInputToProcess.length) {
      return new StepResponse(void 0)
    }

    const paymentService = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )
    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    const remoteQuery = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const allPaymentProviderIds = dataInputToProcess
      .map((inputData) => {
        return inputData.payment_providers!
      })
      .flat()
    const uniquePaymentProviderIds = Array.from(
      new Set<string>(allPaymentProviderIds)
    )

    await validatePaymentProvidersExists(
      paymentService,
      uniquePaymentProviderIds
    )

    const regionIds = dataInputToProcess.map((inputData) => inputData.id)
    const currentExistingLinks = await getCurrentRegionPaymentProvidersLinks(
      regionIds,
      { remoteQuery }
    )

    const linksToRemove: LinkItems = currentExistingLinks
      .filter((existingLink) => {
        return !dataInputToProcess.some((input) => {
          return (
            input.id === existingLink[Modules.REGION].region_id &&
            input.payment_providers.includes(
              existingLink[Modules.PAYMENT].payment_provider_id
            )
          )
        })
      })
      .map((link) => {
        return {
          [Modules.REGION]: { region_id: link[Modules.REGION].region_id },
          [Modules.PAYMENT]: {
            payment_provider_id: link[Modules.PAYMENT].payment_provider_id,
          },
        }
      })

    const linksToCreate = dataInputToProcess
      .map((inputData) => {
        return inputData.payment_providers.map((provider) => {
          const alreadyExists = currentExistingLinks.some((link) => {
            return (
              link[Modules.REGION].region_id === inputData.id &&
              link[Modules.PAYMENT].payment_provider_id === provider
            )
          })

          if (alreadyExists) {
            return
          }

          return {
            [Modules.REGION]: { region_id: inputData.id },
            [Modules.PAYMENT]: { payment_provider_id: provider },
          }
        })
      })
      .flat()
      .filter((d): d is LinkItems[0] => !!d)

    const promises: Promise<unknown[]>[] = []

    if (linksToRemove.length) {
      promises.push(remoteLink.dismiss(linksToRemove))
    }

    if (linksToCreate.length) {
      promises.push(remoteLink.create(linksToCreate))
    }

    await promiseAll(promises)

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

    const promises: Promise<unknown[]>[] = []

    if (rollbackData.linksToRemove.length) {
      promises.push(remoteLink.dismiss(rollbackData.linksToRemove))
    }

    if (rollbackData.linksToCreate.length) {
      promises.push(remoteLink.create(rollbackData.linksToCreate))
    }

    await promiseAll(promises)
  }
)
