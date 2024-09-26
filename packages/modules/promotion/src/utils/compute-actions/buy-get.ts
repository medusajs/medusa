import {
  BigNumberInput,
  ComputeActionItemLine,
  PromotionTypes,
} from "@medusajs/framework/types"
import {
  ApplicationMethodTargetType,
  ComputedActions,
  MathBN,
  MedusaError,
  PromotionType,
} from "@medusajs/framework/utils"
import { areRulesValidForContext } from "../validations"
import { computeActionForBudgetExceeded } from "./usage"

export type EligibleItem = {
  item_id: string
  quantity: BigNumberInput
}

function sortByPrice(a: ComputeActionItemLine, b: ComputeActionItemLine) {
  return MathBN.lt(a.subtotal, b.subtotal) ? 1 : -1
}

/*
  Grabs all the items in the context where the rules apply
  We then sort by price to prioritize most valuable item
*/
function filterItemsByPromotionRules(
  itemsContext: ComputeActionItemLine[],
  rules?: PromotionTypes.PromotionRuleDTO[]
) {
  return itemsContext
    .filter((item) =>
      areRulesValidForContext(
        rules || [],
        item,
        ApplicationMethodTargetType.ITEMS
      )
    )
    .sort(sortByPrice)
}

export function getComputedActionsForBuyGet(
  promotion: PromotionTypes.PromotionDTO,
  itemsContext: ComputeActionItemLine[],
  methodIdPromoValueMap: Map<string, BigNumberInput>,
  eligibleBuyItemMap: Map<string, EligibleItem[]>,
  eligibleTargetItemMap: Map<string, EligibleItem[]>
): PromotionTypes.ComputeActions[] {
  const computedActions: PromotionTypes.ComputeActions[] = []

  const minimumBuyQuantity = MathBN.convert(
    promotion.application_method?.buy_rules_min_quantity ?? 0
  )

  const itemsMap = new Map<string, ComputeActionItemLine>(
    itemsContext.map((i) => [i.id, i])
  )

  if (!itemsContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"items" should be present as an array in the context to compute actions`
    )
  }

  const eligibleBuyItems = filterItemsByPromotionRules(
    itemsContext,
    promotion.application_method?.buy_rules
  )

  const eligibleBuyItemQuantity = MathBN.sum(
    ...eligibleBuyItems.map((item) => item.quantity)
  )

  /*
    Get the total quantity of items where buy rules apply. If the total sum of eligible items 
    does not match up to the minimum buy quantity set on the promotion, return early.
  */
  if (MathBN.gt(minimumBuyQuantity, eligibleBuyItemQuantity)) {
    return []
  }

  /*
    Eligibility of a BuyGet promotion can span across line items. Once an item has been chosen
    as eligible, we can't use this item or its partial remaining quantity when we apply the promotion on
    the target item.

    We build the map here to use when we apply promotions on the target items.
  */
  for (const eligibleBuyItem of eligibleBuyItems) {
    const eligibleItemsByPromotion =
      eligibleBuyItemMap.get(promotion.code!) || []

    const accumulatedQuantity = eligibleItemsByPromotion.reduce(
      (acc, item) => MathBN.sum(acc, item.quantity),
      MathBN.convert(0)
    )

    // If we have reached the minimum buy quantity from the eligible items for this promotion,
    // we can break early and continue to applying the target items
    if (MathBN.gte(accumulatedQuantity, minimumBuyQuantity)) {
      break
    }

    const eligibleQuantity = MathBN.sum(
      ...eligibleItemsByPromotion
        .filter((buy) => buy.item_id === eligibleBuyItem.id)
        .map((b) => b.quantity)
    )

    const reservableQuantity = MathBN.min(
      eligibleBuyItem.quantity,
      MathBN.sub(minimumBuyQuantity, eligibleQuantity)
    )

    // If we have reached the required minimum quantity, we break the loop early
    if (MathBN.lte(reservableQuantity, 0)) {
      break
    }

    eligibleItemsByPromotion.push({
      item_id: eligibleBuyItem.id,
      quantity: MathBN.min(
        eligibleBuyItem.quantity,
        reservableQuantity
      ).toNumber(),
    })

    eligibleBuyItemMap.set(promotion.code!, eligibleItemsByPromotion)
  }

  const eligibleTargetItems = filterItemsByPromotionRules(
    itemsContext,
    promotion.application_method?.target_rules
  )

  const targetQuantity = MathBN.convert(
    promotion.application_method?.apply_to_quantity ?? 0
  )

  /*
    In this loop, we build a map of eligible target items and quantity applicable to these items.

    Here we remove the quantity we used previously to identify eligible buy items
    from the eligible target items.
    
    This is done to prevent applying promotion to the same item we use to qualify the buy rules.
  */
  for (const eligibleTargetItem of eligibleTargetItems) {
    const inapplicableQuantity = MathBN.sum(
      ...Array.from(eligibleBuyItemMap.values())
        .flat(1)
        .filter((buy) => buy.item_id === eligibleTargetItem.id)
        .map((b) => b.quantity)
    )

    const applicableQuantity = MathBN.sub(
      eligibleTargetItem.quantity,
      inapplicableQuantity
    )

    const fulfillableQuantity = MathBN.min(targetQuantity, applicableQuantity)

    // If we have reached the required quantity to target from this item, we
    // move on to the next item
    if (MathBN.lte(fulfillableQuantity, 0)) {
      continue
    }

    const targetItemsByPromotion =
      eligibleTargetItemMap.get(promotion.code!) || []

    targetItemsByPromotion.push({
      item_id: eligibleTargetItem.id,
      quantity: MathBN.min(fulfillableQuantity, targetQuantity).toNumber(),
    })

    eligibleTargetItemMap.set(promotion.code!, targetItemsByPromotion)
  }

  const targetItemsByPromotion =
    eligibleTargetItemMap.get(promotion.code!) || []

  const targettableQuantity = targetItemsByPromotion.reduce(
    (sum, item) => MathBN.sum(sum, item.quantity),
    MathBN.convert(0)
  )

  // If we were able to match the target requirements across all line items, we return early.
  if (MathBN.lt(targettableQuantity, targetQuantity)) {
    return []
  }

  let remainingQtyToApply = MathBN.convert(targetQuantity)

  for (const targetItem of targetItemsByPromotion) {
    const item = itemsMap.get(targetItem.item_id)!
    const appliedPromoValue =
      methodIdPromoValueMap.get(item.id) ?? MathBN.convert(0)
    const multiplier = MathBN.min(targetItem.quantity, remainingQtyToApply)
    const amount = MathBN.mult(
      MathBN.div(item.subtotal, item.quantity),
      multiplier
    )

    const newRemainingQtyToApply = MathBN.sub(remainingQtyToApply, multiplier)

    if (MathBN.lt(newRemainingQtyToApply, 0) || MathBN.lte(amount, 0)) {
      break
    } else {
      remainingQtyToApply = newRemainingQtyToApply
    }

    const budgetExceededAction = computeActionForBudgetExceeded(
      promotion,
      amount
    )

    if (budgetExceededAction) {
      computedActions.push(budgetExceededAction)

      continue
    }

    methodIdPromoValueMap.set(
      item.id,
      MathBN.add(appliedPromoValue, amount).toNumber()
    )

    computedActions.push({
      action: ComputedActions.ADD_ITEM_ADJUSTMENT,
      item_id: item.id,
      amount,
      code: promotion.code!,
    })
  }

  return computedActions
}

export function sortByBuyGetType(a, b) {
  if (a.type === PromotionType.BUYGET && b.type !== PromotionType.BUYGET) {
    return -1
  } else if (
    a.type !== PromotionType.BUYGET &&
    b.type === PromotionType.BUYGET
  ) {
    return 1
  } else {
    return 0
  }
}
