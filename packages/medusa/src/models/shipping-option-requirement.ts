import {
  Entity,
  BeforeInsert,
  Column,
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
