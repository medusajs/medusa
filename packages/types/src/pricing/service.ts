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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of objects of type {@link MoneyAmountDTOs}.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of objects of type {@link MoneyAmountDTOs}, each being a created money amount.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * This method retrieves a currency by its code and optionally the provided configurations.
   *
   * @param {string} code - A string indicating the code of the currency to retrieve.
   * @param {FindConfig<CurrencyDTO>} config - 
   * An object of type {@link FindConfig} used to configure how the currency is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * To specify relations that should be retrieved within the money amounts:
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
   * @param {Context} sharedContext - An object of type {@link Context} used to share resources, such as transaction manager, with the module.
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
   * To specify relations that should be retrieved within the money amounts:
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
   * Creates new currencies based on the provided data.
   *
   * @param {PricingTypes.CreateCurrencyDTO[]} data - An array of objects containing the data to create new currencies.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.CurrencyDTO[]>} A Promise that resolves to an array of newly created currency objects.
   */
  createCurrencies(
    data: CreateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * Updates currencies with the provided data.
   *
   * @param {PricingTypes.UpdateCurrencyDTO[]} data - An array of objects containing the data to update the currencies.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.CurrencyDTO[]>} A Promise that resolves to an array of updated currency objects.
   */
  updateCurrencies(
    data: UpdateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * Deletes currencies with the specified codes.
   *
   * @param {string[]} currencyCodes - An array of string codes representing the currencies to delete.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<void>} A Promise that resolves once the currencies are deleted.
   */
  deleteCurrencies(
    currencyCodes: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * Retrieves a rule type by its ID based on the provided configuration.
   *
   * @param {string} id - The ID of the rule type to retrieve.
   * @param {FindConfig<PricingTypes.RuleTypeDTO>} [config={}] - Optional configuration for retrieving the rule type.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.RuleTypeDTO>} A Promise that resolves to the retrieved rule type object.
   */
  retrieveRuleType(
    code: string,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO>

  /**
   * Lists rule types based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterableRuleTypeProps} [filters={}] - Optional filters to apply when listing rule types.
   * @param {FindConfig<PricingTypes.RuleTypeDTO>} [config={}] - Optional configuration for listing rule types.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.RuleTypeDTO[]>} A Promise that resolves to an array containing the list of rule type objects.
   */
  listRuleTypes(
    filters?: FilterableRuleTypeProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  /**
   * Lists and counts rule types based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterableRuleTypeProps} [filters={}] - Optional filters to apply when listing rule types.
   * @param {FindConfig<PricingTypes.RuleTypeDTO>} [config={}] - Optional configuration for listing rule types.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<[PricingTypes.RuleTypeDTO[], number]>} A Promise that resolves to an array containing the list of rule type objects and the total count.
   */
  listAndCountRuleTypes(
    filters?: FilterableRuleTypeProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<[RuleTypeDTO[], number]>

  /**
   * Creates new rule types based on the provided data.
   *
   * @param {PricingTypes.CreateRuleTypeDTO[]} data - An array of objects containing the data to create new rule types.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.RuleTypeDTO[]>} A Promise that resolves to an array of newly created rule type objects.
   */
  createRuleTypes(
    data: CreateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  /**
   * Updates rule types with the provided data.
   *
   * @param {PricingTypes.UpdateRuleTypeDTO[]} data - An array of objects containing the data to update the rule types.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.RuleTypeDTO[]>} A Promise that resolves to an array of updated rule type objects.
   */
  updateRuleTypes(
    data: UpdateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  /**
   * Deletes rule types with the specified IDs.
   *
   * @param {string[]} ruleTypeIds - An array of string IDs representing the rule types to delete.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<void>} A Promise that resolves once the rule types are deleted.
   */
  deleteRuleTypes(ruleTypeIds: string[], sharedContext?: Context): Promise<void>

  /**
   * Retrieves a price set money amount rule by its ID based on the provided configuration.
   *
   * @param {string} id - The ID of the price set money amount rule to retrieve.
   * @param {FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO>} [config={}] - Optional configuration for retrieving the price set money amount rule.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceSetMoneyAmountRulesDTO>} A Promise that resolves to the retrieved price set money amount rule object.
   */
  retrievePriceSetMoneyAmountRules(
    id: string,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO>

  /**
   * Lists price set money amount rules based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterablePriceSetMoneyAmountRulesProps} [filters={}] - Optional filters to apply when listing price set money amount rules.
   * @param {FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO>} [config={}] - Optional configuration for listing price set money amount rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceSetMoneyAmountRulesDTO[]>} A Promise that resolves to an array containing the list of price set money amount rule objects.
   */
  listPriceSetMoneyAmountRules(
    filters?: FilterablePriceSetMoneyAmountRulesProps,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  /**
   * Lists and counts price set money amount rules based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterablePriceSetMoneyAmountRulesProps} [filters={}] - Optional filters to apply when listing price set money amount rules.
   * @param {FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO>} [config={}] - Optional configuration for listing price set money amount rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<[PricingTypes.PriceSetMoneyAmountRulesDTO[], number]>} A Promise that resolves to an array containing the list of price set money amount rule objects and the total count.
   */
  listAndCountPriceSetMoneyAmountRules(
    filters?: FilterablePriceSetMoneyAmountRulesProps,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<[PriceSetMoneyAmountRulesDTO[], number]>

  /**
   * Creates new price set money amount rules based on the provided data.
   *
   * @param {PricingTypes.CreatePriceSetMoneyAmountRulesDTO[]} data - An array of objects containing the data to create new price set money amount rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceSetMoneyAmountRulesDTO[]>} A Promise that resolves to an array of newly created price set money amount rule objects.
   */
  createPriceSetMoneyAmountRules(
    data: CreatePriceSetMoneyAmountRulesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  /**
   * Updates price set money amount rules with the provided data.
   *
   * @param {PricingTypes.UpdatePriceSetMoneyAmountRulesDTO[]} data - An array of objects containing the data to update the price set money amount rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceSetMoneyAmountRulesDTO[]>} A Promise that resolves to an array of updated price set money amount rule objects.
   */
  updatePriceSetMoneyAmountRules(
    data: UpdatePriceSetMoneyAmountRulesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  /**
   * Deletes price set money amount rules with the specified IDs.
   *
   * @param {string[]} ids - An array of string IDs representing the price set money amount rules to delete.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<void>} A Promise that resolves once the price set money amount rules are deleted.
   */
  deletePriceSetMoneyAmountRules(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * Retrieves a price rule by its ID
   *
   * @param {string} id - The ID of the price rule to retrieve.
   * @param {FindConfig<PricingTypes.PriceRuleDTO>} [config={}] - Optional configuration for retrieving the price rule.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceRuleDTO>} A Promise that resolves to the retrieved price rule object.
   */
  retrievePriceRule(
    id: string,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceRuleDTO>

  /**
   * Lists price rules based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterablePriceRuleProps} [filters={}] - Optional filters to apply when listing price rules.
   * @param {FindConfig<PricingTypes.PriceRuleDTO>} [config={}] - Optional configuration for listing price rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceRuleDTO[]>} A Promise that resolves to an array containing the list of price rule objects.
   */
  listPriceRules(
    filters?: FilterablePriceRuleProps,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  /**
   * Lists and counts price rules based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterablePriceRuleProps} [filters={}] - Optional filters to apply when listing price rules.
   * @param {FindConfig<PricingTypes.PriceRuleDTO>} [config={}] - Optional configuration for listing price rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<[PricingTypes.PriceRuleDTO[], number]>} A Promise that resolves to an array containing the list of price rule objects and the total count.
   */
  listAndCountPriceRules(
    filters?: FilterablePriceRuleProps,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<[PriceRuleDTO[], number]>

  /**
   * Creates new price rules based on the provided data.
   *
   * @param {PricingTypes.CreatePriceRuleDTO[]} data - An array of objects containing the data to create new price rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceRuleDTO[]>} A Promise that resolves to an array of newly created price rule objects.
   */
  createPriceRules(
    data: CreatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  /**
   * Updates price rules with the provided data.
   *
   * @param {PricingTypes.UpdatePriceRuleDTO[]} data - An array of objects containing the data to update the price rules.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.PriceRuleDTO[]>} A Promise that resolves to an array of updated price rule objects.
   */
  updatePriceRules(
    data: UpdatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  /**
   * Deletes price rules with the specified IDs.
   *
   * @param {string[]} priceRuleIds - An array of string IDs representing the price rules to delete.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<void>} A Promise that resolves once the price rules are deleted.
   */
  deletePriceRules(
    priceRuleIds: string[],
    sharedContext?: Context
  ): Promise<void>
}
