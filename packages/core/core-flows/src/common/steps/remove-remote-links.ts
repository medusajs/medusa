import { DeleteEntityInput, RemoteLink } from "@medusajs/modules-sdk"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

type RemoveRemoteLinksStepInput = DeleteEntityInput | DeleteEntityInput[]

export const removeRemoteLinkStepId = "remove-remote-links"
export const removeRemoteLinkStep = createStep(
  removeRemoteLinkStepId,
  async (data: RemoveRemoteLinksStepInput, { container }) => {
    const entries = Array.isArray(data) ? data : [data]

    if (!entries.length) {
      return new StepResponse(void 0)
    }

    const grouped: DeleteEntityInput = {}

    for (const entry of entries) {
      for (const moduleName of Object.keys(entry)) {
        grouped[moduleName] ??= {}

        for (const linkableKey of Object.keys(entry[moduleName])) {
          grouped[moduleName][linkableKey] ??= []

          const keys = Array.isArray(entry[moduleName][linkableKey])
            ? entry[moduleName][linkableKey]
            : [entry[moduleName][linkableKey]]

          grouped[moduleName][linkableKey] = (
            grouped[moduleName][linkableKey] as string[]
          ).concat(keys as string[])
        }
      }
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.delete(grouped)

    return new StepResponse(grouped, grouped)
  },
  async (removedLinks, { container }) => {
    if (!removedLinks) {
      return
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.restore(removedLinks)
  }
)
