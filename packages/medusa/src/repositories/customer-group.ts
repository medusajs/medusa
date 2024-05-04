import { DeleteResult, FindOperator, FindOptionsRelations, In } from "typeorm"
import { CustomerGroup } from "../models"
import { ExtendedFindConfig } from "../types/common"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
  queryEntityWithIds,
  queryEntityWithoutRelations,
} from "../utils/repository"
import { objectToStringPath } from "@medusajs/utils"
import { dataSource } from "../loaders/database"
import { cloneDeep } from "lodash"

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<CustomerGroup>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    discount_condition_id?: string | FindOperator<string>
  }
}

export const CustomerGroupRepository = dataSource
  .getRepository(CustomerGroup)
  .extend({
    async addCustomers(
      groupId: string,
      customerIds: string[]
    ): Promise<CustomerGroup> {
      const customerGroup = await this.findOne({
        where: {
          id: groupId,
        },
      })

      await this.createQueryBuilder()
        .insert()
        .into("customer_group_customers")
        .values(
          customerIds.map((id) => ({
            customer_id: id,
            customer_group_id: groupId,
          }))
        )
        .orIgnore()
        .execute()

      return customerGroup as CustomerGroup
    },

    async removeCustomers(
      groupId: string,
      customerIds: string[]
    ): Promise<DeleteResult> {
      return await this.createQueryBuilder()
        .delete()
        .from("customer_group_customers")
        .where({
          customer_group_id: groupId,
          customer_id: In(customerIds),
        })
        .execute()
    },

    async findWithRelationsAndCount(
      relations: FindOptionsRelations<CustomerGroup> = {},
      idsOrOptionsWithoutRelations: string[] | FindWithoutRelationsOptions = {
        where: {},
      }
    ): Promise<[CustomerGroup[], number]> {
      const withDeleted = Array.isArray(idsOrOptionsWithoutRelations)
        ? false
        : idsOrOptionsWithoutRelations.withDeleted ?? false
      const isOptionsArray = Array.isArray(idsOrOptionsWithoutRelations)
      const originalWhere = isOptionsArray
        ? undefined
        : cloneDeep(idsOrOptionsWithoutRelations.where)
      const originalOrder: any = isOptionsArray
        ? undefined
        : { ...idsOrOptionsWithoutRelations.order }
      const originalSelect = isOptionsArray
        ? undefined
        : (objectToStringPath(idsOrOptionsWithoutRelations.select, {
            includeParentPropertyFields: false,
          }) as (keyof CustomerGroup)[])
      const clonedOptions = isOptionsArray
        ? idsOrOptionsWithoutRelations
        : cloneDeep(idsOrOptionsWithoutRelations)

      let count: number
      let entities: CustomerGroup[]
      if (Array.isArray(idsOrOptionsWithoutRelations)) {
        entities = await this.find({
          where: { id: In(idsOrOptionsWithoutRelations) },
          withDeleted,
        })
        count = entities.length
      } else {
        const discountConditionId = (
          clonedOptions as FindWithoutRelationsOptions
        )?.where?.discount_condition_id
        delete (clonedOptions as FindWithoutRelationsOptions)?.where
          ?.discount_condition_id

        const result = await queryEntityWithoutRelations({
          repository: this,
          optionsWithoutRelations: clonedOptions as FindWithoutRelationsOptions,
          shouldCount: true,
          customJoinBuilders: [
            async (qb, alias) => {
              if (discountConditionId) {
                qb.innerJoin(
                  "discount_condition_customer_group",
                  "dc_cg",
                  `dc_cg.customer_group_id = ${alias}.id AND dc_cg.condition_id = :dcId`,
                  { dcId: discountConditionId }
                )

                return {
                  relation: "discount_condition",
                  preventOrderJoin: true,
                }
              }

              return
            },
          ],
        })
        entities = result[0]
        count = result[1]
      }
      const entitiesIds = entities.map(({ id }) => id)

      if (entitiesIds.length === 0) {
        // no need to continue
        return [[], count]
      }

      if (Object.keys(relations).length === 0) {
        // Since we are finding by the ids that have been retrieved above and those ids are already
        // applying skip/take. Remove those options to avoid getting no results
        if (!Array.isArray(clonedOptions)) {
          delete clonedOptions.skip
          delete clonedOptions.take
        }

        const toReturn = await this.find({
          ...(isOptionsArray
            ? {}
            : (clonedOptions as FindWithoutRelationsOptions)),
          where: {
            id: In(entitiesIds),
            ...(Array.isArray(clonedOptions) ? {} : clonedOptions.where),
          },
        })
        return [toReturn, toReturn.length]
      }

      const legacyRelations = objectToStringPath(relations)
      const groupedRelations = getGroupedRelations(legacyRelations)

      const entitiesIdsWithRelations = await queryEntityWithIds({
        repository: this,
        entityIds: entitiesIds,
        groupedRelations,
        select: originalSelect,
        withDeleted,
      })

      const entitiesAndRelations = entities.concat(entitiesIdsWithRelations)
      const entitiesToReturn =
        mergeEntitiesWithRelations<CustomerGroup>(entitiesAndRelations)

      return [entitiesToReturn, count]
    },
  })

export default CustomerGroupRepository
