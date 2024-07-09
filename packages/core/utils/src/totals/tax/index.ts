import { BigNumberInput, TaxLineDTO } from "@medusajs/types"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"

export function calculateTaxTotal({
  taxLines,
  includesTax,
  taxableAmount,
  setTotalField,
}: {
  taxLines: Pick<TaxLineDTO, "rate">[]
  includesTax?: boolean
  taxableAmount: BigNumberInput
  setTotalField?: string
}) {
  let taxTotal = MathBN.convert(0)
  for (const taxLine of taxLines) {
    const rate = MathBN.div(taxLine.rate, 100)
    let taxAmount = MathBN.mult(taxableAmount, rate)

    if (includesTax) {
      taxAmount = MathBN.div(taxAmount, MathBN.add(1, rate))
    }

    if (setTotalField) {
      ;(taxLine as any)[setTotalField] = new BigNumber(taxAmount)
    }

    taxTotal = MathBN.add(taxTotal, taxAmount)
  }

  return taxTotal
}

export function calculateAmountsWithTax({
  taxLines,
  amount,
  includesTax,
}: {
  taxLines: Pick<TaxLineDTO, "rate">[]
  amount: number
  includesTax?: boolean
}) {
  const tax = calculateTaxTotal({
    taxLines,
    includesTax,
    taxableAmount: amount,
  })

  return {
    priceWithTax: includesTax ? amount : MathBN.add(tax, amount).toNumber(),
    priceWithoutTax: includesTax ? MathBN.sub(amount, tax).toNumber() : amount,
  }
}
