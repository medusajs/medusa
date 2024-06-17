import { AdjustmentLineDTO, TaxLineDTO } from "@medusajs/types"
import { calculateAdjustmentTotal } from "../adjustment"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"
import { calculateTaxTotal } from "../tax"

interface GetLineItemsTotalsContext {
  includeTax?: boolean
  extraQuantityFields?: Record<string, string>
}

export interface GetItemTotalInput {
  id: string
  unit_price: BigNumber
  quantity: BigNumber
  is_tax_inclusive?: boolean
  tax_lines?: Pick<TaxLineDTO, "rate">[]
  adjustments?: Pick<AdjustmentLineDTO, "amount">[]

  fulfilled_quantity?: BigNumber
  shipped_quantity?: BigNumber
  return_requested_quantity?: BigNumber
  return_received_quantity?: BigNumber
  return_dismissed_quantity?: BigNumber
  written_off_quantity?: BigNumber
}

export interface GetItemTotalOutput {
  quantity: BigNumber
  unit_price: BigNumber

  subtotal: BigNumber

  total: BigNumber
  original_total: BigNumber

  discount_total: BigNumber
  discount_tax_total: BigNumber

  tax_total: BigNumber
  original_tax_total: BigNumber

  fulfilled_total?: BigNumber
  shipped_total?: BigNumber
  return_requested_total?: BigNumber
  return_received_total?: BigNumber
  return_dismissed_total?: BigNumber
  write_off_total?: BigNumber
}

export function getLineItemsTotals(
  items: GetItemTotalInput[],
  context: GetLineItemsTotalsContext
) {
  const itemsTotals = {}

  let index = 0
  for (const item of items) {
    itemsTotals[item.id ?? index] = getLineItemTotals(item, {
      includeTax: context.includeTax || item.is_tax_inclusive,
      extraQuantityFields: context.extraQuantityFields,
    })
    index++
  }

  return itemsTotals
}

function getLineItemTotals(
  item: GetItemTotalInput,
  context: GetLineItemsTotalsContext
) {
  const subtotal = MathBN.mult(item.unit_price, item.quantity)

  const sumTaxRate = MathBN.sum(
    ...((item.tax_lines ?? []).map((taxLine) => taxLine.rate) ?? [])
  )
  const discountTotal = calculateAdjustmentTotal({
    adjustments: item.adjustments || [],
    includesTax: context.includeTax,
    taxRate: sumTaxRate,
  })
  const discountTaxTotal = MathBN.mult(
    discountTotal,
    MathBN.div(sumTaxRate, 100)
  )

  const total = MathBN.sub(subtotal, discountTotal)

  const totals: GetItemTotalOutput = {
    quantity: item.quantity,
    unit_price: item.unit_price,

    subtotal: new BigNumber(subtotal),

    total: new BigNumber(total),
    original_total: new BigNumber(subtotal),

    discount_total: new BigNumber(discountTotal),
    discount_tax_total: new BigNumber(discountTaxTotal),

    tax_total: new BigNumber(0),
    original_tax_total: new BigNumber(0),
  }

  const taxableAmountWithDiscount = MathBN.sub(subtotal, discountTotal)
  const taxableAmount = subtotal

  const taxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    includesTax: context.includeTax,
    taxableAmount: taxableAmountWithDiscount,
    setTotalField: "total",
  })
  totals.tax_total = new BigNumber(taxTotal)

  const originalTaxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    includesTax: context.includeTax,
    taxableAmount,
    setTotalField: "subtotal",
  })
  totals.original_tax_total = new BigNumber(originalTaxTotal)

  const isTaxInclusive = context.includeTax ?? item.is_tax_inclusive

  if (isTaxInclusive) {
    totals.subtotal = new BigNumber(
      MathBN.sub(
        MathBN.mult(item.unit_price, totals.quantity),
        originalTaxTotal
      )
    )
  } else {
    const newTotal = MathBN.add(total, totals.tax_total)
    const originalTotal = MathBN.add(subtotal, totals.original_tax_total)
    totals.total = new BigNumber(newTotal)
    totals.original_total = new BigNumber(originalTotal)
  }

  const totalPerUnit = MathBN.div(totals.total, item.quantity)
  const optionalFields = {
    ...(context.extraQuantityFields ?? {}),
  }

  for (const field in optionalFields) {
    if (field in item) {
      const totalField = optionalFields[field]
      totals[totalField] = new BigNumber(MathBN.mult(totalPerUnit, item[field]))
    }
  }

  return totals
}
