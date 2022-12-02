import { BeforeInsert, Column, Entity, OneToMany } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { DiscountCondition } from "./discount-condition"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

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
export class DiscountRule extends SoftDeletableEntity {
  @Column({ nullable: true })
  description: string

  @DbAwareColumn({
    type: "enum",
    enum: DiscountRuleType,
  })
  type: DiscountRuleType

  @Column()
  value: number

  @DbAwareColumn({
    type: "enum",
    enum: AllocationType,
    nullable: true,
  })
  allocation: AllocationType

  @OneToMany(() => DiscountCondition, (conditions) => conditions.discount_rule)
  conditions: DiscountCondition[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "dru")
  }
}

/**
 * @schema discount_rule
 * title: "Discount Rule"
 * description: "Holds the rules that governs how a Discount is calculated when applied to a Cart."
 * x-resourceId: discount_rule
 * type: object
 * required:
 *   - type
 *   - value
 * properties:
 *   id:
 *     type: string
 *     description: The discount rule's ID
 *     example: dru_01F0YESMVK96HVX7N419E3CJ7C
 *   type:
 *     description: "The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers."
 *     type: string
 *     enum:
 *       - fixed
 *       - percentage
 *       - free_shipping
 *     example: percentage
 *   description:
 *     description: "A short description of the discount"
 *     type: string
 *     example: 10 Percent
 *   value:
 *     description: "The value that the discount represents; this will depend on the type of the discount"
 *     type: integer
 *     example: 10
 *   allocation:
 *     description: "The scope that the discount should apply to."
 *     type: string
 *     enum:
 *       - total
 *       - item
 *     example: total
 *   conditions:
 *     description: A set of conditions that can be used to limit when  the discount can be used. Available if the relation `conditions` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A discount condition object.
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
