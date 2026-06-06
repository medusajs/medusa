import {
  BigNumberInput,
  InferEntityType,
  PromotionTypes,
} from "@zjedene-medusa/framework/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  ComputedActions,
  MathBN,
  MedusaError,
} from "@zjedene-medusa/framework/utils"
import { Promotion } from "@models"
import { areRulesValidForContext } from "../validations"
import { sortShippingLineByPriceAscending } from "./sort-by-price"
import { computeActionForBudgetExceeded } from "./usage"

export function getComputedActionsForShippingMethods(
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
  shippingMethodApplicationContext: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.SHIPPING_METHODS],
  methodIdPromoValueMap: Map<string, number>
): PromotionTypes.ComputeActions[] {
  let applicableShippingItems: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.SHIPPING_METHODS] =
    []

  if (!shippingMethodApplicationContext) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `"shipping_methods" should be present as an array in the context for computeActions`
    )
  }

  for (const shippingMethodContext of shippingMethodApplicationContext) {
    const isPromotionApplicableToItem = areRulesValidForContext(
      promotion.application_method?.target_rules!,
      shippingMethodContext,
      ApplicationMethodTargetType.SHIPPING_METHODS
    )

    if (!isPromotionApplicableToItem) {
      continue
    }

    applicableShippingItems.push(shippingMethodContext)
  }

  const allocation = promotion.application_method?.allocation!
  if (allocation === ApplicationMethodAllocation.ONCE) {
    applicableShippingItems = applicableShippingItems.sort(
      sortShippingLineByPriceAscending
    )
  }

  return applyPromotionToShippingMethods(
    promotion,
    applicableShippingItems,
    methodIdPromoValueMap
  )
}

export function applyPromotionToShippingMethods(
  promotion: PromotionTypes.PromotionDTO | InferEntityType<typeof Promotion>,
  shippingMethods: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.SHIPPING_METHODS],
  methodIdPromoValueMap: Map<string, BigNumberInput>
): PromotionTypes.ComputeActions[] {
  const { application_method: applicationMethod } = promotion
  const allocation = applicationMethod?.allocation!
  const computedActions: PromotionTypes.ComputeActions[] = []
  const maxQuantity = applicationMethod?.max_quantity ?? 0
  let remainingQuota = maxQuantity

  if (
    allocation === ApplicationMethodAllocation.EACH ||
    allocation === ApplicationMethodAllocation.ONCE
  ) {
    for (const method of shippingMethods!) {
      if (
        allocation === ApplicationMethodAllocation.ONCE &&
        remainingQuota <= 0
      ) {
        break
      }
      if (!method.subtotal) {
        continue
      }

      const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
      let promotionValue = MathBN.convert(applicationMethod?.value ?? 0)
      const applicableTotal = MathBN.sub(method.subtotal, appliedPromoValue)

      if (applicationMethod?.type === ApplicationMethodType.PERCENTAGE) {
        promotionValue = MathBN.mult(
          MathBN.div(promotionValue, 100),
          applicableTotal
        )
      }

      const amount = MathBN.min(promotionValue, applicableTotal)

      if (MathBN.lte(amount, 0)) {
        continue
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
        method.id,
        MathBN.add(appliedPromoValue, amount)
      )

      if (allocation === ApplicationMethodAllocation.ONCE) {
        remainingQuota -= 1
      }

      computedActions.push({
        action: ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
        shipping_method_id: method.id,
        amount,
        code: promotion.code!,
      })
    }
  }

  if (allocation === ApplicationMethodAllocation.ACROSS) {
    const totalApplicableValue = shippingMethods!.reduce((acc, method) => {
      const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0

      return MathBN.add(
        acc,
        MathBN.sub(method.subtotal ?? 0, appliedPromoValue)
      )
    }, MathBN.convert(0))

    if (MathBN.lte(totalApplicableValue, 0)) {
      return computedActions
    }

    for (const method of shippingMethods!) {
      if (!method.subtotal) {
        continue
      }

      const promotionValue = applicationMethod?.value ?? 0
      const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0
      const applicableTotal = MathBN.sub(method.subtotal, appliedPromoValue)

      let applicablePromotionValue = MathBN.mult(
        MathBN.div(applicableTotal, totalApplicableValue),
        promotionValue
      )

      if (applicationMethod?.type === ApplicationMethodType.PERCENTAGE) {
        applicablePromotionValue = MathBN.mult(
          MathBN.div(promotionValue, 100),
          applicableTotal
        )
      }

      const amount = MathBN.min(applicablePromotionValue, applicableTotal)

      if (MathBN.lte(amount, 0)) {
        continue
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
        method.id,
        MathBN.add(appliedPromoValue, amount)
      )

      computedActions.push({
        action: ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
        shipping_method_id: method.id,
        amount,
        code: promotion.code!,
      })
    }
  }

  return computedActions
}
