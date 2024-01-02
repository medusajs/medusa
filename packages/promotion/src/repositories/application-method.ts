import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ApplicationMethod } from "@models"
import {
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "../types"

export class ApplicationMethodRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ApplicationMethod> = { where: {} },
    context: Context = {}
  ): Promise<ApplicationMethod[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    return await manager.find(
      ApplicationMethod,
      findOptions_.where as MikroFilterQuery<ApplicationMethod>,
      findOptions_.options as MikroOptions<ApplicationMethod>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ApplicationMethod> = { where: {} },
    context: Context = {}
  ): Promise<[ApplicationMethod[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    return await manager.findAndCount(
      ApplicationMethod,
      findOptions_.where as MikroFilterQuery<ApplicationMethod>,
      findOptions_.options as MikroOptions<ApplicationMethod>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(ApplicationMethod, { id: { $in: ids } }, {})
  }

  async create(
    data: CreateApplicationMethodDTO[],
    context: Context = {}
  ): Promise<ApplicationMethod[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const applicationMethods = data.map((applicationMethodData) => {
      return manager.create(ApplicationMethod, applicationMethodData)
    })

    manager.persist(applicationMethods)

    return applicationMethods
  }

  async update(
    data: UpdateApplicationMethodDTO[],
    context: Context = {}
  ): Promise<ApplicationMethod[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const applicationMethodIds = data.map(
      (applicationMethodData) => applicationMethodData.id
    )
    const existingApplicationMethods = await this.find(
      {
        where: {
          id: {
            $in: applicationMethodIds,
          },
        },
      },
      context
    )

    const existingApplicationMethodMap = new Map(
      existingApplicationMethods.map<[string, ApplicationMethod]>(
        (applicationMethod) => [applicationMethod.id, applicationMethod]
      )
    )

    const applicationMethods = data.map((applicationMethodData) => {
      const existingApplicationMethod = existingApplicationMethodMap.get(
        applicationMethodData.id
      )

      if (!existingApplicationMethod) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `ApplicationMethod with id "${applicationMethodData.id}" not found`
        )
      }

      return manager.assign(existingApplicationMethod, applicationMethodData)
    })

    manager.persist(applicationMethods)

    return applicationMethods
  }
}
