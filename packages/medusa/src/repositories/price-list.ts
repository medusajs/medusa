import { flatten, groupBy, map } from "lodash"
import {
  Brackets,
  EntityRepository,
  FindManyOptions,
  FindOperator,
  OrderByCondition,
  Repository,
} from "typeorm"
import { PriceList } from "../models/price-list"
import { PriceListStatus, PriceListType } from "../types/price-list"

type CustomOptions = {
  select?: FindManyOptions["select"]
  where?: FindManyOptions["where"] & {
    status?: FindOperator<PriceListStatus>[]
    type?: FindOperator<PriceListType>[]
  }
  order?: OrderByCondition
  skip?: number
  take?: number
}

type FindOptions = CustomOptions
@EntityRepository(PriceList)
export class PriceListRepository extends Repository<PriceList> {
  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: FindOptions = { where: {} },
    relations: Array<keyof PriceList> = []
  ): Promise<[PriceList[], number]> {
    if (!options.where) {
      options.where = {}
    }
    let qb = this.createQueryBuilder("price_list")
      .leftJoinAndSelect("price_list.customer_groups", "customer_group")
      .select(["price_list.id"])
      .where(options.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`price_list.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`price_list.name ILIKE :q`, { q: `%${q}%` })
            .orWhere(`customer_group.name ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(options.skip)
      .take(options.take)

    const [results, count] = await qb.getManyAndCount()

    const price_lists = await this.findWithRelations(
      relations,
      results.map((r) => r.id)
    )

    return [price_lists, count]
  }

  public async findWithRelations(
    relations: Array<keyof PriceList> = [],
    idsOrOptionsWithoutRelations:
      | Omit<FindManyOptions<PriceList>, "relations">
      | string[] = {}
  ): Promise<PriceList[]> {
    let entities
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations)
    } else {
      entities = await this.find(idsOrOptionsWithoutRelations)
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
      Object.entries(groupedRelations).map(([_, rels]) => {
        return this.findByIds(entitiesIds, {
          select: ["id"],
          relations: rels as string[],
        })
      })
    ).then(flatten)
    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      this.merge({} as PriceList, ...entityAndRelations)
    )
  }

  public async findOneWithRelations(
    relations: Array<keyof PriceList> = [],
    optionsWithoutRelations: Omit<FindManyOptions<PriceList>, "relations"> = {}
  ): Promise<PriceList> {
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
