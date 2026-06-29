import { PromotionTypes } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"
import { filterExclusivePromotionActions } from "../utils/exclusive-promotions"

/**
 * The input of the {@link filterExclusivePromotionActionsStep}.
 */
export interface FilterExclusivePromotionActionsStepInput {
  /**
   * The computed promotion actions to filter for exclusivity.
   */
  actions: PromotionTypes.ComputeActions[]
}

export const filterExclusivePromotionActionsStepId =
  "filter-exclusive-promotion-actions"

/**
 * This step enforces promotion exclusivity. If any of the applied promotions is
 * flagged as `is_exclusive`, the promotions cannot be combined and only the
 * single most valuable promotion is kept; the adjustment actions of the other
 * promotions are removed.
 */
export const filterExclusivePromotionActionsStep = createStep(
  filterExclusivePromotionActionsStepId,
  async (input: FilterExclusivePromotionActionsStepInput, { container }) => {
    const actions = input.actions ?? []

    const codes = [
      ...new Set(
        actions
          .map((action) => (action as { code?: string }).code)
          .filter((code): code is string => !!code)
      ),
    ]

    if (!codes.length) {
      return new StepResponse(actions)
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: promotions } = await query.graph({
      entity: "promotion",
      fields: ["code", "is_exclusive"],
      filters: { code: codes },
    })

    const exclusiveCodes = new Set<string>(
      promotions
        .filter((promotion) => promotion.is_exclusive)
        .map((promotion) => promotion.code)
    )

    return new StepResponse(
      filterExclusivePromotionActions(
        actions as unknown as { action?: string; code?: string; amount?: number }[],
        exclusiveCodes
      ) as unknown as PromotionTypes.ComputeActions[]
    )
  }
)
