import { AdjustmentLineDTO, BigNumberInput, TaxLineDTO } from "@medusajs/types"
import { isDefined, pickValueFromObject } from "../../common"
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
  detail?: {
    fulfilled_quantity: BigNumber
    delivered_quantity: BigNumber
    shipped_quantity: BigNumber
    return_requested_quantity: BigNumber
    return_received_quantity: BigNumber
    return_dismissed_quantity: BigNumber
    written_off_quantity: BigNumber
  }
}

export interface GetItemTotalOutput {
  quantity: BigNumber
  unit_price: BigNumber

  subtotal: BigNumber

  total: BigNumber
  original_total: BigNumber

  discount_total: BigNumber
  discount_subtotal: BigNumber
  discount_tax_total: BigNumber

  refundable_total?: BigNumber
  refundable_total_per_unit?: BigNumber

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

function setRefundableTotal(
  item: GetItemTotalInput,
  discountsTotal: BigNumberInput,
  totals: GetItemTotalOutput,
  context: GetLineItemsTotalsContext
) {
  const itemDetail = item.detail!
  const totalReturnedQuantity = MathBN.sum(
    itemDetail.return_requested_quantity ?? 0,
    itemDetail.return_received_quantity ?? 0,
    itemDetail.return_dismissed_quantity ?? 0
  )
  const currentQuantity = MathBN.sub(item.quantity, totalReturnedQuantity)
  const discountPerUnit = MathBN.div(discountsTotal, item.quantity)

  const refundableSubTotal = MathBN.sub(
    MathBN.mult(currentQuantity, item.unit_price),
    MathBN.mult(currentQuantity, discountPerUnit)
  )

  const taxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    taxableAmount: refundableSubTotal,
  })
  const refundableTotal = MathBN.add(refundableSubTotal, taxTotal)

  totals.refundable_total_per_unit = new BigNumber(
    MathBN.eq(currentQuantity, 0)
      ? 0
      : MathBN.div(refundableTotal, currentQuantity)
  )
  totals.refundable_total = new BigNumber(refundableTotal)
}

function getLineItemTotals(
  item: GetItemTotalInput,
  context: GetLineItemsTotalsContext
) {
  const isTaxInclusive = item.is_tax_inclusive ?? context.includeTax
  const sumTax = MathBN.sum(
    ...((item.tax_lines ?? []).map((taxLine) => taxLine.rate) ?? [])
  )

  const sumTaxRate = MathBN.div(sumTax, 100)
  const totalItemPrice = MathBN.mult(item.unit_price, item.quantity)

  /*
    If the price is inclusive of tax, we need to remove the taxed amount from the subtotal
    Original Price = Total Price / (1 + Tax Rate)
  */
  const subtotal = isTaxInclusive
    ? MathBN.div(totalItemPrice, MathBN.add(1, sumTaxRate))
    : totalItemPrice

  const {
    adjustmentsTotal: discountsTotal,
    adjustmentsSubtotal: discountsSubtotal,
    adjustmentsTaxTotal: discountTaxTotal,
  } = calculateAdjustmentTotal({
    adjustments: item.adjustments || [],
    includesTax: isTaxInclusive,
    taxRate: sumTaxRate,
  })

  const taxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    taxableAmount: MathBN.sub(subtotal, discountsSubtotal),
    setTotalField: "total",
  })

  const originalTaxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    taxableAmount: subtotal,
    setTotalField: "subtotal",
  })

  const totals: GetItemTotalOutput = {
    quantity: item.quantity,
    unit_price: item.unit_price,

    subtotal: new BigNumber(subtotal),
    total: new BigNumber(
      MathBN.sum(MathBN.sub(subtotal, discountsSubtotal), taxTotal)
    ),

    original_total: new BigNumber(
      isTaxInclusive ? totalItemPrice : MathBN.add(subtotal, originalTaxTotal)
    ),

    discount_total: new BigNumber(discountsTotal),
    discount_subtotal: new BigNumber(discountsSubtotal),
    discount_tax_total: new BigNumber(discountTaxTotal),

    tax_total: new BigNumber(taxTotal),
    original_tax_total: new BigNumber(originalTaxTotal),
  }

  if (isDefined(item.detail?.return_requested_quantity)) {
    setRefundableTotal(item, discountsTotal, totals, context)
  }

  const div = MathBN.eq(item.quantity, 0) ? 1 : item.quantity
  const totalPerUnit = MathBN.div(totals.total, div)

  const optionalFields = {
    ...(context.extraQuantityFields ?? {}),
  }

  for (const field in optionalFields) {
    const totalField = optionalFields[field]

    let target = item[totalField]
    if (field.includes(".")) {
      target = pickValueFromObject(field, item)
    }

    if (!isDefined(target)) {
      continue
    }

    totals[totalField] = new BigNumber(MathBN.mult(totalPerUnit, target))
  }

  return totals
}
