import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Unique,
} from "typeorm"

import { CustomerGroup } from "./customer-group"
import { DbAwareColumn } from "../utils/db-aware-column"
import { DiscountRule } from "./discount-rule"
import { Product } from "./product"
import { ProductCollection } from "./product-collection"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

export enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export enum DiscountConditionOperator {
  IN = "in",
  NOT_IN = "not_in",
}

@Entity()
@Unique("dctypeuniq", ["type", "operator", "discount_rule_id"])
export class DiscountCondition extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    enum: DiscountConditionType,
  })
  type: DiscountConditionType

  @DbAwareColumn({
    type: "enum",
    enum: DiscountConditionOperator,
  })
  operator: DiscountConditionOperator

  @Index()
  @Column()
  discount_rule_id: string

  @ManyToOne(() => DiscountRule, (dr) => dr.conditions)
  @JoinColumn({ name: "discount_rule_id" })
  discount_rule: DiscountRule

  @ManyToMany(() => Product)
  @JoinTable({
    name: "discount_condition_product",
    joinColumn: {
      name: "condition_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[]

  @ManyToMany(() => ProductType)
  @JoinTable({
    name: "discount_condition_product_type",
    joinColumn: {
      name: "condition_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_type_id",
      referencedColumnName: "id",
    },
  })
  product_types: ProductType[]

  @ManyToMany(() => ProductTag)
  @JoinTable({
    name: "discount_condition_product_tag",
    joinColumn: {
      name: "condition_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_tag_id",
      referencedColumnName: "id",
    },
  })
  product_tags: ProductTag[]

  @ManyToMany(() => ProductCollection)
  @JoinTable({
    name: "discount_condition_product_collection",
    joinColumn: {
      name: "condition_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_collection_id",
      referencedColumnName: "id",
    },
  })
  product_collections: ProductCollection[]

  @ManyToMany(() => CustomerGroup)
  @JoinTable({
    name: "discount_condition_customer_group",
    joinColumn: {
      name: "condition_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "customer_group_id",
      referencedColumnName: "id",
    },
  })
  customer_groups: CustomerGroup[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "discon")
  }
}

/**
 * @schema discount_condition
 * title: "Discount Condition"
 * description: "Holds rule conditions for when a discount is applicable"
 * x-resourceId: discount_condition
 * required:
 *   - type
 *   - operator
 *   - discount_rule_id
 * properties:
 *   id:
 *     type: string
 *     description: The discount condition's ID
 *     example: discon_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   type:
 *     description: "The type of the Condition"
 *     type: string
 *     enum:
 *       - products
 *       - product_types
 *       - product_collections
 *       - product_tags
 *       - customer_groups
 *   operator:
 *     description: "The operator of the Condition"
 *     type: string
 *     enum:
 *       - in
 *       - not_in
 *   discount_rule_id:
 *     type: string
 *     description: The ID of the discount rule associated with the condition
 *     example: dru_01F0YESMVK96HVX7N419E3CJ7C
 *   discount_rule:
 *     description: Available if the relation `discount_rule` is expanded.
 *     $ref: "#/components/schemas/discount_rule"
 *   products:
 *     description: products associated with this condition if type = products. Available if the relation `products` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A product object.
 *   product_types:
 *     description: product types associated with this condition if type = product_types. Available if the relation `product_types` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A product type object.
 *   product_tags:
 *     description: product tags associated with this condition if type = product_tags. Available if the relation `product_tags` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A product tag object.
 *   product_collections:
 *     description: product collections associated with this condition if type = product_collections. Available if the relation `product_collections` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A product collection object.
 *   customer_groups:
 *     description: customer groups associated with this condition if type = customer_groups. Available if the relation `customer_groups` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A customer group object.
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
