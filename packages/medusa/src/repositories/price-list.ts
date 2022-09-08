import { groupBy, map } from "lodash"
import {
  Brackets,
  EntityRepository,
  FindManyOptions,
  FindOperator,
  Repository,
} from "typeorm"
import { PriceList } from "../models/price-list"
import { CustomFindOptions, ExtendedFindConfig } from "../types/common"
import { FilterablePriceListProps } from "../types/price-list"

export type PriceListFindOptions = CustomFindOptions<
  PriceList,
  "status" | "type"
>

@EntityRepository(PriceList)
export class PriceListRepository extends Repository<PriceList> {
  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: PriceListFindOptions = { where: {} },
    groups: FindOperator<string[]>,
    relations: string[] = []
  ): Promise<[PriceList[], number]> {
    options.where = options.where ?? {}

    const qb = this.createQueryBuilder("price_list")
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

    if (groups) {
      qb.andWhere("group.id IN (:...ids)", { ids: groups.value })
    }

    const [results, count] = await qb.getManyAndCount()

    const price_lists = await this.findWithRelations(
      relations,
      results.map((r) => r.id)
    )

    return [price_lists, count]
  }

  public async findWithRelations(
    relations: string[] = [],
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
    const groupedRelations: Record<string, string[]> = {}
    for (const relation of relations) {
      const [topLevel] = relation.split(".")
      if (groupedRelations[topLevel]) {
        groupedRelations[topLevel].push(relation)
      } else {
        groupedRelations[topLevel] = [relation]
      }
    }
    const entitiesIds = entities.map(({ id }) => id)
    const entitiesIdsWithRelations = await Promise.all(
      Object.values(groupedRelations).map(async (relations: string[]) => {
        return this.findByIds(entitiesIds, {
          select: ["id"],
          relations: relations as string[],
        })
      })
    ).then((entitiesIdsWithRelations) => entitiesIdsWithRelations.flat())
    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      this.merge(this.create(), ...entityAndRelations)
    )
  }

  public async findOneWithRelations(
    relations: (keyof PriceList)[] = [],
    options: Omit<FindManyOptions<PriceList>, "relations"> = {}
  ): Promise<PriceList | undefined> {
    options.take = 1

    return (await this.findWithRelations(relations, options))?.pop()
  }

  async listAndCount(
    query: ExtendedFindConfig<FilterablePriceListProps>,
    groups: FindOperator<string[]>
  ): Promise<[PriceList[], number]> {
    const qb = this.createQueryBuilder("price_list")
      .where(query.where)
      .skip(query.skip)
      .take(query.take)

    if (groups) {
      qb.leftJoinAndSelect("price_list.customer_groups", "group").andWhere(
        "group.id IN (:...ids)",
        { ids: groups.value }
      )
    }

    if (query.relations?.length) {
      query.relations.forEach((rel) => {
        qb.leftJoinAndSelect(`price_list.${rel}`, rel)
      })
    }

    return await qb.getManyAndCount()
  }
}
