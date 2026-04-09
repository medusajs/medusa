import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableLocaleProps,
  FilterableTranslationProps,
  FilterableTranslationSettingsProps,
  LocaleDTO,
  TranslationDTO,
  TranslationSettingsDTO,
  TranslationStatisticsInput,
  TranslationStatisticsOutput,
} from "./common"
import {
  CreateLocaleDTO,
  CreateTranslationDTO,
  CreateTranslationSettingsDTO,
  UpdateLocaleDTO,
  UpdateLocaleDataDTO,
  UpdateTranslationDTO,
  UpdateTranslationDataDTO,
  UpdateTranslationSettingsDTO,
} from "./mutations"

/**
 * The main service interface for the Translation Module.
 *
 * @privateRemarks
 * Method signatures match what MedusaService generates.
 */
export interface ITranslationModuleService extends IModuleService {
  /**
   * This method retrieves a locale by its ID.
   *
   * @param {string} id - The ID of the locale.
   * @param {FindConfig<LocaleDTO>} config - The configurations determining how the locale is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a locale.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LocaleDTO>} The retrieved locale.
   *
   * @example
   * A simple example that retrieves a locale by its ID:
   *
   * ```ts
   * const locale = await translationModuleService.retrieveLocale("loc_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * :::note
   *
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   *
   * :::
   *
   * ```ts
   * const locale = await translationModuleService.retrieveLocale("loc_123", {
   *   relations: ["translations"],
   * })
   * ```
   */
  retrieveLocale(
    id: string,
    config?: FindConfig<LocaleDTO>,
    sharedContext?: Context
  ): Promise<LocaleDTO>

  /**
   * This method retrieves a paginated list of locales based on optional filters and configuration.
   *
   * @param {FilterableLocaleProps} filters - The filters to apply on the retrieved locales.
   * @param {FindConfig<LocaleDTO>} config - The configurations determining how the locale is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a locale.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LocaleDTO[]>} The list of locales.
   *
   * @example
   * To retrieve a list of locales using their IDs:
   *
   * ```ts
   * const locales = await translationModuleService.listLocales({
   *   id: ["loc_123", "loc_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the locales:
   *
   * :::note
   *
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   *
   * :::
   *
   * ```ts
   * const locales = await translationModuleService.listLocales(
   *   {
   *     id: ["loc_123", "loc_321"],
   *   },
   *   {
   *     relations: ["translations"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const locales = await translationModuleService.listLocales(
   *   {
   *     id: ["loc_123", "loc_321"],
   *   },
   *   {
   *     relations: ["translations"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listLocales(
    filters?: FilterableLocaleProps,
    config?: FindConfig<LocaleDTO>,
    sharedContext?: Context
  ): Promise<LocaleDTO[]>

  /**
   * This method retrieves a paginated list of locales along with the total count.
   *
   * @param {FilterableLocaleProps} filters - The filters to apply on the retrieved locales.
   * @param {FindConfig<LocaleDTO>} config - The configurations determining how the locale is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a locale.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[LocaleDTO[], number]>} The list of locales along with their total count.
   *
   * @example
   * To retrieve a list of locales using their IDs:
   *
   * ```ts
   * const [locales, count] = await translationModuleService.listAndCountLocales({
   *   id: ["loc_123", "loc_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the locales:
   *
   * :::note
   *
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   *
   * :::
   *
   * ```ts
   * const [locales, count] = await translationModuleService.listAndCountLocales(
   *   {
   *     id: ["loc_123", "loc_321"],
   *   },
   *   {
   *     relations: ["translations"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [locales, count] = await translationModuleService.listAndCountLocales(
   *   {
   *     id: ["loc_123", "loc_321"],
   *   },
   *   {
   *     relations: ["translations"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountLocales(
    filters?: FilterableLocaleProps,
    config?: FindConfig<LocaleDTO>,
    sharedContext?: Context
  ): Promise<[LocaleDTO[], number]>

  /**
   * This method creates a locale.
   *
   * @param {CreateLocaleDTO} data - The locale to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LocaleDTO>} The created locale.
   *
   * @example
   * const locale = await translationModuleService.createLocales({
   *   code: "en-US",
   *   name: "English (United States)",
   * })
   */
  createLocales(
    data: CreateLocaleDTO,
    sharedContext?: Context
  ): Promise<LocaleDTO>

  /**
   * This method creates locales.
   *
   * @param {CreateLocaleDTO[]} data - The locales to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LocaleDTO[]>} The created locales.
   *
   * @example
   * const locales = await translationModuleService.createLocales([
   *   {
   *     code: "en-US",
   *     name: "English (United States)",
   *   },
   *   {
   *     code: "fr-FR",
   *     name: "French (France)",
   *   },
   * ])
   */
  createLocales(
    data: CreateLocaleDTO[],
    sharedContext?: Context
  ): Promise<LocaleDTO[]>

  /**
   * This method updates an existing locale. The ID should be included in the data object.
   *
   * @param {UpdateLocaleDTO} data - The attributes to update in the locale (including id).
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LocaleDTO>} The updated locale.
   *
   * @example
   * const locale = await translationModuleService.updateLocales({
   *   id: "loc_123",
   *   name: "English (United States)",
   * })
   */
  updateLocales(
    data: UpdateLocaleDTO,
    sharedContext?: Context
  ): Promise<LocaleDTO>

  /**
   * This method updates existing locales either by ID or by a selector.
   *
   * @param {UpdateLocaleDTO[] | { selector: Record<string, any>; data: UpdateLocaleDTO | UpdateLocaleDTO[] }} dataOrOptions - The data or options for bulk update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<LocaleDTO[]>} The updated locales.
   *
   * @example
   * To update locales by their IDs:
   *
   * ```ts
   * const locales = await translationModuleService.updateLocales([
   *   {
   *     id: "loc_123",
   *     name: "English (United States)",
   *   },
   *  {
   *     id: "loc_321",
   *     name: "French (France)",
   *   },
   * ])
   * ```
   *
   * To update locales by a selector:
   *
   * ```ts
   * const locales = await translationModuleService.updateLocales({
   *   selector: {
   *     code: "en-US",
   *   },
   *   data: {
   *     name: "English (United States)",
   *   },
   * })
   * ```
   */
  updateLocales(
    dataOrOptions:
      | UpdateLocaleDTO[]
      | {
          /**
           * The selector to update the locales by.
           */
          selector: Record<string, any>
          /**
           * The data to update the locales with.
           */
          data: UpdateLocaleDataDTO | UpdateLocaleDataDTO[]
        },
    sharedContext?: Context
  ): Promise<LocaleDTO[]>

  /**
   * This method deletes locales by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects with IDs identifying the locales to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the locales are deleted.
   *
   * @example
   * await translationModuleService.deleteLocales(["loc_123", "loc_321"])
   */
  deleteLocales(
    primaryKeyValues: string | object | string[] | object[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes locales by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the locales to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await translationModuleService.softDeleteLocales(["loc_123", "loc_321"])
   */
  softDeleteLocales<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted locales by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects identifying the locales to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the locale. You can pass to its `returnLinkableKeys`
   * property any of the locale's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were restored.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await translationModuleService.restoreLocales(["loc_123", "loc_321"])
   */
  restoreLocales<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves a translation by its ID.
   *
   * @param {string} id - The ID of the translation.
   * @param {FindConfig<TranslationDTO>} config - The configurations determining how the translation is retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationDTO>} The retrieved translation.
   *
   * @example
   * A simple example that retrieves a translation by its ID:
   *
   * ```ts
   * const translation = await translationModuleService.retrieveTranslation("tra_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * :::note
   *
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   *
   * :::
   *
   * ```ts
   * const translation = await translationModuleService.retrieveTranslation("tra_123", {
   *   relations: ["locale"],
   * })
   * ```
   */
  retrieveTranslation(
    id: string,
    config?: FindConfig<TranslationDTO>,
    sharedContext?: Context
  ): Promise<TranslationDTO>

  /**
   * This method retrieves a paginated list of translations based on optional filters and configuration.
   *
   * @param {FilterableTranslationProps} filters - The filters to apply on the retrieved translations.
   * @param {FindConfig<TranslationDTO>} config - The configurations determining how the locale is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a locale.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationDTO[]>} The list of translations.
   *
   * @example
   * To retrieve a list of translations using their IDs:
   *
   * ```ts
   * const translations = await translationModuleService.listTranslations({
   *   id: ["tra_123", "tra_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the translations:
   *
   * :::note
   *
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   *
   * :::
   *
   * ```ts
   * const translations = await translationModuleService.listTranslations(
   *   {
   *     id: ["tra_123", "tra_321"],
   *   },
   *   {
   *     relations: ["locale"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const translations = await translationModuleService.listTranslations(
   *   {
   *     id: ["tra_123", "tra_321"],
   *   },
   *   {
   *     relations: ["locale"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listTranslations(
    filters?: FilterableTranslationProps,
    config?: FindConfig<TranslationDTO>,
    sharedContext?: Context
  ): Promise<TranslationDTO[]>

  /**
   * This method retrieves a paginated list of translations along with the total count.
   *
   * @param {FilterableTranslationProps} filters - The filters to apply on the retrieved translations.
   * @param {FindConfig<TranslationDTO>} config - The configurations determining how the locale is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a locale.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[TranslationDTO[], number]>} The list of translations along with their total count.
   *
   * @example
   * To retrieve a list of translations using their IDs:
   *
   * ```ts
   * const [translations, count] = await translationModuleService.listAndCountTranslations({
   *   id: ["tra_123", "tra_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the translations:
   *
   * :::note
   *
   * You can only retrieve data models defined in the same module. To retrieve linked data models
   * from other modules, use [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) instead.
   *
   * :::
   *
   * ```ts
   * const [translations, count] = await translationModuleService.listAndCountTranslations(
   *   {
   *     id: ["tra_123", "tra_321"],
   *   },
   *   {
   *     relations: ["locale"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [translations, count] = await translationModuleService.listAndCountTranslations(
   *   {
   *     id: ["tra_123", "tra_321"],
   *   },
   *   {
   *     relations: ["locale"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountTranslations(
    filters?: FilterableTranslationProps,
    config?: FindConfig<TranslationDTO>,
    sharedContext?: Context
  ): Promise<[TranslationDTO[], number]>

  /**
   * This method creates a translation.
   *
   * @param {CreateTranslationDTO} data - The translation to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationDTO>} The created translation.
   *
   * @example
   * const translation = await translationModuleService.createTranslations({
   *   reference_id: "prod_123",
   *   reference: "product",
   *   locale_code: "fr-FR",
   *   translations: {
   *     title: "Titre du produit",
   *     description: "Description du produit en français",
   *   },
   * })
   */
  createTranslations(
    data: CreateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationDTO>

  /**
   * This method creates translations.
   *
   * @param {CreateTranslationDTO[]} data - The translations to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationDTO[]>} The created translations.
   *
   * @example
   * const translations = await translationModuleService.createTranslations([
   *   {
   *     reference_id: "prod_123",
   *     reference: "product",
   *     locale_code: "fr-FR",
   *     translations: {
   *       title: "Titre du produit",
   *       description: "Description du produit en français",
   *     },
   *   },
   *   {
   *     reference_id: "prod_123",
   *     reference: "product",
   *     locale_code: "de-DE",
   *     translations: {
   *       title: "Produkt Titel",
   *       description: "Produktbeschreibung auf Deutsch",
   *     },
   *   }
   * ])
   */
  createTranslations(
    data: CreateTranslationDTO[],
    sharedContext?: Context
  ): Promise<TranslationDTO[]>

  /**
   * This method updates an existing translation. The ID should be included in the data object.
   *
   * @param {UpdateTranslationDTO} data - The attributes to update in the translation (including id).
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationDTO>} The updated translation.
   *
   * @example
   * const translation = await translationModuleService.updateTranslations({
   *   id: "tra_123",
   *   translations: {
   *     title: "Titre du produit",
   *     description: "Description du produit en français",
   *   },
   * })
   */
  updateTranslations(
    data: UpdateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationDTO>

  /**
   * This method updates existing translations using an array or selector-based approach.
   *
   * @param {UpdateTranslationDTO[] | { selector: Record<string, any>; data: UpdateTranslationDTO | UpdateTranslationDTO[] }} dataOrOptions - The data or options for bulk update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationDTO[]>} The updated translations.
   *
   * @example
   * const translations = await translationModuleService.updateTranslations([
   *   {
   *     id: "tra_123",
   *     translations: {
   *       title: "Titre du produit",
   *       description: "Description du produit en français",
   *     },
   *   },
   * ])
   */
  updateTranslations(
    dataOrOptions:
      | UpdateTranslationDTO[]
      | {
          /**
           * The selector to update the translations by.
           */
          selector: Record<string, any>
          /**
           * The data to update the translations with.
           */
          data: UpdateTranslationDataDTO | UpdateTranslationDataDTO[]
        },
    sharedContext?: Context
  ): Promise<TranslationDTO[]>

  /**
   * This method deletes translations by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects with IDs identifying the translations to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the translations are deleted.
   *
   * @example
   * await translationModuleService.deleteTranslations("tra_123")
   */
  deleteTranslations(
    primaryKeyValues: string | object | string[] | object[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method soft deletes translations by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects with IDs identifying the translations to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await translationModuleService.softDeleteTranslations(["tra_123", "tra_321"])
   */
  softDeleteTranslations<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted translations by their IDs or objects.
   *
   * @param {string | object | string[] | object[]} primaryKeyValues - The IDs or objects with IDs identifying the translations to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the translation. You can pass to its `returnLinkableKeys`
   * property any of the translation's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await translationModuleService.restoreTranslations(["tra_123", "tra_321"])
   */
  restoreTranslations<TReturnableLinkableKeys extends string = string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method retrieves translation statistics for the specified entities and locales.
   * It's useful to understand the translation coverage of different entities across various locales.
   *
   * You can use this method to get insights into how many fields are translated, missing translations,
   * and the expected number of translations based on the entities and locales provided.
   *
   * @param {TranslationStatisticsInput} input - The entities and locales to check.
   * @param {Context} sharedContext
   * @returns {Promise<TranslationStatisticsOutput>} Statistics by entity.
   *
   * @example
   * const [,count] = await productModuleService.listAndCountProducts()
   * const [,variantCount] = await productVariantModuleService.listAndCountProductVariants()
   * const stats = await translationModuleService.getStatistics({
   *   locales: ["en-US", "fr-FR"],
   *   entities: {
   *     product: { count }, // for example, 2 products
   *     product_variant: { count: variantCount },
   *   }
   * })
   * // Returns:
   * // {
   * //   product: {
   * //     expected: 20, // 2 products × 5 fields × 2 locales
   * //     translated: 15,
   * //     missing: 5,
   * //     by_locale: {
   * //       "en-US": { expected: 10, translated: 8, missing: 2 },
   * //       "fr-FR": { expected: 10, translated: 7, missing: 3 }
   * //     }
   * //   }
   * // }
   */
  getStatistics(
    input: TranslationStatisticsInput,
    sharedContext?: Context
  ): Promise<TranslationStatisticsOutput>

  /**
   * This method retrieves the translatable fields of a resource from the database.
   * For example, product entities have translatable fields such as `title` and `description`.
   *
   * @param {string} entityType - Name of the resource's table to get translatable fields for.
   * If not provided, returns all translatable fields for all entity types. For example, `product` or `product_variant`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]>>} A mapping of resource names to their translatable fields.
   *
   * @example
   * To get translatable fields for all resources:
   *
   * ```ts
   * const allFields = await translationModuleService.getTranslatableFields()
   * // Returns: { product: ["title", "description", ...], product_variant: ["title", ...] }
   * ```
   *
   * To get translatable fields for a specific resource:
   *
   * ```ts
   * const productFields = await translationModuleService.getTranslatableFields("product")
   * // Returns: { product: ["title", "description", "subtitle", "status"] }
   * ```
   */
  getTranslatableFields(
    entityType?: string,
    sharedContext?: Context
  ): Promise<Record<string, string[]>>

  /**
   * This method retrieves the inactive translatable fields of a resource from the database.
   * For example, whenever a merchant disables a fields as translatable, it is added to the inactive translatable fields, so they
   * can later be re-enabled.
   *
   * @param {string} entityType - Name of the resource's table to get inactive translatable fields for.
   * If not provided, returns all inactive translatable fields for all entity types. For example, `product` or `product_variant`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]>>} A mapping of resource names to their inactive translatable fields.
   *
   * @example
   * To get inactive translatable fields for all resources:
   *
   * ```ts
   * const allInactiveFields = await translationModuleService.getInactiveTranslatableFields()
   * // Returns: { product: ["subtitle"], product_variant: ["material"] }
   * ```
   *
   * To get inactive translatable fields for a specific resource:
   *
   * ```ts
   * const productInactiveFields = await translationModuleService.getInactiveTranslatableFields("product")
   * // Returns: { product: ["subtitle"] }
   * ```
   */
  getInactiveTranslatableFields(
    entityType?: string,
    sharedContext?: Context
  ): Promise<Record<string, string[]>>

  /**
   * This method creates a translation setting.
   *
   * @param {CreateTranslationSettingsDTO} data - The translation setting to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationSettingsDTO>} The created translation setting.
   *
   * @example
   * const translationSetting = await translationModuleService.createTranslationSettings({
   *     entity_type: "product",
   *     fields: ["title", "description"],
   *     is_active: true,
   *   })
   */
  createTranslationSettings(
    data: CreateTranslationSettingsDTO,
    sharedContext?: Context
  ): Promise<TranslationSettingsDTO>

  /**
   *
   * @param data - The translation settings to be created.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationSettingsDTO[]>} The created translation settings.
   *
   * @example
   * const translationSettings = await translationModuleService.createTranslationSettings([
   *   {
   *     entity_type: "product",
   *     fields: ["title", "description"],
   *     is_active: true,
   *   },
   * ])
   */
  createTranslationSettings(
    data: CreateTranslationSettingsDTO[],
    sharedContext?: Context
  ): Promise<TranslationSettingsDTO[]>

  /**
   * This method updates an existent translation setting. The ID should be included in the data object.
  }
   * @param {UpdateTranslationSettingsDTO} data - The attributes to update in the translation setting (including id).
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationSettingsDTO>} The updated translation setting.
   *
   * @example
   * const translationSettings = await translationModuleService.updateTranslationSettings([
   *   {
   *     id: "ts_123",
   *     entity_type: "product_collection",
   *     fields: ["title"],
   *     is_active: true,
   *   },
   * ])
   */
  updateTranslationSettings(
    data: UpdateTranslationSettingsDTO,
    sharedContext?: Context
  ): Promise<TranslationSettingsDTO>

  /**
   * This method updates one or more existent translation settings.
   * @param {UpdateTranslationSettingsDTO[]} data - The translation settings to update.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationSettingsDTO[]>} The updated translation settings.
   *
   * @example
   * const translationSettings = await translationModuleService.updateTranslationSettings([
   *   {
   *     id: "ts_123",
   *     entity_type: "product_collection",
   *     fields: ["title"],
   *     is_active: true,
   *   },
   * ])
   */
  updateTranslationSettings(
    data: UpdateTranslationSettingsDTO[],
    sharedContext?: Context
  ): Promise<TranslationSettingsDTO[]>

  /**
   * This method deletes one or more translation settings.
   *
   * @param {string[]} input - The IDs of the translation settings to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the translation settings are deleted.
   *
   * @example
   * await translationModuleService.deleteTranslationSettings([
   *   "ts_123",
   *   "ts_321",
   * ])
   */
  deleteTranslationSettings(
    input: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of translation settings based on optional filters and configuration.
   *
   * @param {FilterableTranslationSettingsProps} filters - The filters to apply on the retrieved translation settings.
   * @param {FindConfig<TranslationSettingsDTO>} config - The configurations determining how the translation settings are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a translation settings.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationSettingsDTO[]>} The list of translation settings.
   *
   * @example
   * const translationSettings = await translationModuleService.listTranslationSettings({
   *   entity_type: "product",
   *   is_active: true,
   * })
   * // Returns: [
   * //   {
   * //     id: "ts_123",
   * //     entity_type: "product",
   * //     fields: ["title", "description"],
   * //     is_active: true,
   * //   },
   * // ]
   */
  listTranslationSettings(
    filters?: FilterableTranslationSettingsProps,
    config?: FindConfig<TranslationSettingsDTO>,
    sharedContext?: Context
  ): Promise<TranslationSettingsDTO[]>

  /**
   * This method retrieves a paginated list of translation settings based on optional filters and configuration, along with the total count.
   *
   * @param {FilterableTranslationSettingsProps} filters - The filters to apply on the retrieved translation settings.
   * @param {FindConfig<TranslationSettingsDTO>} config - The configurations determining how the translation settings are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a translation settings.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[TranslationSettingsDTO[], number]>} The list of translation settings along with their total count.
   *
   * @example
   * const [translationSettings, count] = await translationModuleService.listAndCountTranslationSettings({
   *   entity_type: "product",
   *   is_active: true,
   * })
   * // Returns: [
   * //   [
   * //     {
   * //       id: "ts_123",
   * //       entity_type: "product",
   * //       fields: ["title", "description"],
   * //       is_active: true,
   * //     },
   * //   ],
   * //   1,
   * // ]
   */
  listAndCountTranslationSettings(
    filters?: FilterableTranslationSettingsProps,
    config?: FindConfig<TranslationSettingsDTO>,
    sharedContext?: Context
  ): Promise<[TranslationSettingsDTO[], number]>

  /**
   * This method retrieves a translation setting by its ID.
   *
   * @param {string} id - The ID of the translation setting to retrieve.
   * @param {FindConfig<TranslationSettingsDTO>} config - The configurations determining how the translation setting is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a translation settings.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<TranslationSettingsDTO>} The retrieved translation setting.
   *
   * @example
   * const translationSetting = await translationModuleService.retrieveTranslationSettings("ts_123")
   * // Returns: {
   * //   id: "ts_123",
   * //   entity_type: "product",
   * //   fields: ["title", "description"],
   * //   is_active: true,
   * // }
   */
  retrieveTranslationSettings(
    id: string,
    config?: FindConfig<TranslationSettingsDTO>,
    sharedContext?: Context
  ): Promise<TranslationSettingsDTO>
}
