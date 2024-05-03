import {
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
  TaxCalculationContext,
  TaxRateDTO,
  TaxableItemDTO,
  TaxableShippingDTO,
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
 * ## Overview
 *
 * A tax provider is used to retrieve the tax lines in a provided context. The Tax Module provides a default `system` provider. You can create your own tax provider,
 * either in a plugin, in a provider module, or directly in your Medusa application's codebase, then use it in any tax region.
 *
 * ---
 *
 * ## How to Create a Tax Provider
 *
 * A tax provider class is defined in a TypeScript or JavaScript file. The class must implement the
 * `ITaxProvider` interface imported from `@medusajs/types`.
 *
 * The file can be defined in a plugin, a provider module, or under the `src/services` directory of your Medusa application. You can later pass the package's name or the
 * path to the file in the `providers` option of the Tax Module.
 *
 * For example:
 *
 * ```ts title="src/services/my-tax.ts"
 * import { ITaxProvider } from "@medusajs/types"
 *
 * export default class MyTaxProvider implements ITaxProvider {
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## Identifier Property
 *
 * The `identifier` property in a tax provider is used when the tax provider is registered in the dependency container or added to the database. A tax provider is represented in the database by the `TaxProvider` data model.
 *
 * For example:
 *
 * ```ts title="src/services/my-tax.ts"
 * export default class MyTaxProvider implements ITaxProvider {
 *   static identifier = "my-tax"
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## Constructor
 *
 * You can use the `constructor` of your tax provider to access the resources registered in the dependency container.
 *
 * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.
 *
 * Additionally, if you’re creating your tax provider as a plugin or a provider module to be installed in any Medusa application and you want to access its options, you can access them in the constructor.
 *
 * For example:
 *
 * ```ts
 * export default class MyTaxProvider implements ITaxProvider {
 *   // ...
 *   constructor(container, options) {
 *     // you can access options here
 *
 *     // you can also initialize a client that
 *     // communicates with a third-party service.
 *     this.client = new Client(options)
 *   }
 * }
 * ```
 *
 * ---
 */
export interface ITaxProvider {
  /**
   * @ignore
   */
  getIdentifier(): string

  /**
   * This method is used to retrieve the tax lines of items and shipping methods. It's used
   * when the `getTaxLines` method of the Tax Module's main service is called.
   *
   * This method is useful during checkout or when calculating the totals of orders or exchanges.
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
   *           rate_id: r.id,
   *           rate: r.rate || 0,
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
   *           rate_id: r.id,
   *           rate: r.rate || 0,
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
