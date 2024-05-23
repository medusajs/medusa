import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

type CreateRemoteLinksStepInput = LinkDefinition[]

export const createLinksStepId = "create-links"
export const createLinkStep = createStep(
  createLinksStepId,
  async (data: CreateRemoteLinksStepInput, { container }) => {
    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.create(data)

    return new StepResponse(data, data)
  },
  async (createdLinks, { container }) => {
    if (!createdLinks) {
      return
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.dismiss(createdLinks)
  }
)
