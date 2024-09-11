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
  discount_subtotal: BigNumber
  discount_tax_total: BigNumber

  tax_total: BigNumber
  original_tax_total: BigNumber
}

export function getShippingMethodsTotals(
  shippingMethods: GetShippingMethodTotalInput[],
  context: GetShippingMethodsTotalsContext
): Record<string, GetShippingMethodTotalOutput> {
  const shippingMethodsTotals = {}

  let index = 0
  for (const shippingMethod of shippingMethods) {
    shippingMethodsTotals[shippingMethod.id ?? index] = getShippingMethodTotals(
      shippingMethod,
      context
    )
    index++
  }

  return shippingMethodsTotals
}

export function getShippingMethodTotals(
  shippingMethod: GetShippingMethodTotalInput,
  context: GetShippingMethodsTotalsContext
) {
  const isTaxInclusive = shippingMethod.is_tax_inclusive ?? context.includeTax

  const shippingMethodAmount = MathBN.convert(shippingMethod.amount)
  const sumTax = MathBN.sum(
    ...(shippingMethod.tax_lines?.map((taxLine) => taxLine.rate) ?? [])
  )
  const sumTaxRate = MathBN.div(sumTax, 100)

  const subtotal = isTaxInclusive
    ? MathBN.div(shippingMethodAmount, MathBN.add(1, sumTaxRate))
    : shippingMethodAmount

  const {
    adjustmentsTotal: discountsTotal,
    adjustmentsSubtotal: discountsSubtotal,
    adjustmentsTaxTotal: discountsTaxTotal,
  } = calculateAdjustmentTotal({
    adjustments: shippingMethod.adjustments || [],
    includesTax: isTaxInclusive,
    taxRate: sumTaxRate,
  })

  const taxLines = shippingMethod.tax_lines || []

  const taxTotal = calculateTaxTotal({
    taxLines,
    taxableAmount: MathBN.sub(subtotal, discountsSubtotal),
    setTotalField: "total",
  })

  const originalTaxTotal = calculateTaxTotal({
    taxLines,
    taxableAmount: subtotal,
    setTotalField: "subtotal",
  })

  const totals: GetShippingMethodTotalOutput = {
    amount: new BigNumber(shippingMethodAmount),

    subtotal: new BigNumber(subtotal),
    total: new BigNumber(
      MathBN.sum(MathBN.sub(subtotal, discountsSubtotal), taxTotal)
    ),
    original_total: new BigNumber(
      isTaxInclusive
        ? shippingMethodAmount
        : MathBN.add(subtotal, originalTaxTotal)
    ),

    discount_total: new BigNumber(discountsTotal),
    discount_subtotal: new BigNumber(discountsSubtotal),
    discount_tax_total: new BigNumber(discountsTaxTotal),

    tax_total: new BigNumber(taxTotal),
    original_tax_total: new BigNumber(originalTaxTotal),
  }

  return totals
}
