import {
  ContainerRegistrationKeys,
  Modules,
  PromotionActions,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the promotion codes to apply on a cart.
 */
export interface UpdateCartPromotionStepInput {
  /**
   * The ID of the cart to update promotions for.
   */
  id: string
  /**
   * The promotion codes to apply on the cart.
   */
  promo_codes?: string[]
  /**
   * Whether to add, remove, or replace promotion codes.
   */
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const updateCartPromotionsStepId = "update-cart-promotions"
/**
 * This step updates the promotions applied on a cart.
 */
export const updateCartPromotionsStep = createStep(
  updateCartPromotionsStepId,
  async (data: UpdateCartPromotionStepInput, { container }) => {
    const { promo_codes = [], id, action = PromotionActions.ADD } = data

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const existingCartPromotionLinks = await remoteQuery({
      entryPoint: "cart_promotion",
      fields: ["cart_id", "promotion_id"],
      variables: {
        cart_id: [id],
      },
    })

    const promotionLinkMap = new Map<string, any>(
      existingCartPromotionLinks.map((link) => [link.promotion_id, link])
    )

    const linksToCreate: any[] = []
    const linksToDismiss: any[] = []

    if (promo_codes?.length) {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { data: promotions } = await query.graph(
        {
          entity: "promotion",
          fields: ["id", "code"],
          filters: { code: promo_codes },
        },
        {
          cache: {
            enable: true,
          },
        }
      )

      for (const promotion of promotions) {
        const linkObject = {
          [Modules.CART]: { cart_id: id },
          [Modules.PROMOTION]: { promotion_id: promotion.id },
        }

        if ([PromotionActions.ADD, PromotionActions.REPLACE].includes(action)) {
          linksToCreate.push(linkObject)
        }

        if (action === PromotionActions.REMOVE) {
          const link = promotionLinkMap.get(promotion.id)

          if (link) {
            linksToDismiss.push(linkObject)
          }
        }
      }
    }

    if (action === PromotionActions.REPLACE) {
      for (const link of existingCartPromotionLinks) {
        linksToDismiss.push({
          [Modules.CART]: { cart_id: link.cart_id },
          [Modules.PROMOTION]: { promotion_id: link.promotion_id },
        })
      }
    }

    if (linksToDismiss.length) {
      await remoteLink.dismiss(linksToDismiss)
    }

    const createdLinks = linksToCreate.length
      ? await remoteLink.create(linksToCreate)
      : []

    return new StepResponse(null, {
      // @ts-expect-error
      createdLinkIds: createdLinks.map((link) => link.id),
      dismissedLinks: linksToDismiss,
    })
  },
  async (revertData, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    if (revertData?.dismissedLinks?.length) {
      await remoteLink.create(revertData.dismissedLinks)
    }

    if (revertData?.createdLinkIds?.length) {
      // @ts-expect-error
      await remoteLink.delete(revertData.createdLinkIds)
    }
  }
)
