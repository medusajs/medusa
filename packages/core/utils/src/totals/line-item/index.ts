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
  adjustments?: Pick<AdjustmentLineDTO, "amount" | "is_tax_inclusive">[]
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
  original_subtotal: BigNumber

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
  totals: GetItemTotalOutput
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
    isTaxInclusive: item.is_tax_inclusive,
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

export function getLineItemTotals(
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

  // Proportional discounts to current quantity and compute taxes on the current net amount
  const {
    adjustmentsTotal: discountsTotal,
    adjustmentsSubtotal: discountsSubtotalFull,
    adjustmentSubtotalPerItem,
  } = calculateAdjustmentTotal({
    item,
    adjustments: item.adjustments || [],
    taxRate: sumTaxRate,
  })

  const itemDetail = item.detail!
  const totalReturnedQuantity = MathBN.sum(
    itemDetail?.return_received_quantity ?? 0,
    itemDetail?.return_dismissed_quantity ?? 0
  )

  const currentQuantity = MathBN.sub(item.quantity, totalReturnedQuantity)
  const currentTotalItemPrice = MathBN.mult(item.unit_price, currentQuantity)
  const currentSubtotal = isTaxInclusive
    ? MathBN.div(currentTotalItemPrice, MathBN.add(1, sumTaxRate))
    : currentTotalItemPrice

  const currentDiscountsSubtotal = MathBN.mult(
    adjustmentSubtotalPerItem ?? 0,
    currentQuantity
  )

  const taxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    taxableAmount: MathBN.sub(currentSubtotal, currentDiscountsSubtotal),
    setTotalField: "total",
  })

  const originalTaxTotal = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    taxableAmount: currentSubtotal,
    setTotalField: "subtotal",
  })

  // Compute full-quantity net total after discounts and taxes to derive per-unit totals
  const fullDiscountedTaxable = MathBN.sub(subtotal, discountsSubtotalFull ?? 0)
  const taxTotalFull = calculateTaxTotal({
    taxLines: item.tax_lines || [],
    taxableAmount: fullDiscountedTaxable,
  })
  const fullNetTotal = MathBN.sum(fullDiscountedTaxable, taxTotalFull)

  const totals: GetItemTotalOutput = {
    quantity: item.quantity,
    unit_price: item.unit_price,

    subtotal: new BigNumber(currentSubtotal),

    total: new BigNumber(
      MathBN.sum(
        MathBN.sub(currentSubtotal, currentDiscountsSubtotal),
        taxTotal
      )
    ),

    original_subtotal: new BigNumber(
      MathBN.sub(
        isTaxInclusive
          ? currentTotalItemPrice
          : MathBN.add(currentSubtotal, originalTaxTotal),
        originalTaxTotal
      )
    ),

    original_total: new BigNumber(
      isTaxInclusive
        ? currentTotalItemPrice
        : MathBN.add(currentSubtotal, originalTaxTotal)
    ),

    // Discount values prorated to the current quantity
    discount_subtotal: new BigNumber(currentDiscountsSubtotal),
    discount_tax_total: new BigNumber(MathBN.sub(originalTaxTotal, taxTotal)),
    discount_total: new BigNumber(
      MathBN.add(
        currentDiscountsSubtotal,
        MathBN.sub(originalTaxTotal, taxTotal)
      )
    ),

    tax_total: new BigNumber(taxTotal),
    original_tax_total: new BigNumber(originalTaxTotal),
  }

  if (
    isDefined(item.detail?.return_requested_quantity) ||
    isDefined(item.detail?.return_received_quantity) ||
    isDefined(item.detail?.return_dismissed_quantity)
  ) {
    setRefundableTotal(item, discountsTotal, totals)
  }

  // Per-unit total should be based on full-quantity net total to support lifecycle totals consistently
  const div = MathBN.eq(item.quantity, 0) ? 1 : item.quantity
  const totalPerUnit = MathBN.div(fullNetTotal, div)

  const optionalFields = {
    ...(context.extraQuantityFields ?? {}),
  }

  for (const field in optionalFields) {
    const totalField = optionalFields[field]

    let target = field.includes(".")
      ? pickValueFromObject(field, item)
      : item[field]

    if (!isDefined(target)) {
      continue
    }

    totals[totalField] = new BigNumber(MathBN.mult(totalPerUnit, target))
  }

  return totals
}
