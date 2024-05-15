import {
  DeleteEntityInput,
  LinkDefinition,
  RemoteLink,
} from "@medusajs/modules-sdk"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

type CreateRemoteLinksStepInput = LinkDefinition | LinkDefinition[]

export const createRemoteLinkStepId = "create-remote-links"
export const createRemoteLinkStep = createStep(
  createRemoteLinkStepId,
  async (data: CreateRemoteLinksStepInput, { container }) => {
    const entries = Array.isArray(data) ? data : [data]

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.create(entries)

    return new StepResponse(entries, entries)
  },
  async (createdLinks, { container }) => {
    if (!createdLinks) {
      return
    }

    const grouped: DeleteEntityInput = {}

    for (const entry of createdLinks) {
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
  }
)
