import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm"
import {
  FeatureFlagColumn,
  FeatureFlagDecorators,
} from "../utils/feature-flag-decorators"

import { BaseEntity } from "../interfaces/models/base-entity"
import { Currency } from "./currency"
import { DbAwareColumn } from "../utils/db-aware-column"
import { SalesChannel } from "./sales-channel"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Store extends BaseEntity {
  @Column({ default: "Medusa Store" })
  name: string

  @Column({ default: "usd" })
  default_currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "default_currency_code", referencedColumnName: "code" })
  default_currency?: Currency | null

  @ManyToMany(() => Currency)
  @JoinTable({
    name: "store_currencies",
    joinColumn: {
      name: "store_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "currency_code",
      referencedColumnName: "code",
    },
  })
  currencies?: Currency[]

  @Column({ nullable: true, type: "text" })
  swap_link_template: string | null

  @Column({ nullable: true, type: "text" })
  payment_link_template: string | null

  @Column({ nullable: true, type: "text" })
  invite_link_template: string | null

  @Column({ nullable: true })
  default_location_id: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @FeatureFlagColumn("sales_channels", { nullable: true, type: "text" })
  default_sales_channel_id?: string | null

  @FeatureFlagDecorators("sales_channels", [
    OneToOne(() => SalesChannel),
    JoinColumn({ name: "default_sales_channel_id" }),
  ])
  default_sales_channel?: SalesChannel | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "store")
  }
}

/**
 * @schema Store
 * title: "Store"
 * description: "Holds settings for the Store, such as name, currencies, etc."
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The store's ID
 *     example: store_01G1G5V21KADXNGH29BJMAJ4B4
 *   name:
 *     description: "The name of the Store - this may be displayed to the Customer."
 *     type: string
 *     example: Medusa Store
 *   default_currency_code:
 *     description: "The 3 character currency code that is the default of the store."
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   default_currency:
 *     description: Available if the relation `default_currency` is expanded.
 *     $ref: "#/components/schemas/Currency"
 *   currencies:
 *     description: The currencies that are enabled for the Store. Available if the relation `currencies` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Currency"
 *   swap_link_template:
 *     description: "A template to generate Swap links from. Use {{cart_id}} to include the Swap's `cart_id` in the link."
 *     type: string
 *     example: null
 *   payment_link_template:
 *     description: "A template to generate Payment links from. Use {{cart_id}} to include the payment's `cart_id` in the link."
 *     type: string
 *     example: null
 *   invite_link_template:
 *     description: "A template to generate Invite links from"
 *     type: string
 *     example: null
 *   default_sales_channel_id:
 *     type: string
 *     description: The sales channel ID the cart is associated with.
 *     example: null
 *   default_sales_channel:
 *     description: A sales channel object. Available if the relation `default_sales_channel` is expanded.
 *     type: object
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
