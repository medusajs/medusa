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
  adjustments?: Pick<AdjustmentLineDTO, "amount">[]
}

export interface GetShippingMethodTotalOutput {
  amount: BigNumber

  subtotal: BigNumber

  total: BigNumber
  original_total: BigNumber

  discount_total: BigNumber
  discount_tax_total: BigNumber

  tax_total: BigNumber
  original_tax_total: BigNumber
}

export function getShippingMethodsTotals(
  shippingMethods: GetShippingMethodTotalInput[],
  context: GetShippingMethodsTotalsContext
): Record<string, GetShippingMethodTotalOutput> {
  const { includeTax } = context

  const shippingMethodsTotals = {}

  let index = 0
  for (const shippingMethod of shippingMethods) {
    shippingMethodsTotals[shippingMethod.id ?? index] = getShippingMethodTotals(
      shippingMethod,
      {
        includeTax: includeTax || shippingMethod.is_tax_inclusive,
      }
    )
    index++
  }

  return shippingMethodsTotals
}

export function getShippingMethodTotals(
  shippingMethod: GetShippingMethodTotalInput,
  context: GetShippingMethodsTotalsContext
) {
  const amount = MathBN.convert(shippingMethod.amount)
  const subtotal = MathBN.convert(shippingMethod.amount)

  const sumTaxRate = MathBN.sum(
    ...(shippingMethod.tax_lines?.map((taxLine) => taxLine.rate) ?? [])
  )

  const discountTotal = calculateAdjustmentTotal({
    adjustments: shippingMethod.adjustments || [],
    includesTax: context.includeTax,
    taxRate: sumTaxRate,
  })
  const discountTaxTotal = MathBN.mult(
    discountTotal,
    MathBN.div(sumTaxRate, 100)
  )

  const total = MathBN.sub(amount, discountTotal)

  const totals: GetShippingMethodTotalOutput = {
    amount: new BigNumber(amount),

    subtotal: new BigNumber(subtotal),

    total: new BigNumber(total),
    original_total: new BigNumber(amount),

    discount_total: new BigNumber(discountTotal),
    discount_tax_total: new BigNumber(discountTaxTotal),

    tax_total: new BigNumber(0),
    original_tax_total: new BigNumber(0),
  }

  const taxLines = shippingMethod.tax_lines || []

  const taxableAmountWithDiscount = MathBN.sub(subtotal, discountTotal)
  const taxableAmount = subtotal

  const taxTotal = calculateTaxTotal({
    taxLines,
    includesTax: context.includeTax,
    taxableAmount: taxableAmountWithDiscount,
    setTotalField: "total",
  })
  totals.tax_total = new BigNumber(taxTotal)

  const originalTaxTotal = calculateTaxTotal({
    taxLines,
    includesTax: context.includeTax,
    taxableAmount,
    setTotalField: "subtotal",
  })
  totals.original_tax_total = new BigNumber(originalTaxTotal)

  const isTaxInclusive = context.includeTax ?? shippingMethod.is_tax_inclusive

  if (isTaxInclusive) {
    const subtotal = MathBN.sub(shippingMethod.amount, originalTaxTotal)
    totals.subtotal = new BigNumber(subtotal)
  } else {
    const originalTotal = MathBN.add(
      shippingMethod.amount,
      totals.original_tax_total
    )
    const total = MathBN.add(totals.total, totals.tax_total)

    totals.total = new BigNumber(total)
    totals.original_total = new BigNumber(originalTotal)
  }

  return totals
}
