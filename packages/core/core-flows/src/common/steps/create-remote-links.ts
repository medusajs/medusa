import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

type CreateRemoteLinksStepInput = LinkDefinition[]

export const createLinksStepId = "create-remote-links"
export const createRemoteLinkStep = createStep(
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
