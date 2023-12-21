import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

import { SqlEntityManager } from "@mikro-orm/postgresql"

import { SalesChannel } from "@models"

export class SalesChannelRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async create(
    data: CreateSalesChannelDTO[],
    context: Context = {}
  ): Promise<SalesChannel[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const channels = data.map((salesChannelData) => {
      return manager.create(SalesChannel, {
        ...salesChannelData,
        is_disabled: !!salesChannelData.is_disabled,
      })
    })

    manager.persist(channels)

    return channels
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(SalesChannel, { id: { $in: ids } }, {})
  }

  async find(
    findOptions: DAL.FindOptions<SalesChannel> = { where: {} },
    context: Context = {}
  ): Promise<SalesChannel[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      SalesChannel,
      findOptions_.where as MikroFilterQuery<SalesChannel>,
      findOptions_.options as MikroOptions<SalesChannel>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<SalesChannel> = { where: {} },
    context: Context = {}
  ): Promise<[SalesChannel[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      SalesChannel,
      findOptions_.where as MikroFilterQuery<SalesChannel>,
      findOptions_.options as MikroOptions<SalesChannel>
    )
  }

  async update(
    data: UpdateSalesChannelDTO[],
    context: Context = {}
  ): Promise<SalesChannel[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const existingChannels = await this.find(
      {
        where: {
          id: {
            $in: data.map((scData) => scData.id),
          },
        },
      },
      context
    )

    const existingChannelsMap = new Map(
      existingChannels.map<[string, SalesChannel]>((sc) => [sc.id, sc])
    )

    const channels = data.map((channelData) => {
      const existingChannel = existingChannelsMap.get(channelData.id)

      if (!existingChannel) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `SalesChannel with id "${channelData.id}" not found`
        )
      }

      return manager.assign(existingChannel, channelData)
    })

    manager.persist(channels)

    return channels
  }
}
