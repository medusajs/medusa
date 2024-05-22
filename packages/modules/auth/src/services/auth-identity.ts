import {
  AuthTypes,
  Context,
  DAL,
  FindConfig,
  RepositoryService,
} from "@medusajs/types"
import {
  InjectManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { AuthIdentity } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authIdentityRepository: DAL.RepositoryService
}

export default class AuthIdentityService<
  TEntity extends AuthIdentity = AuthIdentity
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  AuthIdentity
)<TEntity> {
  protected readonly authIdentityRepository_: RepositoryService<TEntity>
  protected baseRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.authIdentityRepository_ = container.authIdentityRepository
    this.baseRepository_ = container.baseRepository
  }

  @InjectManager("authIdentityRepository_")
  async retrieveByProviderAndEntityId<
    TEntityMethod = AuthTypes.AuthIdentityDTO
  >(
    entityId: string,
    provider: string,
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthIdentityDTO> {
    const queryConfig = ModulesSdkUtils.buildQuery<TEntity>(
      { entity_id: entityId, provider },
      { ...config, take: 1 }
    )
    const [result] = await this.authIdentityRepository_.find(
      queryConfig,
      sharedContext
    )

    if (!result) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `AuthIdentity with entity_id: "${entityId}" and provider: "${provider}" not found`
      )
    }

    return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
      result
    )
  }
}
