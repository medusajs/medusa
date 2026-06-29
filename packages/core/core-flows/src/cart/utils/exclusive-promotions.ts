import { ComputedActions } from "@zjedene-medusa/framework/utils"

const ADD_ADJUSTMENT_ACTIONS: string[] = [
  ComputedActions.ADD_ITEM_ADJUSTMENT,
  ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
]

/**
 * Enforces promotion exclusivity over a set of computed promotion actions.
 *
 * When at least one of the applied promotions is exclusive, the promotions
 * cannot be combined: only the single most valuable promotion (by total
 * discount amount across all items / shipping methods) is kept, and the
 * adjustment actions of every other promotion are dropped. Non-adjustment
 * actions (e.g. removals) are always preserved.
 *
 * If none of the applied promotions are exclusive, the actions are returned
 * unchanged.
 */
export function filterExclusivePromotionActions<
  T extends { action?: string; code?: string; amount?: number }
>(actions: T[], exclusiveCodes: Set<string>): T[] {
  if (!exclusiveCodes.size) {
    return actions
  }

  const totalByCode = new Map<string, number>()

  for (const action of actions) {
    if (
      action.code &&
      action.action &&
      ADD_ADJUSTMENT_ACTIONS.includes(action.action)
    ) {
      totalByCode.set(
        action.code,
        (totalByCode.get(action.code) ?? 0) + Number(action.amount ?? 0)
      )
    }
  }

  const appliedCodes = [...totalByCode.keys()]
  const hasExclusiveApplied = appliedCodes.some((code) =>
    exclusiveCodes.has(code)
  )

  if (!hasExclusiveApplied) {
    return actions
  }

  let winningCode: string | undefined
  let winningTotal = -Infinity
  for (const code of appliedCodes) {
    const total = totalByCode.get(code)!
    if (total > winningTotal) {
      winningTotal = total
      winningCode = code
    }
  }

  return actions.filter((action) => {
    if (action.action && ADD_ADJUSTMENT_ACTIONS.includes(action.action)) {
      return action.code === winningCode
    }
    return true
  })
}
