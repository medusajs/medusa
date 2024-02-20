import {
  Context,
  DAL,
  ApiKeyTypes,
  IApiKeyModuleService,
  ModulesSdkTypes,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { ApiKey } from "@models"

const generateMethodForModels = []

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  apiKeyService: ModulesSdkTypes.InternalModuleService<any>
}

export default class ApiKeyModuleService<TEntity extends ApiKey = ApiKey>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    ApiKeyTypes.ApiKeyDTO,
    {
      ApiKey: { dto: ApiKeyTypes.ApiKeyDTO }
    }
  >(ApiKey, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IApiKeyModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly apiKeyService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, apiKeyService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.apiKeyService_ = apiKeyService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(
    data: ApiKeyTypes.CreateApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  create(
    data: ApiKeyTypes.CreateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>

  @InjectManager("baseRepository_")
  async create(
    data: ApiKeyTypes.CreateApiKeyDTO | ApiKeyTypes.CreateApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]> {
    const createdApiKeys = await this.create_(data, sharedContext)

    return await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]
    >(createdApiKeys, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: ApiKeyTypes.CreateApiKeyDTO | ApiKeyTypes.CreateApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    const createdApiKeys = await this.apiKeyService_.create(
      data_,
      sharedContext
    )

    return Array.isArray(data) ? createdApiKeys : createdApiKeys[0]
  }

  update(
    data: ApiKeyTypes.UpdateApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  update(
    data: ApiKeyTypes.UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>

  @InjectManager("baseRepository_")
  async update(
    data: ApiKeyTypes.UpdateApiKeyDTO[] | ApiKeyTypes.UpdateApiKeyDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO[] | ApiKeyTypes.ApiKeyDTO> {
    const updatedApiKeys = await this.update_(data, sharedContext)

    return await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]
    >(updatedApiKeys, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: ApiKeyTypes.UpdateApiKeyDTO[] | ApiKeyTypes.UpdateApiKeyDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[] | TEntity> {
    return []
  }

  @InjectTransactionManager("baseRepository_")
  async revoke(
    id: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return
  }

  @InjectTransactionManager("baseRepository_")
  authenticate(
    id: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<boolean> {
    return Promise.resolve(false)
  }
}
