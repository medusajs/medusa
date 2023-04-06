import {
  DeleteResult,
  FindOperator,
  FindOptionsRelations,
  In,
  SelectQueryBuilder,
} from "typeorm"
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
      idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
    ): Promise<[CustomerGroup[], number]> {
      let count: number
      let entities: CustomerGroup[]
      if (Array.isArray(idsOrOptionsWithoutRelations)) {
        entities = await this.find({
          where: { id: In(idsOrOptionsWithoutRelations) },
          withDeleted: idsOrOptionsWithoutRelations.withDeleted ?? false,
        })
        count = entities.length
      } else {
        const customJoinsBuilders: ((
          qb: SelectQueryBuilder<CustomerGroup>,
          alias: string
        ) => void)[] = []

        if (idsOrOptionsWithoutRelations?.where?.discount_condition_id) {
          const discountConditionId =
            idsOrOptionsWithoutRelations?.where?.discount_condition_id
          delete idsOrOptionsWithoutRelations?.where?.discount_condition_id

          customJoinsBuilders.push(
            (qb: SelectQueryBuilder<CustomerGroup>, alias: string) => {
              qb.innerJoin(
                "discount_condition_customer_group",
                "dc_cg",
                `dc_cg.customer_group_id = ${alias}.id AND dc_cg.condition_id = :dcId`,
                { dcId: discountConditionId }
              )
            }
          )
        }

        const result = await queryEntityWithoutRelations(
          this,
          idsOrOptionsWithoutRelations,
          true,
          customJoinsBuilders
        )
        entities = result[0]
        count = result[1]
      }
      const entitiesIds = entities.map(({ id }) => id)

      if (entitiesIds.length === 0) {
        // no need to continue
        return [[], count]
      }

      if (Object.keys(relations).length === 0) {
        const options = { ...idsOrOptionsWithoutRelations }

        // Since we are finding by the ids that have been retrieved above and those ids are already
        // applying skip/take. Remove those options to avoid getting no results
        delete options.skip
        delete options.take

        const toReturn = await this.find({
          ...options,
          where: { id: In(entitiesIds) },
        })
        return [toReturn, toReturn.length]
      }

      const legacyRelations = objectToStringPath(relations)
      const groupedRelations = getGroupedRelations(legacyRelations)

      const legacySelect = objectToStringPath(
        idsOrOptionsWithoutRelations.select
      )
      const entitiesIdsWithRelations = await queryEntityWithIds(
        this,
        entitiesIds,
        groupedRelations,
        idsOrOptionsWithoutRelations.withDeleted,
        legacySelect
      )

      const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
      const entitiesToReturn =
        mergeEntitiesWithRelations<CustomerGroup>(entitiesAndRelations)

      return [entitiesToReturn, count]
    },
  })

export default CustomerGroupRepository
