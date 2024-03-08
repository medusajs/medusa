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

export interface IApiKeyModuleService extends IModuleService {
  /**
   * Create a new api key
   * @param data
   * @param sharedContext
   */
  create(data: CreateApiKeyDTO[], sharedContext?: Context): Promise<ApiKeyDTO[]>
  create(data: CreateApiKeyDTO, sharedContext?: Context): Promise<ApiKeyDTO>

  /**
   * This method updates existing API keys, or creates new ones if they don't exist.
   *
   * @param {UpsertApiKeyDTO[]} data - The attributes to update or create for each API key.
   * @returns {Promise<ApiKeyDTO[]>} The updated and created API keys.
   *
   * @example
   * {example-code}
   */
  upsert(data: UpsertApiKeyDTO[], sharedContext?: Context): Promise<ApiKeyDTO[]>

  /**
   * This method updates an existing API key, or creates a new one if it doesn't exist.
   *
   * @param {UpsertApiKeyDTO} data - The attributes to update or create for the API key.
   * @returns {Promise<ApiKeyDTO>} The updated or created API key.
   *
   * @example
   * {example-code}
   */
  upsert(data: UpsertApiKeyDTO, sharedContext?: Context): Promise<ApiKeyDTO>

  /**
   * This method updates an existing API key.
   *
   * @param {string} id - The API key's ID.
   * @param {UpdateApiKeyDTO} data - The details to update in the API key.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO>} The updated API key.
   */
  update(
    id: string,
    data: UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * This method updates existing API keys.
   *
   * @param {FilterableApiKeyProps} selector - The filters to specify which API keys should be updated.
   * @param {UpdateApiKeyDTO} data - The details to update in the API keys.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ApiKeyDTO[]>} The updated API keys.
   *
   * @example
   * {example-code}
   */
  update(
    selector: FilterableApiKeyProps,
    data: UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * Delete an api key
   * @param ids
   * @param sharedContext
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>

  /**
   * Retrieve an api key
   * @param id
   * @param config
   * @param sharedContext
   */
  retrieve(
    id: string,
    config?: FindConfig<ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * List api keys
   * @param filters
   * @param config
   * @param sharedContext
   */
  list(
    filters?: FilterableApiKeyProps,
    config?: FindConfig<ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>

  /**
   * List and count api keys
   * @param filters
   * @param config
   * @param sharedContext
   */
  listAndCount(
    filters?: FilterableApiKeyProps,
    config?: FindConfig<ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<[ApiKeyDTO[], number]>

  /**
   * Revokes an api key
   * @param selector
   * @param data
   * @param sharedContext
   */
  revoke(
    selector: FilterableApiKeyProps,
    data: RevokeApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>
  /**
   * Revokes an api key
   * @param id
   * @param data
   * @param sharedContext
   */
  revoke(
    id: string,
    data: RevokeApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>

  /**
   * Check the validity of an api key
   * @param token
   * @param sharedContext
   */
  authenticate(
    token: string,
    sharedContext?: Context
  ): Promise<ApiKeyDTO | false>
}
