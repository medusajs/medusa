import { Modules } from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const linkCartRegionStepId = "link-cart-region"
export const linkCartRegionStep = createStep(
  linkCartRegionStepId,
  async (data: { regionId: string; cartId: string }, { container }) => {
    const remoteLink = container.resolve("remoteLink")

    await remoteLink.create({
      [Modules.CART]: {
        cart_id: data.cartId,
      },
      [Modules.REGION]: {
        region_id: data.regionId,
      },
    })

    return new StepResponse(void 0, {
      cartId: data.cartId,
      regionId: data.regionId,
    })
  },
  async (data, { container }) => {
    const remoteLink = container.resolve("remoteLink")

    await remoteLink.dismiss({
      [Modules.CART]: {
        cart_id: data!.cartId,
      },
      [Modules.REGION]: {
        region_id: data!.regionId,
      },
    })
  }
)
