/**
 * @schema Cart
 * title: "Cart"
 * description: "A cart represents a virtual shopping bag. It can be used to complete an order, a swap, or a claim."
 * type: object
 * required:
 *   - billing_address_id
 *   - completed_at
 *   - context
 *   - created_at
 *   - customer_id
 *   - deleted_at
 *   - email
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - payment_authorized_at
 *   - payment_id
 *   - payment_session
 *   - region_id
 *   - shipping_address_id
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The cart's ID
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   email:
 *     description: The email associated with the cart
 *     nullable: true
 *     type: string
 *     format: email
 *   billing_address_id:
 *     description: The billing address's ID
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   billing_address:
 *     description: The details of the billing address associated with the cart.
 *     x-expandable: "billing_address"
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   shipping_address_id:
 *     description: The shipping address's ID
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   shipping_address:
 *     description: The details of the shipping address associated with the cart.
 *     x-expandable: "shipping_address"
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   items:
 *     description: The line items added to the cart.
 *     type: array
 *     x-expandable: "items"
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   region_id:
 *     description: The region's ID
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: The details of the region associated with the cart.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   discounts:
 *     description: An array of details of all discounts applied to the cart.
 *     type: array
 *     x-expandable: "discounts"
 *     items:
 *       $ref: "#/components/schemas/Discount"
 *   gift_cards:
 *     description: An array of details of all gift cards applied to the cart.
 *     type: array
 *     x-expandable: "gift_cards"
 *     items:
 *       $ref: "#/components/schemas/GiftCard"
 *   customer_id:
 *     description: The customer's ID
 *     nullable: true
 *     type: string
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   customer:
 *     description: The details of the customer the cart belongs to.
 *     x-expandable: "customer"
 *     nullable: true
 *     $ref: "#/components/schemas/Customer"
 *   payment_session:
 *     description: The details of the selected payment session in the cart.
 *     x-expandable: "payment_session"
 *     nullable: true
 *     $ref: "#/components/schemas/PaymentSession"
 *   payment_sessions:
 *     description: The details of all payment sessions created on the cart.
 *     type: array
 *     x-expandable: "payment_sessions"
 *     items:
 *       $ref: "#/components/schemas/PaymentSession"
 *   payment_id:
 *     description: The payment's ID if available
 *     nullable: true
 *     type: string
 *     example: pay_01G8ZCC5W42ZNY842124G7P5R9
 *   payment:
 *     description: The details of the payment associated with the cart.
 *     nullable: true
 *     x-expandable: "payment"
 *     $ref: "#/components/schemas/Payment"
 *   shipping_methods:
 *     description: The details of the shipping methods added to the cart.
 *     type: array
 *     x-expandable: "shipping_methods"
 *     items:
 *       $ref: "#/components/schemas/ShippingMethod"
 *   type:
 *     description: The cart's type.
 *     type: string
 *     enum:
 *       - default
 *       - swap
 *       - draft_order
 *       - payment_link
 *       - claim
 *     default: default
 *   completed_at:
 *     description: The date with timezone at which the cart was completed.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   payment_authorized_at:
 *     description: The date with timezone at which the payment was authorized.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of a cart in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/development/idempotency-key/overview.md
 *       description: Learn more how to use the idempotency key.
 *   context:
 *     description: "The context of the cart which can include info like IP or user agent."
 *     nullable: true
 *     type: object
 *     example:
 *       ip: "::1"
 *       user_agent: "PostmanRuntime/7.29.2"
 *   sales_channel_id:
 *     description: The sales channel ID the cart is associated with.
 *     nullable: true
 *     type: string
 *     example: null
 *   sales_channel:
 *     description: The details of the sales channel associated with the cart.
 *     nullable: true
 *     x-expandable: "sales_channel"
 *     $ref: "#/components/schemas/SalesChannel"
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
 *   shipping_total:
 *     description: The total of shipping
 *     type: integer
 *     example: 1000
 *   discount_total:
 *     description: The total of discount rounded
 *     type: integer
 *     example: 800
 *   raw_discount_total:
 *     description: The total of discount
 *     type: integer
 *     example: 800
 *   item_tax_total:
 *     description: The total of items with taxes
 *     type: integer
 *     example: 8000
 *   shipping_tax_total:
 *     description: The total of shipping with taxes
 *     type: integer
 *     example: 1000
 *   tax_total:
 *     description: The total of tax
 *     type: integer
 *     example: 0
 *   refunded_total:
 *     description: The total amount refunded if the order associated with this cart is returned.
 *     type: integer
 *     example: 0
 *   total:
 *     description: The total amount of the cart
 *     type: integer
 *     example: 8200
 *   subtotal:
 *     description: The subtotal of the cart
 *     type: integer
 *     example: 8000
 *   refundable_amount:
 *     description: The amount that can be refunded
 *     type: integer
 *     example: 8200
 *   gift_card_total:
 *     description: The total of gift cards
 *     type: integer
 *     example: 0
 *   gift_card_tax_total:
 *     description: The total of gift cards with taxes
 *     type: integer
 *     example: 0
 *   sales_channels:
 *     description: The associated sales channels.
 *     type: array
 *     nullable: true
 *     x-expandable: "sales_channels"
 *     items:
 *       $ref: "#/components/schemas/SalesChannel"
 */

import { MedusaV2Flag, SalesChannelFeatureFlag } from "@medusajs/utils"
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import {
  FeatureFlagColumn,
  FeatureFlagDecorators,
} from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils/generate-entity-id"
import { Address } from "./address"
import { Customer } from "./customer"
import { Discount } from "./discount"
import { GiftCard } from "./gift-card"
import { LineItem } from "./line-item"
import { Payment } from "./payment"
import { PaymentSession } from "./payment-session"
import { Region } from "./region"
import { SalesChannel } from "./sales-channel"
import { ShippingMethod } from "./shipping-method"

export enum CartType {
  DEFAULT = "default",
  SWAP = "swap",
  DRAFT_ORDER = "draft_order",
  PAYMENT_LINK = "payment_link",
  CLAIM = "claim",
}

@Entity()
export class Cart extends SoftDeletableEntity {
  /**
   * @apiIgnore
   */
  readonly object = "cart"

  @Column({ nullable: true })
  email: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address, {
    cascade: ["insert", "remove", "soft-remove"],
  })
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Relation<Address>

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, {
    cascade: ["insert", "remove", "soft-remove"],
  })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Relation<Address> | null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    cascade: ["insert", "remove"],
  })
  items: Relation<LineItem>[]

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Relation<Region>

  @ManyToMany(() => Discount)
  @JoinTable({
    name: "cart_discounts",
    joinColumn: {
      name: "cart_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Relation<Discount>[]

  @ManyToMany(() => GiftCard)
  @JoinTable({
    name: "cart_gift_cards",
    joinColumn: {
      name: "cart_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "gift_card_id",
      referencedColumnName: "id",
    },
  })
  gift_cards: Relation<GiftCard>[]

  @Index()
  @Column({ nullable: true })
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Relation<Customer>

  payment_session: PaymentSession | null

  @OneToMany(() => PaymentSession, (paymentSession) => paymentSession.cart, {
    cascade: true,
  })
  payment_sessions: Relation<PaymentSession>[]

  @Index()
  @Column({ nullable: true })
  payment_id: string

  @OneToOne(() => Payment)
  @JoinColumn({ name: "payment_id" })
  payment: Relation<Payment>

  @OneToMany(() => ShippingMethod, (method) => method.cart, {
    cascade: ["soft-remove", "remove"],
  })
  shipping_methods: Relation<ShippingMethod>[]

  @DbAwareColumn({ type: "enum", enum: CartType, default: "default" })
  type: CartType

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  payment_authorized_at: Date

  @Column({ nullable: true })
  idempotency_key: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  context: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @FeatureFlagColumn(SalesChannelFeatureFlag.key, {
    type: "varchar",
    nullable: true,
  })
  sales_channel_id: string | null

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
    ManyToOne(() => SalesChannel),
    JoinColumn({ name: "sales_channel_id" }),
  ])
  sales_channel: Relation<SalesChannel>

  @FeatureFlagDecorators(
    [MedusaV2Flag.key, SalesChannelFeatureFlag.key],
    [
      ManyToMany(() => SalesChannel, { cascade: ["remove", "soft-remove"] }),
      JoinTable({
        name: "cart_sales_channel",
        joinColumn: {
          name: "cart_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "sales_channel_id",
          referencedColumnName: "id",
        },
      }),
    ]
  )
  sales_channels?: Relation<SalesChannel>[]

  shipping_total?: number
  discount_total?: number
  raw_discount_total?: number
  item_tax_total?: number | null
  shipping_tax_total?: number | null
  tax_total?: number | null
  refunded_total?: number
  total?: number
  subtotal?: number
  refundable_amount?: number
  gift_card_total?: number
  gift_card_tax_total?: number

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "cart")

    if (this.sales_channel_id || this.sales_channel) {
      this.sales_channels = [
        { id: this.sales_channel_id || this.sales_channel?.id },
      ] as SalesChannel[]
    }
  }

  /**
   * @apiIgnore
   */
  @BeforeUpdate()
  private beforeUpdate(): void {
    if (this.sales_channel_id || this.sales_channel) {
      this.sales_channels = [
        { id: this.sales_channel_id || this.sales_channel?.id },
      ] as SalesChannel[]
    }
  }

  /**
   * @apiIgnore
   */
  @AfterLoad()
  private afterLoad(): void {
    if (this.payment_sessions) {
      this.payment_session = this.payment_sessions.find((p) => p.is_selected)!
    }
    if (this.sales_channels) {
      this.sales_channel = this.sales_channels?.[0]
      this.sales_channel_id = this.sales_channel?.id
      delete this.sales_channels
    }
  }
}
