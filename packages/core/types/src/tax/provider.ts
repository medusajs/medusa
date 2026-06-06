import {
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
  TaxableItemDTO,
  TaxableShippingDTO,
  TaxCalculationContext,
  TaxRateDTO,
} from "./common"

/**
 * A shipping method and the tax rates configured to apply to the
 * shipping method.
 */
export type ShippingTaxCalculationLine = {
  /**
   * The shipping method to calculate taxes for.
   */
  shipping_line: TaxableShippingDTO
  /**
   * The rates applicable on the shipping method.
   */
  rates: TaxRateDTO[]
}

/**
 * A line item and the tax rates configured to apply to the
 * product contained in the line item.
 */
export type ItemTaxCalculationLine = {
  /**
   * The line item to calculate taxes for.
   */
  line_item: TaxableItemDTO
  /**
   * The rates applicable on the item.
   */
  rates: TaxRateDTO[]
}

/**
 * 
 * 
 * ### Identifier Property
 *
 * Each tax provider has a unique identifier defined in its class. The provider's ID
 * will be stored as `tp_{identifier}_{id}`, where `{id}` is the provider's `id`
 * property in the `medusa-config.ts`.
 *
 * For example:
 *
 * ```ts title="src/modules/my-tax/service.ts"
 * export default class MyTaxProvider implements ITaxProvider {
 *   static identifier = "my-tax"
 *   // ...
 * }
 * ```
 *
 * ### constructor
 *
 * You can use the `constructor` of your Tax Module Provider's service to access the resources registered in the [Module Container](https://docs.medusajs.com/resources/medusa-container-resources#module-container-resources).
 *
 * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.
 *
 * Additionally, if you’re creating your tax provider as a plugin or a module provider to be installed in any Medusa application and you want to access its options, you can access them in the second parameter of the constructor.
 *
 * For example:
 *
 * ```ts
 * import {
 *   ITaxProvider,
 *   Logger
 * } from "@zjedene-medusa/framework/types"
 * 
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 * 
 * type Options = {
 *   apiKey: string
 * }
 * 
 * export default class MyTaxProvider implements ITaxProvider {
 *   static identifier = "my-tax"
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 * 
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 * }
 * ```
 *
 * ---
 */
export interface ITaxProvider {
  /**
   * This method is used to retrieve the unique identifier of the tax provider.
   * 
   * @return {string} The unique identifier of the tax provider.
   * 
   * @example
   * export default class MyTaxProvider implements ITaxProvider {
   *   static identifier = "my-tax"
   *   
   *   getIdentifier(): string {
   *     return MyTaxProvider.identifier
   *   }
   * }
   */
  getIdentifier(): string

  /**
   * This method is used to retrieve the tax lines of items and shipping methods. It's used during checkout 
   * when the `getTaxLines` method of the Tax Module's main service is called for a tax
   * region that uses this tax provider.
   *
   * @param {ItemTaxCalculationLine[]} itemLines - The line item lines to calculate taxes for.
   * @param {ShippingTaxCalculationLine[]} shippingLines - The shipping method lines to calculate taxes for.
   * @param {TaxCalculationContext} context - The context relevant and useful for the taxes calculation.
   * @return {Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>} The list of calculated line item and shipping tax lines.
   * If an item in the array has the `shipping_line_id` property, then it's a shipping tax line. Otherwise, if it has
   * the `line_item_id` property, then it's a line item tax line.
   *
   * @example
   * An example of how this method is implemented in the `system` provider:
   *
   * ```ts
   * // ...
   *
   * export default class SystemTaxService implements ITaxProvider {
   *   // ...
   *
   *   async getTaxLines(
   *     itemLines: TaxTypes.ItemTaxCalculationLine[],
   *     shippingLines: TaxTypes.ShippingTaxCalculationLine[],
   *     _: TaxTypes.TaxCalculationContext
   *   ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
   *     let taxLines: (TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[] =
   *       itemLines.flatMap((l) => {
   *         return l.rates.map((r) => ({
   *           rate_id: r.id, // this is optional. When integrating with a third-party, you don't need to provide it
   *           rate: r.rate || 0, // For example, 10 for 10%
   *           name: r.name,
   *           code: r.code,
   *           line_item_id: l.line_item.id,
   *           provider_id: this.getIdentifier(),
   *         }))
   *       })
   *
   *     taxLines = taxLines.concat(
   *       shippingLines.flatMap((l) => {
   *         return l.rates.map((r) => ({
   *           rate_id: r.id, // this is optional. When integrating with a third-party, you don't need to provide it
   *           rate: r.rate || 0, // For example, 10 for 10%
   *           name: r.name,
   *           code: r.code,
   *           shipping_line_id: l.shipping_line.id,
   *           provider_id: this.getIdentifier(),
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
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>
}
