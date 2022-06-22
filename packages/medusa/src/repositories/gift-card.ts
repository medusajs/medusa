import { flatten, groupBy, merge } from "lodash"
import {
  Brackets,
  EntityRepository,
  FindManyOptions,
  Repository,
} from "typeorm"
import { GiftCard } from "../models/gift-card"
import { ExtendedFindConfig, Writable } from "../types/common"

@EntityRepository(GiftCard)
export class GiftCardRepository extends Repository<GiftCard> {
  public async findWithRelations(
    relations: (keyof GiftCard | string)[] = [],
    idsOrOptionsWithoutRelations:
      | Omit<FindManyOptions<GiftCard>, "relations">
      | string[] = {}
  ): Promise<GiftCard[]> {
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
    return Object.values(entitiesAndRelationsById).map((v) => merge({}, ...v))
  }

  protected async queryGiftCards(
    q: string,
    where: Partial<Writable<GiftCard>>,
    rels: (keyof GiftCard | string)[]
  ): Promise<GiftCard[]> {
    const raw = await this.createQueryBuilder("gift_card")
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
      .getMany()

    return this.findWithRelations(
      rels,
      raw.map((i) => i.id)
    )
  }

  public async listGiftCards(
    query: ExtendedFindConfig<GiftCard>,
    rels: (keyof GiftCard | string)[] = [],
    q?: string
  ): Promise<GiftCard[]> {
    if (q) {
      const where = query.where
      delete where.id

      return await this.queryGiftCards(q, where, rels)
    }
    return this.findWithRelations(rels, query)
  }

  public async findOneWithRelations(
    relations: Array<keyof GiftCard> = [],
    optionsWithoutRelations: Omit<FindManyOptions<GiftCard>, "relations"> = {}
  ): Promise<GiftCard> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
