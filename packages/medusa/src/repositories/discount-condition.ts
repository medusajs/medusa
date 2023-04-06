import { DeleteResult, EntityTarget, In, Not } from "typeorm"
import {
  Discount,
  DiscountCondition,
  DiscountConditionCustomerGroup,
  DiscountConditionOperator,
  DiscountConditionProduct,
  DiscountConditionProductCollection,
  DiscountConditionProductTag,
  DiscountConditionProductType,
  DiscountConditionType,
} from "../models"
import { isString } from "../utils"
import { dataSource } from "../loaders/database"

export enum DiscountConditionJoinTableForeignKey {
  PRODUCT_ID = "product_id",
  PRODUCT_TYPE_ID = "product_type_id",
  PRODUCT_COLLECTION_ID = "product_collection_id",
  PRODUCT_TAG_ID = "product_tag_id",
  CUSTOMER_GROUP_ID = "customer_group_id",
}

type DiscountConditionResourceType = EntityTarget<
  | DiscountConditionProduct
  | DiscountConditionProductType
  | DiscountConditionProductCollection
  | DiscountConditionProductTag
  | DiscountConditionCustomerGroup
>

export const DiscountConditionRepository = dataSource
  .getRepository(DiscountCondition)
  .extend({
    async findOneWithDiscount(
      conditionId: string,
      discountId: string
    ): Promise<(DiscountCondition & { discount: Discount }) | undefined> {
      return (await this.createQueryBuilder("condition")
        .leftJoinAndMapOne(
          "condition.discount",
          Discount,
          "discount",
          `condition.discount_rule_id = discount.rule_id and discount.id = :discId and condition.id = :dcId`,
          { discId: discountId, dcId: conditionId }
        )
        .getOne()) as (DiscountCondition & { discount: Discount }) | undefined
    },

    getJoinTableResourceIdentifiers(type: string): {
      joinTable: string
      resourceKey: string
      joinTableForeignKey: DiscountConditionJoinTableForeignKey
      conditionTable: DiscountConditionResourceType
      joinTableKey: string
    } {
      let conditionTable: DiscountConditionResourceType =
        DiscountConditionProduct

      let joinTable = "product"
      let joinTableForeignKey: DiscountConditionJoinTableForeignKey =
        DiscountConditionJoinTableForeignKey.PRODUCT_ID
      let joinTableKey = "id"

      // On the joined table (e.g. `product`), what key should be match on
      // (e.g `type_id` for product types and `id` for products)
      let resourceKey

      switch (type) {
        case DiscountConditionType.PRODUCTS: {
          resourceKey = "id"
          joinTableForeignKey = DiscountConditionJoinTableForeignKey.PRODUCT_ID
          joinTable = "product"

          conditionTable = DiscountConditionProduct
          break
        }
        case DiscountConditionType.PRODUCT_TYPES: {
          resourceKey = "type_id"
          joinTableForeignKey =
            DiscountConditionJoinTableForeignKey.PRODUCT_TYPE_ID
          joinTable = "product"

          conditionTable = DiscountConditionProductType
          break
        }
        case DiscountConditionType.PRODUCT_COLLECTIONS: {
          resourceKey = "collection_id"
          joinTableForeignKey =
            DiscountConditionJoinTableForeignKey.PRODUCT_COLLECTION_ID
          joinTable = "product"

          conditionTable = DiscountConditionProductCollection
          break
        }
        case DiscountConditionType.PRODUCT_TAGS: {
          joinTableKey = "product_id"
          resourceKey = "product_tag_id"
          joinTableForeignKey =
            DiscountConditionJoinTableForeignKey.PRODUCT_TAG_ID
          joinTable = "product_tags"

          conditionTable = DiscountConditionProductTag
          break
        }
        case DiscountConditionType.CUSTOMER_GROUPS: {
          joinTableKey = "customer_id"
          resourceKey = "customer_group_id"
          joinTable = "customer_group_customers"
          joinTableForeignKey =
            DiscountConditionJoinTableForeignKey.CUSTOMER_GROUP_ID

          conditionTable = DiscountConditionCustomerGroup
          break
        }
        default:
          break
      }

      return {
        joinTable,
        joinTableKey,
        resourceKey,
        joinTableForeignKey,
        conditionTable,
      }
    },

    async removeConditionResources(
      id: string,
      type: DiscountConditionType,
      resourceIds: (string | { id: string })[]
    ): Promise<DeleteResult | void> {
      const { conditionTable, joinTableForeignKey } =
        this.getJoinTableResourceIdentifiers(type)

      if (!conditionTable || !joinTableForeignKey) {
        return Promise.resolve()
      }

      const idsToDelete = resourceIds.map((rId): string => {
        return isString(rId) ? rId : rId.id
      })
      return await this.createQueryBuilder()
        .delete()
        .from(conditionTable)
        .where({ condition_id: id, [joinTableForeignKey]: In(idsToDelete) })
        .execute()
    },

    async addConditionResources(
      conditionId: string,
      resourceIds: (string | { id: string })[],
      type: DiscountConditionType,
      overrideExisting = false
    ): Promise<
      (
        | DiscountConditionProduct
        | DiscountConditionProductType
        | DiscountConditionProductCollection
        | DiscountConditionProductTag
        | DiscountConditionCustomerGroup
      )[]
    > {
      let toInsert: { condition_id: string; [x: string]: string }[] | [] = []

      const { conditionTable, joinTableForeignKey } =
        this.getJoinTableResourceIdentifiers(type)

      if (!conditionTable || !joinTableForeignKey) {
        return Promise.resolve([])
      }

      const idsToInsert = resourceIds.map((rId): string => {
        return isString(rId) ? rId : rId.id
      })
      toInsert = idsToInsert.map((rId) => ({
        condition_id: conditionId,
        [joinTableForeignKey]: rId,
      }))

      const insertResult = await this.createQueryBuilder()
        .insert()
        .orIgnore(true)
        .into(conditionTable)
        .values(toInsert)
        .execute()

      if (overrideExisting) {
        await this.createQueryBuilder()
          .delete()
          .from(conditionTable)
          .where({
            condition_id: conditionId,
            [joinTableForeignKey]: Not(In(idsToInsert)),
          })
          .execute()
      }

      return await this.manager
        .createQueryBuilder(conditionTable, "discon")
        .select()
        .where(insertResult.identifiers)
        .getMany()
    },

    async queryConditionTable({ type, condId, resourceId }): Promise<number> {
      const {
        conditionTable,
        joinTable,
        joinTableForeignKey,
        resourceKey,
        joinTableKey,
      } = this.getJoinTableResourceIdentifiers(type)

      return await this.manager
        .createQueryBuilder(conditionTable, "dc")
        .innerJoin(
          joinTable,
          "resource",
          `dc.${joinTableForeignKey} = resource.${resourceKey} and resource.${joinTableKey} = :resourceId `,
          {
            resourceId,
          }
        )
        .where(`dc.condition_id = :conditionId`, {
          conditionId: condId,
        })
        .getCount()
    },

    async isValidForProduct(
      discountRuleId: string,
      productId: string
    ): Promise<boolean> {
      const discountConditions = await this.createQueryBuilder("discon")
        .select(["discon.id", "discon.type", "discon.operator"])
        .where("discon.discount_rule_id = :discountRuleId", {
          discountRuleId,
        })
        .getMany()

      // in case of no discount conditions, we assume that the discount
      // is valid for all
      if (!discountConditions.length) {
        return true
      }

      // retrieve all conditions for each type where condition type id is in jointable (products, product_types, product_collections, product_tags)
      // "E.g. for a given product condition, give me all products affected by it"
      // for each of these types, we check:
      //    if condition operation is `in` and the query for conditions defined for the given type is empty, the discount is invalid
      //    if condition operation is `not_in` and the query for conditions defined for the given type is not empty, the discount is invalid
      for (const condition of discountConditions) {
        if (condition.type === DiscountConditionType.CUSTOMER_GROUPS) {
          continue
        }

        const numConditions = await this.queryConditionTable({
          type: condition.type,
          condId: condition.id,
          resourceId: productId,
        })

        if (
          condition.operator === DiscountConditionOperator.IN &&
          numConditions === 0
        ) {
          return false
        }

        if (
          condition.operator === DiscountConditionOperator.NOT_IN &&
          numConditions > 0
        ) {
          return false
        }
      }

      return true
    },

    async canApplyForCustomer(
      discountRuleId: string,
      customerId: string
    ): Promise<boolean> {
      const discountConditions = await this.createQueryBuilder("discon")
        .select(["discon.id", "discon.type", "discon.operator"])
        .where("discon.discount_rule_id = :discountRuleId", {
          discountRuleId,
        })
        .andWhere("discon.type = :type", {
          type: DiscountConditionType.CUSTOMER_GROUPS,
        })
        .getMany()

      // in case of no discount conditions, we assume that the discount
      // is valid for all
      if (!discountConditions.length) {
        return true
      }

      // retrieve conditions for customer groups
      // for each customer group
      //   if condition operation is `in` and the query for customer group conditions is empty, the discount is invalid
      //   if condition operation is `not_in` and the query for customer group conditions is not empty, the discount is invalid
      for (const condition of discountConditions) {
        const numConditions = await this.queryConditionTable({
          type: "customer_groups",
          condId: condition.id,
          resourceId: customerId,
        })

        if (
          condition.operator === DiscountConditionOperator.IN &&
          numConditions === 0
        ) {
          return false
        }

        if (
          condition.operator === DiscountConditionOperator.NOT_IN &&
          numConditions > 0
        ) {
          return false
        }
      }

      return true
    },
  })

export default DiscountConditionRepository
