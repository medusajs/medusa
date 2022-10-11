import {
  Brackets,
  DeleteResult,
  EntityRepository,
  FindManyOptions,
  In,
  Repository,
} from "typeorm"
import { SalesChannel } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common"
import { flatten, groupBy, merge } from "lodash"

@EntityRepository(SalesChannel)
export class SalesChannelRepository extends Repository<SalesChannel> {
  public async findWithRelations(
    relations: (keyof SalesChannel | string)[] = [],
    idsOrOptionsWithoutRelations:
      | Omit<FindManyOptions<SalesChannel>, "relations">
      | string[] = {}
  ): Promise<[SalesChannel[], number]> {
    let entities: SalesChannel[] = []
    let count = 0
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations)
      count = idsOrOptionsWithoutRelations.length
    } else {
      const [results, resultCount] = await this.findAndCount(
        idsOrOptionsWithoutRelations
      )
      entities = results
      count = resultCount
    }
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations = {}
    for (const rel of relations) {
      const [topLevel] = rel.split(".")
      if (groupedRelations[topLevel]) {
        groupedRelations[topLevel].push(rel)
      } else {
        groupedRelations[topLevel] = [rel]
      }
    }

    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([_, rels]) => {
        return this.findByIds(entitiesIds, {
          select: ["id"],
          relations: rels as string[],
        })
      })
    ).then(flatten)
    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return [
      Object.values(entitiesAndRelationsById).map((v) => merge({}, ...v)),
      count,
    ]
  }

  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: ExtendedFindConfig<SalesChannel, Selector<SalesChannel>> = {
      where: {},
    }
  ): Promise<[SalesChannel[], number]> {
    const options_ = { ...options }
    delete options_?.where?.name
    delete options_?.where?.description

    let qb = this.createQueryBuilder("sales_channel")
      .select()
      .where(options_.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`sales_channel.description ILIKE :q`, {
            q: `%${q}%`,
          }).orWhere(`sales_channel.name ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(options.skip)
      .take(options.take)

    if (options.withDeleted) {
      qb = qb.withDeleted()
    }

    return await qb.getManyAndCount()
  }

  async removeProducts(
    salesChannelId: string,
    productIds: string[]
  ): Promise<DeleteResult> {
    return await this.createQueryBuilder()
      .delete()
      .from("product_sales_channel")
      .where({
        sales_channel_id: salesChannelId,
        product_id: In(productIds),
      })
      .execute()
  }

  async addProducts(
    salesChannelId: string,
    productIds: string[]
  ): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into("product_sales_channel")
      .values(
        productIds.map((id) => ({
          sales_channel_id: salesChannelId,
          product_id: id,
        }))
      )
      .orIgnore()
      .execute()
  }

  public async findOneWithRelations(
    relations: Array<keyof SalesChannel> = [],
    optionsWithoutRelations: Omit<
      FindManyOptions<SalesChannel>,
      "relations"
    > = {}
  ): Promise<SalesChannel> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const [result] = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
