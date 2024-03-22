import {
  AddPriceListPricesDTO,
  AddPricesDTO,
  AddRulesDTO,
  CalculatedPriceSet,
  CreatePriceListDTO,
  CreatePriceListRuleDTO,
  CreatePriceRuleDTO,
  CreatePriceSetDTO,
  CreateRuleTypeDTO,
  FilterablePriceListProps,
  FilterablePriceListRuleProps,
  FilterablePriceProps,
  FilterablePriceRuleProps,
  FilterablePriceSetProps,
  FilterableRuleTypeProps,
  PriceDTO,
  PriceListDTO,
  PriceListRuleDTO,
  PriceRuleDTO,
  PriceSetDTO,
  PricingContext,
  PricingFilters,
  RemovePriceListRulesDTO,
  RemovePriceSetRulesDTO,
  RuleTypeDTO,
  SetPriceListRulesDTO,
  UpdatePriceListDTO,
  UpdatePriceListPricesDTO,
  UpdatePriceListRuleDTO,
  UpdatePriceRuleDTO,
  UpdatePriceSetDTO,
  UpdateRuleTypeDTO,
} from "./common"

import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"

/**
 * The main service interface for the pricing module.
 */
export interface IPricingModuleService extends IModuleService {
  /**
   * This method is used to calculate prices based on the provided filters and context.
   *
   * @param {PricingFilters} filters - The filters to apply on prices.
   * @param {PricingContext} context -
   * The context used to select the prices. For example, you can specify the region ID in this context, and only prices having the same value
   * will be retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CalculatedPriceSet[]>} The calculated prices matching the context and filters provided.
   *
   * @example
   * When you calculate prices, you must at least specify the currency code:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   * async function calculatePrice (priceSetId: string, currencyCode: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const price = await pricingService.calculatePrices(
   *     { id: [priceSetId] },
   *     {
   *       context: {
   *         currency_code: currencyCode
   *       }
   *     }
   *   )
   *
   *   // do something with the price or return it
   * }
   * ```
   *
   * To calculate prices for specific minimum and/or maximum quantity:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   * async function calculatePrice (priceSetId: string, currencyCode: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const price = await pricingService.calculatePrices(
   *     { id: [priceSetId] },
   *     {
   *       context: {
   *         currency_code: currencyCode,
   *         min_quantity: 4
   *       }
   *     }
   *   )
   *
   *   // do something with the price or return it
   * }
   * ```
   *
   * To calculate prices for custom rule types:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   * async function calculatePrice (priceSetId: string, currencyCode: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const price = await pricingService.calculatePrices(
   *     { id: [priceSetId] },
   *     {
   *       context: {
   *         currency_code: currencyCode,
   *         region_id: "US"
   *       }
   *     }
   *   )
   *
   *   // do something with the price or return it
   * }
   * ```
   */
  calculatePrices(
    filters: PricingFilters,
    context?: PricingContext,
    sharedContext?: Context
  ): Promise<CalculatedPriceSet[]>

  /**
   * This method is used to retrieve a price set by its ID.
   *
   * @param {string} id - The ID of the price set to retrieve.
   * @param {FindConfig<PriceSetDTO>} config -
   * The configurations determining how the price set is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} The retrieved price set.
   *
   * @example
   * A simple example that retrieves a price set by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.retrieve(
   *     priceSetId
   *   )
   *
   *   // do something with the price set or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.retrieve(
   *     priceSetId,
   *     {
   *       relations: ["prices"]
   *     }
   *   )
   *
   *   // do something with the price set or return it
   * }
   * ```
   */
  retrieve(
    id: string,
    config?: FindConfig<PriceSetDTO>,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  /**
   * This method is used to retrieve a paginated list of price sets based on optional filters and configuration.
   *
   * @param {FilterablePriceSetProps} filters - The filters to apply on the retrieved price lists.
   * @param {FindConfig<PriceSetDTO>} config -
   * The configurations determining how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} The list of price sets.
   *
   * @example
   *
   * To retrieve a list of price sets using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.list(
   *     {
   *       id: priceSetIds
   *     },
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price sets:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.list(
   *     {
   *       id: priceSetIds
   *     },
   *     {
   *       relations: ["prices"]
   *     }
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.list(
   *     {
   *       id: priceSetIds
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[], priceIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.list(
   *     {
   *       $and: [
   *         {
   *           id: priceSetIds
   *         },
   *         {
   *           prices: {
   *             id: priceIds
   *           }
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   */
  list(
    filters?: FilterablePriceSetProps,
    config?: FindConfig<PriceSetDTO>,
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * This method is used to retrieve a paginated list of price sets along with the total count of available price sets satisfying the provided filters.
   *
   * @param {FilterablePriceSetProps} filters - The filters to apply on the retrieved price lists.
   * @param {FindConfig<PriceSetDTO>} config -
   * The configurations determining how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceSetDTO[], number]>} The list of price sets along with their total count.
   *
   * @example
   *
   * To retrieve a list of prices sets using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSets, count] = await pricingService.listAndCount(
   *     {
   *       id: priceSetIds
   *     },
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price sets:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSets, count] = await pricingService.listAndCount(
   *     {
   *       id: priceSetIds
   *     },
   *     {
   *       relations: ["prices"]
   *     }
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSets, count] = await pricingService.listAndCount(
   *     {
   *       id: priceSetIds
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSets (priceSetIds: string[], priceIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSets, count] = await pricingService.listAndCount(
   *     {
   *       $and: [
   *         {
   *           id: priceSetIds
   *         },
   *         {
   *           prices: {
   *             id: priceIds
   *           }
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price sets or return them
   * }
   * ```
   */
  listAndCount(
    filters?: FilterablePriceSetProps,
    config?: FindConfig<PriceSetDTO>,
    sharedContext?: Context
  ): Promise<[PriceSetDTO[], number]>

  /**
   * This method is used to create a new price set.
   *
   * @param {CreatePriceSetDTO} data - The attributes of the price set to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} The created price set.
   *
   * @example
   * To create a default price set, don't pass any rules. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceSet () {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.create(
   *     {
   *       rules: [],
   *       prices: [
   *         {
   *           amount: 500,
   *           currency_code: "USD",
   *           min_quantity: 0,
   *           max_quantity: 4,
   *           rules: {},
   *         },
   *         {
   *           amount: 400,
   *           currency_code: "USD",
   *           min_quantity: 5,
   *           max_quantity: 10,
   *           rules: {},
   *         },
   *       ],
   *     },
   *   )
   *
   *   // do something with the price set or return it
   * }
   * ```
   *
   * To create a price set and associate it with rule types:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceSet () {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.create(
   *     {
   *       rules: [{ rule_attribute: "region_id" }, { rule_attribute: "city" }],
   *       prices: [
   *         {
   *           amount: 300,
   *           currency_code: "EUR",
   *           rules: {
   *             region_id: "PL",
   *             city: "krakow"
   *           },
   *         },
   *         {
   *           amount: 400,
   *           currency_code: "EUR",
   *           rules: {
   *             region_id: "PL"
   *           },
   *         },
   *         {
   *           amount: 450,
   *           currency_code: "EUR",
   *           rules: {
   *             city: "krakow"
   *           },
   *         }
   *       ],
   *     },
   *   )
   *
   *   // do something with the price set or return it
   * }
   * ```
   */
  create(data: CreatePriceSetDTO, sharedContext?: Context): Promise<PriceSetDTO>

  /**
   * @overload
   *
   * This method is used to create multiple price sets.
   *
   * @param {CreatePriceSetDTO[]} data - The price sets to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} The list of created price sets.
   *
   * @example
   * To create price sets with a default price, don't pass any rules and make sure to pass the `currency_code` of the price. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceSets () {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.create([
   *     {
   *       rules: [],
   *       prices: [
   *         {
   *           amount: 500,
   *           currency_code: "USD",
   *           rules: {},
   *         },
   *       ],
   *     },
   *   ])
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * To create price sets and associate them with rule types:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceSets () {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.create([
   *     {
   *       rules: [{ rule_attribute: "region_id" }, { rule_attribute: "city" }],
   *       prices: [
   *         {
   *           amount: 300,
   *           currency_code: "EUR",
   *           rules: {
   *             region_id: "PL",
   *             city: "krakow"
   *           },
   *         },
   *         {
   *           amount: 400,
   *           currency_code: "EUR",
   *           min_quantity: 0,
   *           max_quantity: 4,
   *           rules: {
   *             region_id: "PL"
   *           },
   *         },
   *         {
   *           amount: 450,
   *           currency_code: "EUR",
   *           rules: {
   *             city: "krakow"
   *           },
   *         }
   *       ],
   *     },
   *   ])
   *
   *   // do something with the price sets or return them
   * }
   * ```
   */
  create(
    data: CreatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * @ignore
   * @privateRemarks
   * The update method shouldn't be documented at the moment
   *
   * This method is used to update existing price sets.
   *
   * @param {UpdatePriceSetDTO[]} data - The price sets to update, each having the attributes that should be updated in a price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} The list of updated price sets.
   */
  update(
    data: UpdatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * This method remove rules from a price set.
   *
   * @param {RemovePriceSetRulesDTO[]} data - The rules to remove per price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when rules are successfully removed.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function removePriceSetRule (priceSetId: string, ruleAttributes: []) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.removeRules([
   *     {
   *       id: priceSetId,
   *       rules: ruleAttributes
   *     },
   *   ])
   * }
   */
  removeRules(
    data: RemovePriceSetRulesDTO[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes price sets by their IDs.
   *
   * @param {string[]} ids - The IDs of the price sets to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the price sets are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function removePriceSetRule (priceSetIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.delete(priceSetIds)
   * }
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method adds prices to a price set.
   *
   * @param {AddPricesDTO} data - The data defining the price set to add the prices to, along with the prices to add.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} The price set that the prices were added to.
   *
   * @example
   *
   * To add a default price to a price set, don't pass it any rules and make sure to pass it the `currency_code`:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addPricesToPriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.addPrices({
   *     priceSetId,
   *     prices: [
   *      {
   *         amount: 500,
   *         currency_code: "USD",
   *         rules: {},
   *       },
   *     ],
   *   })
   *
   *   // do something with the price set or return it
   * }
   * ```
   *
   * To add prices with rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addPricesToPriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.addPrices({
   *     priceSetId,
   *     prices: [
   *       {
   *         amount: 300,
   *         currency_code: "EUR",
   *         rules: {
   *           region_id: "PL",
   *           city: "krakow"
   *         },
   *       },
   *       {
   *         amount: 400,
   *         currency_code: "EUR",
   *         min_quantity: 0,
   *         max_quantity: 4,
   *         rules: {
   *           region_id: "PL"
   *         },
   *       },
   *       {
   *         amount: 450,
   *         currency_code: "EUR",
   *         rules: {
   *           city: "krakow"
   *         },
   *       }
   *     ],
   *   })
   *
   *   // do something with the price set or return it
   * }
   * ```
   */
  addPrices(data: AddPricesDTO, sharedContext?: Context): Promise<PriceSetDTO>

  /**
   * This method adds prices to multiple price sets.
   *
   * @param {AddPricesDTO[]} data - The data defining the prices to add per price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} The list of the price sets that prices were added to.
   *
   * @example
   *
   * To add a default price to a price set, don't pass it any rules and make sure to pass it the `currency_code`:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addPricesToPriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.addPrices([{
   *     priceSetId,
   *     prices: [
   *      {
   *         amount: 500,
   *         currency_code: "USD",
   *         rules: {},
   *       },
   *     ],
   *   }])
   *
   *   // do something with the price sets or return them
   * }
   * ```
   *
   * To add prices with rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addPricesToPriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.addPrices([{
   *     priceSetId,
   *     prices: [
   *       {
   *         amount: 300,
   *         currency_code: "EUR",
   *         rules: {
   *           region_id: "PL",
   *           city: "krakow"
   *         },
   *       },
   *       {
   *         amount: 400,
   *         currency_code: "EUR",
   *         min_quantity: 0,
   *         max_quantity: 4,
   *         rules: {
   *           region_id: "PL"
   *         },
   *       },
   *       {
   *         amount: 450,
   *         currency_code: "EUR",
   *         rules: {
   *           city: "krakow"
   *         },
   *       }
   *     ],
   *   }])
   *
   *   // do something with the price sets or return them
   * }
   * ```
   */
  addPrices(
    data: AddPricesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * This method adds rules to a price set.
   *
   * @param {AddRulesDTO} data - The data defining the price set to add the rules to, along with the rules to add.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} The price set that the rules were added to.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addRulesToPriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSet = await pricingService.addRules({
   *     priceSetId,
   *     rules: [{
   *       attribute: "region_id"
   *     }]
   *   })
   *
   *   // do something with the price set or return it
   * }
   */
  addRules(data: AddRulesDTO, sharedContext?: Context): Promise<PriceSetDTO>

  /**
   * This method adds rules to multiple price sets.
   *
   * @param {AddRulesDTO[]} data - The data defining the rules to add per price set.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} The list of the price sets that the rules were added to.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addRulesToPriceSet (priceSetId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.addRules([{
   *     priceSetId,
   *     rules: [{
   *       attribute: "region_id"
   *     }]
   *   }])
   *
   *   // do something with the price sets or return them
   * }
   */
  addRules(data: AddRulesDTO[], sharedContext?: Context): Promise<PriceSetDTO[]>

  /**
   * This method is used to retrieve a rule type by its ID and and optionally based on the provided configurations.
   *
   * @param {string} id - The ID of the rule type to retrieve.
   * @param {FindConfig<RuleTypeDTO>} config -
   * The configurations determining how the rule type is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a rule type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO>} The retrieved rule type.
   *
   * @example
   * A simple example that retrieves a rule type by its code:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleType (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleType = await pricingService.retrieveRuleType(ruleTypeId)
   *
   *   // do something with the rule type or return it
   * }
   * ```
   *
   * To specify attributes that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleType (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleType = await pricingService.retrieveRuleType(ruleTypeId, {
   *     select: ["name"]
   *   })
   *
   *   // do something with the rule type or return it
   * }
   * ```
   */
  retrieveRuleType(
    id: string,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO>

  /**
   * This method is used to retrieve a paginated list of rule types based on optional filters and configuration.
   *
   * @param {FilterableRuleTypeProps} filters - The filters to apply on the retrieved rule types.
   * @param {FindConfig<RuleTypeDTO>} config -
   * The configurations determining how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a rule type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO[]>} The list of rule types.
   *
   * @example
   *
   * To retrieve a list of rule types using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleTypes = await pricingService.listRuleTypes({
   *     id: [
   *       ruleTypeId
   *     ]
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the rule types:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleTypes = await pricingService.listRuleTypes({
   *     id: [
   *       ruleTypeId
   *     ]
   *   }, {
   *     select: ["name"]
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleTypes = await pricingService.listRuleTypes({
   *     id: [
   *       ruleTypeId
   *     ]
   *   }, {
   *     select: ["name"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string[], name: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleTypes = await pricingService.listRuleTypes({
   *     $and: [
   *       {
   *         id: ruleTypeId
   *       },
   *       {
   *         name
   *       }
   *     ]
   *   }, {
   *     select: ["name"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   */
  listRuleTypes(
    filters?: FilterableRuleTypeProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  /**
   * This method is used to retrieve a paginated list of rule types along with the total count of available rule types satisfying the provided filters.
   *
   * @param {FilterableRuleTypeProps} filters - The filters to apply on the retrieved rule types.
   * @param {FindConfig<RuleTypeDTO>} config -
   * The configurations determining how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a rule type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RuleTypeDTO[], number]>} The list of rule types along with their total count.
   *
   * @example
   *
   * To retrieve a list of rule types using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
   *     id: [
   *       ruleTypeId
   *     ]
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the rule types:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
   *     id: [
   *       ruleTypeId
   *     ]
   *   }, {
   *     select: ["name"]
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
   *     id: [
   *       ruleTypeId
   *     ]
   *   }, {
   *     select: ["name"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveRuleTypes (ruleTypeId: string[], name: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
   *     $and: [
   *       {
   *         id: ruleTypeId
   *       },
   *       {
   *         name
   *       }
   *     ]
   *   }, {
   *     select: ["name"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the rule types or return them
   * }
   * ```
   */
  listAndCountRuleTypes(
    filters?: FilterableRuleTypeProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<[RuleTypeDTO[], number]>

  /**
   * This method is used to create new rule types.
   *
   * @param {CreateRuleTypeDTO[]} data - The rule types to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO[]>} The list of created rule types.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createRuleTypes () {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleTypes = await pricingService.createRuleTypes([
   *     {
   *       name: "Region",
   *       rule_attribute: "region_id"
   *     }
   *   ])
   *
   *   // do something with the rule types or return them
   * }
   */
  createRuleTypes(
    data: CreateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  /**
   * This method is used to update existing rule types with the provided data.
   *
   * @param {UpdateRuleTypeDTO[]} data - The rule types to update, each having the attributes that should be updated in a rule type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO[]>} The list of updated rule types.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updateRuleTypes (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const ruleTypes = await pricingService.updateRuleTypes([
   *     {
   *       id: ruleTypeId,
   *       name: "Region",
   *     }
   *   ])
   *
   *   // do something with the rule types or return them
   * }
   */
  updateRuleTypes(
    data: UpdateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  /**
   * This method is used to delete rule types based on the provided IDs.
   *
   * @param {string[]} ruleTypeIds - The IDs of the rule types to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves once the rule types are deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deleteRuleTypes (ruleTypeId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deleteRuleTypes([ruleTypeId])
   * }
   */
  deleteRuleTypes(ruleTypeIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method is used to retrieve a paginated list of prices based on optional filters and configuration.
   *
   * @param {FilterablePriceProps} filters - The filters to apply on the retrieved prices.
   * @param {FindConfig<PriceDTO>} config -
   * The configurations determining how the prices are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceDTO[]>} The list of prices.
   *
   * @example
   *
   * To retrieve a list of prices using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const prices = await pricingService.listPrices({
   *     id: [id]
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the prices:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const prices = await pricingService.listPrices({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"]
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const prices = await pricingService.listPrices({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (ids: string[], titles: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const prices = await pricingService.listPrices({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         title: titles
   *       }
   *     ]
   *   }, {
   *     relations: ["price_rules"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   */
  listPrices(
    filters?: FilterablePriceProps,
    config?: FindConfig<PriceDTO>,
    sharedContext?: Context
  ): Promise<PriceDTO[]>

  softDeletePrices<TReturnableLinkableKeys extends string = string>(
    priceIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restorePrices<TReturnableLinkableKeys extends string = string>(
    priceIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to retrieve a paginated list of prices along with the total count of
   * available prices satisfying the provided filters.
   *
   * @param {FilterablePriceProps} filters - The filters to apply on the retrieved prices.
   * @param {FindConfig<PriceDTO>} config -
   * The configurations determining how the prices are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceDTO[], number]>} The list of prices and their total count.
   *
   * @example
   *
   * To retrieve a list of prices using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [prices, count] = await pricingService.listAndCountPrices({
   *     id: [id]
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the prices:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [prices, count] = await pricingService.listAndCountPrices({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"],
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [prices, count] = await pricingService.listAndCountPrices({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePrices (ids: string[], titles: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [prices, count] = await pricingService.listAndCountPrices({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         title: titles
   *       }
   *     ]
   *   }, {
   *     relations: ["price_rules"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the prices or return them
   * }
   * ```
   */
  listAndCountPrices(
    filters?: FilterablePriceProps,
    config?: FindConfig<PriceDTO>,
    sharedContext?: Context
  ): Promise<[PriceDTO[], number]>

  /**
   * This method is used to retrieve a price rule by its ID.
   *
   * @param {string} id - The ID of the price rule to retrieve.
   * @param {FindConfig<PriceRuleDTO>} config -
   * The configurations determining how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO>} The retrieved price rule.
   *
   * @example
   * A simple example that retrieves a price rule by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRule (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRule = await pricingService.retrievePriceRule(id)
   *
   *   // do something with the price rule or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRule (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRule = await pricingService.retrievePriceRule(id, {
   *     relations: ["price_set"]
   *   })
   *
   *   // do something with the price rule or return it
   * }
   * ```
   */
  retrievePriceRule(
    id: string,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceRuleDTO>

  /**
   * This method is used to retrieve a paginated list of price rules based on optional filters and configuration.
   *
   * @param {FilterablePriceRuleProps} filters - The filters to apply on the retrieved price rules.
   * @param {FindConfig<PriceRuleDTO>} config -
   * The configurations determining how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} The list of price rules.
   *
   * @example
   *
   * To retrieve a list of price rules using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRules = await pricingService.listPriceRules({
   *     id: [id]
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRules = await pricingService.listPriceRules({
   *     id: [id],
   *   }, {
   *     relations: ["price_set"]
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRules = await pricingService.listPriceRules({
   *     id: [id],
   *   }, {
   *     relations: ["price_set"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (ids: string[], name: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRules = await pricingService.listPriceRules({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         name
   *       }
   *     ]
   *   }, {
   *     relations: ["price_set"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   */
  listPriceRules(
    filters?: FilterablePriceRuleProps,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  /**
   * This method is used to retrieve a paginated list of price rules along with the total count of available price rules satisfying the provided filters.
   *
   * @param {FilterablePriceRuleProps} filters - The filters to apply on the retrieved price rules.
   * @param {FindConfig<PriceRuleDTO>} config -
   * The configurations determining how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} The list of price rules along with their total count.
   *
   * @example
   *
   * To retrieve a list of price rules using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceRules, count] = await pricingService.listAndCountPriceRules({
   *     id: [id]
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceRules, count] = await pricingService.listAndCountPriceRules({
   *     id: [id],
   *   }, {
   *     relations: ["price_set"]
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceRules, count] = await pricingService.listAndCountPriceRules({
   *     id: [id],
   *   }, {
   *     relations: ["price_set"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceRules (ids: string[], name: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceRules, count] = await pricingService.listAndCountPriceRules({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         name
   *       }
   *     ]
   *   }, {
   *     relations: ["price_set"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price rules or return them
   * }
   * ```
   */
  listAndCountPriceRules(
    filters?: FilterablePriceRuleProps,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<[PriceRuleDTO[], number]>

  /**
   * This method is used to create new price rules based on the provided data.
   *
   * @param {CreatePriceRuleDTO[]} data - The price rules to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} The list of created price rules.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceRules (
   *   id: string,
   *   priceSetId: string,
   *   ruleTypeId: string,
   *   value: string,
   *   priceId: string,
   *   priceListId: string
   * ) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRules = await pricingService.createPriceRules([
   *     {
   *       id,
   *       price_set_id: priceSetId,
   *       rule_type_id: ruleTypeId,
   *       value,
   *       price_id: priceId,
   *       price_list_id: priceListId
   *     }
   *   ])
   *
   *   // do something with the price rules or return them
   * }
   */
  createPriceRules(
    data: CreatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  /**
   * This method is used to update price rules, each with their provided data.
   *
   * @param {UpdatePriceRuleDTO[]} data - The price rules to update, each having attributes that should be updated in a price rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} The list of updated price rules.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updatePriceRules (
   *   id: string,
   *   priceSetId: string,
   * ) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceRules = await pricingService.updatePriceRules([
   *     {
   *       id,
   *       price_set_id: priceSetId,
   *     }
   *   ])
   *
   *   // do something with the price rules or return them
   * }
   */
  updatePriceRules(
    data: UpdatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  /**
   * This method is used to delete price rules based on the specified IDs.
   *
   * @param {string[]} priceRuleIds - The IDs of the price rules to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves once the price rules are deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deletePriceRules (
   *   id: string,
   * ) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deletePriceRules([id])
   * }
   */
  deletePriceRules(
    priceRuleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method is used to retrieve a price list by its ID.
   *
   * @param {string} id - The ID of the price list to retrieve.
   * @param {FindConfig<PriceListDTO>} config -
   * The configurations determining how the price list is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO>} The retrieved price list.
   *
   * @example
   * A simple example that retrieves a price list by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceList (priceListId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceList = await pricingService.retrievePriceList(
   *     priceListId
   *   )
   *
   *   // do something with the price list or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceList (priceListId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceList = await pricingService.retrievePriceList(
   *     priceListId,
   *     {
   *       relations: ["prices"]
   *     }
   *   )
   *
   *   // do something with the price list or return it
   * }
   * ```
   */
  retrievePriceList(
    id: string,
    config?: FindConfig<PriceListDTO>,
    sharedContext?: Context
  ): Promise<PriceListDTO>

  /**
   * This method is used to retrieve a paginated list of price lists based on optional filters and configuration.
   *
   * @param {FilterablePriceListProps} filters - The filters to apply on the retrieved price lists.
   * @param {FindConfig<PriceListDTO>} config -
   * The configurations determining how the price lists are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO[]>} The list of price lists.
   *
   * @example
   *
   * To retrieve a list of price lists using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceLists (priceListIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceLists = await pricingService.listPriceLists(
   *     {
   *       id: priceListIds
   *     },
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price lists:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceLists (priceListIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceLists = await pricingService.listPriceLists(
   *     {
   *       id: priceListIds
   *     },
   *     {
   *       relations: ["prices"]
   *     }
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceLists (priceListIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceLists = await pricingService.listPriceLists(
   *     {
   *       id: priceListIds
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceLists (priceListIds: string[], titles: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceLists = await pricingService.listPriceLists(
   *     {
   *       $and: [
   *         {
   *           id: priceListIds
   *         },
   *         {
   *           title: titles
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   */
  listPriceLists(
    filters?: FilterablePriceListProps,
    config?: FindConfig<PriceListDTO>,
    sharedContext?: Context
  ): Promise<PriceListDTO[]>

  /**
   * This method is used to retrieve a paginated list of price lists along with the total count of available price lists satisfying the provided filters.
   *
   * @param {FilterablePriceListProps} filters - The filters to apply on the retrieved price lists.
   * @param {FindConfig<PriceListDTO>} config -
   * The configurations determining how the price lists are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceListDTO[], number]>} The list of price lists along with their total count.
   *
   * @example
   *
   * To retrieve a list of price lists using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceLists (priceListIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceLists, count] = await pricingService.listPriceLists(
   *     {
   *       id: priceListIds
   *     },
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price lists:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceLists (priceListIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceLists, count] = await pricingService.listPriceLists(
   *     {
   *       id: priceListIds
   *     },
   *     {
   *       relations: ["prices"]
   *     }
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceLists (priceListIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceLists, count] = await pricingService.listPriceLists(
   *     {
   *       id: priceListIds
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceLists (priceListIds: string[], titles: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceLists, count] = await pricingService.listPriceLists(
   *     {
   *       $and: [
   *         {
   *           id: priceListIds
   *         },
   *         {
   *           title: titles
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["prices"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price lists or return them
   * }
   * ```
   */
  listAndCountPriceLists(
    filters?: FilterablePriceListProps,
    config?: FindConfig<PriceListDTO>,
    sharedContext?: Context
  ): Promise<[PriceListDTO[], number]>

  /**
   * This method is used to create price lists.
   *
   * @param {CreatePriceListDTO[]} data - The details of each price list to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO[]>} The created price lists.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceList (items: {
   *   title: string
   *   description: string
   *   starts_at?: string
   *   ends_at?: string
   * }[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceList = await pricingService.createPriceLists(items)
   *
   *   // do something with the price lists or return them
   * }
   */
  createPriceLists(
    data: CreatePriceListDTO[],
    sharedContext?: Context
  ): Promise<PriceListDTO[]>

  /**
   * This method is used to update price lists.
   *
   * @param {UpdatePriceListDTO[]} data - The attributes to update in each price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO[]>} The updated price lists.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updatePriceLists (items: {
   *   id: string
   *   title: string
   *   description: string
   *   starts_at?: string
   *   ends_at?: string
   * }[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceList = await pricingService.updatePriceLists(items)
   *
   *   // do something with the price lists or return them
   * }
   */
  updatePriceLists(
    data: UpdatePriceListDTO[],
    sharedContext?: Context
  ): Promise<PriceListDTO[]>

  /**
   * This method is used to delete price lists.
   *
   * @param {string[]} priceListIds - The IDs of the price lists to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the price lists are deleted successfully.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deletePriceLists (ids: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deletePriceLists(ids)
   * }
   */
  deletePriceLists(
    priceListIds: string[],
    sharedContext?: Context
  ): Promise<void>

  softDeletePriceLists<TReturnableLinkableKeys extends string = string>(
    priceListIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restorePriceLists<TReturnableLinkableKeys extends string = string>(
    priceListIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to retrieve a price list rule by its ID.
   *
   * @param {string} id - The ID of the price list rule to retrieve.
   * @param {FindConfig<PriceListRuleDTO>} config -
   * The configurations determining how the price list rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price list rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListRuleDTO>} The retrieved price list rule.
   *
   * @example
   * A simple example that retrieves a price list rule by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceListRule (priceListRuleId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRule = await pricingService.retrievePriceListRule(
   *     priceListRuleId
   *   )
   *
   *   // do something with the price list rule or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceListRule (priceListRuleId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRule = await pricingService.retrievePriceListRule(
   *     priceListRuleId,
   *     {
   *       relations: ["price_list"]
   *     }
   *   )
   *
   *   // do something with the price list rule or return it
   * }
   * ```
   */
  retrievePriceListRule(
    id: string,
    config?: FindConfig<PriceListRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceListRuleDTO>

  /**
   * This method is used to retrieve a paginated list of price list rules based on optional filters and configuration.
   *
   * @param {FilterablePriceListRuleProps} filters - The filters to apply on the retrieved price list rules.
   * @param {FindConfig<PriceListRuleDTO>} config -
   * The configurations determining how the price list rules are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price list rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListRuleDTO[]>} The list of price list rules.
   *
   * @example
   *
   * To retrieve a list of price list vs using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceListRules (priceListRuleIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRules = await pricingService.listPriceListRules(
   *     {
   *       id: priceListRuleIds
   *     },
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price list rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceListRules (priceListRuleIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRules = await pricingService.listPriceListRules(
   *     {
   *       id: priceListRuleIds
   *     },
   *     {
   *       relations: ["price_list_rule_values"]
   *     }
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceListRules (priceListRuleIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRules = await pricingService.listPriceListRules(
   *     {
   *       id: priceListRuleIds
   *     },
   *     {
   *       relations: ["price_list_rule_values"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listPriceListRules (priceListRuleIds: string[], ruleTypeIDs: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRules = await pricingService.listPriceListRules(
   *     {
   *       $and: [
   *         {
   *           id: priceListRuleIds
   *         },
   *         {
   *           rule_types: ruleTypeIDs
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["price_list_rule_values"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   */
  listPriceListRules(
    filters?: FilterablePriceListRuleProps,
    config?: FindConfig<PriceListRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceListRuleDTO[]>

  /**
   * This method is used to retrieve a paginated list of price list ruless along with the total count of available price list ruless satisfying the provided filters.
   *
   * @param {FilterablePriceListRuleProps} filters - The filters to apply on the retrieved price list rules.
   * @param {FindConfig<PriceListRuleDTO>} config -
   * The configurations determining how the price list rules are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price list rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceListRuleDTO[], number]>} The list of price list rules along with their total count.
   *
   * @example
   *
   * To retrieve a list of price list vs using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listAndCountPriceListRules (priceListRuleIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceListRules, count] = await pricingService.listAndCountPriceListRules(
   *     {
   *       id: priceListRuleIds
   *     },
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price list rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listAndCountPriceListRules (priceListRuleIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceListRules, count] = await pricingService.listAndCountPriceListRules(
   *     {
   *       id: priceListRuleIds
   *     },
   *     {
   *       relations: ["price_list_rule_values"]
   *     }
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listAndCountPriceListRules (priceListRuleIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceListRules, count] = await pricingService.listAndCountPriceListRules(
   *     {
   *       id: priceListRuleIds
   *     },
   *     {
   *       relations: ["price_list_rule_values"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function listAndCountPriceListRules (priceListRuleIds: string[], ruleTypeIDs: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceListRules, count] = await pricingService.listAndCountPriceListRules(
   *     {
   *       $and: [
   *         {
   *           id: priceListRuleIds
   *         },
   *         {
   *           rule_types: ruleTypeIDs
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["price_list_rule_values"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the price list rules or return them
   * }
   * ```
   */
  listAndCountPriceListRules(
    filters?: FilterablePriceListRuleProps,
    config?: FindConfig<PriceListRuleDTO>,
    sharedContext?: Context
  ): Promise<[PriceListRuleDTO[], number]>

  /**
   * This method is used to create price list rules.
   *
   * @param {CreatePriceListRuleDTO[]} data - The price list rules to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListRuleDTO[]>} The created price list rules.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceListRules (items: {
   *   rule_type_id: string
   *   price_list_id: string
   * }[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRules = await pricingService.createPriceListRules(items)
   *
   *   // do something with the price list rule or return them
   * }
   */
  createPriceListRules(
    data: CreatePriceListRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceListRuleDTO[]>

  /**
   * This method is used to update price list rules.
   *
   * @param {UpdatePriceListRuleDTO[]} data - The attributes to update for each price list rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListRuleDTO[]>} The updated price list rules.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updatePriceListRules (items: {
   *   id: string
   *   rule_type_id?: string
   *   price_list_id?: string
   * }[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceListRules = await pricingService.updatePriceListRules(items)
   *
   *   // do something with the price list rule or return them
   * }
   */
  updatePriceListRules(
    data: UpdatePriceListRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceListRuleDTO[]>

  /**
   * This method is used to delete price list rules.
   *
   * @param {string[]} priceListRuleIds - The IDs of the price list rules to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves successfully when the price list rules are deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deletePriceListRules (priceListRuleIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deletePriceListRules(priceListRuleIds)
   * }
   */
  deletePriceListRules(
    priceListRuleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method is used to add prices to price lists.
   *
   * @param {AddPriceListPricesDTO[]} data - The prices to add for each price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO[]>} The updated price lists.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function addPriceListPrices (items: {
   *   priceListId: string,
   *   prices: {
   *     currency_code: string,
   *     amount: number,
   *     price_set_id: string
   *   }[]
   * }[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceLists = await pricingService.addPriceListPrices(items)
   *
   *   // do something with the price lists or return them
   * }
   */
  addPriceListPrices(
    data: AddPriceListPricesDTO[],
    sharedContext?: Context
  ): Promise<PriceListDTO[]>

  updatePriceListPrices(
    data: UpdatePriceListPricesDTO[],
    sharedContext?: Context
  ): Promise<PriceListDTO[]>

  /**
   * This method is used to set the rules of a price list.
   *
   * @param {SetPriceListRulesDTO} data - The rules to set for a price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO>} The updated price lists.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function setPriceListRules (priceListId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceList = await pricingService.setPriceListRules({
   *     priceListId,
   *     rules: {
   *       region_id: "US"
   *     }
   *   })
   *
   *   // do something with the price list or return it
   * }
   */
  setPriceListRules(
    data: SetPriceListRulesDTO,
    sharedContext?: Context
  ): Promise<PriceListDTO>

  /**
   * This method is used to remove rules from a price list.
   *
   * @param {RemovePriceListRulesDTO} data - The rules to remove from a price list.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceListDTO>} The updated price lists.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function setPriceListRules (priceListId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceList = await pricingService.removePriceListRules({
   *     priceListId,
   *     rules: ["region_id"]
   *   })
   *
   *   // do something with the price list or return it
   * }
   */
  removePriceListRules(
    data: RemovePriceListRulesDTO,
    sharedContext?: Context
  ): Promise<PriceListDTO>

  removePrices(ids: string[], sharedContext?: Context): Promise<void>
}
