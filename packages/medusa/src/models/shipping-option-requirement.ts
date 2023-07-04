import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { ShippingOption } from "./shipping-option"
import { generateEntityId } from "../utils/generate-entity-id"

export enum RequirementType {
  MIN_SUBTOTAL = "min_subtotal",
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
  shipping_option: ShippingOption

  @DbAwareColumn({ type: "enum", enum: RequirementType })
  type: RequirementType

  @Column({ type: "int" })
  amount: number

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sor")
  }
}

/**
 * @schema ShippingOptionRequirement
 * title: "Shipping Option Requirement"
 * description: "A requirement that a Cart must satisfy for the Shipping Option to be available to the Cart."
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
 *     description: The id of the Shipping Option that the hipping option requirement belongs to
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   shipping_option:
 *     description: Available if the relation `shipping_option` is expanded.
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
