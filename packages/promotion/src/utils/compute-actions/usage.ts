import { ComputeActions } from "@medusajs/types"
import { ComputedActions } from "@medusajs/utils"

export function canRegisterUsage(computedAction: ComputeActions): boolean {
  return (
    [
      ComputedActions.ADD_ITEM_ADJUSTMENT,
      ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
    ] as string[]
  ).includes(computedAction.action)
}
