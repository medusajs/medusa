import { Context, DAL } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"

import { AuthProvider } from "@models"
import { RepositoryTypes } from "@types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class AuthProviderRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<AuthProvider> = { where: {} },
    context: Context = {}
  ): Promise<AuthProvider[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      AuthProvider,
      findOptions_.where as MikroFilterQuery<AuthProvider>,
      findOptions_.options as MikroOptions<AuthProvider>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<AuthProvider> = { where: {} },
    context: Context = {}
  ): Promise<[AuthProvider[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      AuthProvider,
      findOptions_.where as MikroFilterQuery<AuthProvider>,
      findOptions_.options as MikroOptions<AuthProvider>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(AuthProvider, { provider: { $in: ids } }, {})
  }

  async create(
    data: RepositoryTypes.CreateAuthProviderDTO[],
    context: Context = {}
  ): Promise<AuthProvider[]> {
    const manager: SqlEntityManager =
      this.getActiveManager<SqlEntityManager>(context)

    const authProviders = data.map((authProviderData) => {
      return manager.create(AuthProvider, authProviderData)
    })

    manager.persist(authProviders)

    return authProviders
  }

  async update(
    data: RepositoryTypes.UpdateAuthProviderDTO[],
    context: Context = {}
  ): Promise<AuthProvider[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const authProviders = data.map(({ provider, update }) => {
      return manager.assign(provider, update)
    })

    manager.persist(authProviders)

    return authProviders
  }
}
