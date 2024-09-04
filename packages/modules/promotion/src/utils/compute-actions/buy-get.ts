import {
  BigNumberInput,
  ComputeActionItemLine,
  PromotionTypes,
} from "@medusajs/types"
import {
  ApplicationMethodTargetType,
  ComputedActions,
  MathBN,
  MedusaError,
  PromotionType,
} from "@medusajs/utils"
import { areRulesValidForContext } from "../validations"
import { computeActionForBudgetExceeded } from "./usage"

type EligibleItem = { item_id: string; quantity: BigNumberInput }

function sortByPrice(a: ComputeActionItemLine, b: ComputeActionItemLine) {
  const aPrice = MathBN.div(a.subtotal, a.quantity)
  const bPrice = MathBN.div(b.subtotal, b.quantity)

  return MathBN.lt(bPrice, aPrice) ? -1 : 1
}

/*
  Grabs all the items in the context where the rules apply
  We then sort by price to prioritize most valuable item
*/
function fetchEligibleItemsByRules(
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

// TODO: calculations should eventually move to a totals util outside of the module
export function getComputedActionsForBuyGet(
  promotion: PromotionTypes.PromotionDTO,
  itemsContext: ComputeActionItemLine[],
  methodIdPromoValueMap: Map<string, BigNumberInput>
): PromotionTypes.ComputeActions[] {
  const computedActions: PromotionTypes.ComputeActions[] = []
  // Keeps a map of all elgible items in the buy section and its eligible quantity
  const eligibleBuyItemMap = new Map<string, EligibleItem[]>()
  // Keeps a map of all elgible items in the target section and its eligible quantity
  const eligibleTargetItemMap = new Map<string, EligibleItem[]>()

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

  const eligibleBuyItems = fetchEligibleItemsByRules(
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

    We build a map here to use when we apply promotions on the target items.
  */
  for (const eligibleBuyItem of eligibleBuyItems) {
    const buyItems = eligibleBuyItemMap.get(promotion.code!) || []
    const eligibleQuantity = MathBN.sum(...buyItems.map((b) => b.quantity))
    const reservableQuantity = MathBN.sub(minimumBuyQuantity, eligibleQuantity)

    // If we have reached the required minimum quantity, we break the loop early
    if (MathBN.lte(reservableQuantity, 0)) {
      break
    }

    buyItems.push({
      item_id: eligibleBuyItem.id,
      quantity: MathBN.min(eligibleBuyItem.quantity, reservableQuantity),
    })

    eligibleBuyItemMap.set(promotion.code!, buyItems)
  }

  const eligibleTargetItems = fetchEligibleItemsByRules(
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
    const items = eligibleTargetItemMap.get(promotion.code!) || []
    const eligibleBuyItems = (
      eligibleBuyItemMap.get(promotion.code!) || []
    ).filter((buy) => buy.item_id === eligibleTargetItem.id)

    const inapplicableQuantity = MathBN.sum(
      ...eligibleBuyItems.map((b) => b.quantity)
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

    items.push({
      item_id: eligibleTargetItem.id,
      quantity: MathBN.min(fulfillableQuantity, targetQuantity),
    })

    eligibleTargetItemMap.set(promotion.code!, items)
  }

  const targetItems = Array.from(eligibleTargetItemMap.values()).flat(1)
  const availableTargetQuantity = targetItems.reduce(
    (sum, item) => MathBN.sum(sum, item.quantity),
    MathBN.convert(0)
  )

  // If we were able to match the target requirements across all line items, we return early.
  if (MathBN.lt(availableTargetQuantity, targetQuantity)) {
    return []
  }

  let remainingQtyToApply = MathBN.convert(targetQuantity)

  for (const targetItem of targetItems) {
    const item = itemsMap.get(targetItem.item_id)!
    const appliedPromoValue = methodIdPromoValueMap.get(item.id) ?? 0
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

    methodIdPromoValueMap.set(item.id, MathBN.add(appliedPromoValue, amount))

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
