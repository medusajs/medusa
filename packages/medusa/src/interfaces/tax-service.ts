import { LineItem } from "../models/line-item"
import { Region } from "../models/region"
import { Address } from "../models/address"
import { ShippingMethod } from "../models/shipping-method"
import { Customer } from "../models/customer"
import { ProviderTaxLine, TaxServiceRate } from "../types/tax-service"
import { LineAllocationsMap } from "../types/totals"
import { TransactionBaseService } from "./transaction-base-service"
import { MedusaContainer } from "@medusajs/types"

/**
 * A shipping method and the tax rates configured to apply to the
 * shipping method.
 */
export type ShippingTaxCalculationLine = {
  /**
   * The shipping method to calculate taxes for.
   */
  shipping_method: ShippingMethod
  /**
   * The rates applicable on the shipping method.
   */
  rates: TaxServiceRate[]
}

/**
 * A line item and the tax rates configured to apply to the
 * product contained in the line item.
 */
export type ItemTaxCalculationLine = {
  /**
   * The line item to calculate taxes for.
   */
  item: LineItem
  /**
   * The rates applicable on the item.
   */
  rates: TaxServiceRate[]
}

/**
 * Information relevant to a tax calculation, such as the shipping address where
 * the items are going.
 */
export type TaxCalculationContext = {
  /**
   * The shipping address used in the cart.
   */
  shipping_address: Address | null
  /**
   * The customer that the cart belongs to.
   */
  customer: Customer
  /**
   * The cart's region.
   */
  region: Region
  /**
   * Whether the cart is used in a return flow.
   */
  is_return: boolean
  /**
   * The shipping methods used in the cart.
   */
  shipping_methods: ShippingMethod[]
  /**
   * The gift cards and discounts applied on line items.
   * Each object key or property is an ID of a line item
   */
  allocation_map: LineAllocationsMap
}

/**
 * ## Overview
 *
 * A tax provider is used to retrieve the tax lines in a cart. The Medusa backend provides a default `system` provider. You can create your own tax provider,
 * either in a plugin or directly in your Medusa backend, then use it in any region.
 *
 * A tax provider class is defined in a TypeScript or JavaScript file under the `src/services` directory and the class must extend the
 * `AbstractTaxService` class imported from `@medusajs/medusa`. The file's name is the tax provider's class name as a slug and without the word `Service`.
 *
 * For example, you can create the file `src/services/my-tax.ts` with the following content:
 *
 * ```ts title="src/services/my-tax.ts"
 * import {
 *   AbstractTaxService,
 *   ItemTaxCalculationLine,
 *   ShippingTaxCalculationLine,
 *   TaxCalculationContext,
 * } from "@medusajs/medusa"
 * import {
 *   ProviderTaxLine,
 * } from "@medusajs/medusa/dist/types/tax-service"
 *
 * class MyTaxService extends AbstractTaxService {
 *   async getTaxLines(
 *     itemLines: ItemTaxCalculationLine[],
 *     shippingLines: ShippingTaxCalculationLine[],
 *     context: TaxCalculationContext):
 *     Promise<ProviderTaxLine[]> {
 *     throw new Error("Method not implemented.")
 *   }
 * }
 *
 * export default MyTaxService
 * ```
 *
 * ---
 *
 * ## Identifier Property
 *
 * The `TaxProvider` entity has 2 properties: `identifier` and `is_installed`. The `identifier` property in the tax provider service is used when the tax provider is added to the database.
 *
 * The value of this property is also used to reference the tax provider throughout Medusa. For example, it is used to [change the tax provider](https://docs.medusajs.com/modules/taxes/admin/manage-tax-settings#change-tax-provider-of-a-region) to a region.
 *
 * ```ts title="src/services/my-tax.ts"
 * class MyTaxService extends AbstractTaxService {
 *   static identifier = "my-tax"
 *   // ...
 * }
 * ```
 *
 * ---
 */
export interface ITaxService {
  /**
   * This method is used when retrieving the tax lines for line items and shipping methods.
   * This occurs during checkout or when calculating totals for orders, swaps, or returns.
   *
   * @param {ItemTaxCalculationLine[]} itemLines - The line item lines to calculate taxes for.
   * @param {ShippingTaxCalculationLine[]} shippingLines - The shipping method lines to calculate taxes for.
   * @param {TaxCalculationContext} context - Context relevant and useful for the taxes calculation.
   * @return {Promise<ProviderTaxLine[]>} The list of calculated line item and shipping method tax lines.
   * If an item in the array has the `shipping_method_id` property, then it's a shipping method tax line. Otherwise, if it has
   * the `item_id` property, then it's a line item tax line.
   *
   * @example
   * An example of how this method is implemented in the `system` provider implemented in the Medusa backend:
   *
   * ```ts
   * // ...
   *
   * class SystemTaxService extends AbstractTaxService {
   *   // ...
   *
   *   async getTaxLines(
   *     itemLines: ItemTaxCalculationLine[],
   *     shippingLines: ShippingTaxCalculationLine[],
   *     context: TaxCalculationContext
   *   ): Promise<ProviderTaxLine[]> {
   *     let taxLines: ProviderTaxLine[] = itemLines.flatMap((l) => {
   *       return l.rates.map((r) => ({
   *         rate: r.rate || 0,
   *         name: r.name,
   *         code: r.code,
   *         item_id: l.item.id,
   *       }))
   *     })
   *
   *     taxLines = taxLines.concat(
   *       shippingLines.flatMap((l) => {
   *         return l.rates.map((r) => ({
   *           rate: r.rate || 0,
   *           name: r.name,
   *           code: r.code,
   *           shipping_method_id: l.shipping_method.id,
   *         }))
   *       })
   *     )
   *
   *     return taxLines
   *   }
   * }
   * ```
   */
  getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]>
}

/**
 * @parentIgnore activeManager_,atomicPhase_,shouldRetryTransaction_,withTransaction
 */
export abstract class AbstractTaxService
  extends TransactionBaseService
  implements ITaxService
{
  /**
   * @ignore
   */
  static _isTaxService = true
  protected static identifier: string

  /**
   * @ignore
   */
  static isTaxService(object): boolean {
    return object?.constructor?._isTaxService
  }

  /**
   * You can use the `constructor` of your tax provider to access the different services in Medusa through dependency injection.
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.
   * Additionally, if you’re creating your tax provider as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor.
   *
   * @param {Record<string, unknown>} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
   * @param {Record<string, unknown>} config - If this tax provider is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * // ...
   * import { LineItemService } from "@medusajs/medusa"
   *
   * type InjectedDependencies = {
   *   lineItemService: LineItemService
   * }
   *
   * class MyTaxService extends AbstractTaxService {
   *   protected readonly lineItemService_: LineItemService
   *
   *   constructor({ lineItemService }: InjectedDependencies) {
   *     super(arguments[0])
   *     this.lineItemService_ = lineItemService
   *
   *     // you can also initialize a client that
   *     // communicates with a third-party service.
   *     this.client = new Client(options)
   *   }
   *
   *   // ...
   * }
   *
   * export default MyTaxService
   */
  protected constructor(
    protected readonly container: Record<string, unknown>,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    super(container, config)
  }

  /**
   * @ignore
   */
  public getIdentifier(): string {
    if (!(this.constructor as typeof AbstractTaxService).identifier) {
      throw new Error(`Missing static property "identifier".`)
    }
    return (this.constructor as typeof AbstractTaxService).identifier
  }

  public abstract getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]>
}
