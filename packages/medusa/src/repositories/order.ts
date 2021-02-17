import { flatten, groupBy, map, merge } from "lodash"
import { EntityRepository, Repository, FindManyOptions } from "typeorm"
import { Order } from "../models/order"

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  public async findWithRelations(
    relations: Array<keyof Order> = [],
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)
    const entitiesIdsWithRelations = await Promise.all(
      relations.map(relation => {
        const relationParts = relation.split(".") as string[]

        const partialRelations = relationParts.reduce(
          (acc: string[], _: string, index: number) => {
            const toPush = []

            for (let i = 0; i <= index; i++) {
              toPush.push(relationParts[i])
            }

            acc.push(toPush.join("."))

            return acc
          },
          [] as string[]
        )

        return this.findByIds(entitiesIds, {
          select: ["id"],
          relations: partialRelations,
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
    relations: Array<keyof Order> = [],
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order> {
    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
