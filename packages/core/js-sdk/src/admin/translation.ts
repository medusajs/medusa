import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Translation {
  /**
   * @ignore
   */
  private client: Client

  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves a paginated list of translations. It sends a request to the
   * [List Translations](https://docs.medusajs.com/api/admin#translations_gettranslations)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of translations.
   *
   * @example
   * To retrieve the list of translations:
   *
   * ```ts
   * sdk.admin.translation.list()
   * .then(({ translations, count, limit, offset }) => {
   *   console.log(translations)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.translation.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ translations, count, limit, offset }) => {
   *   console.log(translations)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each translation:
   *
   * ```ts
   * sdk.admin.translation.list({
   *   fields: "id,name"
   * })
   * .then(({ translations, count, limit, offset }) => {
   *   console.log(translations)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminTranslationsListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationsListResponse>(
      `/admin/translations`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method allows bulk operations on translations. It sends a request to the
   * [Manage Translations](https://docs.medusajs.com/api/admin#translations_posttranslationsbatch)
   * API route.
   *
   * @param payload - The translations to create, update, or delete.
   * @param headers - Headers to pass in the request.
   * @returns The translations' details.
   *
   * @example
   * sdk.admin.translation.batch({
   *   create: [
   *     {
   *       reference_id: "prod_123",
   *       reference: "product",
   *       locale_code: "en-US",
   *       translations: { title: "Shirt" }
   *     }
   *   ],
   *   update: [
   *     {
   *       id: "trans_123",
   *       translations: { title: "Pants" }
   *     }
   *   ],
   *   delete: ["trans_321"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  async batch(body: HttpTypes.AdminBatchTranslations, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminTranslationsBatchResponse>(
      `/admin/translations/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method retrieves the settings for the translations for a given entity type or all entity types if no entity type is provided.
   * It sends a request to the
   * [Get Translation Settings](https://docs.medusajs.com/api/admin#translations_gettranslationssettings) API route.
   *
   * @param query - The query parameters which can optionally include the entity type to get the settings for and whether to get the settings for active/inactive entities only.
   * @param headers - Headers to pass in the request.
   * @returns The translation settings.
   *
   * @example
   * To retrieve the settings for the translations for a given entity type:
   *
   * ```ts
   * sdk.admin.translation.settings({
   *   entity_type: "product"
   * })
   * .then(({ translation_settings }) => {
   *   console.log(translation_settings)
   * })
   * ```
   *
   * To retrieve the settings for all entity types:
   *
   * ```ts
   * sdk.admin.translation.settings()
   * .then(({ translation_settings }) => {
   *   console.log(translation_settings)
   * })
   * ```
   *
   * To retrieve the settings for active entities only:
   *
   * ```ts
   * sdk.admin.translation.settings({
   *   is_active: true
   * })
   * .then(({ translation_settings }) => {
   *   console.log(translation_settings)
   * })
   * ```
   *
   * To retrieve the settings for inactive entities only:
   *
   * ```ts
   * sdk.admin.translation.settings({
   *   is_active: false
   * })
   * .then(({ translation_settings }) => {
   *   console.log(translation_settings)
   * })
   * ```
   */
  async settings(
    query?: HttpTypes.AdminTranslationSettingsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationSettingsResponse>(
      `/admin/translations/settings`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method allows bulk operations on translation settings. It sends a request to the
   * [Batch Translation Settings](https://docs.medusajs.com/api/admin#translations_posttranslationssettingsbatch)
   * API route.
   *
   * @since 2.12.6
   *
   * @param body - The translation settings to create, update, or delete.
   * @param headers - Headers to pass in the request.
   * @returns The translation settings' details.
   *
   * @example
   * sdk.admin.translation.batchSettings({
   *   create: [
   *     {
   *       entity_type: "product",
   *       fields: ["title", "description"],
   *       is_active: true
   *     }
   *   ],
   *   update: [
   *     {
   *       id: "trset_123",
   *       fields: ["title", "description", "subtitle"],
   *       is_active: true
   *     }
   *   ],
   *   delete: ["trset_456"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   * ```
   */
  async batchSettings(
    body: HttpTypes.AdminBatchTranslationSettings,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchTranslationSettingsResponse>(
      `/admin/translations/settings/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method retrieves a paginated list of entities for a given entity type with only their
   * translatable fields.
   * It sends a request to the
   * [Get Translation Entities](https://docs.medusajs.com/api/admin#translations_gettranslationentities) API route.
   *
   * @since 2.12.4
   *
   * @param query - The query parameters including the entity type and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of entities with their translatable fields.
   *
   * @example
   * To retrieve the entities for a given entity type:
   *
   * ```ts
   * sdk.admin.translation.entities({
   *   type: "product"
   * })
   * .then(({ data, count, offset, limit }) => {
   *   console.log(data)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.translation.entities({
   *   type: "product",
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ data, count, offset, limit }) => {
   *   console.log(data)
   * })
   * ```
   */
  async entities(
    query: HttpTypes.AdminTranslationEntitiesParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationEntitiesResponse>(
      `/admin/translations/entities`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves the statistics for the translations for a given entity type or all entity types if no entity type is provided.
   * It sends a request to the
   * [Get Translation Statistics](https://docs.medusajs.com/api/admin#translations_gettranslationsstatistics) API route.
   *
   * @param query - The query parameters which can optionally include the entity type to get the statistics for.
   * @param headers - Headers to pass in the request.
   * @returns The translation statistics.
   *
   * @example
   * To retrieve the statistics for the translations for a given entity type:
   *
   * ```ts
   * sdk.admin.translation.statistics({
   *   entity_type: "product"
   * })
   * .then(({ statistics }) => {
   *   console.log(statistics)
   * })
   * ```
   *
   * To retrieve the statistics for all entity types:
   *
   * ```ts
   * sdk.admin.translation.statistics()
   * .then(({ statistics }) => {
   *   console.log(statistics)
   * })
   * ```
   */
  async statistics(
    query?: HttpTypes.AdminTranslationStatisticsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTranslationStatisticsResponse>(
      `/admin/translations/statistics`,
      {
        headers,
        query,
      }
    )
  }
}
