import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

type DismissRemoteLinksStepInput = LinkDefinition | LinkDefinition[]

export const dismissRemoteLinkStepId = "dismiss-remote-links"
export const dismissRemoteLinkStep = createStep(
  dismissRemoteLinkStepId,
  async (data: DismissRemoteLinksStepInput, { container }) => {
    const entries = Array.isArray(data) ? data : [data]

    if (!entries.length) {
      return new StepResponse([], [])
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.dismiss(entries)

    return new StepResponse(entries, entries)
  },
  async (dismissdLinks, { container }) => {
    if (!dismissdLinks) {
      return
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.create(dismissdLinks)
  }
)
