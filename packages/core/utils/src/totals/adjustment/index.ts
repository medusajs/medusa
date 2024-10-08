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
  // the sum of all adjustment amounts excluding tax
  let adjustmentsSubtotal = MathBN.convert(0)
  // the sum of all adjustment amounts including tax
  let adjustmentsTotal = MathBN.convert(0)
  // the sum of all taxes on subtotals
  let adjustmentsTaxTotal = MathBN.convert(0)

  for (const adj of adjustments) {
    if (!isDefined(adj.amount)) {
      continue
    }

    const adjustmentAmount = MathBN.convert(adj.amount)
    adjustmentsSubtotal = MathBN.add(adjustmentsSubtotal, adjustmentAmount)

    if (isDefined(taxRate)) {
      const adjustmentSubtotal = includesTax
        ? MathBN.div(adjustmentAmount, MathBN.add(1, taxRate))
        : adjustmentAmount

      const adjustmentTaxTotal = MathBN.mult(adjustmentSubtotal, taxRate)
      const adjustmentTotal = MathBN.add(adjustmentSubtotal, adjustmentTaxTotal)

      adj["subtotal"] = new BigNumber(adjustmentSubtotal)
      adj["total"] = new BigNumber(adjustmentTotal)

      adjustmentsTotal = MathBN.add(adjustmentsTotal, adjustmentTotal)
      adjustmentsTaxTotal = MathBN.add(adjustmentsTaxTotal, adjustmentTaxTotal)
    } else {
      adj["subtotal"] = new BigNumber(adjustmentAmount)
      adj["adjustmentAmount"] = new BigNumber(adjustmentAmount)
      adjustmentsTotal = MathBN.add(adjustmentsTotal, adjustmentAmount)
    }
  }

  return {
    adjustmentsTotal,
    adjustmentsSubtotal,
    adjustmentsTaxTotal,
  }
}
