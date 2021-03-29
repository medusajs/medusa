import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Product } from "./product"

export enum DiscountRuleType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
  FREE_SHIPPING = "free_shipping",
}

export enum AllocationType {
  TOTAL = "total",
  ITEM = "item",
}

@Entity()
export class DiscountRule {
  @PrimaryColumn()
  id: string

  @Column()
  description: string

  @Column({
    type: "enum",
    enum: DiscountRuleType,
  })
  type: DiscountRuleType

  @Column()
  value: number

  @Column({
    type: "enum",
    enum: AllocationType,
    nullable: true,
  })
  allocation: AllocationType

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: "discount_rule_products",
    joinColumn: {
      name: "discount_rule_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  valid_for: Product[]

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = ulid()
    this.id = `dru_${id}`
  }
}

/**
 * @schema discount_rule
 * title: "Discount Rule"
 * description: "Holds the rules that governs how a Discount is calculated when applied to a Cart."
 * x-resourceId: discount_rule
 * properties:
 *   id:
 *     description: "The id of the Discount Rule. Will be prefixed by `dru_`."
 *     type: string
 *   type:
 *     description: "The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers."
 *     type: string
 *     enum:
 *       - fixed
 *       - percentage
 *       - free_shipping
 *   description:
 *     description: "A short description of the discount"
 *     type: string
 *   value:
 *     description: "The value that the discount represents; this will depend on the type of the discount"
 *     type: integer
 *   allocation:
 *     description: "The scope that the discount should apply to."
 *     type: string
 *     enum:
 *       - total
 *       - item
 *   valid_for:
 *     description: "A set of Products that the discount can be used for."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product"
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
