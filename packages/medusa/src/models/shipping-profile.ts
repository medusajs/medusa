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

/**
 * @schema shipping_profile
 * title: "Shipping Profile"
 * description: "Shipping Profiles have a set of defined Shipping Options that can be used to fulfill a given set of Products."
 * x-resourceId: shipping_profile
 * properties:
 *   id:
 *     description: "The id of the Shipping Profile. This value will be prefixed with `sp_`."
 *     type: string
 *   name:
 *     description: "The name given to the Shipping profile - this may be displayed to the Customer."
 *     type: string
 *   type:
 *     description: "The type of the Shipping Profile, may be `default`, `gift_card` or `custom`."
 *     type: string
 *     enum:
 *       - default
 *       - gift_card
 *       - custom
 *   products:
 *     description: "The Products that the Shipping Profile defines Shipping Options for."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product"
 *   shipping_options:
 *     description: "The Shipping Options that can be used to fulfill the Products in the Shipping Profile."
 *     type: array
 *     items:
 *       anyOf:
 *         - $ref: "#/components/schemas/shipping_option"
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
