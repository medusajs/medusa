import { IModuleService } from "../modules-sdk"
import { ApiKeyDTO, FilterableApiKeyProps } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { CreateApiKeyDTO, RevokeApiKeyDTO, UpdateApiKeyDTO } from "./mutations"

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
   * @param selector
   * @param data
   * @param sharedContext
   */
  update(
    selector: FilterableApiKeyProps,
    data: Omit<UpdateApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyDTO[]>
  /**
   * Update an api key
   * @param id
   * @param data
   * @param sharedContext
   */
  update(
    id: string,
    data: Omit<UpdateApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>
  /**
   * Update an api key
   * @param data
   */
  update(data: UpdateApiKeyDTO[]): Promise<ApiKeyDTO[]>

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
    data: Omit<RevokeApiKeyDTO, "id">,
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
    data: Omit<RevokeApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyDTO>
  /**
   * Revokes an api key
   * @param data
   */
  revoke(data: RevokeApiKeyDTO[]): Promise<ApiKeyDTO[]>

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
