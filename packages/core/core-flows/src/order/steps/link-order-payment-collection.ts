import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  links: {
    order_id: string
    payment_collection_id: string
  }[]
}

export const linkOrderAndPaymentCollectionsStepId =
  "link-order-payment-collection"
export const linkOrderAndPaymentCollectionsStep = createStep(
  linkOrderAndPaymentCollectionsStepId,
  async (data: StepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const links = data.links.map((d) => ({
      [Modules.ORDER]: { order_id: d.order_id },
      [Modules.PAYMENT]: { payment_collection_id: d.payment_collection_id },
    }))

    await remoteLink.create(links)

    return new StepResponse(void 0, data)
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const links = data.links.map((d) => ({
      [Modules.ORDER]: { order_id: d.order_id },
      [Modules.PAYMENT]: { payment_collection_id: d.payment_collection_id },
    }))

    await remoteLink.dismiss(links)
  }
)
