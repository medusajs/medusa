import { AdjustmentLineDTO, BigNumberInput } from "@medusajs/types"
import { isDefined } from "../../common"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"

export function calculateAdjustmentTotal({
  item,
  adjustments,
  taxRate,
}: {
  item?: { quantity: BigNumberInput }
  adjustments: Pick<AdjustmentLineDTO, "amount" | "is_tax_inclusive">[]
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

    const adjustmentSubtotal =
      isDefined(taxRate) && adj.is_tax_inclusive
        ? MathBN.div(adj.amount, MathBN.add(1, taxRate))
        : adj.amount

    const adjustmentTaxTotal = isDefined(taxRate)
      ? MathBN.mult(adjustmentSubtotal, taxRate)
      : 0
    const adjustmentTotal = MathBN.add(adjustmentSubtotal, adjustmentTaxTotal)

    adjustmentsSubtotal = MathBN.add(adjustmentsSubtotal, adjustmentSubtotal)
    adjustmentsTaxTotal = MathBN.add(adjustmentsTaxTotal, adjustmentTaxTotal)
    adjustmentsTotal = MathBN.add(adjustmentsTotal, adjustmentTotal)

    // Assign this adjustment's OWN subtotal/total — not the running cumulative
    // sum across all adjustments. Using the plural accumulators here inflated
    // every adjustment after the first to the cumulative total.
    adj["subtotal"] = new BigNumber(adjustmentSubtotal)
    adj["total"] = new BigNumber(adjustmentTotal)
  }

  const quantity = item?.quantity || MathBN.convert(1)

  let adjustmentPerItem = MathBN.convert(0)
  let adjustmentSubtotalPerItem = MathBN.convert(0)
  let adjustmentTaxTotalPerItem = MathBN.convert(0)

  if (!MathBN.eq(quantity, 0)) {
    adjustmentPerItem = MathBN.div(adjustmentsTotal, quantity)
    adjustmentSubtotalPerItem = MathBN.div(adjustmentsSubtotal, quantity)
    adjustmentTaxTotalPerItem = MathBN.div(adjustmentsTaxTotal, quantity)
  }

  return {
    adjustmentsTotal,
    adjustmentsSubtotal,
    adjustmentsTaxTotal,
    adjustmentPerItem,
    adjustmentSubtotalPerItem,
    adjustmentTaxTotalPerItem,
  }
}
