import { LineItem } from "../models/line-item"
import { TaxCalculationContext } from "./tax-service"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { TransactionBaseService } from "./transaction-base-service"
import { MedusaContainer } from "@medusajs/types"

/**
 * ## Overview
 *
 * A tax calculation strategy is used to calculate taxes when calculating a cart's totals. The Medusa
 * backend provides a tax calculation strategy that handles calculating the taxes, taking into account the
 * defined tax rates and settings such as whether tax-inclusive pricing is enabled.
 *
 * You can override the tax calculation strategy to implement different calculation logic or to
 * integrate a third-party service that handles the tax calculation. You can override it either
 * in a Medusa backend setup or in a plugin.
 *
 * A tax calculation strategy should be defined in a TypeScript or JavaScript file created under the `src/strategies` directory.
 * The class must also implement the `ITaxCalculationStrategy` interface imported from the `@medusajs/medusa` package.
 *
 * For example, you can create the file `src/strategies/tax-calculation.ts` with the following content:
 *
 * ```ts title="src/strategies/tax-calculation.ts"
 * import {
 *   ITaxCalculationStrategy,
 *   LineItem,
 *   LineItemTaxLine,
 *   ShippingMethodTaxLine,
 *   TaxCalculationContext,
 * } from "@medusajs/medusa"
 *
 * class TaxCalculationStrategy
 *   implements ITaxCalculationStrategy {
 *
 *   async calculate(
 *     items: LineItem[],
 *     taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
 *     calculationContext: TaxCalculationContext
 *   ): Promise<number> {
 *     throw new Error("Method not implemented.")
 *   }
 *
 * }
 *
 * export default TaxCalculationStrategy
 * ```
 *
 * ---
 */
export interface ITaxCalculationStrategy {
  /**
   * This method calculates the tax amount for a given set of line items under applicable
   * tax conditions and calculation contexts.
   *
   * This method is used whenever taxes are calculated. If automatic tax calculation is disabled in a region,
   * then it's only triggered when taxes are calculated manually as explained in
   * [this guide](https://docs.medusajs.com/modules/taxes/storefront/manual-calculation).
   *
   * @param {LineItem[]} items - The line items to calculate the tax total for.
   * @param {(ShippingMethodTaxLine | LineItemTaxLine)[]} taxLines - The tax lines used for the calculation
   * @param {TaxCalculationContext} calculationContext - Other details relevant for the calculation
   * @returns {Promise<number>} The calculated tax total
   *
   * @example
   * An example of the general implementation of this method in the Medusa backend's tax calculation strategy:
   *
   * ```ts
   * async calculate(
   *   items: LineItem[],
   *   taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
   *   calculationContext: TaxCalculationContext
   * ): Promise<number> {
   *   const lineItemsTaxLines = taxLines.filter(
   *     (tl) => "item_id" in tl
   *   ) as LineItemTaxLine[]
   *   const shippingMethodsTaxLines = taxLines.filter(
   *     (tl) => "shipping_method_id" in tl
   *   ) as ShippingMethodTaxLine[]
   *
   *   const lineItemsTax = this.calculateLineItemsTax(
   *     items,
   *     lineItemsTaxLines,
   *     calculationContext
   *   )
   *
   *   const shippingMethodsTax = this.calculateShippingMethodsTax(
   *     calculationContext.shipping_methods,
   *     shippingMethodsTaxLines
   *   )
   *
   *   return Math.round(lineItemsTax + shippingMethodsTax)
   * }
   * ```
   */
  calculate(
    items: LineItem[],
    taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
    calculationContext: TaxCalculationContext
  ): Promise<number>
}

/**
 * @parentIgnore activeManager_,atomicPhase_,shouldRetryTransaction_,withTransaction
 */
export abstract class AbstractTaxCalculationStrategy
  extends TransactionBaseService
  implements ITaxCalculationStrategy
{
  /**
   * @ignore
   */
  static _isTaxCalculationStrategy = true

  /**
   * @ignore
   */
  static isTaxCalculationStrategy(object): boolean {
    return (
      typeof object.calculate === "function" ||
      object?.constructor?._isTaxCalculationStrategy
    )
  }

  /**
   * You can use the `constructor` of your tax calculation strategy to access the different services in Medusa through dependency injection.
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.
   * Additionally, if you’re creating your tax calculation strategy as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor.
   *
   * @param {Record<string, unknown>} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
   * @param {Record<string, unknown>} config - If this tax calculation strategy is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * import {
   *   ITaxCalculationStrategy,
   *   LineItemService,
   * } from "@medusajs/medusa"
   *
   * type InjectedDependencies = {
   *   lineItemService: LineItemService
   * }
   *
   * class TaxCalculationStrategy
   *   implements ITaxCalculationStrategy {
   *
   *   protected readonly lineItemService_: LineItemService
   *
   *   constructor({ lineItemService }: InjectedDependencies) {
   *     this.lineItemService_ = lineItemService
   *   }
   *
   *   // ...
   * }
   *
   * export default TaxCalculationStrategy
   */
  protected constructor(
    protected readonly container: Record<string, unknown>,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    super(container, config)
  }

  abstract calculate(
    items: LineItem[],
    taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
    calculationContext: TaxCalculationContext
  ): Promise<number>
}
