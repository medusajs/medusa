import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { AuthUser } from "@models"

import { RepositoryTypes, ServiceTypes } from "@types"

type InjectedDependencies = {
  authUserRepository: DAL.RepositoryService
}

export default class AuthUserService<
  TEntity extends AuthUser = AuthUser
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateAuthUserDTO
  }
>(AuthUser)<TEntity> {
  protected readonly authUserRepository_: DAL.RepositoryService<TEntity>

  constructor({ authUserRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.authUserRepository_ = authUserRepository
  }

  @InjectTransactionManager("authUserRepository_")
  async update(
    data: ServiceTypes.UpdateAuthUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const existingUsers = await this.list(
      { id: data.map(({ id }) => id) },
      {},
      sharedContext
    )

    const existingUsersMap = new Map(
      existingUsers.map<[string, AuthUser]>((authUser) => [
        authUser.id,
        authUser,
      ])
    )

    const updates: RepositoryTypes.UpdateAuthUserDTO[] = []

    for (const update of data) {
      const user = existingUsersMap.get(update.id)

      if (!user) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `AuthUser with id "${update.id}" not found`
        )
      }

      updates.push({ update, user })
    }

    return await this.authUserRepository_.update(updates, sharedContext)
  }
}
