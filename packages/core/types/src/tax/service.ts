import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableTaxRateProps,
  FilterableTaxRateRuleProps,
  FilterableTaxRegionProps,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
  TaxableItemDTO,
  TaxableShippingDTO,
  TaxCalculationContext,
  TaxRateDTO,
  TaxRateRuleDTO,
  TaxRegionDTO,
} from "./common"
import {
  CreateTaxRateDTO,
  CreateTaxRateRuleDTO,
  CreateTaxRegionDTO,
  UpdateTaxRateDTO,
  UpsertTaxRateDTO,
} from "./mutations"

/**
 * The main service interface for the Tax Module.
 */
export interface ITaxModuleService extends IModuleService {
  /**
   * This method retrieves a tax by its ID.
   *
   * @param {string} taxRateId - The tax rate's ID.
   * @param {FindConfig<TaxRateDTO>} config - The configurations determining how the tax rate is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a tax rate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO>} The retrieved tax.
   *
   * @example
   * A simple example that retrieves a tax rate by its ID:
   *
   * ```ts
   * const taxRate = await taxModuleService.retrieveTaxRate("txr_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const taxRate = await taxModuleService.retrieveTaxRate("txr_123", {
   *   relations: ["tax_region"],
   * })
   * ```
   */
  retrieveTaxRate(
    taxRateId: string,
    config?: FindConfig<TaxRateDTO>,
    sharedContext?: Context
  ): Promise<TaxRateDTO>

  /**
   * This method retrieves a paginated list of tax rates based on optional filters and configuration.
   *
   * @param {FilterableTaxRateProps} filters - The filters to apply on the retrieved tax rates.
   * @param {FindConfig<TaxRateDTO>} config - The configurations determining how the tax rate is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a tax rate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO[]>} The list of tax rates.
   *
   * @example
   * To retrieve a list of tax rates using their IDs:
   *
   * ```ts
   * const taxRates = await taxModuleService.listTaxRates({
   *   id: ["txr_123", "txr_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the tax rate:
   *
   * ```ts
   * const taxRates = await taxModuleService.listTaxRates(
   *   {
   *     id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     relations: ["tax_region"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const taxRates = await taxModuleService.listTaxRates(
   *   {
   *     id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     relations: ["tax_region"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listTaxRates(
    filters?: FilterableTaxRateProps,
    config?: FindConfig<TaxRateDTO>,
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  /**
   * This method retrieves a paginated list of tax rates along with the total count of available tax rates satisfying the provided filters.
   *
   * @param {FilterableTaxRateProps} filters - The filters to apply on the retrieved tax rates.
   * @param {FindConfig<TaxRateDTO>} config - The configurations determining how the tax rate is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a tax rate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[TaxRateDTO[], number]>} The list of tax rates along with their total count.
   *
   * @example
   * To retrieve a list of tax rates using their IDs:
   *
   * ```ts
   * const [taxRates, count] = await taxModuleService.listAndCountTaxRates(
   *   {
   *     id: ["txr_123", "txr_321"],
   *   }
   * )
   * ```
   *
   * To specify relations that should be retrieved within the tax rate:
   *
   * ```ts
   * const [taxRates, count] = await taxModuleService.listAndCountTaxRates(
   *   {
   *     id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     relations: ["tax_region"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [taxRates, count] = await taxModuleService.listAndCountTaxRates(
   *   {
   *     id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     relations: ["tax_region"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountTaxRates(
    filters?: FilterableTaxRateProps,
    config?: FindConfig<TaxRateDTO>,
    sharedContext?: Context
  ): Promise<[TaxRateDTO[], number]>

  /**
   * This method creates tax rates.
   *
   * @param {CreateTaxRateDTO[]} data - The tax rates to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO[]>} The created tax rates.
   *
   * @example
   * const taxRates = await taxModuleService.createTaxRates([
   *   {
   *     tax_region_id: "txreg_123",
   *     name: "Default rate",
   *     rate: 10,
   *   },
   *   {
   *     tax_region_id: "txreg_123",
   *     name: "Custom rate",
   *     rate: 15,
   *     rules: [
   *       {
   *         reference: "product_type",
   *         reference_id: "ptyp_1",
   *       },
   *       {
   *         reference: "product",
   *         reference_id: "prod_123",
   *       },
   *     ],
   *   },
   * ])
   */
  createTaxRates(
    data: CreateTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  /**
   * This method creates a tax rate.
   *
   * @param {CreateTaxRateDTO} data - The tax rate to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO>} The created tax rate.
   *
   * @example
   * const taxRate = await taxModuleService.createTaxRates({
   *   tax_region_id: "txreg_123",
   *   name: "Default rate",
   *   rate: 10,
   * })
   */
  createTaxRates(
    data: CreateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO>

  /**
   * This method updates an existing tax rate.
   *
   * @param {string} taxRateId - The tax rate's ID.
   * @param {UpdateTaxRateDTO} data - The attributes to update in the tax rate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO>} The updated tax rate.
   *
   * @example
   * const taxRate = await taxModuleService.updateTaxRates("txr_123", {
   *   rate: 10,
   * })
   */
  updateTaxRates(
    taxRateId: string,
    data: UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO>

  /**
   * This method updates existing tax rates.
   *
   * @param {string[]} taxRateIds - The IDs of tax rates to update.
   * @param {UpdateTaxRateDTO} data - The attributes to update in the tax rate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO[]>} The updated tax rates.
   *
   * @example
   * const taxRates = await taxModuleService.updateTaxRates(
   *   ["txr_123", "txr_321"],
   *   {
   *     rate: 10,
   *   }
   * )
   */
  updateTaxRates(
    taxRateIds: string[],
    data: UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  /**
   * This method updates existing tax rates matching the specified filters.
   *
   * @param {FilterableTaxRateProps} selector - The filters specifying which tax rates to update.
   * @param {UpdateTaxRateDTO} data - The attributes to update in the tax rate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO[]>} The updated tax rates.
   *
   * @example
   * const taxRates = await taxModuleService.updateTaxRates(
   *   {
   *     id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     rate: 10,
   *   }
   * )
   */
  updateTaxRates(
    selector: FilterableTaxRateProps,
    data: UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  /**
   * This method updates or creates a tax rate if it doesn't exist.
   *
   * @param {UpsertTaxRateDTO} data - The attributes in the tax rate to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO>} The created or updated tax rate.
   *
   * @example
   * const taxRate = await taxModuleService.upsertTaxRates({
   *   id: "txr_123",
   *   rate: 10,
   * })
   */
  upsertTaxRates(
    data: UpsertTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO>

  /**
   * This method updates or creates tax rates if they don't exist.
   *
   * @param {UpsertTaxRateDTO[]} data - The attributes in the tax rates to be created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateDTO[]>} The created or updated tax rates.
   *
   * @example
   * const taxRates = await taxModuleService.upsertTaxRates([
   *   {
   *     id: "txr_123",
   *     rate: 10,
   *   },
   * ])
   */
  upsertTaxRates(
    data: UpsertTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  /**
   * This method deletes tax rates by their IDs.
   *
   * @param {string[]} taxRateIds - The IDs of tax rates to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the tax rates are deleted successfully.
   *
   * @example
   * await taxModuleService.deleteTaxRates(["txr_123", "txr_321"])
   */
  deleteTaxRates(taxRateIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a tax rate by its ID.
   *
   * @param {string} taxRateId - The tax rate's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the tax rate is deleted successfully.
   *
   * @example
   * await taxModuleService.deleteTaxRates("txr_123")
   */
  deleteTaxRates(taxRateId: string, sharedContext?: Context): Promise<void>

  /**
   * This method restores soft deleted tax rates by their IDs.
   *
   * @param {string[]} taxRateIds - The IDs of the tax rates.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the tax. You can pass to its `returnLinkableKeys`
   * property any of the tax rate's relation attribute names, such as `rules`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated rules.
   * The object's keys are the ID attribute names of the tax rate entity's relations, such as `rule_id`,
   * and its value is an array of strings, each being the ID of the record associated with the tax rate through this relation,
   * such as the IDs of associated rules.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await taxModuleService.restoreTaxRates(["txr_123", "txr_321"])
   */
  restoreTaxRates<TReturnableLinkableKeys extends string = string>(
    taxRateIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method creates a tax region.
   *
   * @param {CreateTaxRegionDTO} data - The tax region to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRegionDTO>} The created tax region.
   *
   * @example
   * const taxRegion = await taxModuleService.createTaxRegions({
   *   country_code: "us",
   * })
   */
  createTaxRegions(
    data: CreateTaxRegionDTO,
    sharedContext?: Context
  ): Promise<TaxRegionDTO>

  /**
   * This method creates tax regions.
   *
   * @param {CreateTaxRegionDTO[]} data - The tax regions to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRegionDTO[]>} The created tax regions.
   *
   * @example
   * const taxRegions = await taxModuleService.createTaxRegions([
   *   {
   *     country_code: "us",
   *   },
   *   {
   *     country_code: "gb",
   *   },
   * ])
   */
  createTaxRegions(
    data: CreateTaxRegionDTO[],
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  /**
   * This method deletes tax regions by their IDs.
   *
   * @param {string[]} taxRegionIds - The IDs of the tax regions.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the tax regions are deleted.
   *
   * @example
   * await taxModuleService.deleteTaxRegions([
   *   "txreg_123",
   *   "txreg_321",
   * ])
   */
  deleteTaxRegions(
    taxRegionIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes a tax region by its ID.
   *
   * @param {string} taxRegionId - The tax region's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the tax region is successfully deleted.
   *
   * @example
   * await taxModuleService.deleteTaxRegions("txreg_123")
   */
  deleteTaxRegions(taxRegionId: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a paginated list of tax regions based on optional filters and configuration.
   *
   * @param {FilterableTaxRegionProps} filters - The filters to apply on the retrieved tax regions.
   * @param {FindConfig<TaxRegionDTO>} config - The configurations determining how the tax region is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a tax region.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRegionDTO[]>} The list of tax regions.
   *
   * @example
   * To retrieve a list of tax regions using their IDs:
   *
   * ```ts
   * const taxRegions = await taxModuleService.listTaxRegions({
   *   id: ["txreg_123", "txreg_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the tax region:
   *
   * ```ts
   * const taxRegions = await taxModuleService.listTaxRegions(
   *   {
   *     id: ["txreg_123", "txreg_321"],
   *   },
   *   {
   *     relations: ["tax_rates"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const taxRegions = await taxModuleService.listTaxRegions(
   *   {
   *     id: ["txreg_123", "txreg_321"],
   *   },
   *   {
   *     relations: ["tax_rates"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listTaxRegions(
    filters?: FilterableTaxRegionProps,
    config?: FindConfig<TaxRegionDTO>,
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  /**
   * This method creates a tax rate rule.
   *
   * @param {CreateTaxRateRuleDTO} data - The tax rate rule to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateRuleDTO>} The created tax rate rule.
   *
   * @example
   * const taxRateRule = await taxModuleService.createTaxRateRules(
   *   {
   *     reference: "product_type",
   *     reference_id: "ptyp_123",
   *     tax_rate_id: "txr_123",
   *   }
   * )
   */
  createTaxRateRules(
    data: CreateTaxRateRuleDTO,
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO>

  /**
   * This method creates tax rate rules.
   *
   * @param {CreateTaxRateRuleDTO[]} data - The tax rate rules to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateRuleDTO[]>} The created tax rate rules.
   *
   * @example
   * const taxRateRules =
   *   await taxModuleService.createTaxRateRules([
   *     {
   *       reference: "product_type",
   *       reference_id: "ptyp_123",
   *       tax_rate_id: "txr_123",
   *     },
   *     {
   *       reference: "product",
   *       reference_id: "prod_123",
   *       tax_rate_id: "txr_321",
   *     },
   *   ])
   */
  createTaxRateRules(
    data: CreateTaxRateRuleDTO[],
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO[]>

  /**
   * This method deletes a tax rate rule by its ID.
   *
   * @param {string} taxRateRuleId - The tax rate rule's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the tax rate rule is deleted successfully.
   *
   * @example
   * await taxModuleService.deleteTaxRateRules("txrule_123")
   */
  deleteTaxRateRules(
    taxRateRuleId: string,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes tax rate rules by their IDs.
   *
   * @param {string[]} taxRateRuleIds - The tax rate rules' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the tax rate rules are deleted successfully.
   *
   * @example
   * await taxModuleService.deleteTaxRateRules([
   *   "txrule_123",
   *   "txrule_321",
   * ])
   */
  deleteTaxRateRules(
    taxRateRuleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of tax rate rules based on optional filters and configuration.
   *
   * @param {FilterableTaxRateRuleProps} filters - The filters to apply on the retrieved tax rate rules.
   * @param {FindConfig<TaxRateRuleDTO>} config - The configurations determining how the tax rate rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a tax rate rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TaxRateRuleDTO[]>} The list of tax rate rules.
   *
   * @example
   * To retrieve a list of tax rate rules using their associated tax rate's ID:
   *
   * ```ts
   * const taxRateRules = await taxModuleService.listTaxRateRules({
   *   tax_rate_id: ["txr_123", "txr_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the tax rate rule:
   *
   * ```ts
   * const taxRateRules = await taxModuleService.listTaxRateRules(
   *   {
   *     tax_rate_id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     relations: ["tax_rate"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const taxRateRules = await taxModuleService.listTaxRateRules(
   *   {
   *     tax_rate_id: ["txr_123", "txr_321"],
   *   },
   *   {
   *     relations: ["tax_rate"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listTaxRateRules(
    filters?: FilterableTaxRateRuleProps,
    config?: FindConfig<TaxRateRuleDTO>,
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO[]>

  /**
   * This method retrieves tax lines for taxable items and shipping methods in a cart.
   *
   * Learn more in [this guide](https://docs.medusajs.com/experimental/tax/tax-calculation-with-provider/).
   *
   * @param {(TaxableItemDTO | TaxableShippingDTO)[]} items - The items and shipping methods to retrieve their tax lines.
   * @param {TaxCalculationContext} calculationContext - The context to pass to the underlying tax provider. It provides more
   * details that are useful to provide accurate tax lines.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>} The item and shipping methods' tax lines.
   *
   * @example
   * const taxLines = await taxModuleService.getTaxLines(
   *   [
   *     {
   *       id: "cali_123",
   *       product_id: "prod_123",
   *       unit_price: 1000,
   *       quantity: 1,
   *     },
   *     {
   *       id: "casm_123",
   *       shipping_option_id: "so_123",
   *       unit_price: 2000,
   *     },
   *   ],
   *   {
   *     address: {
   *       country_code: "us",
   *     },
   *   }
   * )
   */
  getTaxLines(
    items: (TaxableItemDTO | TaxableShippingDTO)[],
    calculationContext: TaxCalculationContext,
    sharedContext?: Context
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>

  /**
   * This method soft deletes tax raes by their IDs.
   *
   * @param {string[]} taxRateIds - The IDs of the tax rates.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated rules.
   * The object's keys are the ID attribute names of the tax rate entity's relations, such as `rule_id`, and its value is an array of strings, each being the ID of a record associated
   * with the tax rate through this relation, such as the IDs of associated rules.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await taxModuleService.softDeleteTaxRates(["txr_123", "txr_321"])
   */
  softDeleteTaxRates<TReturnableLinkableKeys extends string = string>(
    taxRateIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method soft deletes tax regions by their IDs.
   *
   * @param {string[]} taxRegionIds - The IDs of the tax regions.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated tax rates.
   * The object's keys are the ID attribute names of the tax region entity's relations, such as `tax_rate_id`, and its value is an array of strings, each being the ID of a record associated
   * with the tax region through this relation, such as the IDs of associated tax rates.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await taxModuleService.softDeleteTaxRegions([
   *   "txreg_123",
   *   "txreg_321",
   * ])
   */
  softDeleteTaxRegions<TReturnableLinkableKeys extends string = string>(
    taxRegionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted tax regions by their IDs.
   *
   * @param {string[]} taxRegionIds - The IDs of the tax regions.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the tax. You can pass to its `returnLinkableKeys`
   * property any of the tax region's relation attribute names, such as `tax_rates`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated tax rates.
   * The object's keys are the ID attribute names of the tax region entity's relations, such as `tax_rate_id`,
   * and its value is an array of strings, each being the ID of the record associated with the tax region through this relation,
   * such as the IDs of associated tax rates.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await taxModuleService.restoreTaxRegions([
   *   "txreg_123",
   *   "txreg_321",
   * ])
   */
  restoreTaxRegions<TReturnableLinkableKeys extends string = string>(
    taxRegionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method soft deletes tax rate rules by their IDs.
   *
   * @param {string[]} taxRateRuleIds - The IDs of the tax rate rules.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await taxModuleService.softDeleteTaxRateRules([
   *   "txrule_123",
   *   "txrule_321",
   * ])
   */
  softDeleteTaxRateRules<TReturnableLinkableKeys extends string = string>(
    taxRateRuleIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted tax rate rules by their IDs.
   *
   * @param {string[]} taxRateRuleIds - The IDs of the tax rate rules.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the tax. You can pass to its `returnLinkableKeys`
   * property any of the tax rate rule's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await taxModuleService.restoreTaxRateRules([
   *   "txrule_123",
   *   "txrule_321",
   * ])
   */
  restoreTaxRateRules<TReturnableLinkableKeys extends string = string>(
    taxRateRuleIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
