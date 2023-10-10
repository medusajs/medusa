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
  __joinerConfig(): ModuleJoinerConfig

  /**
   * Calculates prices based on the provided filters and context.
   *
   * @async
   * @param {PricingFilters} filters - PriceSet filters
   * @param {PricingContext=} context - Optional pricing context to select prices.
   * @param {Context=} sharedContext - Optional shared context.
   * @returns {Promise<CalculatedPriceSetDTO>} A promise that resolves to the calculated prices.
   */
  calculatePrices(
    filters: PricingFilters,
    context?: PricingContext,
    sharedContext?: Context
  ): Promise<CalculatedPriceSetDTO>

  /**
   * Retrieves a priceSet by its ID.
   *
   * @async
   * @param {string} id - The ID of the priceSet to retrieve.
   * @param {FindConfig<PriceSetDTO>=} config - Optional configuration for the retrieval.
   * @param {Context=} sharedContext - Optional shared context.
   * @returns {Promise<PriceSetDTO>} A promise that resolves to a PriceSetDTO.
   */
  retrieve(
    id: string,
    config?: FindConfig<PriceSetDTO>,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  /**
   * Lists price sets based on optional filters and configuration.
   *
   * @async
   * @param {FilterablePriceSetProps=} filters - Optional filters to narrow down the list.
   * @param {FindConfig<PriceSetDTO>=} config - Optional configuration.
   * @param {Context=} sharedContext - Optional shared context.
   * @returns {Promise<PriceSetDTO[]>} A promise that resolves to an array of PriceSetDTOs.
   */
  list(
    filters?: FilterablePriceSetProps,
    config?: FindConfig<PriceSetDTO>,
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * List priceSets and provide the total count.
   * @param filters - Optional filters for listing.
   * @param config - Optional configuration.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to an array of PriceSetDTOs and a count.
   */
  listAndCount(
    filters?: FilterablePriceSetProps,
    config?: FindConfig<PriceSetDTO>,
    sharedContext?: Context
  ): Promise<[PriceSetDTO[], number]>

  /**
   * Create a new priceSet.
   * @param data - Data for creating a priceSet.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to the created PriceSetDTO.
   */
  create(data: CreatePriceSetDTO, sharedContext?: Context): Promise<PriceSetDTO>

  /**
   * Create multiple new priceSets.
   * @param data - Array of data for creating priceSets.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to an array of created PriceSetDTOs.
   */
  create(
    data: CreatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * Update existing priceSets.
   * @param data - Array of data for updating priceSets.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to an array of updated PriceSetDTOs.
   */
  update(
    data: UpdatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * Remove rules from priceSet.
   * @param data - Array of data for removing priceSet rules.
   * @param sharedContext - Optional shared context.
   * @returns A promise that resolves when rules are successfully removed.
   */
  removeRules(
    data: RemovePriceSetRulesDTO[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * Delete priceSets by their IDs.
   *
   * @param ids - An array of IDs for priceSets to delete.
   * @param sharedContext - Optional shared context.
   * @returns A promise that resolves when the price sets are successfully deleted.
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * Add prices to a price set.
   *
   * @param data - Data for adding prices to a price set.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to the updated PriceSetDTO.
   */
  addPrices(data: AddPricesDTO, sharedContext?: Context): Promise<PriceSetDTO>

  /**
   * Add prices to multiple price sets.
   *
   * @param data - An array of data for adding prices to price sets.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to an array of updated PriceSetDTOs.
   */
  addPrices(
    data: AddPricesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  /**
   * Add rules to a price set.
   *
   * @param data - Data for adding rules to a price set.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to the updated PriceSetDTO.
   */
  addRules(data: AddRulesDTO, sharedContext?: Context): Promise<PriceSetDTO>

  /**
   * Add rules to multiple price sets.
   *
   * @param data - An array of data for adding rules to price sets.
   * @param sharedContext - Optional shared context.
   * @returns A promise resolving to an array of updated PriceSetDTOs.
   */
  addRules(data: AddRulesDTO[], sharedContext?: Context): Promise<PriceSetDTO[]>

  /**
   * Retrieves a money amount by its ID.
   *
   * @param {string} id - The ID of the money amount to retrieve.
   * @param {FindConfig<MoneyAmountDTO>=} config - Optional configuration for the retrieval operation.
   * @param sharedContext - Optional shared context.
   * @returns {Promise<MoneyAmountDTO>} A promise that resolves to a MoneyAmountDTO.
   */
  retrieveMoneyAmount(
    id: string,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<MoneyAmountDTO>

  /**
   * Lists money amounts based on optional filters and configuration.
   *
   * @param {FilterableMoneyAmountProps=} filters - Optional filters to narrow down the list.
   * @param {FindConfig<MoneyAmountDTO>=} config - Optional configuration for the listing operation.
   * @param sharedContext - Optional shared context.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of MoneyAmountDTOs.
   */
  listMoneyAmounts(
    filters?: FilterableMoneyAmountProps,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  /**
   * Lists money amounts based on optional filters and configuration and provides the total count.
   *
   * @param {FilterableMoneyAmountProps=} filters - Optional filters to narrow down the list.
   * @param {FindConfig<MoneyAmountDTO>=} config - Optional configuration for the listing operation.
   * @param sharedContext - Optional shared context.
   * @returns {Promise<[MoneyAmountDTO[], number]>} A promise that resolves to an array of MoneyAmountDTOs and the total count.
   */
  listAndCountMoneyAmounts(
    filters?: FilterableMoneyAmountProps,
    config?: FindConfig<MoneyAmountDTO>,
    sharedContext?: Context
  ): Promise<[MoneyAmountDTO[], number]>

  /**
   * Creates new money amounts based on the provided data.
   *
   * @param {CreateMoneyAmountDTO[]} data - An array of data objects for creating money amounts.
   * @param sharedContext - Optional shared context.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of created MoneyAmountDTOs.
   */
  createMoneyAmounts(
    data: CreateMoneyAmountDTO[],
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  /**
   * Updates existing money amounts based on the provided data.
   *
   * @param {UpdateMoneyAmountDTO[]} data - An array of data objects for updating money amounts.
   * @param sharedContext - Optional shared context.
   * @returns {Promise<MoneyAmountDTO[]>} A promise that resolves to an array of updated MoneyAmountDTOs.
   */
  updateMoneyAmounts(
    data: UpdateMoneyAmountDTO[],
    sharedContext?: Context
  ): Promise<MoneyAmountDTO[]>

  /**
   * Deletes money amounts by their IDs.
   *
   * @param {string[]} ids - An array of IDs for money amounts to delete.
   * @param sharedContext - Optional shared context.
   * @returns {Promise<void>} A promise that resolves when the money amounts are successfully deleted.
   */
  deleteMoneyAmounts(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * Retrieves a currency by its code based on the provided configuration.
   *
   * @param {string} code - The code of the currency to retrieve.
   * @param {FindConfig<PricingTypes.CurrencyDTO>} [config={}] - Optional configuration for retrieving the currency.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.CurrencyDTO>} A Promise that resolves to the retrieved currency object.
   */
  retrieveCurrency(
    code: string,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO>

  /**
   * Lists currencies based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterableCurrencyProps} [filters={}] - Optional filters to apply when listing currencies.
   * @param {FindConfig<PricingTypes.CurrencyDTO>} [config={}] - Optional configuration for listing currencies.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<PricingTypes.CurrencyDTO[]>} A Promise that resolves to an array containing the list of currency objects.
   */
  listCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * Lists and counts currencies based on the provided filters and configuration.
   *
   * @param {PricingTypes.FilterableCurrencyProps} [filters={}] - Optional filters to apply when listing currencies.
   * @param {FindConfig<PricingTypes.CurrencyDTO>} [config={}] - Optional configuration for listing currencies.
   * @param {Context} [sharedContext={}] - An optional shared MedusaContext object.
   * @returns {Promise<[PricingTypes.CurrencyDTO[], number]>} A Promise that resolves to an array containing the list of currency objects and the total count.
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
