import { flatten, groupBy, map, merge } from "lodash"
import { EntityRepository, FindManyOptions, Repository } from "typeorm"
import { GiftCard } from "../models/gift-card"

@EntityRepository(GiftCard)
export class GiftCardRepository extends Repository<GiftCard> {
  public async findWithRelations(
    relations: Array<keyof GiftCard> = [],
    idsOrOptionsWithoutRelations: Omit<
      FindManyOptions<GiftCard>,
      "relations"
    > = {}
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
    return map(entitiesAndRelationsById, entityAndRelations =>
      merge({}, ...entityAndRelations)
    )
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
