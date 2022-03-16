import {
  DeleteResult,
  EntityRepository,
  EntityTarget,
  In,
  Not,
  Repository,
} from "typeorm"
import {
  DiscountCondition,
  DiscountConditionOperator,
  DiscountConditionType,
} from "../models/discount-condition"
import { DiscountConditionCustomerGroup } from "../models/discount-condition-customer-group"
import { DiscountConditionProduct } from "../models/discount-condition-product"
import { DiscountConditionProductCollection } from "../models/discount-condition-product-collection"
import { DiscountConditionProductTag } from "../models/discount-condition-product-tag"
import { DiscountConditionProductType } from "../models/discount-condition-product-type"
import { Product } from "../models/product"

enum DiscountConditionJoinTableForeignKey {
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
> | null

@EntityRepository(DiscountCondition)
export class DiscountConditionRepository extends Repository<DiscountCondition> {
  getJoinTableResourceIdentifiers(type: string): {
    joinTableName: DiscountConditionResourceType
    joinTableForeignKey: DiscountConditionJoinTableForeignKey | undefined
  } {
    let joinTableName: DiscountConditionResourceType = null
    let joinTableForeignKey: DiscountConditionJoinTableForeignKey | undefined =
      undefined

    switch (type) {
      case DiscountConditionType.PRODUCTS: {
        joinTableName = DiscountConditionProduct
        joinTableForeignKey = DiscountConditionJoinTableForeignKey.PRODUCT_ID
        break
      }
      case DiscountConditionType.PRODUCT_TYPES: {
        joinTableName = DiscountConditionProductType
        joinTableForeignKey =
          DiscountConditionJoinTableForeignKey.PRODUCT_TYPE_ID
        break
      }
      case DiscountConditionType.PRODUCT_COLLECTIONS: {
        joinTableName = DiscountConditionProductCollection
        joinTableForeignKey =
          DiscountConditionJoinTableForeignKey.PRODUCT_COLLECTION_ID
        break
      }
      case DiscountConditionType.PRODUCT_TAGS: {
        joinTableName = DiscountConditionProductTag
        joinTableForeignKey =
          DiscountConditionJoinTableForeignKey.PRODUCT_TAG_ID
        break
      }
      case DiscountConditionType.CUSTOMER_GROUPS: {
        joinTableName = DiscountConditionCustomerGroup
        joinTableForeignKey =
          DiscountConditionJoinTableForeignKey.CUSTOMER_GROUP_ID
        break
      }
      default:
        break
    }

    return { joinTableName, joinTableForeignKey }
  }

  async removeConditionResources(
    id: string,
    type: DiscountConditionType,
    resourceIds: string[]
  ): Promise<DeleteResult | void> {
    const { joinTableName, joinTableForeignKey } =
      this.getJoinTableResourceIdentifiers(type)

    if (!joinTableName || !joinTableForeignKey) {
      return Promise.resolve()
    }

    return await this.createQueryBuilder()
      .delete()
      .from(joinTableName)
      .where({ condition_id: id, [joinTableForeignKey]: In(resourceIds) })
      .execute()
  }

  async addConditionResources(
    conditionId: string,
    resourceIds: string[],
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

    const { joinTableName, joinTableForeignKey } =
      this.getJoinTableResourceIdentifiers(type)

    if (!joinTableName || !joinTableForeignKey) {
      return Promise.resolve([])
    }

    toInsert = resourceIds.map((pId) => ({
      condition_id: conditionId,
      [joinTableForeignKey]: pId,
    }))

    const insertResult = await this.createQueryBuilder()
      .insert()
      .orIgnore(true)
      .into(joinTableName)
      .values(toInsert)
      .execute()

    if (overrideExisting) {
      await this.createQueryBuilder()
        .delete()
        .from(joinTableName)
        .where({
          condition_id: conditionId,
          [joinTableForeignKey]: Not(In(resourceIds)),
        })
        .execute()
    }

    return await this.manager
      .createQueryBuilder(joinTableName, "discon")
      .select()
      .where(insertResult.identifiers)
      .getMany()
  }

  async queryConditionTable({
    type,
    condId,
    resourceId,
  }): Promise<
    (
      | DiscountConditionProduct
      | DiscountConditionProductType
      | DiscountConditionProductCollection
      | DiscountConditionProductTag
      | DiscountConditionCustomerGroup
    )[]
  > {
    const { joinTableName, joinTableForeignKey } =
      this.getJoinTableResourceIdentifiers(type)

    if (joinTableName) {
      return await this.manager
        .createQueryBuilder(joinTableName, "conds")
        .select()
        .where(`${"conds"}.${joinTableForeignKey} = :resourceId`, {
          resourceId,
        })
        .andWhere(`${"conds"}.condition_id = :condId`, {
          condId,
        })
        .getMany()
    }

    return []
  }

  async isValidForProduct(
    discountRuleId: string,
    product: Product
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
      const { joinTableForeignKey } = this.getJoinTableResourceIdentifiers(
        condition.type
      )

      // Tags is a ManyToMany relation, so we need to check all tags that exist
      // For each tag, we perform the operation outlined in above comment
      if (
        joinTableForeignKey ===
        DiscountConditionJoinTableForeignKey.PRODUCT_TAG_ID
      ) {
        for (const tag of product.tags) {
          const tagConds = await this.queryConditionTable({
            type: condition.type,
            condId: condition.id,
            resourceId: tag.id,
          })

          if (
            condition.operator === DiscountConditionOperator.IN &&
            !tagConds.length
          ) {
            return false
          }

          if (
            condition.operator === DiscountConditionOperator.NOT_IN &&
            tagConds.length
          ) {
            return false
          }
        }
      } else {
        let resourceId: string | null = null

        if (condition.type === DiscountConditionType.PRODUCTS) {
          resourceId = product.id
        }

        if (condition.type === DiscountConditionType.PRODUCT_TYPES) {
          resourceId = product.type_id
        }

        if (condition.type === DiscountConditionType.PRODUCT_COLLECTIONS) {
          resourceId = product.collection_id
        }

        if (!resourceId) {
          return false
        }

        const resourceSpecificConditions = await this.queryConditionTable({
          type: condition.type,
          condId: condition.id,
          resourceId,
        })

        if (
          condition.operator === DiscountConditionOperator.IN &&
          !resourceSpecificConditions.length
        ) {
          return false
        }

        if (
          condition.operator === DiscountConditionOperator.NOT_IN &&
          resourceSpecificConditions.length
        ) {
          return false
        }
      }
    }

    return true
  }
}
