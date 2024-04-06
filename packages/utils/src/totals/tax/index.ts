import { BigNumberInput, TaxLineDTO } from "@medusajs/types"
import { MathBN } from "../math"

export function calculateTaxTotal({
  taxLines,
  includesTax,
  taxableAmount,
  taxRate,
  setTotalField,
}: {
  taxLines: TaxLineDTO[]
  includesTax?: boolean
  taxableAmount: BigNumberInput
  taxRate?: number
  setTotalField?: string
}) {
  let taxTotal = MathBN.convert(0)
  for (const taxLine of taxLines) {
    const rate = MathBN.convert(taxRate ?? taxLine.rate)
    let taxAmount = MathBN.mult(taxableAmount, rate)

    if (includesTax) {
      taxAmount = MathBN.div(taxAmount, MathBN.add(1, rate))
    }

    if (setTotalField) {
      ;(taxLine as any)[setTotalField] = taxAmount
    }

    taxTotal = MathBN.add(taxTotal, taxAmount)
  }

  return taxTotal
}
