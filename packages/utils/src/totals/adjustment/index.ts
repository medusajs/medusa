import { AdjustmentLineDTO } from "@medusajs/types"
import { MathBN } from "../math"

export function calculateAdjustmentTotal({
  adjustments,
}: {
  adjustments: AdjustmentLineDTO[]
}) {
  return adjustments.reduce((acc, line) => {
    return MathBN.add(acc, line.amount)
  }, MathBN.convert(0))
}
