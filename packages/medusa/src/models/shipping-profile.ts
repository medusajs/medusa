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
import { Product } from "./product"

export enum ShippingProfileType {
  DEFAULT = "default",
  GIFT_CARD = "gift_card",
  CUSTOM = "custom",
}

@Entity()
export class ShippingProfile {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ type: "enum", enum: ShippingProfileType })
  type: ShippingProfileType

  @OneToMany(
    () => Product,
    product => product.profile
  )
  products: Product[]

  @OneToMany(
    () => ShippingOption,
    so => so.profile
  )
  shipping_options: ShippingOption[]

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
    this.id = `sp_${id}`
  }
}
