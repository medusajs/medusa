import {
  BigNumberInput,
  ComputeActionItemLine,
  InferEntityType,
  PromotionTypes,
} from "@medusajs/framework/types"
import {
  ApplicationMethodTargetType,
  ApplicationMethodType,
  ComputedActions,
  MathBN,
  MedusaError,
  PromotionType,
} from "@medusajs/framework/utils"
import { areRulesValidForContext } from "../validations"
import { computeActionForBudgetExceeded } from "./usage"
import { Promotion } from "@models"

export type EligibleItem = {
  item_id: string
  quantity: BigNumberInput
}

function sortByPrice(a: ComputeActionItemLine, b: ComputeActionItemLine) {
  return MathBN.lt(a.subtotal, b.subtotal) ? 1 : -1
}

function isValidPromotionContext(
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
  itemsContext: ComputeActionItemLine[]
): boolean {
  if (!itemsContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"items" should be present as an array in the context to compute actions`
    )
  }

  if (!itemsContext?.length) {
    return false
  }

  const minimumBuyQuantity = MathBN.convert(
    promotion.application_method?.buy_rules_min_quantity ?? 0
  )

  if (
    MathBN.lte(minimumBuyQuantity, 0) ||
    !promotion.application_method?.buy_rules?.length
  ) {
    return false
  }

  return true
}

function normalizePromotionApplicationConfiguration(
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>
) {
  const minimumBuyQuantity = MathBN.convert(
    promotion.application_method?.buy_rules_min_quantity ?? 0
  )
  const targetApplyQuantity = MathBN.convert(
    promotion.application_method?.apply_to_quantity ?? 0
  )
  const maximumApplyQuantity = MathBN.convert(
    promotion.application_method?.max_quantity ?? 1
  )
  const promotionValue = promotion.application_method?.value ?? 0

  return {
    minimumBuyQuantity,
    targetApplyQuantity,
    maximumApplyQuantity,
    promotionValue,
  }
}

function calculateRemainingQuantities(
  eligibleItems: ComputeActionItemLine[],
  itemsMap: Map<string, EligibleItem[]>,
  currentPromotionCode: string
): Map<string, BigNumberInput> {
  const remainingQuantities = new Map<string, BigNumberInput>()

  for (const item of eligibleItems) {
    let consumedByOtherPromotions = MathBN.convert(0)

    for (const [code, eligibleItems] of itemsMap) {
      if (code === currentPromotionCode) {
        continue
      }

      for (const eligibleItem of eligibleItems) {
        if (eligibleItem.item_id === item.id) {
          consumedByOtherPromotions = MathBN.add(
            consumedByOtherPromotions,
            eligibleItem.quantity
          )
        }
      }
    }

    const remaining = MathBN.sub(item.quantity, consumedByOtherPromotions)
    remainingQuantities.set(item.id, MathBN.max(remaining, 0))
  }

  return remainingQuantities
}

type PromotionConfig = {
  minimumBuyQuantity: BigNumberInput
  targetApplyQuantity: BigNumberInput
  maximumApplyQuantity: BigNumberInput
  promotionValue: number
}

type PromotionApplication = {
  buyItems: EligibleItem[]
  targetItems: EligibleItem[]
  isValid: boolean
}

/*
  Determines which buy and target items should be used for a promotion application.
  
  We run the following steps to prepare the promotion application state to be used within an application loop:
    1. Selecting enough buy items to satisfy the minimum buy quantity requirement from the remaining buy quantities
    2. Identifying target eligible items for application (excluding those used in buy rules) from the remaining target quantities
    3. Ensuring the application doesn't exceed max_quantity limits for the target items
    4. Returns a valid application state or marks it invalid if requirements can't be met
*/
function preparePromotionApplicationState(
  eligibleBuyItems: ComputeActionItemLine[],
  eligibleTargetItems: ComputeActionItemLine[],
  remainingBuyQuantities: Map<string, BigNumberInput>,
  remainingTargetQuantities: Map<string, BigNumberInput>,
  applicationConfig: PromotionConfig,
  appliedPromotionQuantity: BigNumberInput
): PromotionApplication {
  const totalRemainingBuyQuantity = MathBN.sum(
    ...Array.from(remainingBuyQuantities.values())
  )

  if (
    MathBN.lt(totalRemainingBuyQuantity, applicationConfig.minimumBuyQuantity)
  ) {
    return { buyItems: [], targetItems: [], isValid: false }
  }

  const eligibleItemsByPromotion: EligibleItem[] = []
  let accumulatedQuantity = MathBN.convert(0)

  for (const eligibleBuyItem of eligibleBuyItems) {
    if (MathBN.gte(accumulatedQuantity, applicationConfig.minimumBuyQuantity)) {
      break
    }

    const availableQuantity =
      remainingBuyQuantities.get(eligibleBuyItem.id) || MathBN.convert(0)

    if (MathBN.lte(availableQuantity, 0)) {
      continue
    }

    const reservableQuantity = MathBN.min(
      availableQuantity,
      MathBN.sub(applicationConfig.minimumBuyQuantity, accumulatedQuantity)
    )

    if (MathBN.lte(reservableQuantity, 0)) {
      continue
    }

    eligibleItemsByPromotion.push({
      item_id: eligibleBuyItem.id,
      quantity: reservableQuantity.toNumber(),
    })

    accumulatedQuantity = MathBN.add(accumulatedQuantity, reservableQuantity)
  }

  if (MathBN.lt(accumulatedQuantity, applicationConfig.minimumBuyQuantity)) {
    return { buyItems: [], targetItems: [], isValid: false }
  }

  const quantitiesUsedInBuyRules = new Map<string, BigNumberInput>()

  for (const buyItem of eligibleItemsByPromotion) {
    const currentValue =
      quantitiesUsedInBuyRules.get(buyItem.item_id) || MathBN.convert(0)

    quantitiesUsedInBuyRules.set(
      buyItem.item_id,
      MathBN.add(currentValue, buyItem.quantity)
    )
  }

  const targetItemsByPromotion: EligibleItem[] = []
  let availableTargetQuantity = MathBN.convert(0)

  for (const eligibleTargetItem of eligibleTargetItems) {
    const availableTargetQuantityForItem =
      remainingTargetQuantities.get(eligibleTargetItem.id) || MathBN.convert(0)

    const quantityUsedInBuyRules =
      quantitiesUsedInBuyRules.get(eligibleTargetItem.id) || MathBN.convert(0)

    const applicableQuantity = MathBN.sub(
      availableTargetQuantityForItem,
      quantityUsedInBuyRules
    )

    if (MathBN.lte(applicableQuantity, 0)) {
      continue
    }

    const remainingNeeded = MathBN.sub(
      applicationConfig.targetApplyQuantity,
      availableTargetQuantity
    )

    const remainingMaxQuantityAllowance = MathBN.sub(
      applicationConfig.maximumApplyQuantity,
      appliedPromotionQuantity
    )

    const fulfillableQuantity = MathBN.min(
      remainingNeeded,
      applicableQuantity,
      remainingMaxQuantityAllowance
    )

    if (MathBN.lte(fulfillableQuantity, 0)) {
      continue
    }

    targetItemsByPromotion.push({
      item_id: eligibleTargetItem.id,
      quantity: fulfillableQuantity.toNumber(),
    })

    availableTargetQuantity = MathBN.add(
      availableTargetQuantity,
      fulfillableQuantity
    )

    if (
      MathBN.gte(availableTargetQuantity, applicationConfig.targetApplyQuantity)
    ) {
      break
    }
  }

  const isValid = MathBN.gte(
    availableTargetQuantity,
    applicationConfig.targetApplyQuantity
  )

  return {
    buyItems: eligibleItemsByPromotion,
    targetItems: targetItemsByPromotion,
    isValid,
  }
}

/*
  Applies promotion to the target items selected by preparePromotionApplicationState.
  
  This function performs the application by:
    1. Calculating promotion amounts based on item prices and promotion value (percentage or fixed)
    2. Checking promotion budget limits to prevent overspending
    3. Updating promotional value tracking maps for cross-promotion coordination
    4. Accumulating total promotion amounts per item across all applications
    5. Returns computed actions
*/
function applyPromotionToTargetItems(
  targetItems: EligibleItem[],
  itemIdPromotionAmountMap: Map<string, BigNumberInput>,
  methodIdPromoValueMap: Map<string, BigNumberInput>,
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
  itemsMap: Map<string, ComputeActionItemLine>,
  applicationConfig: PromotionConfig
): {
  computedActions: PromotionTypes.ComputeActions[]
  appliedPromotionQuantity: BigNumberInput
} {
  const computedActions: PromotionTypes.ComputeActions[] = []
  let appliedPromotionQuantity = MathBN.convert(0)
  let remainingQtyToApply = MathBN.convert(
    applicationConfig.targetApplyQuantity
  )

  for (const targetItem of targetItems) {
    if (MathBN.lte(remainingQtyToApply, 0)) {
      break
    }

    const item = itemsMap.get(targetItem.item_id)!
    const appliedPromoValue =
      methodIdPromoValueMap.get(item.id) ?? MathBN.convert(0)
    const multiplier = MathBN.min(targetItem.quantity, remainingQtyToApply)
    const pricePerUnit = MathBN.div(item.subtotal, item.quantity)
    const applicableAmount = MathBN.mult(pricePerUnit, multiplier)

    let amount
    if (promotion.application_method?.type === ApplicationMethodType.FIXED) {
      // Fixed: apply value per unit, capped at item price
      amount = MathBN.min(
        MathBN.mult(applicationConfig.promotionValue, multiplier),
        applicableAmount
      )
    } else {
      amount = MathBN.mult(
        applicableAmount,
        applicationConfig.promotionValue
      ).div(100)
    }

    if (MathBN.lte(amount, 0)) {
      continue
    }

    remainingQtyToApply = MathBN.sub(remainingQtyToApply, multiplier)

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

    const currentPromotionAmount =
      itemIdPromotionAmountMap.get(item.id) ?? MathBN.convert(0)

    itemIdPromotionAmountMap.set(
      item.id,
      MathBN.add(currentPromotionAmount, amount)
    )

    appliedPromotionQuantity = MathBN.add(appliedPromotionQuantity, multiplier)
  }

  return { computedActions, appliedPromotionQuantity }
}

/*
  Updates the remaining quantities of the eligible items (buy and target) based on the application.
  This is used to prevent double-usage of the same item in the next iteration of the
  application loop.

  We track the total consumed quantities per item to handle buy+target scenarios of the same item.
*/
function updateEligibleItemQuantities(
  remainingBuyQuantities: Map<string, BigNumberInput>,
  remainingTargetQuantities: Map<string, BigNumberInput>,
  application: PromotionApplication
): void {
  const totalConsumedQuantities = new Map<string, BigNumberInput>()

  for (const buyItem of application.buyItems) {
    const currentConsumed =
      totalConsumedQuantities.get(buyItem.item_id) || MathBN.convert(0)

    totalConsumedQuantities.set(
      buyItem.item_id,
      MathBN.add(currentConsumed, buyItem.quantity)
    )
  }

  for (const targetItem of application.targetItems) {
    const currentConsumed =
      totalConsumedQuantities.get(targetItem.item_id) || MathBN.convert(0)

    totalConsumedQuantities.set(
      targetItem.item_id,
      MathBN.add(currentConsumed, targetItem.quantity)
    )
  }

  // Update remaining quantities of buy and target items based on totalConsumedQuantities tracked from previous iterations
  for (const [itemId, consumedQuantity] of totalConsumedQuantities) {
    if (remainingBuyQuantities.has(itemId)) {
      const currentBuyRemaining =
        remainingBuyQuantities.get(itemId) || MathBN.convert(0)

      remainingBuyQuantities.set(
        itemId,
        MathBN.sub(currentBuyRemaining, consumedQuantity)
      )
    }

    if (remainingTargetQuantities.has(itemId)) {
      const currentTargetRemaining =
        remainingTargetQuantities.get(itemId) || MathBN.convert(0)

      remainingTargetQuantities.set(
        itemId,
        MathBN.sub(currentTargetRemaining, consumedQuantity)
      )
    }
  }
}

function updateEligibleItems(
  totalEligibleItemsMap: Map<string, EligibleItem>,
  applicationItems: EligibleItem[]
): void {
  for (const item of applicationItems) {
    const existingItem = totalEligibleItemsMap.get(item.item_id)

    // If the item already exists, we add the quantity to the existing item
    if (existingItem) {
      existingItem.quantity = MathBN.add(
        existingItem.quantity,
        item.quantity
      ).toNumber()
    } else {
      totalEligibleItemsMap.set(item.item_id, { ...item })
    }
  }
}

function createComputedActionsFromPromotionApplication(
  itemIdPromotionAmountMap: Map<string, BigNumberInput>,
  promotionCode: string
): PromotionTypes.ComputeActions[] {
  const computedActions: PromotionTypes.ComputeActions[] = []

  for (const [itemId, totalAmount] of itemIdPromotionAmountMap) {
    if (MathBN.gt(totalAmount, 0)) {
      computedActions.push({
        action: ComputedActions.ADD_ITEM_ADJUSTMENT,
        item_id: itemId,
        amount: totalAmount,
        code: promotionCode,
      })
    }
  }

  return computedActions
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
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
  itemsContext: ComputeActionItemLine[],
  methodIdPromoValueMap: Map<string, BigNumberInput>,
  eligibleBuyItemMap: Map<string, EligibleItem[]>,
  eligibleTargetItemMap: Map<string, EligibleItem[]>
): PromotionTypes.ComputeActions[] {
  if (!isValidPromotionContext(promotion, itemsContext)) {
    return []
  }

  const applicationConfig =
    normalizePromotionApplicationConfiguration(promotion)

  const itemsMap = new Map<string, ComputeActionItemLine>(
    itemsContext.map((i) => [i.id, i])
  )

  const eligibleBuyItems = filterItemsByPromotionRules(
    itemsContext,
    promotion.application_method?.buy_rules
  )

  const eligibleTargetItems = filterItemsByPromotionRules(
    itemsContext,
    promotion.application_method?.target_rules
  )

  const remainingBuyQuantities = calculateRemainingQuantities(
    eligibleBuyItems,
    eligibleBuyItemMap,
    promotion.code!
  )

  const remainingTargetQuantities = calculateRemainingQuantities(
    eligibleTargetItems,
    eligibleTargetItemMap,
    promotion.code!
  )

  const totalEligibleBuyItemsMap = new Map<string, EligibleItem>()
  const totalEligibleTargetItemsMap = new Map<string, EligibleItem>()
  const itemIdPromotionAmountMap = new Map<string, BigNumberInput>()
  const computedActions: PromotionTypes.ComputeActions[] = []

  const MAX_PROMOTION_ITERATIONS = 1000
  let iterationCount = 0
  let appliedPromotionQuantity = MathBN.convert(0)

  /*
    This loop continues applying the promotion until one of the stopping conditions is met:
    - No more items satisfy the minimum buy quantity requirement
    - Maximum applicable promotion quantity is reached  
    - No valid target items can be found for promotion application
    - Maximum iteration count is reached (safety check)
    
    Each iteration:
    1. Prepares an application state (selects buy items + eligible target items)
    2. Applies promotion to the selected target items
    3. Updates remaining quantities to prevent double-usage in next iteration
    4. Updates the total eligible items for next iteration
  */
  while (true) {
    iterationCount++

    if (iterationCount > MAX_PROMOTION_ITERATIONS) {
      console.warn(
        `Buy-get promotion ${promotion.code} exceeded maximum iterations (${MAX_PROMOTION_ITERATIONS}). Breaking loop to prevent infinite execution.`
      )

      break
    }
    // We prepare an application state for the promotion to be applied on all eligible items
    // We use this as a source of truth to update the remaining quantities of the eligible items
    // and the total eligible items
    const applicationState = preparePromotionApplicationState(
      eligibleBuyItems,
      eligibleTargetItems,
      remainingBuyQuantities,
      remainingTargetQuantities,
      applicationConfig,
      appliedPromotionQuantity
    )

    // If the application state is not valid, we break the loop
    // If it is not valid, it means that there are no more eligible items to apply the promotion to
    // for the configuration of the promotion
    if (!applicationState.isValid) {
      break
    }

    // We apply the promotion to the target items based on the target items that are eligible
    // and the remaining quantities of the target items
    const application = applyPromotionToTargetItems(
      applicationState.targetItems,
      itemIdPromotionAmountMap,
      methodIdPromoValueMap,
      promotion,
      itemsMap,
      applicationConfig
    )

    computedActions.push(...application.computedActions)

    // Computed actions being generated means that the promotion is applied.
    // We now need to update the remaining quantities of the eligible items and the total eligible items
    // to be used in the next iteration of the loop
    appliedPromotionQuantity = MathBN.add(
      appliedPromotionQuantity,
      application.appliedPromotionQuantity
    )

    updateEligibleItemQuantities(
      remainingBuyQuantities,
      remainingTargetQuantities,
      applicationState
    )

    updateEligibleItems(totalEligibleBuyItemsMap, applicationState.buyItems)
    updateEligibleItems(
      totalEligibleTargetItemsMap,
      applicationState.targetItems
    )
  }

  const finalActions = createComputedActionsFromPromotionApplication(
    itemIdPromotionAmountMap,
    promotion.code!
  )
  computedActions.push(...finalActions)

  eligibleBuyItemMap.set(
    promotion.code!,
    Array.from(totalEligibleBuyItemsMap.values())
  )
  eligibleTargetItemMap.set(
    promotion.code!,
    Array.from(totalEligibleTargetItemsMap.values())
  )

  return computedActions
}

export function sortByBuyGetType(a, b) {
  if (a.type === PromotionType.BUYGET && b.type !== PromotionType.BUYGET) {
    return -1 // BuyGet promotions come first
  } else if (
    a.type !== PromotionType.BUYGET &&
    b.type === PromotionType.BUYGET
  ) {
    return 1 // BuyGet promotions come first
  } else if (a.type === b.type) {
    // If types are equal, sort by application_method.value in descending order when types are equal
    if (a.application_method.value < b.application_method.value) {
      return 1 // Higher value comes first
    } else if (a.application_method.value > b.application_method.value) {
      return -1 // Lower value comes later
    }

    /*
      If the promotion is a BuyGet & the value is the same, we need to sort by the following criteria:
      - buy_rules_min_quantity in descending order
      - apply_to_quantity in descending order
    */
    if (a.type === PromotionType.BUYGET) {
      if (
        a.application_method.buy_rules_min_quantity <
        b.application_method.buy_rules_min_quantity
      ) {
        return 1
      } else if (
        a.application_method.buy_rules_min_quantity >
        b.application_method.buy_rules_min_quantity
      ) {
        return -1
      }

      if (
        a.application_method.apply_to_quantity <
        b.application_method.apply_to_quantity
      ) {
        return 1
      } else if (
        a.application_method.apply_to_quantity >
        b.application_method.apply_to_quantity
      ) {
        return -1
      }
    }

    return 0 // If all criteria are equal, keep original order
  } else {
    return 0 // If types are different (and not BuyGet), keep original order
  }
}
