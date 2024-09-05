import { AdjustmentLineDTO, BigNumberInput } from "@medusajs/types"
import { isDefined } from "../../common"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"

export function calculateAdjustmentTotal({
  adjustments,
  includesTax,
  taxRate,
}: {
  adjustments: Pick<AdjustmentLineDTO, "amount">[]
  includesTax?: boolean
  taxRate?: BigNumberInput
}) {
  let total = MathBN.convert(0)
  for (const adj of adjustments) {
    if (!isDefined(adj.amount)) {
      continue
    }

    total = MathBN.add(total, adj.amount)

    if (isDefined(taxRate)) {
      if (includesTax) {
        const rate = MathBN.div(taxRate, 100)
        let taxAmount = MathBN.mult(adj.amount, rate)

        taxAmount = MathBN.div(taxAmount, MathBN.add(1, rate))

        adj["subtotal"] = new BigNumber(MathBN.sub(adj.amount, taxAmount))
        adj["total"] = new BigNumber(adj.amount)
      } else {
        total = MathBN.convert(adj.amount)

        adj["subtotal"] = new BigNumber(adj.amount)
        adj["total"] = new BigNumber(total)
      }
    }
  }

  return total
}
