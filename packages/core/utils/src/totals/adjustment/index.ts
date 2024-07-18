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
      const rate = MathBN.div(taxRate, 100)
      let taxAmount = MathBN.mult(adj.amount, rate)

      if (includesTax) {
        taxAmount = MathBN.div(taxAmount, MathBN.add(1, rate))

        adj["subtotal"] = new BigNumber(MathBN.sub(adj.amount, taxAmount))
        adj["total"] = new BigNumber(adj.amount)
      } else {
        total = MathBN.add(adj.amount, taxAmount)

        adj["subtotal"] = new BigNumber(adj.amount)
        adj["total"] = new BigNumber(MathBN.add(adj.amount, taxAmount))
      }
    }
  }

  return total
}
