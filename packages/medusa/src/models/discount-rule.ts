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
 *   conditions:
 *     description: "A set of conditions that can be used to limit when  the discount can be used"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/discount_condition"
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
