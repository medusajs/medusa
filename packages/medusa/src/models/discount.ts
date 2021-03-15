import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinTable,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { DiscountRule } from "./discount-rule"
import { Region } from "./region"

@Entity()
export class Discount {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  code: string

  @Column()
  is_dynamic: boolean

  @Index()
  @Column({ nullable: true })
  rule_id: string

  @ManyToOne(() => DiscountRule, { cascade: true, eager: true })
  @JoinColumn({ name: "rule_id" })
  rule: DiscountRule

  @Column()
  is_disabled: boolean

  @Column({ nullable: true })
  parent_discount_id: string

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "parent_discount_id" })
  parent_discount: Discount

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  starts_at: Date

  @Column({ type: "timestamptz", nullable: true })
  ends_at: Date

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
    if (this.id) return
    const id = ulid()
    this.id = `disc_${id}`
    this.code = this.code.toUpperCase()
  }
}

/**
 * @schema discount
 * title: "Discount"
 * description: "Represents a discount that can be applied to a cart for promotional purposes."
 * x-resourceId: discount
 * properties:
 *   id:
 *     description: "The id of the Discount. Will be prefixed by `disc_`."
 *     type: string
 *   code:
 *     description: "A unique code for the discount - this will be used by the customer to apply the discount"
 *     type: string
 *   is_dynamic:
 *     description: "A flag to indicate if multiple instances of the discount can be generated. I.e. for newsletter discounts"
 *     type: boolean
 *   rule:
 *     description: "The Discount Rule that governs the behaviour of the Discount"
 *     anyOf:
 *       - $ref: "#/components/schemas/discount_rule"
 *   is_disabled:
 *     description: "Whether the Discount has been disabled. Disabled discounts cannot be applied to carts"
 *     type: boolean
 *   parent_discount_id:
 *     description: "The Discount that the discount was created from. This will always be a dynamic discount"
 *     type: string
 *   starts_at:
 *     description: "The time at which the discount can be used."
 *     type: string
 *     format: date-time
 *   ends_at:
 *     description: "The time at which the discount can no longer be used."
 *     type: string
 *     format: date-time
 *   regions:
 *     description: "The Regions in which the Discount can be used"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/region"
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
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
