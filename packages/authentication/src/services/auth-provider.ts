import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { AuthProvider } from "@models"
import { AuthProviderRepository } from "@repositories"

import { RepositoryTypes, ServiceTypes } from "@types"

type InjectedDependencies = {
  authProviderRepository: DAL.RepositoryService
}

export default class AuthProviderService<
  TEntity extends AuthProvider = AuthProvider
> {
  protected readonly authProviderRepository_: DAL.RepositoryService

  constructor({ authProviderRepository }: InjectedDependencies) {
    this.authProviderRepository_ = authProviderRepository
  }

  @InjectManager("authProviderRepository_")
  async retrieve(
    provider: string,
    config: FindConfig<ServiceTypes.AuthProviderDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<AuthProvider, ServiceTypes.AuthProviderDTO>({
      id: provider,
      identifierColumn: "provider",
      entityName: AuthProvider.name,
      repository: this.authProviderRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("authProviderRepository_")
  async list(
    filters: ServiceTypes.FilterableAuthProviderProps = {},
    config: FindConfig<ServiceTypes.AuthProviderDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryConfig = ModulesSdkUtils.buildQuery<AuthProvider>(
      filters,
      config
    )

    return (await this.authProviderRepository_.find(
      queryConfig,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("authProviderRepository_")
  async listAndCount(
    filters: ServiceTypes.FilterableAuthProviderProps = {},
    config: FindConfig<ServiceTypes.AuthProviderDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryConfig = ModulesSdkUtils.buildQuery<AuthProvider>(
      filters,
      config
    )

    return (await this.authProviderRepository_.findAndCount(
      queryConfig,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("authProviderRepository_")
  async create(
    data: ServiceTypes.CreateAuthProviderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.authProviderRepository_ as AuthProviderRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("authProviderRepository_")
  async update(
    data: ServiceTypes.UpdateAuthProviderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const authProviderIds = data.map(
      (authProviderData) => authProviderData.provider
    )

    const existingAuthProviders = await this.list(
      {
        provider: authProviderIds,
      },
      {},
      sharedContext
    )

    const updates: RepositoryTypes.UpdateAuthProviderDTO[] = []

    const existingAuthProvidersMap = new Map(
      existingAuthProviders.map<[string, AuthProvider]>((authProvider) => [
        authProvider.provider,
        authProvider,
      ])
    )

    for (const update of data) {
      const provider = existingAuthProvidersMap.get(update.provider)

      if (!provider) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `AuthProvider with provider "${update.provider}" not found`
        )
      }

      updates.push({ update, provider })
    }

    return (await (
      this.authProviderRepository_ as AuthProviderRepository
    ).update(updates, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("authProviderRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.authProviderRepository_.delete(ids, sharedContext)
  }
}
