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

enum DiscountConditionResourceTableId {
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
  getResourceIdentifiers(type: string): {
    fromTable: DiscountConditionResourceType
    resourceId: string | undefined
  } {
    let fromTable: DiscountConditionResourceType = null
    let resourceId: DiscountConditionResourceType | undefined = undefined

    switch (type) {
      case DiscountConditionType.PRODUCTS: {
        fromTable = DiscountConditionProduct
        resourceId = DiscountConditionResourceTableId.PRODUCT_ID
        break
      }
      case DiscountConditionType.PRODUCT_TYPES: {
        fromTable = DiscountConditionProductType
        resourceId = DiscountConditionResourceTableId.PRODUCT_TYPE_ID
        break
      }
      case DiscountConditionType.PRODUCT_COLLECTIONS: {
        fromTable = DiscountConditionProductCollection
        resourceId = DiscountConditionResourceTableId.PRODUCT_COLLECTION_ID
        break
      }
      case DiscountConditionType.PRODUCT_TAGS: {
        fromTable = DiscountConditionProductTag
        resourceId = DiscountConditionResourceTableId.PRODUCT_TAG_ID
        break
      }
      case DiscountConditionType.CUSTOMER_GROUPS: {
        fromTable = DiscountConditionCustomerGroup
        resourceId = DiscountConditionResourceTableId.CUSTOMER_GROUP_ID
        break
      }
      default:
        break
    }

    return { fromTable, resourceId }
  }

  async removeConditionResources(
    id: string,
    type: DiscountConditionType,
    resourceIds: string[]
  ): Promise<DeleteResult | void> {
    const { fromTable, resourceId } = this.getResourceIdentifiers(type)

    if (!fromTable || !resourceId) {
      return Promise.resolve()
    }

    return await this.createQueryBuilder()
      .delete()
      .from(fromTable)
      .where({ condition_id: id, [resourceId]: In(resourceIds) })
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

    const { fromTable, resourceId } = this.getResourceIdentifiers(type)

    if (!fromTable || !resourceId) {
      return Promise.resolve([])
    }

    toInsert = resourceIds.map((pId) => ({
      condition_id: conditionId,
      [resourceId]: pId,
    }))

    const insertResult = await this.createQueryBuilder()
      .insert()
      .orIgnore(true)
      .into(fromTable)
      .values(toInsert)
      .execute()

    if (overrideExisting) {
      await this.createQueryBuilder()
        .delete()
        .from(fromTable)
        .where({
          condition_id: conditionId,
          [resourceId]: Not(In(resourceIds)),
        })
        .execute()
    }

    return await this.manager
      .createQueryBuilder(fromTable, "discon")
      .select()
      .where(insertResult.identifiers)
      .getMany()
  }

  async queryConditionTable({
    type,
    condId,
    conditionTypeId,
  }): Promise<
    (
      | DiscountConditionProduct
      | DiscountConditionProductType
      | DiscountConditionProductCollection
      | DiscountConditionProductTag
      | DiscountConditionCustomerGroup
    )[]
  > {
    const { fromTable, resourceId } = this.getResourceIdentifiers(type)

    if (fromTable) {
      return await this.manager
        .createQueryBuilder(fromTable, "conds")
        .select()
        .where(`${"conds"}.${resourceId} = :conditionTypeId`, {
          conditionTypeId,
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

    // We would like to break the loop as early as possible
    // to minimize the # of DB accesses, which is why we
    // check for conditions after each query.
    //
    // retrieve all conditions for each type where condition type id is in jointable (products, product_types, product_collections, product_tags)
    // "E.g. for a given condition, give me all products affected by it"
    // for each of these types, we check:
    //    if condition operation is `in` and the query for conditions defined for the given type is empty, the discount is invalid
    //    if condition operation is `not_in` and the query for conditions defined for the given type is not empty, the discount is invalid
    for (const condition of discountConditions) {
      const prodConds = await this.queryConditionTable({
        type: "products",
        condId: condition.id,
        conditionTypeId: product.id,
      })

      if (
        condition.operator === DiscountConditionOperator.IN &&
        !prodConds.length
      ) {
        return false
      }

      if (
        condition.operator === DiscountConditionOperator.NOT_IN &&
        prodConds.length
      ) {
        return false
      }

      const collConds = await this.queryConditionTable({
        type: "product_collections",
        condId: condition.id,
        conditionTypeId: product.collection_id,
      })

      if (
        condition.operator === DiscountConditionOperator.IN &&
        !collConds.length
      ) {
        return false
      }

      if (
        condition.operator === DiscountConditionOperator.NOT_IN &&
        collConds.length
      ) {
        return false
      }

      const typeConds = await this.queryConditionTable({
        type: "product_types",
        condId: condition.id,
        conditionTypeId: product.type_id,
      })

      if (
        condition.operator === DiscountConditionOperator.IN &&
        !typeConds.length
      ) {
        return false
      }

      if (
        condition.operator === DiscountConditionOperator.NOT_IN &&
        typeConds.length
      ) {
        return false
      }

      for (const tag of product.tags) {
        const tagConds = await this.queryConditionTable({
          type: "product_tags",
          condId: condition.id,
          conditionTypeId: tag.id,
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
    }

    return true
  }
}
