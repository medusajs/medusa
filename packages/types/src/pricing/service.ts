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

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"

export interface IPricingModuleService {
  __joinerConfig(): ModuleJoinerConfig

  /**
 * Calculates prices based on the provided filters and context.
 *
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
 * 
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
 * 
 * @param data - Data for creating a priceSet.
 * @param sharedContext - Optional shared context.
 * @returns A promise resolving to the created PriceSetDTO.
 */
  create(
    data: CreatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

/**
 * Create multiple new priceSets.
 * 
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
 * 
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
 * 
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

  retrieveCurrency(
    code: string,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO>

  listCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  listAndCountCurrencies(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<[CurrencyDTO[], number]>

  createCurrencies(
    data: CreateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  updateCurrencies(
    data: UpdateCurrencyDTO[],
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  deleteCurrencies(
    currencyCodes: string[],
    sharedContext?: Context
  ): Promise<void>
  retrieveRuleType(
    code: string,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO>

  listRuleTypes(
    filters?: FilterableRuleTypeProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  listAndCountRuleTypes(
    filters?: FilterableRuleTypeProps,
    config?: FindConfig<RuleTypeDTO>,
    sharedContext?: Context
  ): Promise<[RuleTypeDTO[], number]>

  createRuleTypes(
    data: CreateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  updateRuleTypes(
    data: UpdateRuleTypeDTO[],
    sharedContext?: Context
  ): Promise<RuleTypeDTO[]>

  deleteRuleTypes(ruleTypeIds: string[], sharedContext?: Context): Promise<void>

  retrievePriceSetMoneyAmountRules(
    id: string,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO>

  listPriceSetMoneyAmountRules(
    filters?: FilterablePriceSetMoneyAmountRulesProps,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  listAndCountPriceSetMoneyAmountRules(
    filters?: FilterablePriceSetMoneyAmountRulesProps,
    config?: FindConfig<PriceSetMoneyAmountRulesDTO>,
    sharedContext?: Context
  ): Promise<[PriceSetMoneyAmountRulesDTO[], number]>

  createPriceSetMoneyAmountRules(
    data: CreatePriceSetMoneyAmountRulesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  updatePriceSetMoneyAmountRules(
    data: UpdatePriceSetMoneyAmountRulesDTO[],
    sharedContext?: Context
  ): Promise<PriceSetMoneyAmountRulesDTO[]>

  deletePriceSetMoneyAmountRules(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  retrievePriceRule(
    id: string,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceRuleDTO>

  listPriceRules(
    filters?: FilterablePriceRuleProps,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  listAndCountPriceRules(
    filters?: FilterablePriceRuleProps,
    config?: FindConfig<PriceRuleDTO>,
    sharedContext?: Context
  ): Promise<[PriceRuleDTO[], number]>

  createPriceRules(
    data: CreatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  updatePriceRules(
    data: UpdatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<PriceRuleDTO[]>

  deletePriceRules(
    priceRuleIds: string[],
    sharedContext?: Context
  ): Promise<void>
}
