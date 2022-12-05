import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { DiscountRule } from "./discount-rule"
import { Region } from "./region"

@Entity()
export class Discount extends SoftDeletableEntity {
  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  code: string

  @Column()
  is_dynamic: boolean

  @Index()
  @Column({ nullable: true })
  rule_id: string

  @ManyToOne(() => DiscountRule, { cascade: true })
  @JoinColumn({ name: "rule_id" })
  rule: DiscountRule

  @Column()
  is_disabled: boolean

  @Column({ nullable: true })
  parent_discount_id: string

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "parent_discount_id" })
  parent_discount: Discount

  @Column({
    type: resolveDbType("timestamptz"),
    default: () => "CURRENT_TIMESTAMP",
  })
  starts_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  ends_at: Date | null

  @Column({ type: String, nullable: true })
  valid_duration: string | null

  @ManyToMany(() => Region, { cascade: true })
  @JoinTable({
    name: "discount_regions",
    joinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
  })
  regions: Region[]

  @Column({ type: Number, nullable: true })
  usage_limit: number | null

  @Column({ default: 0 })
  usage_count: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private upperCaseCodeAndTrim(): void {
    this.code = this.code.toUpperCase().trim()
    if (this.id) {
      return
    }

    this.id = generateEntityId(this.id, "disc")
  }
}

/**
 * @schema discount
 * title: "Discount"
 * description: "Represents a discount that can be applied to a cart for promotional purposes."
 * x-resourceId: discount
 * type: object
 * required:
 *   - code
 *   - is_dynamic
 * properties:
 *   id:
 *     type: string
 *     description: The discount's ID
 *     example: disc_01F0YESMW10MGHWJKZSDDMN0VN
 *   code:
 *     description: "A unique code for the discount - this will be used by the customer to apply the discount"
 *     type: string
 *     example: 10DISC
 *   is_dynamic:
 *     description: "A flag to indicate if multiple instances of the discount can be generated. I.e. for newsletter discounts"
 *     type: boolean
 *     example: false
 *   rule_id:
 *     type: string
 *     description: "The Discount Rule that governs the behaviour of the Discount"
 *     example: dru_01F0YESMVK96HVX7N419E3CJ7C
 *   rule:
 *     description: Available if the relation `rule` is expanded.
 *     $ref: "#/components/schemas/discount_rule"
 *   is_disabled:
 *     description: "Whether the Discount has been disabled. Disabled discounts cannot be applied to carts"
 *     type: boolean
 *     example: false
 *   parent_discount_id:
 *     type: string
 *     description: "The Discount that the discount was created from. This will always be a dynamic discount"
 *     example: disc_01G8ZH853YPY9B94857DY91YGW
 *   parent_discount:
 *     description: Available if the relation `parent_discount` is expanded.
 *     $ref: "#/components/schemas/discount"
 *   starts_at:
 *     description: "The time at which the discount can be used."
 *     type: string
 *     format: date-time
 *   ends_at:
 *     description: "The time at which the discount can no longer be used."
 *     type: string
 *     format: date-time
 *   valid_duration:
 *     type: string
 *     description: Duration the discount runs between
 *     example: P3Y6M4DT12H30M5S
 *   regions:
 *     description: The Regions in which the Discount can be used. Available if the relation `regions` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A region object.
 *   usage_limit:
 *     description: "The maximum number of times that a discount can be used."
 *     type: integer
 *     example: 100
 *   usage_count:
 *     description: "The number of times a discount has been used."
 *     type: integer
 *     example: 50
 *     default: 0
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
