import {
  AddPriceListPricesDTO,
  AddPricesDTO,
  AddRulesDTO,
  CalculatedPriceSet,
  CreateCurrencyDTO,
  CreateMoneyAmountDTO,
  CreatePriceListDTO,
  CreatePriceListRuleDTO,
  CreatePriceRuleDTO,
  CreatePriceSetDTO,
  CreatePriceSetMoneyAmountRulesDTO,
  CreateRuleTypeDTO,
  CurrencyDTO,
  FilterableCurrencyProps,
  FilterableMoneyAmountProps,
  FilterablePriceListProps,
  FilterablePriceListRuleProps,
  FilterablePriceRuleProps,
  FilterablePriceSetMoneyAmountProps,
  FilterablePriceSetMoneyAmountRulesProps,
  FilterablePriceSetProps,
  FilterableRuleTypeProps,
  MoneyAmountDTO,
  PriceListDTO,
  PriceListRuleDTO,
  PriceRuleDTO,
  PriceSetDTO,
  PriceSetMoneyAmountDTO,
  PriceSetMoneyAmountRulesDTO,
  PricingContext,
  PricingFilters,
  RemovePriceListRulesDTO,
  RemovePriceSetRulesDTO,
  RuleTypeDTO,
  SetPriceListRulesDTO,
  UpdateCurrencyDTO,
  UpdateMoneyAmountDTO,
  UpdatePriceListDTO,
  UpdatePriceListRuleDTO,
  UpdatePriceRuleDTO,
  UpdatePriceSetDTO,
  UpdatePriceSetMoneyAmountRulesDTO,
  UpdateRuleTypeDTO,
} from "./common"

import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"

export interface IPricingModuleService {
  /**
   * @ignore
   */
  __joinerConfig(): ModuleJoinerConfig

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
   *       relations: ["money_amounts"]
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
   *       relations: ["money_amounts"]
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
   *       relations: ["money_amounts"],
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
   * async function retrievePriceSets (priceSetIds: string[], moneyAmountIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSets = await pricingService.list(
   *     {
   *       $and: [
   *         {
   *           id: priceSetIds
   *         },
   *         {
   *           money_amounts: {
   *             id: moneyAmountIds
   *           }
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["money_amounts"],
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
   *       relations: ["money_amounts"]
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
   *       relations: ["money_amounts"],
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
   * async function retrievePriceSets (priceSetIds: string[], moneyAmountIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSets, count] = await pricingService.listAndCount(
   *     {
   *       $and: [
   *         {
   *           id: priceSetIds
   *         },
   *         {
   *           money_amounts: {
   *             id: moneyAmountIds
   *           }
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["money_amounts"],
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
   * This method retrieves a money amount by its ID.
   *
   * @param {string} id - The ID of the money amount to retrieve.
   * @param {FindConfig<MoneyAmountDTO>} config -
   * The configurations determining how a money amount is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO>} The retrieved money amount.
   *
   * @example
   * To retrieve a money amount by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmount (moneyAmountId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmount = await pricingService.retrieveMoneyAmount(
   *     moneyAmountId,
   *   )
   *
   *   // do something with the money amount or return it
   * }
   * ```
   *
   * To retrieve relations along with the money amount:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmount (moneyAmountId: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmount = await pricingService.retrieveMoneyAmount(
   *     moneyAmountId,
   *     {
   *       relations: ["currency"]
   *     }
   *   )
   *
   *   // do something with the money amount or return it
   * }
   * ```
   */
  retrieveMoneyAmount(
    id: string,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<MoneyAmountDTO>

  /**
   * This method is used to retrieve a paginated list of money amounts based on optional filters and configuration.
   *
   * @param {FilterableMoneyAmountProps} filters - The filtes to apply on the retrieved money amounts.
   * @param {FindConfig<MoneyAmountDTO>} config -
   * The configurations determining how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO[]>} The list of money amounts.
   *
   * @example
   *
   * To retrieve a list of money amounts using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmounts = await pricingService.listMoneyAmounts(
   *     {
   *       id: moneyAmountIds
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmounts = await pricingService.listMoneyAmounts(
   *     {
   *       id: moneyAmountIds
   *     },
   *     {
   *       relations: ["currency"]
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
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
   * async function retrieveMoneyAmounts (moneyAmountIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmounts = await pricingService.listMoneyAmounts(
   *     {
   *       id: moneyAmountIds
   *     },
   *     {
   *       relations: ["currency"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
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
   * async function retrieveMoneyAmounts (moneyAmountIds: string[], currencyCode: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmounts = await pricingService.listMoneyAmounts(
   *     {
   *       $and: [
   *         {
   *           id: moneyAmountIds
   *         },
   *         {
   *           currency_code: currencyCode
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["currency"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
   * }
   * ```
   */
  listMoneyAmounts(
    filters?: FilterableMoneyAmountProps,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  /**
   * This method is used to retrieve a paginated list of money amounts along with the total count of available money amounts satisfying the provided filters.
   *
   * @param {FilterableMoneyAmountProps} filters - The filters to apply on the retrieved money amounts.
   * @param {FindConfig<MoneyAmountDTO>} config -
   * The configurations determining how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[MoneyAmountDTO[], number]>} The list of money amounts along with their total count.
   *
   * @example
   *
   * To retrieve a list of money amounts using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
   *     {
   *       id: moneyAmountIds
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
   *     {
   *       id: moneyAmountIds
   *     },
   *     {
   *       relations: ["currency"]
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
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
   * async function retrieveMoneyAmounts (moneyAmountIds: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
   *     {
   *       id: moneyAmountIds
   *     },
   *     {
   *       relations: ["currency"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
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
   * async function retrieveMoneyAmounts (moneyAmountIds: string[], currencyCode: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
   *     {
   *       $and: [
   *         {
   *           id: moneyAmountIds
   *         },
   *         {
   *           currency_code: currencyCode
   *         }
   *       ]
   *     },
   *     {
   *       relations: ["currency"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the money amounts or return them
   * }
   * ```
   */
  listAndCountMoneyAmounts(
    filters?: FilterableMoneyAmountProps,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<[MoneyAmountDTO[], number]>

  /**
   * This method creates money amounts.
   *
   * @param {CreateMoneyAmountDTO[]} data - The money amounts to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO[]>} The list of created money amounts.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveMoneyAmounts () {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmounts = await pricingService.createMoneyAmounts([
   *     {
   *       amount: 500,
   *       currency_code: "USD",
   *     },
   *     {
   *       amount: 400,
   *       currency_code: "USD",
   *       min_quantity: 0,
   *       max_quantity: 4
   *     }
   *   ])
   *
   *   // do something with the money amounts or return them
   * }
   */
  createMoneyAmounts(
    data: CreateMoneyAmountDTO[],
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  /**
   * This method updates existing money amounts.
   *
   * @param {UpdateMoneyAmountDTO[]} data - The money amounts to update, each having the attributes that should be updated in a money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO[]>} The list of updated money amounts.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updateMoneyAmounts (moneyAmountId: string, amount: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const moneyAmounts = await pricingService.updateMoneyAmounts([
   *     {
   *       id: moneyAmountId,
   *       amount
   *     }
   *   ])
   *
   *   // do something with the money amounts or return them
   * }
   */
  updateMoneyAmounts(
    data: UpdateMoneyAmountDTO[],
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  /**
   * This method deletes money amounts by their IDs.
   *
   * @param {string[]} ids - The IDs of the money amounts to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the money amounts are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deleteMoneyAmounts (moneyAmountIds: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deleteMoneyAmounts(
   *     moneyAmountIds
   *   )
   * }
   */
  deleteMoneyAmounts(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a currency by its code and and optionally based on the provided configurations.
   *
   * @param {string} code - The code of the currency to retrieve.
   * @param {FindConfig<CurrencyDTO>} config -
   * The configurations determining how the currency is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO>} The retrieved currency.
   *
   * @example
   * A simple example that retrieves a currency by its code:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveCurrency (code: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const currency = await pricingService.retrieveCurrency(
   *     code
   *   )
   *
   *   // do something with the currency or return it
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
   * async function retrieveCurrency (code: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const currency = await pricingService.retrieveCurrency(
   *     code,
   *     {
   *       select: ["symbol_native"]
   *     }
   *   )
   *
   *   // do something with the currency or return it
   * }
   * ```
   */
  retrieveCurrency(
    code: string,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO>

  /**
   * This method is used to retrieve a paginated list of currencies based on optional filters and configuration.
   *
   * @param {FilterableCurrencyProps} filters - The filters to apply on the retrieved currencies.
   * @param {FindConfig<CurrencyDTO>} config -
   * The configurations determining how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} The list of currencies.
   *
   * @example
   *
   * To retrieve a list of currencies using their codes:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const currencies = await pricingService.listCurrencies(
   *     {
   *       code: codes
   *     },
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const currencies = await pricingService.listCurrencies(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"]
   *     }
   *   )
   *
   *   // do something with the currencies or return them
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
   * async function retrieveCurrencies (codes: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const currencies = await pricingService.listCurrencies(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   */
  listCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * This method is used to retrieve a paginated list of currencies along with the total count of available currencies satisfying the provided filters.
   *
   * @param {FilterableCurrencyProps} filters - The filters to apply on the retrieved currencies.
   * @param {FindConfig<CurrencyDTO>} config -
   * The configurations determining how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CurrencyDTO[], number]>} The list of currencies along with the total count.
   *
   * @example
   *
   * To retrieve a list of currencies using their codes:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [currencies, count] = await pricingService.listAndCountCurrencies(
   *     {
   *       code: codes
   *     },
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [currencies, count] = await pricingService.listAndCountCurrencies(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"]
   *     }
   *   )
   *
   *   // do something with the currencies or return them
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
   * async function retrieveCurrencies (codes: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [currencies, count] = await pricingService.listAndCountCurrencies(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   */
  listAndCountCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<[CurrencyDTO[], number]>

  /**
   * This method is used to create new currencies.
   *
   * @param {CreateCurrencyDTO[]} data - The currencies to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} The list of created currencies.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createCurrencies () {
   *   const pricingService = await initializePricingModule()
   *
   *   const currencies = await pricingService.createCurrencies([
   *     {
   *       code: "USD",
   *       symbol: "$",
   *       symbol_native: "$",
   *       name: "US Dollar",
   *     }
   *   ])
   *
   *   // do something with the currencies or return them
   * }
   */
  createCurrencies(
    data: CreateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * This method is used to update existing currencies with the provided data. In each currency object, the currency code must be provided to identify which currency to update.
   *
   * @param {UpdateCurrencyDTO[]} data - The currencies to update, each having the attributes that should be updated in a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} The list of updated currencies.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updateCurrencies () {
   *   const pricingService = await initializePricingModule()
   *
   *   const currencies = await pricingService.updateCurrencies([
   *     {
   *       code: "USD",
   *       symbol: "$",
   *     }
   *   ])
   *
   *   // do something with the currencies or return them
   * }
   */
  updateCurrencies(
    data: UpdateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * This method is used to delete currencies based on their currency code.
   *
   * @param {string[]} currencyCodes - Currency codes of the currencies to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves once the currencies are deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deleteCurrencies () {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deleteCurrencies(["USD"])
   *
   * }
   */
  deleteCurrencies(
    currencyCodes: string[],
    sharedContext?: Context
  ): Promise<void>

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
   * This method is used to a price set money amount rule by its ID based on the provided configuration.
   *
   * @param {string} id - The ID of the price set money amount rule to retrieve.
   * @param {FindConfig<PriceSetMoneyAmountRulesDTO>} config -
   * The configurations determining how the price set money amount rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO>} The retrieved price set money amount rule.
   *
   * @example
   * A simple example that retrieves a price set money amount rule by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmountRule (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRule = await pricingService.retrievePriceSetMoneyAmountRules(id)
   *
   *   // do something with the price set money amount rule or return it
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
   * async function retrievePriceSetMoneyAmountRule (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRule = await pricingService.retrievePriceSetMoneyAmountRules(id, {
   *     relations: ["price_set_money_amount"]
   *   })
   *
   *   // do something with the price set money amount rule or return it
   * }
   * ```
   */
  retrievePriceSetMoneyAmountRules(
    id: string,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO>

  /**
   * This method is used to retrieve a paginated list of price set money amount rules based on optional filters and configuration.
   *
   * @param {FilterablePriceSetMoneyAmountRulesProps} filters - The filters to apply on the retrieved price set money amount rules.
   * @param {FindConfig<PriceSetMoneyAmountRulesDTO>} config -
   * The configurations determining how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO[]>} The list of price set money amount rules.
   *
   * @example
   *
   * To retrieve a list of price set money amount rules using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmountRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
   *     id: [id]
   *   })
   *
   *   // do something with the price set money amount rules or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price set money amount rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmountRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
   *     id: [id]
   *   }, {
   *     relations: ["price_set_money_amount"]
   *   })
   *
   *   // do something with the price set money amount rules or return them
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
   * async function retrievePriceSetMoneyAmountRules (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
   *     id: [id]
   *   }, {
   *     relations: ["price_set_money_amount"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price set money amount rules or return them
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
   * async function retrievePriceSetMoneyAmountRules (ids: string[], ruleTypeId: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         rule_type_id: ruleTypeId
   *       }
   *     ]
   *   }, {
   *     relations: ["price_set_money_amount"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price set money amount rules or return them
   * }
   * ```
   */
  listPriceSetMoneyAmountRules(
    filters?: FilterablePriceSetMoneyAmountRulesProps,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  /**
   * This method is used to retrieve a paginated list of price set money amount rules along with the total count of
   * available price set money amount rules satisfying the provided filters.
   *
   * @param {FilterablePriceSetMoneyAmountRulesProps} filters - The filters to apply on the retrieved price set money amount rules.
   * @param {FindConfig<PriceSetMoneyAmountRulesDTO>} config -
   * The configurations determining how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceSetMoneyAmountRulesDTO[], number]>} The list of price set money amount rules and their total count.
   *
   * @example
   *
   * To retrieve a list of price set money amounts using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmountRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
   *     id: [id]
   *   })
   *
   *   // do something with the price set money amount rules or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price set money amount rules:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmountRules (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
   *     id: [id]
   *   }, {
   *     relations: ["price_set_money_amount"],
   *   })
   *
   *   // do something with the price set money amount rules or return them
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
   * async function retrievePriceSetMoneyAmountRules (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
   *     id: [id]
   *   }, {
   *     relations: ["price_set_money_amount"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price set money amount rules or return them
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
   * async function retrievePriceSetMoneyAmountRules (ids: string[], ruleTypeId: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         rule_type_id: ruleTypeId
   *       }
   *     ]
   *   }, {
   *     relations: ["price_set_money_amount"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price set money amount rules or return them
   * }
   * ```
   */
  listAndCountPriceSetMoneyAmountRules(
    filters?: FilterablePriceSetMoneyAmountRulesProps,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<[PriceSetMoneyAmountRulesDTO[], number]>

  /**
   * This method is used to retrieve a paginated list of price set money amounts based on optional filters and configuration.
   *
   * @param {FilterablePriceSetMoneyAmountProps} filters - The filters to apply on the retrieved price set money amounts.
   * @param {FindConfig<PriceSetMoneyAmountDTO>} config -
   * The configurations determining how the price set money amounts are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountDTO[]>} The list of price set money amounts.
   *
   * @example
   *
   * To retrieve a list of price set money amounts using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmounts (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
   *     id: [id]
   *   })
   *
   *   // do something with the price set money amounts or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price set money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmounts (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"]
   *   })
   *
   *   // do something with the price set money amounts or return them
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
   * async function retrievePriceSetMoneyAmounts (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price set money amounts or return them
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
   * async function retrievePriceSetMoneyAmounts (ids: string[], titles: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
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
   *   // do something with the price set money amounts or return them
   * }
   * ```
   */
  listPriceSetMoneyAmounts(
    filters?: FilterablePriceSetMoneyAmountProps,
    config?: FindConfig<PriceSetMoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountDTO[]>

  /**
   * This method is used to retrieve a paginated list of price set money amounts along with the total count of
   * available price set money amounts satisfying the provided filters.
   *
   * @param {FilterablePriceSetMoneyAmountProps} filters - The filters to apply on the retrieved price set money amounts.
   * @param {FindConfig<PriceSetMoneyAmountDTO>} config -
   * The configurations determining how the price set money amounts are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceSetMoneyAmountDTO[], number]>} The list of price set money amounts and their total count.
   *
   * @example
   *
   * To retrieve a list of price set money amounts using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmounts (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
   *     id: [id]
   *   })
   *
   *   // do something with the price set money amounts or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the price set money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function retrievePriceSetMoneyAmounts (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"],
   *   })
   *
   *   // do something with the price set money amounts or return them
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
   * async function retrievePriceSetMoneyAmounts (id: string, skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
   *     id: [id]
   *   }, {
   *     relations: ["price_rules"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the price set money amounts or return them
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
   * async function retrievePriceSetMoneyAmounts (ids: string[], titles: string[], skip: number, take: number) {
   *   const pricingService = await initializePricingModule()
   *
   *   const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
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
   *   // do something with the price set money amounts or return them
   * }
   * ```
   */
  listAndCountPriceSetMoneyAmounts(
    filters?: FilterablePriceSetMoneyAmountProps,
    config?: FindConfig<PriceSetMoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<[PriceSetMoneyAmountDTO[], number]>

  /**
   * This method is used to create new price set money amount rules. A price set money amount rule creates an association between a price set money amount and
   * a rule type.
   *
   * @param {CreatePriceSetMoneyAmountRulesDTO[]} data - The price set money amount rules to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO[]>} The list of created price set money amount rules.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function createPriceSetMoneyAmountRules (priceSetMoneyAmountId: string, ruleTypeId: string, value: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRules = await pricingService.createPriceSetMoneyAmountRules([
   *     {
   *       price_set_money_amount: priceSetMoneyAmountId,
   *       rule_type: ruleTypeId,
   *       value
   *     }
   *   ])
   *
   *   // do something with the price set money amount rules or return them
   * }
   */
  createPriceSetMoneyAmountRules(
    data: CreatePriceSetMoneyAmountRulesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  /**
   * This method is used to update price set money amount rules, each with their provided data.
   *
   * @param {UpdatePriceSetMoneyAmountRulesDTO[]} data -
   * The price set money amounts to update, each having the attributes to update in a price set money amount.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO[]>} The list of updated price set money amount rules.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function updatePriceSetMoneyAmountRules (id: string, value: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   const priceSetMoneyAmountRules = await pricingService.updatePriceSetMoneyAmountRules([
   *     {
   *       id,
   *       value
   *     }
   *   ])
   *
   *   // do something with the price set money amount rules or return them
   * }
   */
  updatePriceSetMoneyAmountRules(
    data: UpdatePriceSetMoneyAmountRulesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  /**
   * This method is used to delete price set money amount rules based on the specified IDs.
   *
   * @param {string[]} ids - The IDs of the price set money amount rules to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves once the price set money amount rules are deleted.
   *
   * @example
   * import {
   *   initialize as initializePricingModule,
   * } from "@medusajs/pricing"
   *
   * async function deletePriceSetMoneyAmountRule (id: string) {
   *   const pricingService = await initializePricingModule()
   *
   *   await pricingService.deletePriceSetMoneyAmountRules([id])
   * }
   */
  deletePriceSetMoneyAmountRules(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

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
   *   priceSetMoneyAmountId: string,
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
   *       price_set_money_amount_id: priceSetMoneyAmountId,
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
   *       relations: ["price_set_money_amounts"]
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
   *       relations: ["price_set_money_amounts"]
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
   *       relations: ["price_set_money_amounts"],
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
   *       relations: ["price_set_money_amounts"],
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
   *       relations: ["price_set_money_amounts"]
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
   *       relations: ["price_set_money_amounts"],
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
   *       relations: ["price_set_money_amounts"],
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
}
