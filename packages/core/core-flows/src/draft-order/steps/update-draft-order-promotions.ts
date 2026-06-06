import {
  ContainerRegistrationKeys,
  Modules,
  PromotionActions,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import type { IPromotionModuleService } from "@zjedene-medusa/framework/types"

export const updateDraftOrderPromotionsStepId = "update-draft-order-promotions"

/**
 * The details of the promotions to update in a draft order.
 */
export interface UpdateDraftOrderPromotionsStepInput {
  /**
   * The ID of the draft order.
   */
  id: string
  /**
   * The promo codes to add, replace, or remove from the draft order.
   */
  promo_codes: string[]
  /**
   * The action to perform on the promotions. You can either:
   *
   * - Add the promotions to the draft order.
   * - Replace the existing promotions with the new ones.
   * - Remove the promotions from the draft order.
   */
  action?: PromotionActions
}

/**
 * This step updates the promotions of a draft order.
 *
 * @example
 * const data = updateDraftOrderPromotionsStep({
 *   id: "order_123",
 *   promo_codes: ["PROMO_123", "PROMO_456"],
 *   // Import from "@zjedene-medusa/framework/utils"
 *   action: PromotionActions.ADD,
 * })
 */
export const updateDraftOrderPromotionsStep = createStep(
  updateDraftOrderPromotionsStepId,
  async function (data: UpdateDraftOrderPromotionsStepInput, { container }) {
    const { id, promo_codes = [], action = PromotionActions.ADD } = data

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )
    const promotionService = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const existingDraftOrderPromotionLinks = await remoteQuery({
      entryPoint: "order_promotion",
      fields: ["order_id", "promotion_id"],
      variables: { order_id: [id] },
    })

    const promotionLinkMap = new Map<string, any>(
      existingDraftOrderPromotionLinks.map((link) => [link.promotion_id, link])
    )

    const linksToCreate: any[] = []
    const linksToDismiss: any[] = []

    if (promo_codes?.length) {
      const promotions = await promotionService.listPromotions(
        { code: promo_codes },
        { select: ["id"] }
      )

      for (const promotion of promotions) {
        const linkObject = {
          [Modules.ORDER]: { order_id: id },
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
      for (const link of existingDraftOrderPromotionLinks) {
        linksToDismiss.push({
          [Modules.ORDER]: { order_id: link.order_id },
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
  async function (revertData, { container }) {
    const { dismissedLinks, createdLinkIds } = revertData ?? {}

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    if (dismissedLinks?.length) {
      await remoteLink.create(dismissedLinks)
    }

    if (createdLinkIds?.length) {
      // @ts-expect-error
      await remoteLink.delete(createdLinkIds)
    }
  }
)
