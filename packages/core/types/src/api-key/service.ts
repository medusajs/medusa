import { IModuleService } from "../modules-sdk"
import { ApiKeyDTO, FilterableApiKeyProps } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import {
  CreateApiKeyDTO,
  RevokeApiKeyDTO,
  UpdateApiKeyDTO,
  UpsertApiKeyDTO,
} from "./mutations"

/**
 * The main service interface for the Api Key Module.
 */
export interface IApiKeyModuleService extends IModuleService {
  /**
   * This method creates API keys.
   *
   * @param {CreateApiKeyDTO[]} data - The API keys to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO[]>} The created API keys.
   *
   * @example
   * const apiKey = await apiKeyModuleService.createApiKeys([{
   *   title: "Development API key",
   *   type: "publishable",
   *   created_by: "user_123"
   * }])
   */
  createApiKeys(
    data: CreateApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * This method creates an API key.
   *
   * @param {CreateApiKeyDTO} data - The API key to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO>} The created API key.
   *
   * @example
   * const apiKey = await apiKeyModuleService.createApiKeys({
   *   title: "Development API key",
   *   type: "publishable",
   *   created_by: "user_123"
   * })
   */
  createApiKeys(
    data: CreateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * This method updates or creates API keys if they don't exist.
   *
   * @param {UpsertApiKeyDTO[]} data - The attributes in the API keys that are created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO[]>} The created or updated API keys.
   *
   * @example
   * const apiKey = await apiKeyModuleService.upsertApiKeys([
   *   {
   *     id: "apk_123",
   *     title: "My development key",
   *   },
   *   {
   *     title: "New development key",
   *     type: "secret",
   *     created_by: "user_123",
   *   },
   * ])
   */
  upsertApiKeys(
    data: UpsertApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * This method updates or creates an API key if it doesn't exist.
   *
   * @param {UpsertApiKeyDTO} data - The attributes in the API key that's created or updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO>} The created or updated API key.
   *
   * @example
   * const apiKey = await apiKeyModuleService.upsertApiKeys({
   *   id: "apk_123",
   *   title: "My development key"
   * })
   */
  upsertApiKeys(
    data: UpsertApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * This method updates an existing API key.
   *
   * @param {string} id - The ID of the API key.
   * @param {UpdateApiKeyDTO} data - The attributes to update in the API key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO>} The updated API key.
   *
   * @example
   * const apiKey = await apiKeyModuleService.updateApiKeys("apk_123", {
   *   title: "My development key"
   * })
   */
  updateApiKeys(
    id: string,
    data: UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * This method updates existing API keys.
   *
   * @param {FilterableApiKeyProps} selector - The filters that specify which API keys should be updated.
   * @param {UpdateApiKeyDTO} data - The attributes to update in the API keys.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO[]>} The updated API keys.
   *
   * @example
   * const apiKey = await apiKeyModuleService.updateApiKeys(
   *   {
   *     title: "Development key",
   *   },
   *   {
   *     title: "My development key",
   *   }
   * )
   */
  updateApiKeys(
    selector: FilterableApiKeyProps,
    data: UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * This method deletes API keys by their IDs.
   *
   * @param {string[]} ids - The IDs of the API keys.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the API keys are deleted successfully.
   *
   * @example
   * await apiKeyModuleService.deleteApiKeys(["apk_123"])
   */
  deleteApiKeys(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes an API key by its ID.
   *
   * @param {string} id - The ID of the API key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the API key is deleted successfully.
   *
   * @example
   * await apiKeyModuleService.deleteApiKeys("apk_123")
   */
  deleteApiKeys(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves an API key by its ID.
   *
   * @param {string} id - The ID of the API key.
   * @param {FindConfig<ApiKeyDTO>} config - The configurations determining how the API key is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a api key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO>} The retrieved API key.
   *
   * @example
   * const apiKey = await apiKeyModuleService.retrieveApiKey("apk_123")
   */
  retrieveApiKey(
    id: string,
    config?: FindConfig<ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * This method retrieves a paginated list of API keys based on optional filters and configuration.
   *
   * @param {FilterableApiKeyProps} filters - The filters to apply on the retrieved API keys.
   * @param {FindConfig<ApiKeyDTO>} config - The configurations determining how the API key is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a API key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO[]>} The list of API keys.
   *
   * @example
   * To retrieve a list of API keys using their IDs:
   *
   * ```ts
   * const apiKeys = await apiKeyModuleService.listApiKeys({
   *   id: ["apk_123", "apk_321"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const apiKeys = await apiKeyModuleService.listApiKeys(
   *   {
   *     id: ["apk_123", "apk_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listApiKeys(
    filters?: FilterableApiKeyProps,
    config?: FindConfig<ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * This method retrieves a paginated list of API keys along with the total count of available API keys satisfying the provided filters.
   *
   * @param {FilterableApiKeyProps} filters - The filters to apply on the retrieved API keys.
   * @param {FindConfig<ApiKeyDTO>} config - The configurations determining how the api API is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a API key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ApiKeyDTO[], number]>} The list of API keys along with their total count.
   *
   * @example
   * To retrieve a list of API keys using their IDs:
   *
   * ```ts
   * const [apiKeys, count] =
   * await apiKeyModuleService.listAndCountApiKeys({
   *   id: ["apk_123", "apk_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [apiKeys, count] =
   *   await apiKeyModuleService.listAndCountApiKeys(
   *     {
   *       id: ["apk_123", "apk_321"],
   *     },
   *     {
   *       take: 15,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountApiKeys(
    filters?: FilterableApiKeyProps,
    config?: FindConfig<ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<[ApiKeyDTO[], number]>

  /**
   * This method revokes API keys based on the filters provided.
   *
   * @param {FilterableApiKeyProps} selector - The filters to specify which API keys should be revoked.
   * @param {RevokeApiKeyDTO} data - The details of revoking the API keys.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO[]>} The revoked API keys.
   *
   * @example
   * const apiKey = await apiKeyModuleService.revoke(
   *   {
   *     id: "apk_123",
   *   },
   *   {
   *     revoked_by: "user_123",
   *     // 1 minute
   *     revoke_in: 60,
   *   }
   * )
   */
  revoke(
    selector: FilterableApiKeyProps,
    data: RevokeApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * This method revokes an API key based on the ID provided.
   *
   * @param {string} id - The ID of the API key to revoke.
   * @param {RevokeApiKeyDTO} data - The details of revoking the API key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO>} The revoked API key.
   *
   * @example
   * const apiKey = await apiKeyModuleService.revoke("apk_123", {
   *   revoked_by: "user_123",
   *   // 1 minute
   *   revoke_in: 60,
   * })
   */
  revoke(
    id: string,
    data: RevokeApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * This method verifies whether a token is valid, considering it authenticated.
   *
   * @param {string} token - The token to verify.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<false | ApiKeyDTO>} If the token is verified successfully, the API key associated with the token is returned. Otherwise, `false` is returned.
   *
   * @example
   * const apiKey =
   *   await apiKeyModuleService.authenticate("AbCD123987")
   *
   * if (!apiKey) {
   *   // authentication failed
   * }
   */
  authenticate(
    token: string,
    sharedContext?: Context
  ): Promise<ApiKeyDTO | false>
}
