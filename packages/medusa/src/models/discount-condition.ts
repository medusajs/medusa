import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
  Unique,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"
import { CustomerGroup } from "./customer-group"
import { DiscountRule } from "./discount-rule"
import { Product } from "./product"
import { ProductCollection } from "./product-collection"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"

/**
 * @enum
 *
 * The discount condition's type.
 */
export enum DiscountConditionType {
  /**
   * The discount condition is used for products.
   */
  PRODUCTS = "products",
  /**
   * The discount condition is used for product types.
   */
  PRODUCT_TYPES = "product_types",
  /**
   * The discount condition is used for product collections.
   */
  PRODUCT_COLLECTIONS = "product_collections",
  /**
   * The discount condition is used for product tags.
   */
  PRODUCT_TAGS = "product_tags",
  /**
   * The discount condition is used for customer groups.
   */
  CUSTOMER_GROUPS = "customer_groups",
}

/**
 * @enum
 *
 * The possible operators used for a discount condition.
 */
export enum DiscountConditionOperator {
  /**
   * The discountable resources are within the specified resources.
   */
  IN = "in",
  /**
   * The discountable resources are everything but the specified resources.
   */
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
  discount_rule: Relation<DiscountRule>

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

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "discon")
  }
}

/**
 * @schema DiscountCondition
 * title: "Discount Condition"
 * description: "Holds rule conditions for when a discount is applicable"
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - discount_rule_id
 *   - id
 *   - metadata
 *   - operator
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The discount condition's ID
 *     type: string
 *     example: discon_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   type:
 *     description: "The type of the condition. The type affects the available resources associated with the condition. For example, if the type is `products`,
 *      that means the `products` relation will hold the products associated with this condition and other relations will be empty."
 *     type: string
 *     enum:
 *       - products
 *       - product_types
 *       - product_collections
 *       - product_tags
 *       - customer_groups
 *   operator:
 *     description: >-
 *       The operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that
 *       discountable resources are everything but the specified resources.
 *     type: string
 *     enum:
 *       - in
 *       - not_in
 *   discount_rule_id:
 *     description: The ID of the discount rule associated with the condition
 *     type: string
 *     example: dru_01F0YESMVK96HVX7N419E3CJ7C
 *   discount_rule:
 *     description: The details of the discount rule associated with the condition.
 *     x-expandable: "discount_rule"
 *     nullable: true
 *     $ref: "#/components/schemas/DiscountRule"
 *   products:
 *     description: products associated with this condition if `type` is `products`.
 *     type: array
 *     x-expandable: "products"
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   product_types:
 *     description: Product types associated with this condition if `type` is `product_types`.
 *     type: array
 *     x-expandable: "product_types"
 *     items:
 *       $ref: "#/components/schemas/ProductType"
 *   product_tags:
 *     description: Product tags associated with this condition if `type` is `product_tags`.
 *     type: array
 *     x-expandable: "product_tags"
 *     items:
 *       $ref: "#/components/schemas/ProductTag"
 *   product_collections:
 *     description: Product collections associated with this condition if `type` is `product_collections`.
 *     type: array
 *     x-expandable: "product_collections"
 *     items:
 *       $ref: "#/components/schemas/ProductCollection"
 *   customer_groups:
 *     description: Customer groups associated with this condition if `type` is `customer_groups`.
 *     type: array
 *     x-expandable: "customer_groups"
 *     items:
 *       $ref: "#/components/schemas/CustomerGroup"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
