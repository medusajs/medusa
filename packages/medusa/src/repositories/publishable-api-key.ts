import { flatten, groupBy, merge } from "lodash"
import { EntityRepository, FindManyOptions, Repository } from "typeorm"

import { PublishableApiKey } from "../models"

@EntityRepository(PublishableApiKey)
export class PublishableApiKeyRepository extends Repository<PublishableApiKey> {
  public async findWithRelations(
    relations: (keyof PublishableApiKey | string)[] = [],
    idsOrOptionsWithoutRelations:
      | Omit<FindManyOptions<PublishableApiKey>, "relations">
      | string[] = {}
  ): Promise<[PublishableApiKey[], number]> {
    let entities: PublishableApiKey[] = []
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

  public async findOneWithRelations(
    relations: Array<keyof PublishableApiKey> = [],
    optionsWithoutRelations: Omit<
      FindManyOptions<PublishableApiKey>,
      "relations"
    > = {}
  ): Promise<PublishableApiKey> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const [result] = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
