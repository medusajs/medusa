import {
  ITaxCalculationStrategy,
  TaxCalculationContext,
  TransactionBaseService,
} from "../interfaces"
import { EntityManager } from "typeorm"
import {
  Discount,
  DiscountRuleType,
  GiftCard,
  GiftCardTransaction,
  LineItem,
  LineItemTaxLine,
  Region,
  ShippingMethod,
  ShippingMethodTaxLine,
} from "../models"
import { TaxProviderService, TotalsService } from "./index"
import { LineAllocationsMap } from "../types/totals"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { FlagRouter } from "../utils/flag-router"
import { calculatePriceTaxAmount } from "../utils"

type LineItemTotals = {
  unit_price: number
  quantity: number
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  tax_lines: LineItemTaxLine[]
  discount_total: number
}

type ShippingMethodTotals = {
  price: number
  tax_total: number
  total: number
  subtotal: number
  original_total: number
  original_tax_total: number
  tax_lines: ShippingMethodTaxLine[]
}

type InjectedDependencies = {
  totalsService: TotalsService
  taxProviderService: TaxProviderService
  taxCalculationStrategy: ITaxCalculationStrategy
  featureFlagRouter: FlagRouter
}

export default class totalsNewService extends TransactionBaseService {
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined

  protected readonly totalsService_: TotalsService
  protected readonly taxProviderService_: TaxProviderService
  protected readonly featureFlagRouter_: FlagRouter
  protected readonly taxCalculationStrategy_: ITaxCalculationStrategy

  constructor({
    totalsService,
    taxProviderService,
    featureFlagRouter,
    taxCalculationStrategy,
  }: InjectedDependencies) {
    super(arguments[0])

    this.totalsService_ = totalsService
    this.taxProviderService_ = taxProviderService
    this.featureFlagRouter_ = featureFlagRouter
    this.taxCalculationStrategy_ = taxCalculationStrategy
  }

  /**
   * Calcul and return the totals for each item
   * @param items
   * @param calculationContext
   * @param includeTax
   * @param taxRate
   * @param isOrder
   * @param useExistingTaxLines Force to use the tax lines of the shipping method instead of fetching them
   */
  async getLineItemsTotals(
    items: LineItem[],
    {
      includeTax,
      calculationContext,
      isOrder,
      taxRate,
      useExistingTaxLines,
    }: {
      calculationContext: TaxCalculationContext
      isOrder?: boolean
      includeTax?: boolean
      taxRate?: number
      useExistingTaxLines?: boolean
    }
  ): Promise<Map<string, LineItemTotals>> {
    let lineItemsTaxLinesMap = new Map()
    if (includeTax) {
      if (useExistingTaxLines) {
        items.forEach((item) => {
          lineItemsTaxLinesMap.set(item.id, item.tax_lines ?? [])
        })
      } else if (items.length) {
        const { lineItemsTaxLines } = await this.getTaxLinesMap(
          items,
          calculationContext
        )
        lineItemsTaxLinesMap = lineItemsTaxLines
      }
    }

    const useOrderLineCalculation = isOrder && taxRate
    const calculationMethod = useOrderLineCalculation
      ? this.getOrderLineItemTotals.bind(this)
      : this.getLineItemTotals.bind(this)

    const itemsTotals = new Map<string, LineItemTotals>()
    for (const item of items) {
      const lineItemAllocation =
        calculationContext.allocation_map[item.id] || {}

      const itemTotals = await calculationMethod(item, {
        includeTax,
        taxRate,
        lineItemAllocation,
        taxLines: lineItemsTaxLinesMap.get(item.id),
        calculationContext,
      })
      itemsTotals.set(item.id, itemTotals)
    }

    return itemsTotals
  }

  /**
   * Calcul and return the totals for an item
   * @param item
   * @param lineItemAllocation
   * @param taxLines
   * @param include_tax
   * @param calculationContext
   */
  async getLineItemTotals(
    item: LineItem,
    {
      lineItemAllocation,
      taxLines,
      includeTax,
      calculationContext,
    }: {
      lineItemAllocation: LineAllocationsMap[number]
      taxLines?: (LineItemTaxLine | ShippingMethodTaxLine)[]
      includeTax?: boolean
      calculationContext: TaxCalculationContext
    }
  ): Promise<LineItemTotals> {
    let subtotal = item.unit_price * item.quantity
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) &&
      item.includes_tax &&
      includeTax
    ) {
      subtotal = 0 // in that case we need to know the tax rate to compute it later
    }

    const discount_total =
      (lineItemAllocation.discount?.unit_amount || 0) * item.quantity

    const totals: LineItemTotals = {
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal,
      discount_total,
      total: subtotal - discount_total,
      original_total: subtotal,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: (taxLines ?? item.tax_lines ?? []) as LineItemTaxLine[],
    }

    if (!totals.tax_lines && includeTax) {
      const { lineItemsTaxLines } = await this.getTaxLinesMap(
        [item],
        calculationContext
      )
      totals.tax_lines = lineItemsTaxLines.get(item.id) ?? []
    }

    if (totals.tax_lines.length > 0) {
      totals.tax_total = await this.taxCalculationStrategy_.calculate(
        [item],
        totals.tax_lines,
        calculationContext
      )
      const noDiscountContext = {
        ...calculationContext,
        allocation_map: {}, // Don't account for discounts
      }

      totals.original_tax_total = await this.taxCalculationStrategy_.calculate(
        [item],
        totals.tax_lines,
        noDiscountContext
      )

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) &&
        item.includes_tax
      ) {
        totals.subtotal +=
          totals.unit_price * totals.quantity - totals.original_tax_total
        totals.total += totals.subtotal
        totals.original_total += totals.subtotal
      }

      totals.total += totals.tax_total
      totals.original_total += totals.original_tax_total
    }

    return totals
  }

  /**
   * Calcul and return the totals for an order item
   * @param item
   * @param taxRate
   * @param lineItemAllocation
   * @param taxLines
   * @param includeTax
   * @param calculationContext
   */
  async getOrderLineItemTotals(
    item: LineItem,
    {
      taxRate,
      lineItemAllocation,
      taxLines,
      includeTax,
      calculationContext,
    }: {
      lineItemAllocation: LineAllocationsMap[number]
      calculationContext: TaxCalculationContext
      includeTax?: boolean
      taxRate?: number
      taxLines?: (LineItemTaxLine | ShippingMethodTaxLine)[]
    }
  ): Promise<LineItemTotals> {
    if (!taxRate) {
      return await this.getLineItemTotals(item, {
        lineItemAllocation,
        taxLines,
        includeTax,
        calculationContext,
      })
    }

    let subtotal = item.unit_price * item.quantity
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) &&
      item.includes_tax &&
      includeTax
    ) {
      subtotal = 0 // in that case we need to know the tax rate to compute it later
    }

    const discount_total =
      (lineItemAllocation.discount?.unit_amount || 0) * item.quantity

    const totals: LineItemTotals = {
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal,
      discount_total,
      total: subtotal - discount_total,
      original_total: subtotal,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: (taxLines ?? item.tax_lines ?? []) as LineItemTaxLine[],
    }

    if (includeTax) {
      taxRate = taxRate / 100

      const includesTax =
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) && item.includes_tax
      const taxIncludedInPrice = !item.includes_tax
        ? 0
        : Math.round(
            calculatePriceTaxAmount({
              price: item.unit_price,
              taxRate: taxRate,
              includesTax,
            })
          )
      totals.subtotal = (item.unit_price - taxIncludedInPrice) * item.quantity
      totals.total = totals.subtotal

      totals.original_tax_total = totals.subtotal * taxRate
      totals.tax_total = (totals.subtotal - discount_total) * taxRate

      totals.total += totals.tax_total
      totals.original_total += totals.original_tax_total
    }

    return totals
  }

  /**
   * Calcul and return the gift cards totals
   * @param giftCardableAmount
   * @param giftCardTransactions
   * @param region
   * @param giftCards
   * @param subtotal
   */
  async getGiftCardTotals(
    giftCardableAmount: number,
    {
      giftCardTransactions,
      region,
      giftCards,
    }: {
      region: Region
      items?: LineItem[]
      giftCardTransactions?: GiftCardTransaction[]
      giftCards?: GiftCard[]
    }
  ): Promise<{
    total: number
    tax_total: number
  }> {
    if (giftCardTransactions) {
      return this.getGiftCardTransactionsTotals({
        giftCardTransactions,
        region,
      })
    }

    const result = {
      total: 0,
      tax_total: 0,
    }

    if (!giftCards?.length) {
      return result
    }

    const giftAmount = giftCards.reduce((acc, next) => acc + next.balance, 0)
    result.total = Math.min(giftCardableAmount, giftAmount)

    if (region?.gift_cards_taxable) {
      result.tax_total = Math.round((result.total * region.tax_rate) / 100)
      return result
    }

    return result
  }

  /**
   * Calcul and return the gift cards totals based on their transactions
   * @param gift_card_transactions
   * @param region
   */
  getGiftCardTransactionsTotals({
    giftCardTransactions,
    region,
  }: {
    giftCardTransactions: GiftCardTransaction[]
    region: { gift_cards_taxable: boolean; tax_rate: number }
  }): { total: number; tax_total: number } {
    return giftCardTransactions.reduce(
      (acc, next) => {
        let taxMultiplier = (next.tax_rate || 0) / 100

        // Previously we did not record whether a gift card was taxable or not.
        // All gift cards where is_taxable === null are from the old system,
        // where we defaulted to taxable gift cards.
        //
        // This is a backwards compatability fix for orders that were created
        // before we added the gift card tax rate.
        if (next.is_taxable === null && region?.gift_cards_taxable) {
          taxMultiplier = region.tax_rate / 100
        }

        return {
          total: acc.total + next.amount,
          tax_total: acc.tax_total + next.amount * taxMultiplier,
        }
      },
      {
        total: 0,
        tax_total: 0,
      }
    )
  }

  /**
   *
   * @param shippingMethods
   * @param isOrder
   * @param discounts
   * @param taxRate
   * @param includeTax
   * @param calculationContext
   * @param useExistingTaxLines Force to use the tax lines of the shipping method instead of fetching them
   */
  async getShippingMethodsTotals(
    shippingMethods: ShippingMethod[],
    {
      isOrder,
      discounts,
      taxRate,
      includeTax,
      calculationContext,
      useExistingTaxLines,
    }: {
      calculationContext: TaxCalculationContext
      discounts?: Discount[]
      includeTax?: boolean
      isOrder?: boolean
      taxRate?: number
      useExistingTaxLines?: boolean
    }
  ): Promise<Map<string, ShippingMethodTotals>> {
    let shippingMethodsTaxLinesMap = new Map()
    if (includeTax) {
      if (useExistingTaxLines) {
        shippingMethods.forEach((sm) => {
          shippingMethodsTaxLinesMap.set(sm.id, sm.tax_lines ?? [])
        })
      } else if (shippingMethods.length) {
        const { shippingMethodsTaxLines } = await this.getTaxLinesMap(
          [],
          calculationContext
        )
        shippingMethodsTaxLinesMap = shippingMethodsTaxLines
      }
    }

    const useOrderShippingMethodCalculation = isOrder && taxRate
    const calculationMethod = useOrderShippingMethodCalculation
      ? this.getOrderShippingMethodTotals.bind(this)
      : this.getShippingMethodTotals.bind(this)

    const shippingMethodsTotals = new Map<string, ShippingMethodTotals>()
    for (const shippingMethod of shippingMethods) {
      const shippingMethodTotals = await calculationMethod(shippingMethod, {
        includeTax,
        calculationContext,
        taxLines: shippingMethodsTaxLinesMap.get(shippingMethod.id),
        discounts,
      })
      shippingMethodsTotals.set(shippingMethod.id, shippingMethodTotals)
    }

    return shippingMethodsTotals
  }

  async getShippingMethodTotals(
    shippingMethod: ShippingMethod,
    {
      includeTax,
      calculationContext,
      taxLines,
      discounts,
    }: {
      calculationContext: TaxCalculationContext
      includeTax?: boolean
      taxLines?: (ShippingMethodTaxLine | LineItemTaxLine)[]
      discounts?: Discount[]
    }
  ) {
    const totals: ShippingMethodTotals = {
      price: shippingMethod.price,
      original_total: shippingMethod.price,
      total: shippingMethod.price,
      subtotal: shippingMethod.price,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: (taxLines ??
        shippingMethod.tax_lines ??
        []) as ShippingMethodTaxLine[],
    }

    const calculationContext_: TaxCalculationContext = {
      ...calculationContext,
      shipping_methods: [shippingMethod],
    }

    if (!totals.tax_lines && includeTax) {
      const { shippingMethodsTaxLines } = await this.getTaxLinesMap(
        [],
        calculationContext
      )
      totals.tax_lines = shippingMethodsTaxLines.get(shippingMethod.id) ?? []
    }

    if (totals.tax_lines.length > 0) {
      const includesTax =
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) && shippingMethod.includes_tax

      totals.original_tax_total = await this.taxCalculationStrategy_.calculate(
        [],
        totals.tax_lines,
        calculationContext_
      )
      totals.tax_total = totals.original_tax_total

      if (includesTax) {
        totals.subtotal -= totals.tax_total
      } else {
        totals.original_total += totals.original_tax_total
        totals.total += totals.tax_total
      }
    }

    const hasFreeShipping = discounts?.some(
      (d) => d.rule.type === DiscountRuleType.FREE_SHIPPING
    )

    if (hasFreeShipping) {
      totals.total = 0
      totals.subtotal = 0
      totals.tax_total = 0
    }

    return totals
  }

  async getOrderShippingMethodTotals(
    shippingMethod: ShippingMethod,
    {
      includeTax,
      calculationContext,
      taxLines,
      discounts,
      taxRate,
    }: {
      calculationContext: TaxCalculationContext
      includeTax?: boolean
      taxLines?: (ShippingMethodTaxLine | LineItemTaxLine)[]
      discounts?: Discount[]
      taxRate?: number
    }
  ): Promise<ShippingMethodTotals> {
    if (!taxRate) {
      return await this.getShippingMethodTotals(shippingMethod, {
        includeTax,
        calculationContext,
        taxLines,
        discounts,
      })
    }

    const totals: ShippingMethodTotals = {
      price: shippingMethod.price,
      original_total: shippingMethod.price,
      total: shippingMethod.price,
      subtotal: shippingMethod.price,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: (taxLines ??
        shippingMethod.tax_lines ??
        []) as ShippingMethodTaxLine[],
    }

    totals.original_tax_total = Math.round(totals.price * (taxRate / 100))
    totals.tax_total = Math.round(totals.price * (taxRate / 100))

    return totals
  }

  /**
   * Return a map of tax lines for line items and shipping methods
   * @param items
   * @param calculationContext
   * @protected
   */
  protected async getTaxLinesMap(
    items: LineItem[],
    calculationContext: TaxCalculationContext
  ): Promise<{
    lineItemsTaxLines: Map<string, LineItemTaxLine[]>
    shippingMethodsTaxLines: Map<string, ShippingMethodTaxLine[]>
  }> {
    const lineItemsTaxLinesMap = new Map<string, LineItemTaxLine[]>()
    const shippingMethodsTaxLinesMap = new Map<
      string,
      ShippingMethodTaxLine[]
    >()

    const taxLines = await this.taxProviderService_
      .withTransaction(this.manager_)
      .getTaxLines(items, calculationContext)

    taxLines.forEach((taxLine) => {
      if ("item_id" in taxLine) {
        const itemTaxLines = lineItemsTaxLinesMap.get(taxLine.item_id) ?? []
        itemTaxLines.push(taxLine)
        lineItemsTaxLinesMap.set(taxLine.item_id, itemTaxLines)
      }
      if ("shipping_method_id" in taxLine) {
        const shippingMethodTaxLines =
          shippingMethodsTaxLinesMap.get(taxLine.shipping_method_id) ?? []
        shippingMethodTaxLines.push(taxLine)
        shippingMethodsTaxLinesMap.set(
          taxLine.shipping_method_id,
          shippingMethodTaxLines
        )
      }
    })

    return {
      lineItemsTaxLines: lineItemsTaxLinesMap,
      shippingMethodsTaxLines: shippingMethodsTaxLinesMap,
    }
  }
}
