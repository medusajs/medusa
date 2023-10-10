import {
  AddPricesDTO,
  AddRulesDTO,
  CalculatedPriceSetDTO,
  CreateCurrencyDTO,
  CreateMoneyAmountDTO,
  CreatePriceRuleDTO,
  CreatePriceSetDTO,
  CreatePriceSetMoneyAmountRulesDTO,
  CreateRuleTypeDTO,
  CurrencyDTO,
  FilterableCurrencyProps,
  FilterableMoneyAmountProps,
  FilterablePriceRuleProps,
  FilterablePriceSetMoneyAmountRulesProps,
  FilterablePriceSetProps,
  FilterableRuleTypeProps,
  MoneyAmountDTO,
  PriceRuleDTO,
  PriceSetDTO,
  PriceSetMoneyAmountRulesDTO,
  PricingContext,
  PricingFilters,
  RemovePriceSetRulesDTO,
  RuleTypeDTO,
  UpdateCurrencyDTO,
  UpdateMoneyAmountDTO,
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
   * @param {PricingContext} filters - An object of type {@link PricingFilters} used to filter the price sets.
   * @param {PricingContext} context - An object of type {@link PricingContext} to select prices. For example, the pricing context can specify the currency code to calculate prices in.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CalculatedPriceSetDTO>} A promise that resolves to an object of type {@link CalculatedPriceSetDTO} which includes the calculated prices.
   * 
   * @example
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
   */
  calculatePrices(
    filters: PricingFilters,
    context?: PricingContext,
    sharedContext?: Context
  ): Promise<CalculatedPriceSetDTO>

  /**
   * This method is used to retrieves a price set by its ID.
   *
   * @param {string} id - A string indicating the ID of the price set to retrieve.
   * @param {FindConfig<PriceSetDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price set is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} A promise that resolves to an object of type {@link PriceSetDTO} which is the retrieved price set.
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
   * @param {FilterablePriceSetProps} filters - An object of type {@link FilterablePriceSetProps} that is used to filter the retrieved price lists.
   * @param {FindConfig<PriceSetDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetDTO}.
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
   * @param {FilterablePriceSetProps} filters - An object of type {@link FilterablePriceSetProps} that is used to filter the retrieved price lists.
   * @param {FindConfig<PriceSetDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceSetDTO[], number]>} A promise that resolves to an array having two items, the first item is an array of objects of type {@link PriceSetDTO}, 
   * and the second item is a number indicating the total count.
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
   * @param {CreatePriceSetDTO} data - An object of type {@link CreatePriceSetDTO} that holds the attribute of the price set to create.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} A promise that resolves to an object of type {@link PriceSetDTO}, which is the created price set.
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
   * @param {CreatePriceSetDTO[]} data - An array of objects of type {@link CreatePriceSetDTO}, where each object holds the attribute of a price set to create.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetDTO}, which are the created price sets.
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
   * @param {UpdatePriceSetDTO[]} data - An array of objects of type {@link UpdatePriceSetDTO}, each holding the data of the price sets to update.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetDTOs}, which are the updated price sets.
   */
  update(
    data: UpdatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * This method remove rules from a price set.
   * 
   * @param {RemovePriceSetRulesDTO[]} data - An array of objects of type {@link RemovePriceSetRulesDTO}, each specfiying which rules to remove.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves when rules are successfully removed.
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
   * @param {string[]} ids - An array of strings, each being the ID for a price set to delete.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves when the price sets are successfully deleted.
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
   * @param {AddPricesDTO} data - An object of type {@link AddPricesDTO} that holds the data necessary to add the prices.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} A promise that resolves to an object of type {@link PriceSetDTO}, which is the price set that the prices belong to.
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
   * @param {AddPricesDTO[]} data - An array of objects of type {@link AddPricesDTO}, each holding the data necessary to add the prices to the price set.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetDTO}, each being a price list that prices were added to.
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
   * @param {AddRulesDTO} data - An object of type {@link AddRulesDTO} that holds the necessary data to add rules to a price set.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO>} A promise that resolves to an object of type {@link PriceSetDTO}, which is the price set that the rules belong to.
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
   * @param {AddRulesDTO[]} data - An array of objects of type {@link AddRulesDTO}, each holding the necessary data to add rules to a price set.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetDTO}, each being the price set that rules were added to.
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
   * An object of type {@link MoneyAmountDTO} used to configure how a money amount is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a money amount.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO>} A promise that resolves to an object of type {@link MoneyAmountDTO} which is the retrieved money amount.
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
   * @param {FilterableMoneyAmountProps} filters - An object of type {@link FilterableMoneyAmountProps} that is used to filter the retrieved money amounts.
   * @param {FindConfig<MoneyAmountDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a money amount.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of objects of type {@link MoneyAmountDTO}.
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
   * @param {FilterableMoneyAmountProps} filters - An object of type {@link FilterableMoneyAmountProps} that is used to filter the retrieved money amounts.
   * @param {FindConfig<MoneyAmountDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a money amount.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[MoneyAmountDTO[], number]>} A promise that resolves to an array having two items, the first item is an array of objects of type {@link MoneyAmountDTO}, 
   * and the second item is a number indicating the total count.
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
   * @param {CreateMoneyAmountDTO[]} data - An array of objects of type {@link CreateMoneyAmountDTO} that holds the necessary data to create the money amount.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of objects of type {@link MoneyAmountDTO}, each being a created money amount.
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
   * @param {UpdateMoneyAmountDTO[]} data - An array of objects of type {@link UpdateMoneyAmountDTO}, each holding data to update in a money amount.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of objects of type {@link MoneyAmountDTO}, each being a updated money amount.
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
   * @param {string[]} ids - An array of strings, each being the ID of a money amount to delete.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves when the money amounts are successfully deleted.
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
   * @param {string} code - A string indicating the code of the currency to retrieve.
   * @param {FindConfig<CurrencyDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the currency is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO>} A promise that resolves to an object of type {@link CurrencyDTO}.
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
   * @param {FilterableCurrencyProps} filters - An object of type {@link FilterableCurrencyProps} that is used to filter the retrieved currencies.
   * @param {FindConfig<CurrencyDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} A promise that resolves to an array of objects of type {@link CurrencyDTO}.
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
   * @param {FilterableCurrencyProps} filters - An object of type {@link FilterableCurrencyProps} that is used to filter the retrieved currencies.
   * @param {FindConfig<CurrencyDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CurrencyDTO[], number]>} A promise that resolves to an array having two items, the first item is an array of objects of type {@link CurrencyDTO}, 
   * and the second item is a number indicating the total count.
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
   * @param {CreateCurrencyDTO[]} data - An array of objects of type {@link CreateCurrencyDTO}, each object holding the data of a currency to create.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} A promise that resolves to an array of objects of type {@link CurrencyDTO}, each object being a created currency.
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
   * @param {UpdateCurrencyDTO[]} data - An array of objects of type {@link UpdateCurrencyDTO}, each object containing data to be updated in a currency.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} A promise that resolves to an array of objects of type {@link CurrencyDTO}, each object being an updated currency.
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
   * @param {string[]} currencyCodes - An array of strings, each being a code of a currency to delete.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves once the currencies are deleted.
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
   * An object of type {@link FindConfig} used to configure how the rule type is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a rule type.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO>} A promise that resolves to an object of type {@link RuleTypeDTO}.
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
    code: string,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO>

  /**
   * This method is used to retrieve a paginated list of rule types based on optional filters and configuration.
   *
   * @param {FilterableRuleTypeProps} filters - An object of type {@link FilterableRuleTypeProps} that is used to filter the retrieved rule types.
   * @param {FindConfig<RuleTypeDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a rule type.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO[]>} A promise that resolves to an array of objects of type {@link RuleTypeDTO}.
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
   * @param {FilterableRuleTypeProps} filters - An object of type {@link FilterableRuleTypeProps} that is used to filter the retrieved rule types.
   * @param {FindConfig<RuleTypeDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a rule type.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RuleTypeDTO[], number]>} A promise that resolves to an array having two items, the first item is an array of objects of type {@link RuleTypeDTO}, 
   * and the second item is a number indicating the total count.
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
   * @param {CreateRuleTypeDTO[]} data - An array of objects of type {@link CreateRuleTypeDTO}, each being the data to use to create a rule type.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO[]>} A promise that resolves to an array of objects of type {@link RuleTypeDTO}, each being a created rule type.
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
   * @param {UpdateRuleTypeDTO[]} data - An array of objects of type {@link UpdateRuleTypeDTO}, each object containing data to be updated in a rule type.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RuleTypeDTO[]>} A promise that resolves to an array of objects of type {@link RuleTypeDTO}, each being an updated rule type.
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
   * @param {string[]} ruleTypeIds - An array of strings, each being the ID of a rule type to delete.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves once the rule types are deleted.
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
   * @param {string} id - A string indicating the ID of the price set money amount rule to retrieve.
   * @param {FindConfig<PriceSetMoneyAmountRulesDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price set money amount rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO>} A promise that resolves to an object of type {@link PriceSetMoneyAmountRulesDTO}.
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
   * @param {FilterablePriceSetMoneyAmountRulesProps} filters - 
   * An object of type {@link FilterablePriceSetMoneyAmountRulesProps} that is used to filter the retrieved price set money amount rules.
   * @param {FindConfig<PriceSetMoneyAmountRulesDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetMoneyAmountRulesDTO}.
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
   * @param {FilterablePriceSetMoneyAmountRulesProps} filters - 
   * An object of type {@link FilterablePriceSetMoneyAmountRulesProps} that is used to filter the retrieved price set money amount rules.
   * @param {FindConfig<PriceSetMoneyAmountRulesDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price set money amount rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PriceSetMoneyAmountRulesDTO[], number]>} A promise that resolves to an array having two items, the first item is an array of objects of type {@link PriceSetMoneyAmountRulesDTO}, 
   * and the second item is a number indicating the total count.
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
   * This method is used to create new price set money amount rules. A price set money amount rule creates an association between a price set money amount and
   * a rule type.
   *
   * @param {CreatePriceSetMoneyAmountRulesDTO[]} data - 
   * An array of objects of type {@link CreatePriceSetMoneyAmountRulesDTO}, each containing the data of a price set money amount rule to create.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetMoneyAmountRulesDTO}, each being
   * a created price set money amount rule.
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
   * An array of objects of type {@link UpdatePriceSetMoneyAmountRulesDTO}, each containing the data to update in a price set money amount rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceSetMoneyAmountRulesDTO[]>} A promise that resolves to an array of objects of type {@link PriceSetMoneyAmountRulesDTO}, each being the
   * updated price set money amount rule.
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
   * @param {string[]} ids - An array of strings, each representing the ID of a price set money amount rule to delete.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves once the price set money amount rules are deleted.
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
   * An object of type {@link FindConfig} used to configure how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO>} A promise that resolves to an object of type {@link PriceRuleDTO}.
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
   * @param {FilterablePriceRuleProps} filters - 
   * An object of type {@link FilterablePriceRuleProps} that is used to filter the retrieved price rules.
   * @param {FindConfig<PriceRuleDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} A promise that resolves to an array of objects of type {@link PriceRuleDTO}.
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
   * @param {FilterablePriceRuleProps} filters - 
   * An object of type {@link FilterablePriceRuleProps} that is used to filter the retrieved price rules.
   * @param {FindConfig<PriceRuleDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a price rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} A promise that resolves to an array of objects of type {@link PriceRuleDTO}.
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
   * @param {CreatePriceRuleDTO[]} data - An array of objects of type {@link CreatePriceRuleDTO}, each containing the data necessary to create a price rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} A promise that resolves to an array of objects of type {@link PriceRuleDTO}, each being a created price rule.
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
   * @param {UpdatePriceRuleDTO[]} data - An array of objects of type {@link UpdatePriceRuleDTO}, each containing the data to update in a price rule.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PriceRuleDTO[]>} A promise that resolves to an array of objects of type {@link PriceRuleDTO}, each being an updated price rule.
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
   * @param {string[]} priceRuleIds - An array of strings, each being the ID of a price rule to delete.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} A promise that resolves once the price rules are deleted.
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
}
