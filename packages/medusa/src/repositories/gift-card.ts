import { flatten, groupBy, merge } from "lodash"
import {
  Brackets,
  EntityRepository,
  FindManyOptions,
  Repository,
} from "typeorm"
import { GiftCard } from "../models/gift-card"
import { ExtendedFindConfig, QuerySelector, Writable } from "../types/common"

@EntityRepository(GiftCard)
export class GiftCardRepository extends Repository<GiftCard> {
  public async findWithRelations(
    relations: (keyof GiftCard | string)[] = [],
    idsOrOptionsWithoutRelations:
      | Omit<FindManyOptions<GiftCard>, "relations">
      | string[] = {}
  ): Promise<[GiftCard[], number]> {
    let entities: GiftCard[] = []
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

  protected async queryGiftCards(
    q: string,
    where: Partial<Writable<QuerySelector<GiftCard>>>,
    rels: (keyof GiftCard | string)[],
    shouldCount = false
  ): Promise<[GiftCard[], number]> {
    const qb = this.createQueryBuilder("gift_card")
      .leftJoinAndSelect("gift_card.order", "order")
      .select(["gift_card.id"])
      .where(where)
      .andWhere(
        new Brackets((qb) => {
          return qb
            .where(`gift_card.code ILIKE :q`, { q: `%${q}%` })
            .orWhere(`display_id::varchar(255) ILIKE :dId`, { dId: `${q}` })
        })
      )

    let raw: GiftCard[] = []
    let count = 0
    if (shouldCount) {
      const [results, resultCount] = await qb.getManyAndCount()
      raw = results
      count = resultCount
    } else {
      raw = await qb.getMany()
    }

    const [results] = await this.findWithRelations(
      rels,
      raw.map((i) => i.id)
    )

    return [results, count]
  }

  public async listGiftCardsAndCount(
    inputQuery: ExtendedFindConfig<GiftCard, QuerySelector<GiftCard>>,
    rels: (keyof GiftCard | string)[] = [],
    q?: string
  ): Promise<[GiftCard[], number]> {
    const query = { ...inputQuery }

    if (q) {
      const where = query.where
      delete where.id

      return await this.queryGiftCards(q, where, rels, true)
    }
    return await this.findWithRelations(rels, query)
  }

  public async listGiftCards(
    query: ExtendedFindConfig<GiftCard, QuerySelector<GiftCard>>,
    rels: (keyof GiftCard | string)[] = [],
    q?: string
  ): Promise<GiftCard[]> {
    if (q) {
      const where = query.where
      delete where.id

      const [result] = await this.queryGiftCards(q, where, rels)
      return result
    }

    const [results] = await this.findWithRelations(rels, query)
    return results
  }

  public async findOneWithRelations(
    relations: Array<keyof GiftCard> = [],
    optionsWithoutRelations: Omit<FindManyOptions<GiftCard>, "relations"> = {}
  ): Promise<GiftCard> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const [result] = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
