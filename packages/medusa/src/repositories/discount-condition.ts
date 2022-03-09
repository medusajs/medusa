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
  DiscountConditionType,
} from "../models/discount-condition"
import { DiscountConditionCustomerGroup } from "../models/discount-condition-customer-group"
import { DiscountConditionProduct } from "../models/discount-condition-product"
import { DiscountConditionProductCollection } from "../models/discount-condition-product-collection"
import { DiscountConditionProductTag } from "../models/discount-condition-product-tag"
import { DiscountConditionProductType } from "../models/discount-condition-product-type"

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
    id: string,
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
      condition_id: id,
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
        .where({ condition_id: id, [resourceId]: Not(In(resourceIds)) })
        .execute()
    }

    return await this.manager
      .createQueryBuilder(fromTable, "discon")
      .select()
      .where(insertResult.identifiers)
      .getMany()
  }
}
