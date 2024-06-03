import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const createLinksStepId = "create-remote-links"
export const createRemoteLinkStep = createStep(
  createLinksStepId,
  async (data: LinkDefinition[], { container }) => {
    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    if (!data.length) {
      return new StepResponse([], [])
    }

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
