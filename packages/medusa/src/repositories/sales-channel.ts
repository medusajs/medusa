import { EntityRepository, Repository } from "typeorm"
import { SalesChannel } from "../models/sales-channel"
import { flatten, groupBy, map, merge } from "lodash"
import { CustomFindOptions } from "../types/common"

@EntityRepository(SalesChannel)
export class SalesChannelRepository extends Repository<SalesChannel> {
  public async findWithRelations(
    relations: string[] = [],
    optionsWithoutRelations: CustomFindOptions<
      SalesChannel,
      keyof SalesChannel
    > = {}
  ): Promise<SalesChannel[]> {
    const entities = await this.find(optionsWithoutRelations)
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
      merge({}, ...entityAndRelations)
    )
  }

  public async findOneWithRelations(
    relations: string[] = [],
    optionsWithoutRelations: CustomFindOptions<SalesChannel, keyof SalesChannel> = {}
  ): Promise<SalesChannel | undefined> {
    optionsWithoutRelations.take = 1

    const items = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )

    return items.pop()
  }
}
