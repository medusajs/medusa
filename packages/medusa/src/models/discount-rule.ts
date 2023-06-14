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
 * @schema DiscountRule
 * title: "Discount Rule"
 * description: "Holds the rules that governs how a Discount is calculated when applied to a Cart."
 * type: object
 * required:
 *   - allocation
 *   - created_at
 *   - deleted_at
 *   - description
 *   - id
 *   - metadata
 *   - type
 *   - updated_at
 *   - value
 * properties:
 *   id:
 *     description: The discount rule's ID
 *     type: string
 *     example: dru_01F0YESMVK96HVX7N419E3CJ7C
 *   type:
 *     description: The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
 *     type: string
 *     enum:
 *       - fixed
 *       - percentage
 *       - free_shipping
 *     example: percentage
 *   description:
 *     description: A short description of the discount
 *     nullable: true
 *     type: string
 *     example: 10 Percent
 *   value:
 *     description: The value that the discount represents; this will depend on the type of the discount
 *     type: integer
 *     example: 10
 *   allocation:
 *     description: The scope that the discount should apply to.
 *     nullable: true
 *     type: string
 *     enum:
 *       - total
 *       - item
 *     example: total
 *   conditions:
 *     description: A set of conditions that can be used to limit when  the discount can be used. Available if the relation `conditions` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/DiscountCondition"
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
 */
