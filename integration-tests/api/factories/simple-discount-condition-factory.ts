import {
  DiscountCondition,
  DiscountConditionOperator,
  DiscountConditionType,
} from "@medusajs/medusa/dist/models/discount-condition"
import { DiscountConditionCustomerGroup } from "@medusajs/medusa/dist/models/discount-condition-customer-group"
import { DiscountConditionProduct } from "@medusajs/medusa/dist/models/discount-condition-product"
import { DiscountConditionProductCollection } from "@medusajs/medusa/dist/models/discount-condition-product-collection"
import { DiscountConditionProductTag } from "@medusajs/medusa/dist/models/discount-condition-product-tag"
import { DiscountConditionProductType } from "@medusajs/medusa/dist/models/discount-condition-product-type"
import { DiscountConditionJoinTableForeignKey } from "@medusajs/medusa/dist/repositories/discount-condition"
import faker from "faker"
import { DataSource } from "typeorm"

export type DiscountConditionFactoryData = {
  id?: string
  rule_id: string
  type: DiscountConditionType
  operator: DiscountConditionOperator
  products: string[]
  product_collections: string[]
  product_types: string[]
  product_tags: string[]
  customer_groups: string[]
}

const getJoinTableResourceIdentifiers = (type: string) => {
  let conditionTable: any
  let resourceKey

  switch (type) {
    case DiscountConditionType.PRODUCTS: {
      resourceKey = DiscountConditionJoinTableForeignKey.PRODUCT_ID
      conditionTable = DiscountConditionProduct
      break
    }
    case DiscountConditionType.PRODUCT_TYPES: {
      resourceKey = DiscountConditionJoinTableForeignKey.PRODUCT_TYPE_ID
      conditionTable = DiscountConditionProductType
      break
    }
    case DiscountConditionType.PRODUCT_COLLECTIONS: {
      resourceKey = DiscountConditionJoinTableForeignKey.PRODUCT_COLLECTION_ID
      conditionTable = DiscountConditionProductCollection
      break
    }
    case DiscountConditionType.PRODUCT_TAGS: {
      resourceKey = DiscountConditionJoinTableForeignKey.PRODUCT_TAG_ID

      conditionTable = DiscountConditionProductTag
      break
    }
    case DiscountConditionType.CUSTOMER_GROUPS: {
      resourceKey = DiscountConditionJoinTableForeignKey.CUSTOMER_GROUP_ID
      conditionTable = DiscountConditionCustomerGroup
      break
    }
    default:
      break
  }

  return {
    resourceKey,
    conditionTable,
  }
}

export const simpleDiscountConditionFactory = async (
  dataSource: DataSource,
  data: DiscountConditionFactoryData,
  seed?: number
): Promise<void> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  let resources = []

  if (data.products) {
    resources = data.products
  }
  if (data.product_collections) {
    resources = data.product_collections
  }
  if (data.product_types) {
    resources = data.product_types
  }
  if (data.product_tags) {
    resources = data.product_tags
  }
  if (data.customer_groups) {
    resources = data.customer_groups
  }

  const toCreate = {
    type: data.type,
    operator: data.operator,
    discount_rule_id: data.rule_id,
  }

  if (data.id) {
    toCreate["id"] = data.id
  }

  const condToSave = manager.create(DiscountCondition, toCreate)

  const { conditionTable, resourceKey } = getJoinTableResourceIdentifiers(
    data.type
  )

  const condition = await manager.save(condToSave)

  for (const resourceCond of resources) {
    const toSave = manager.create(conditionTable, {
      [resourceKey]: resourceCond,
      condition_id: condition.id,
    })

    await manager.save(toSave)
  }
}
