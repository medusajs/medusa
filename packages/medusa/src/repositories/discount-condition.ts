import { DeleteResult, EntityRepository, In, Not, Repository } from "typeorm"
import {
  DiscountCondition,
  DiscountConditionType,
} from "../models/discount-condition"
import { DiscountConditionCustomerGroup } from "../models/discount-condition-customer-group"
import { DiscountConditionProduct } from "../models/discount-condition-product"
import { DiscountConditionProductCollection } from "../models/discount-condition-product-collection"
import { DiscountConditionProductTag } from "../models/discount-condition-product-tag"
import { DiscountConditionProductType } from "../models/discount-condition-product-type"

@EntityRepository(DiscountCondition)
export class DiscountConditionRepository extends Repository<DiscountCondition> {
  getResourceIdentifiers(type: string): {
    fromTable: any
    resourceId: string
  } {
    let fromTable: any = null
    let resourceId = ""

    switch (type) {
      case DiscountConditionType.PRODUCTS: {
        fromTable = DiscountConditionProduct
        resourceId = "product_id"
        break
      }
      case DiscountConditionType.PRODUCT_TYPES: {
        fromTable = DiscountConditionProductType
        resourceId = "product_type_id"
        break
      }
      case DiscountConditionType.PRODUCT_COLLECTIONS: {
        fromTable = DiscountConditionProductCollection
        resourceId = "product_collection_id"
        break
      }
      case DiscountConditionType.PRODUCT_TAGS: {
        fromTable = DiscountConditionProductTag
        resourceId = "product_tag_id"
        break
      }
      case DiscountConditionType.CUSTOMER_GROUPS: {
        fromTable = DiscountConditionCustomerGroup
        resourceId = "customer_group_id"
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

    if (fromTable) {
      return await this.createQueryBuilder()
        .delete()
        .from(fromTable)
        .where({ rate_id: id, [resourceId]: In(resourceIds) })
        .execute()
    }
  }

  async addConditionResources(
    id: string,
    resourceIds: string[],
    type: DiscountConditionType,
    overrideExisting = false
  ): Promise<any[]> {
    let toInsert: { condition_id: string; [x: string]: string }[] | [] = []

    const { fromTable, resourceId } = this.getResourceIdentifiers(type)

    toInsert = resourceIds.map((pId) => ({
      condition_id: id,
      [resourceId]: pId,
    }))

    if (fromTable) {
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
          .where({ rate_id: id, [resourceId]: Not(In(resourceIds)) })
          .execute()
      }

      return (await this.manager
        .createQueryBuilder(fromTable, "discon")
        .select()
        .where(insertResult.identifiers)
        .getMany()) as any
    }

    return []
  }
}
