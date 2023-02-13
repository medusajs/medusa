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
  LineItem,
  LineItemTaxLine,
  Region,
  ShippingMethod,
  ShippingMethodTaxLine,
} from "../models"
import { TaxProviderService } from "./index"
import { LineAllocationsMap } from "../types/totals"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { FlagRouter } from "../utils/flag-router"
import { calculatePriceTaxAmount } from "../utils"
import { isDefined, MedusaError } from "medusa-core-utils"

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

type GiftCardTransaction = {
  tax_rate: number | null
  is_taxable: boolean | null
  amount: number
  gift_card: GiftCard
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
  manager: EntityManager
  taxProviderService: TaxProviderService
  taxCalculationStrategy: ITaxCalculationStrategy
  featureFlagRouter: FlagRouter
}

export default class NewTotalsService extends TransactionBaseService {
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined

  protected readonly taxProviderService_: TaxProviderService
  protected readonly featureFlagRouter_: FlagRouter
  protected readonly taxCalculationStrategy_: ITaxCalculationStrategy

  constructor({
    manager,
    taxProviderService,
    featureFlagRouter,
    taxCalculationStrategy,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.taxProviderService_ = taxProviderService
    this.featureFlagRouter_ = featureFlagRouter
    this.taxCalculationStrategy_ = taxCalculationStrategy
  }

  /**
   * Calculate and return the items totals for either the legacy calculation or the new calculation
   * @param items
   * @param includeTax
   * @param calculationContext
   * @param taxRate
   */
  async getLineItemTotals(
    items: LineItem | LineItem[],
    {
      includeTax,
      calculationContext,
      taxRate,
    }: {
      includeTax?: boolean
      calculationContext: TaxCalculationContext
      taxRate?: number | null
    }
  ): Promise<{ [lineItemId: string]: LineItemTotals }> {
    items = Array.isArray(items) ? items : [items]

    const manager = this.transactionManager_ ?? this.manager_
    let lineItemsTaxLinesMap: { [lineItemId: string]: LineItemTaxLine[] } = {}

    if (!taxRate && includeTax) {
      // Use existing tax lines if they are present
      const itemContainsTaxLines = items.some((item) => item.tax_lines?.length)
      if (itemContainsTaxLines) {
        items.forEach((item) => {
          lineItemsTaxLinesMap[item.id] = item.tax_lines ?? []
        })
      } else {
        const { lineItemsTaxLines } = await this.taxProviderService_
          .withTransaction(manager)
          .getTaxLinesMap(items, calculationContext)
        lineItemsTaxLinesMap = lineItemsTaxLines
      }
    }

    const calculationMethod = taxRate
      ? this.getLineItemTotalsLegacy.bind(this)
      : this.getLineItemTotals_.bind(this)

    const itemsTotals: { [lineItemId: string]: LineItemTotals } = {}
    for (const item of items) {
      const lineItemAllocation =
        calculationContext.allocation_map[item.id] || {}

      itemsTotals[item.id] = await calculationMethod(item, {
        taxRate,
        includeTax,
        lineItemAllocation,
        taxLines: lineItemsTaxLinesMap[item.id],
        calculationContext,
      })
    }

    return itemsTotals
  }

  /**
   * Calculate and return the totals for an item
   * @param item
   * @param includeTax
   * @param lineItemAllocation
   * @param taxLines Only needed to force the usage of the specified tax lines, often in the case where the item does not hold the tax lines
   * @param calculationContext
   */
  protected async getLineItemTotals_(
    item: LineItem,
    {
      includeTax,
      lineItemAllocation,
      taxLines,
      calculationContext,
    }: {
      includeTax?: boolean
      lineItemAllocation: LineAllocationsMap[number]
      taxLines?: LineItemTaxLine[]
      calculationContext: TaxCalculationContext
    }
  ): Promise<LineItemTotals> {
    let subtotal = item.unit_price * item.quantity
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) &&
      item.includes_tax
    ) {
      subtotal = 0 // in that case we need to know the tax rate to compute it later
    }

    const discount_total = lineItemAllocation.discount?.amount ?? 0

    const totals: LineItemTotals = {
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal,
      discount_total,
      total: subtotal - discount_total,
      original_total: subtotal,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: item.tax_lines ?? [],
    }

    if (includeTax) {
      totals.tax_lines = totals.tax_lines.length
        ? totals.tax_lines
        : (taxLines as LineItemTaxLine[])

      if (!totals.tax_lines && item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Tax Lines must be joined to calculate taxes"
        )
      }
    }

    if (item.is_return) {
      if (!isDefined(item.tax_lines) && item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Return Line Items must join tax lines"
        )
      }
    }

    if (totals.tax_lines?.length > 0) {
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
   * Calculate and return the legacy calculated totals using the tax rate
   * @param item
   * @param taxRate
   * @param lineItemAllocation
   * @param calculationContext
   */
  protected async getLineItemTotalsLegacy(
    item: LineItem,
    {
      taxRate,
      lineItemAllocation,
      calculationContext,
    }: {
      lineItemAllocation: LineAllocationsMap[number]
      calculationContext: TaxCalculationContext
      taxRate: number
    }
  ): Promise<LineItemTotals> {
    let subtotal = item.unit_price * item.quantity
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) &&
      item.includes_tax
    ) {
      subtotal = 0 // in that case we need to know the tax rate to compute it later
    }

    const discount_total = lineItemAllocation.discount?.amount ?? 0

    const totals: LineItemTotals = {
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal,
      discount_total,
      total: subtotal - discount_total,
      original_total: subtotal,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: [],
    }

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
    totals.subtotal = Math.round(
      (item.unit_price - taxIncludedInPrice) * item.quantity
    )
    totals.total = totals.subtotal

    totals.original_tax_total = Math.round(totals.subtotal * taxRate)
    totals.tax_total = Math.round((totals.subtotal - discount_total) * taxRate)

    totals.total += totals.tax_total

    if (includesTax) {
      totals.original_total += totals.subtotal
    }

    totals.original_total += totals.original_tax_total

    return totals
  }

  /**
   * Return the amount that can be refund on a line item
   * @param lineItem
   * @param calculationContext
   * @param taxRate
   */
  getLineItemRefund(
    lineItem: {
      id: string
      unit_price: number
      includes_tax: boolean
      quantity: number
      tax_lines: LineItemTaxLine[]
    },
    {
      calculationContext,
      taxRate,
    }: { calculationContext: TaxCalculationContext; taxRate?: number | null }
  ): number {
    /*
     * Used for backcompat with old tax system
     */
    if (taxRate != null) {
      return this.getLineItemRefundLegacy(lineItem, {
        calculationContext,
        taxRate,
      })
    }

    const includesTax =
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) && lineItem.includes_tax

    const discountAmount =
      (calculationContext.allocation_map[lineItem.id]?.discount?.unit_amount ||
        0) * lineItem.quantity

    if (!isDefined(lineItem.tax_lines)) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cannot compute line item refund amount, tax lines are missing from the line item"
      )
    }

    const totalTaxRate = lineItem.tax_lines.reduce((acc, next) => {
      return acc + next.rate / 100
    }, 0)

    const taxAmountIncludedInPrice = !includesTax
      ? 0
      : Math.round(
          calculatePriceTaxAmount({
            price: lineItem.unit_price,
            taxRate: totalTaxRate,
            includesTax,
          })
        )

    const lineSubtotal =
      (lineItem.unit_price - taxAmountIncludedInPrice) * lineItem.quantity -
      discountAmount

    const taxTotal = lineItem.tax_lines.reduce((acc, next) => {
      return acc + Math.round(lineSubtotal * (next.rate / 100))
    }, 0)

    return lineSubtotal + taxTotal
  }

  /**
   * @param lineItem
   * @param calculationContext
   * @param taxRate
   * @protected
   */
  protected getLineItemRefundLegacy(
    lineItem: {
      id: string
      unit_price: number
      includes_tax: boolean
      quantity: number
    },
    {
      calculationContext,
      taxRate,
    }: { calculationContext: TaxCalculationContext; taxRate: number }
  ): number {
    const includesTax =
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) && lineItem.includes_tax

    const taxAmountIncludedInPrice = !includesTax
      ? 0
      : Math.round(
          calculatePriceTaxAmount({
            price: lineItem.unit_price,
            taxRate: taxRate / 100,
            includesTax,
          })
        )

    const discountAmount =
      calculationContext.allocation_map[lineItem.id]?.discount?.amount ?? 0

    const lineSubtotal =
      (lineItem.unit_price - taxAmountIncludedInPrice) * lineItem.quantity -
      discountAmount

    return Math.round(lineSubtotal * (1 + taxRate / 100))
  }

  /**
   * Calculate and return the gift cards totals
   * @param giftCardableAmount
   * @param giftCardTransactions
   * @param region
   * @param giftCards
   */
  async getGiftCardTotals(
    giftCardableAmount: number,
    {
      giftCardTransactions,
      region,
      giftCards,
    }: {
      region: Region
      giftCardTransactions?: GiftCardTransaction[]
      giftCards?: GiftCard[]
    }
  ): Promise<{
    total: number
    tax_total: number
  }> {
    if (!giftCards && !giftCardTransactions) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cannot calculate the gift cart totals. Neither the gift cards or gift card transactions have been provided"
      )
    }

    if (giftCardTransactions?.length) {
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

    // If a gift card is not taxable, the tax_rate for the giftcard will be null
    const { totalGiftCardBalance, totalTaxFromGiftCards } = giftCards.reduce(
      (acc, giftCard) => {
        let taxableAmount = 0

        acc.totalGiftCardBalance += giftCard.balance

        taxableAmount = Math.min(acc.giftCardableBalance, giftCard.balance)
        // skip tax, if the taxable amount is not a positive number or tax rate is not set
        if (taxableAmount <= 0 || !giftCard.tax_rate) {
          return acc
        }

        const taxAmountFromGiftCard = Math.round(
          taxableAmount * (giftCard.tax_rate / 100)
        )

        acc.totalTaxFromGiftCards += taxAmountFromGiftCard
        // Update the balance, pass it over to the next gift card (if any) for calculating tax on balance.
        acc.giftCardableBalance -= taxableAmount

        return acc
      },
      {
        totalGiftCardBalance: 0,
        totalTaxFromGiftCards: 0,
        giftCardableBalance: giftCardableAmount,
      }
    )

    result.tax_total = Math.round(totalTaxFromGiftCards)
    result.total = Math.min(giftCardableAmount, totalGiftCardBalance)

    return result
  }

  /**
   * Calculate and return the gift cards totals based on their transactions
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
        // We prioritize the giftCard.tax_rate as we create a snapshot of the tax
        // on order creation to create gift cards on the gift card itself.
        // If its created outside of the order, we refer to the region tax
        if (next.is_taxable === null) {
          if (region?.gift_cards_taxable || next.gift_card?.tax_rate) {
            taxMultiplier = (next.gift_card?.tax_rate ?? region.tax_rate) / 100
          }
        }

        return {
          total: acc.total + next.amount,
          tax_total: Math.round(acc.tax_total + next.amount * taxMultiplier),
        }
      },
      {
        total: 0,
        tax_total: 0,
      }
    )
  }

  /**
   * Calculate and return the shipping methods totals for either the legacy calculation or the new calculation
   * @param shippingMethods
   * @param includeTax
   * @param discounts
   * @param taxRate
   * @param calculationContext
   */
  async getShippingMethodTotals(
    shippingMethods: ShippingMethod | ShippingMethod[],
    {
      includeTax,
      discounts,
      taxRate,
      calculationContext,
    }: {
      includeTax?: boolean
      calculationContext: TaxCalculationContext
      discounts?: Discount[]
      taxRate?: number | null
    }
  ): Promise<{ [shippingMethodId: string]: ShippingMethodTotals }> {
    shippingMethods = Array.isArray(shippingMethods)
      ? shippingMethods
      : [shippingMethods]

    const manager = this.transactionManager_ ?? this.manager_
    let shippingMethodsTaxLinesMap: {
      [shippingMethodId: string]: ShippingMethodTaxLine[]
    } = {}

    if (!taxRate && includeTax) {
      // Use existing tax lines if they are present
      const shippingMethodContainsTaxLines = shippingMethods.some(
        (method) => method.tax_lines?.length
      )
      if (shippingMethodContainsTaxLines) {
        shippingMethods.forEach((sm) => {
          shippingMethodsTaxLinesMap[sm.id] = sm.tax_lines ?? []
        })
      } else {
        const calculationContextWithGivenMethod = {
          ...calculationContext,
          shipping_methods: shippingMethods,
        }
        const { shippingMethodsTaxLines } = await this.taxProviderService_
          .withTransaction(manager)
          .getTaxLinesMap([], calculationContextWithGivenMethod)
        shippingMethodsTaxLinesMap = shippingMethodsTaxLines
      }
    }

    const calculationMethod = taxRate
      ? this.getShippingMethodTotalsLegacy.bind(this)
      : this.getShippingMethodTotals_.bind(this)

    const shippingMethodsTotals: {
      [lineItemId: string]: ShippingMethodTotals
    } = {}
    for (const shippingMethod of shippingMethods) {
      shippingMethodsTotals[shippingMethod.id] = await calculationMethod(
        shippingMethod,
        {
          includeTax,
          calculationContext,
          taxLines: shippingMethodsTaxLinesMap[shippingMethod.id],
          discounts,
          taxRate,
        }
      )
    }

    return shippingMethodsTotals
  }

  /**
   * Calculate and return the shipping method totals
   * @param shippingMethod
   * @param includeTax
   * @param calculationContext
   * @param taxLines
   * @param discounts
   */
  protected async getShippingMethodTotals_(
    shippingMethod: ShippingMethod,
    {
      includeTax,
      calculationContext,
      taxLines,
      discounts,
    }: {
      includeTax?: boolean
      calculationContext: TaxCalculationContext
      taxLines?: ShippingMethodTaxLine[]
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
      tax_lines: shippingMethod.tax_lines ?? [],
    }

    if (includeTax) {
      totals.tax_lines = totals.tax_lines.length
        ? totals.tax_lines
        : (taxLines as ShippingMethodTaxLine[])

      if (!totals.tax_lines) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Tax Lines must be joined to calculate taxes"
        )
      }
    }

    const calculationContext_: TaxCalculationContext = {
      ...calculationContext,
      shipping_methods: [shippingMethod],
    }

    if (totals.tax_lines.length) {
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

  /**
   * Calculate and return the shipping method totals legacy using teh tax rate
   * @param shippingMethod
   * @param calculationContext
   * @param taxRate
   * @param discounts
   */
  protected async getShippingMethodTotalsLegacy(
    shippingMethod: ShippingMethod,
    {
      calculationContext,
      discounts,
      taxRate,
    }: {
      calculationContext: TaxCalculationContext
      discounts?: Discount[]
      taxRate: number
    }
  ): Promise<ShippingMethodTotals> {
    const totals: ShippingMethodTotals = {
      price: shippingMethod.price,
      original_total: shippingMethod.price,
      total: shippingMethod.price,
      subtotal: shippingMethod.price,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: [],
    }

    totals.original_tax_total = Math.round(totals.price * (taxRate / 100))
    totals.tax_total = Math.round(totals.price * (taxRate / 100))

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
}
