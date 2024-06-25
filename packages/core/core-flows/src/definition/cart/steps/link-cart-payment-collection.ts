import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type StepInput = {
  links: {
    cart_id: string
    payment_collection_id: string
  }[]
}

export const linkCartAndPaymentCollectionsStepId =
  "link-cart-payment-collection"
export const linkCartAndPaymentCollectionsStep = createStep(
  linkCartAndPaymentCollectionsStepId,
  async (data: StepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const links = data.links.map((d) => ({
      [Modules.CART]: { cart_id: d.cart_id },
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
      [Modules.CART]: { cart_id: d.cart_id },
      [Modules.PAYMENT]: { payment_collection_id: d.payment_collection_id },
    }))

    await remoteLink.dismiss(links)
  }
)
