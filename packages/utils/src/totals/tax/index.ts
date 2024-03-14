import { BigNumberInput, TaxLineDTO } from "@medusajs/types"
import { MathBN } from "../math"

export function calculateTaxTotal({
  taxLines,
  includesTax,
  taxableAmount,
}: {
  taxLines: TaxLineDTO[]
  includesTax?: boolean
  taxableAmount: BigNumberInput
}) {
  const taxTotal = taxLines.reduce((acc, line) => {
    const rate = MathBN.convert(line.rate)
    let taxAmount = MathBN.mult(taxableAmount, rate)

    if (includesTax) {
      taxAmount = MathBN.div(taxAmount, MathBN.add(1, rate))
    }

    return MathBN.add(acc, taxAmount)
  }, MathBN.convert(0))

  return taxTotal
}
