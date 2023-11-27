import { BeforeInsert, Column, Entity, OneToMany } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { DiscountCondition } from "./discount-condition"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

/**
 * @enum
 * 
 * The possible types of discount rules.
 */
export enum DiscountRuleType {
  /**
   * Discounts that reduce the price by a fixed amount.
   */
  FIXED = "fixed",
  /**
   * Discounts that reduce the price by a percentage reduction.
   */
  PERCENTAGE = "percentage",
  /**
   * Discounts that sets the shipping price to `0`.
   */
  FREE_SHIPPING = "free_shipping",
}

/**
 * @enum
 * 
 * The scope that the discount should apply to.
 */
export enum AllocationType {
  /**
   * The discount should be applied to the checkout total.
   */
  TOTAL = "total",
  /**
   * The discount should be applied to applicable items in the cart.
   */
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

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "dru")
  }
}

/**
 * @schema DiscountRule
 * title: "Discount Rule"
 * description: "A discount rule defines how a Discount is calculated when applied to a Cart."
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
 *     description: >-
 *       The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
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
 *     description: The details of the discount conditions associated with the rule. They can be used to limit when the discount can be used.
 *     type: array
 *     x-expandable: "conditions"
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
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
