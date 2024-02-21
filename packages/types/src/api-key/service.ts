import { IModuleService } from "../modules-sdk"
import { ApiKeyDTO, FilterableApiKeyProps } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { CreateApiKeyDTO, UpdateApiKeyDTO } from "./mutations"

export interface IApiKeyModuleService extends IModuleService {
  /**
   * Create a new api key
   * @param data
   * @param sharedContext
   */
  create(data: CreateApiKeyDTO[], sharedContext?: Context): Promise<ApiKeyDTO[]>
  create(data: CreateApiKeyDTO, sharedContext?: Context): Promise<ApiKeyDTO>

  /**
   * Update an api key
   * @param data
   * @param sharedContext
   */
  update(data: UpdateApiKeyDTO[], sharedContext?: Context): Promise<ApiKeyDTO[]>
  update(data: UpdateApiKeyDTO, sharedContext?: Context): Promise<ApiKeyDTO>

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
   * @param id
   * @param sharedContext
   */
  revoke(id: string, sharedContext?: Context): Promise<void>

  /**
   * Check the validity of an api key
   * @param id
   * @param sharedContext
   */
  authenticate(id: string, sharedContext?: Context): Promise<boolean>
}
