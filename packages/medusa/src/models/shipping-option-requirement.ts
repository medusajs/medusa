import {
  Entity,
  BeforeInsert,
  Column,
  Index,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { ShippingOption } from "./shipping-option"

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

  @Column({ type: "enum", enum: RequirementType })
  type: RequirementType

  @Column({ type: "int" })
  amount: number

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `sor_${id}`
  }
}

/**
 * @schema shipping_option_requirement
 * title: "Shipping Option Requirement"
 * description: "A requirement that a Cart must satisfy for the Shipping Option to be available to the Cart."
 * x-resourceId: shipping_option_requirement
 * properties:
 *   id:
 *     description: "The id of the Shipping Option Requirement. This value will be prefixed with `sor_`."
 *     type: string
 *   shipping_option_id:
 *     description: "The id of the Shipping Option that the Shipping Option Requirement belongs to."
 *     type: string
 *   type:
 *     description: "The type of the requirement, this defines how the value will be compared to the Cart's total. `min_subtotal` requirements define the minimum subtotal that is needed for the Shipping Option to be available, while the `max_subtotal` defines the maximum subtotal that the Cart can have for the Shipping Option to be available."
 *     type: string
 *     enum:
 *       - min_subtotal
 *       - max_subtotal
 *   amount:
 *     description: "The amount to compare the Cart subtotal to."
 *     type: integer
 */
