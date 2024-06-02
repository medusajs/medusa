import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const updateLinksStepId = "update-links-step"
export const updateLinksStep = createStep(
  updateLinksStepId,
  async (data: LinkDefinition[], { container }) => {
    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    // Fetch all existing links and throw an error if any weren't found
    const dataBeforeUpdate = (await link.list(data, {
      asLinkDefinition: true,
    })) as LinkDefinition[]

    const unequal = dataBeforeUpdate.length !== data.length

    if (unequal) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find all existing links from data`
      )
    }

    // link.create here performs an upsert. By performing validation above, we can ensure
    // that this method will always perform an update in these cases
    await link.create(data)

    return new StepResponse(data, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    await link.create(dataBeforeUpdate)
  }
)
