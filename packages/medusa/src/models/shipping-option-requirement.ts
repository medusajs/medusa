import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { generateEntityId } from "../utils/generate-entity-id"
import { ShippingOption } from "./shipping-option"

/**
 * @enum
 *
 * The type of shipping option requirement.
 */
export enum RequirementType {
  /**
   * The shipping option can only be applied if the subtotal is greater than the requirement's amount.
   */
  MIN_SUBTOTAL = "min_subtotal",
  /**
   * The shipping option can only be applied if the subtotal is less than the requirement's amont.
   */
  MAX_SUBTOTAL = "max_subtotal",
}

@Entity()
export class ShippingOptionRequirement {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  shipping_option_id: string

  @ManyToOne(() => ShippingOption)
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: Relation<ShippingOption>

  @DbAwareColumn({ type: "enum", enum: RequirementType })
  type: RequirementType

  @Column({ type: "int" })
  amount: number

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sor")
  }
}

/**
 * @schema ShippingOptionRequirement
 * title: "Shipping Option Requirement"
 * description: "A shipping option requirement defines conditions that a Cart must satisfy for the Shipping Option to be available for usage in the Cart."
 * type: object
 * required:
 *   - amount
 *   - deleted_at
 *   - id
 *   - shipping_option_id
 *   - type
 * properties:
 *   id:
 *     description: The shipping option requirement's ID
 *     type: string
 *     example: sor_01G1G5V29AB4CTNDRFSRWSRKWD
 *   shipping_option_id:
 *     description: The ID of the shipping option that the requirements belong to.
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   shipping_option:
 *     description: The details of the shipping option that the requirements belong to.
 *     x-expandable: "shipping_option"
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingOption"
 *   type:
 *     description: The type of the requirement, this defines how the value will be compared to the Cart's total. `min_subtotal` requirements define the minimum subtotal that is needed for the Shipping Option to be available, while the `max_subtotal` defines the maximum subtotal that the Cart can have for the Shipping Option to be available.
 *     type: string
 *     enum:
 *       - min_subtotal
 *       - max_subtotal
 *     example: min_subtotal
 *   amount:
 *     description: The amount to compare the Cart subtotal to.
 *     type: integer
 *     example: 100
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 */
