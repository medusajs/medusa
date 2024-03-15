import { AdjustmentLineDTO, TaxLineDTO } from "@medusajs/types"
import { calculateAdjustmentTotal } from "../adjustment"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"
import { calculateTaxTotal } from "../tax"

interface GetShippingMethodsTotalsContext {
  includeTax?: boolean
}

export interface GetShippingMethodTotalInput {
  id: string
  amount: BigNumber
  is_tax_inclusive?: boolean
  tax_lines?: TaxLineDTO[]
  adjustments?: AdjustmentLineDTO[]
}

export interface GetShippingMethodTotalOutput {
  amount: BigNumber

  subtotal: BigNumber

  total: BigNumber
  original_total: BigNumber

  discount_total: BigNumber
  discount_tax_total

  tax_total: BigNumber
  original_tax_total: BigNumber
}

export function getShippingMethodsTotals(
  shippingMethods: GetShippingMethodTotalInput[],
  context: GetShippingMethodsTotalsContext
) {
  const { includeTax } = context

  const shippingMethodsTotals = {}

  for (const shippingMethod of shippingMethods) {
    shippingMethodsTotals[shippingMethod.id] = getShippingMethodTotals(
      shippingMethod,
      {
        includeTax,
      }
    )
  }

  return shippingMethodsTotals
}

export function getShippingMethodTotals(
  shippingMethod: GetShippingMethodTotalInput,
  context: GetShippingMethodsTotalsContext
) {
  const amount = MathBN.convert(shippingMethod.amount)

  const sumTaxRate = MathBN.sum(
    // @ts-ignore
    shippingMethod.tax_lines?.map((taxLine) => MathBN.convert(taxLine.rate))
  )
  const discountTotal = calculateAdjustmentTotal({
    adjustments: shippingMethod.adjustments || [],
  })
  const discountTaxTotal = MathBN.mult(discountTotal, sumTaxRate)

  const totals: GetShippingMethodTotalOutput = {
    amount: new BigNumber(amount),

    subtotal: new BigNumber(amount),

    total: new BigNumber(amount),
    original_total: new BigNumber(amount),

    discount_total: new BigNumber(discountTotal),
    discount_tax_total: new BigNumber(discountTaxTotal),

    tax_total: new BigNumber(0),
    original_tax_total: new BigNumber(0),
  }

  const taxLines = shippingMethod.tax_lines || []

  const taxableAmountWithDiscount = MathBN.sub(amount, discountTotal)
  const taxableAmount = amount

  const taxTotal = calculateTaxTotal({
    taxLines,
    includesTax: context.includeTax,
    taxableAmount: taxableAmountWithDiscount,
  })
  totals.tax_total = new BigNumber(taxTotal)

  const originalTaxTotal = calculateTaxTotal({
    taxLines,
    includesTax: context.includeTax,
    taxableAmount,
  })
  totals.original_tax_total = new BigNumber(originalTaxTotal)

  const isTaxInclusive = context.includeTax ?? shippingMethod.is_tax_inclusive

  if (isTaxInclusive) {
    const subtotal = MathBN.add(shippingMethod.amount, taxTotal)
    totals.subtotal = new BigNumber(subtotal)
  } else {
    const originalTotal = MathBN.add(
      shippingMethod.amount,
      totals.original_tax_total
    )
    const total = MathBN.add(shippingMethod.amount, totals.tax_total)
    
    totals.total = new BigNumber(total)
    totals.original_total = new BigNumber(originalTotal)
  }

  return totals
}
