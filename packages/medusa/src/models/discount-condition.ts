import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { CustomerGroup } from "./customer-group"
import { DiscountRule } from "./discount-rule"
import { Product } from "./product"
import { ProductCollection } from "./product-collection"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"

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
export class DiscountCondition {
  @PrimaryColumn()
  id: string

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

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) {
      return
    }

    const id = ulid()
    this.id = `discon_${id}`
  }
}

/**
 * @schema discount_condition
 * title: "Discount Condition"
 * description: "Holds rule conditions for when a discount is applicable"
 * x-resourceId: discount_condition
 * properties:
 *   id:
 *     description: "The id of the Discount Condition. Will be prefixed by `discon_`."
 *     type: string
 *   type:
 *     description: "The type of the Condition"
 *     type: string
 *     enum:
 *       - products
 *       - product_types
 *       - product_collections
 *       - product_tags
 *       - customer_groups
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   update_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
