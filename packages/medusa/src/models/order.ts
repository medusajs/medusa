import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm"
import {
  DbAwareColumn,
  resolveDbGenerationStrategy,
  resolveDbType,
} from "../utils/db-aware-column"
import {
  FeatureFlagColumn,
  FeatureFlagDecorators,
} from "../utils/feature-flag-decorators"

import { Address } from "./address"
import { BaseEntity } from "../interfaces/models/base-entity"
import { Cart } from "./cart"
import { ClaimOrder } from "./claim-order"
import { Currency } from "./currency"
import { Customer } from "./customer"
import { Discount } from "./discount"
import { DraftOrder } from "./draft-order"
import { Fulfillment } from "./fulfillment"
import { GiftCard } from "./gift-card"
import { GiftCardTransaction } from "./gift-card-transaction"
import { LineItem } from "./line-item"
import { Payment } from "./payment"
import { Refund } from "./refund"
import { Region } from "./region"
import { Return } from "./return"
import { SalesChannel } from "./sales-channel"
import { ShippingMethod } from "./shipping-method"
import { Swap } from "./swap"
import { generateEntityId } from "../utils/generate-entity-id"
import { manualAutoIncrement } from "../utils/manual-auto-increment"
import { OrderEdit } from "./order-edit"
import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  ARCHIVED = "archived",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  PARTIALLY_SHIPPED = "partially_shipped",
  SHIPPED = "shipped",
  PARTIALLY_RETURNED = "partially_returned",
  RETURNED = "returned",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class Order extends BaseEntity {
  readonly object = "order"

  @DbAwareColumn({ type: "enum", enum: OrderStatus, default: "pending" })
  status: OrderStatus

  @DbAwareColumn({
    type: "enum",
    enum: FulfillmentStatus,
    default: "not_fulfilled",
  })
  fulfillment_status: FulfillmentStatus

  @DbAwareColumn({ type: "enum", enum: PaymentStatus, default: "not_paid" })
  payment_status: PaymentStatus

  @Index()
  @Column()
  @Generated(resolveDbGenerationStrategy("increment"))
  display_id: number

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column()
  customer_id: string

  @ManyToOne(() => Customer, { cascade: ["insert"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  email: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "real", nullable: true })
  tax_rate: number | null

  @ManyToMany(() => Discount, { cascade: ["insert"] })
  @JoinTable({
    name: "order_discounts",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Discount[]

  @ManyToMany(() => GiftCard, { cascade: ["insert"] })
  @JoinTable({
    name: "order_gift_cards",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "gift_card_id",
      referencedColumnName: "id",
    },
  })
  gift_cards: GiftCard[]

  @OneToMany(() => ShippingMethod, (method) => method.order, {
    cascade: ["insert"],
  })
  shipping_methods: ShippingMethod[]

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: ["insert"] })
  payments: Payment[]

  @OneToMany(() => Fulfillment, (fulfillment) => fulfillment.order, {
    cascade: ["insert"],
  })
  fulfillments: Fulfillment[]

  @OneToMany(() => Return, (ret) => ret.order, { cascade: ["insert"] })
  returns: Return[]

  @OneToMany(() => ClaimOrder, (co) => co.order, { cascade: ["insert"] })
  claims: ClaimOrder[]

  @OneToMany(() => Refund, (ref) => ref.order, { cascade: ["insert"] })
  refunds: Refund[]

  @OneToMany(() => Swap, (swap) => swap.order, { cascade: ["insert"] })
  swaps: Swap[]

  @Column({ nullable: true })
  draft_order_id: string

  @OneToOne(() => DraftOrder)
  @JoinColumn({ name: "draft_order_id" })
  draft_order: DraftOrder

  @FeatureFlagDecorators(OrderEditingFeatureFlag.key, [
    OneToMany(
      () => OrderEdit,
      (oe) => oe.order
    ),
  ])
  edits: OrderEdit[]

  @OneToMany(() => LineItem, (lineItem) => lineItem.order, {
    cascade: ["insert"],
  })
  items: LineItem[]

  @OneToMany(() => GiftCardTransaction, (gc) => gc.order)
  gift_card_transactions: GiftCardTransaction[]

  @Column({ nullable: true, type: resolveDbType("timestamptz") })
  canceled_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ type: "boolean", nullable: true })
  no_notification: boolean

  @Column({ nullable: true })
  idempotency_key: string

  @Column({ type: "varchar", nullable: true })
  external_id: string | null

  @FeatureFlagColumn("sales_channels", { type: "varchar", nullable: true })
  sales_channel_id: string | null

  @FeatureFlagDecorators("sales_channels", [
    ManyToOne(() => SalesChannel),
    JoinColumn({ name: "sales_channel_id" }),
  ])
  sales_channel: SalesChannel

  // Total fields
  shipping_total: number
  discount_total: number
  tax_total: number | null
  refunded_total: number
  total: number
  subtotal: number
  paid_total: number
  refundable_amount: number
  gift_card_total: number
  gift_card_tax_total: number

  @BeforeInsert()
  private async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "order")

    if (process.env.NODE_ENV === "development" && !this.display_id) {
      const disId = await manualAutoIncrement("order")

      if (disId) {
        this.display_id = disId
      }
    }
  }
}

/**
 * @schema order
 * title: "Order"
 * description: "Represents an order"
 * x-resourceId: order
 * required:
 *   - customer_id
 *   - email
 *   - region_id
 *   - currency_code
 * properties:
 *   id:
 *     type: string
 *     description: The order's ID
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   status:
 *     type: string
 *     description: The order's status
 *     enum:
 *       - pending
 *       - completed
 *       - archived
 *       - canceled
 *       - requires_action
 *     default: pending
 *   fulfillment_status:
 *     type: string
 *     description: The order's fulfillment status
 *     enum:
 *       - not_fulfilled
 *       - partially_fulfilled
 *       - fulfilled
 *       - partially_shipped
 *       - shipped
 *       - partially_returned
 *       - returned
 *       - canceled
 *       - requires_action
 *     default: not_fulfilled
 *   payment_status:
 *     type: string
 *     description: The order's payment status
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - captured
 *       - partially_refunded
 *       - refuneded
 *       - canceled
 *       - requires_action
 *     default: not_paid
 *   display_id:
 *     type: integer
 *     description: The order's display ID
 *     example: 2
 *   cart_id:
 *     type: string
 *     description: The ID of the cart associated with the order
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   customer_id:
 *     type: string
 *     description: The ID of the customer associated with the order
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   customer:
 *     description: A customer object. Available if the relation `customer` is expanded.
 *     type: object
 *   email:
 *     description: The email associated with the order
 *     type: string
 *     format: email
 *   billing_address_id:
 *     type: string
 *     description: The ID of the billing address associated with the order
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   billing_address:
 *     description: Available if the relation `billing_address` is expanded.
 *     $ref: "#/components/schemas/address"
 *   shipping_address_id:
 *     type: string
 *     description: The ID of the shipping address associated with the order
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   shipping_address:
 *     description: Available if the relation `shipping_address` is expanded.
 *     $ref: "#/components/schemas/address"
 *   region_id:
 *     type: string
 *     description: The region's ID
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     type: object
 *   currency_code:
 *     description: "The 3 character currency code that is used in the order"
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   currency:
 *     description: Available if the relation `currency` is expanded.
 *     $ref: "#/components/schemas/currency"
 *   tax_rate:
 *     description: The order's tax rate
 *     type: number
 *     example: 0
 *   discounts:
 *     type: array
 *     description: The discounts used in the order. Available if the relation `discounts` is expanded.
 *     items:
 *       type: object
 *       description: A discount object.
 *   gift_cards:
 *     type: array
 *     description: The gift cards used in the order. Available if the relation `gift_cards` is expanded.
 *     items:
 *       type: object
 *       description: A gift card object.
 *   shipping_methods:
 *     type: array
 *     description: The shipping methods used in the order. Available if the relation `shipping_methods` is expanded.
 *     items:
 *       $ref: "#/components/schemas/shipping_method"
 *   payments:
 *     type: array
 *     description: The payments used in the order. Available if the relation `payments` is expanded.
 *     items:
 *       $ref: "#/components/schemas/payment"
 *   fulfillments:
 *     type: array
 *     description: The fulfillments used in the order. Available if the relation `fulfillments` is expanded.
 *     items:
 *       $ref: "#/components/schemas/fulfillment"
 *   returns:
 *     type: array
 *     description: The returns associated with the order. Available if the relation `returns` is expanded.
 *     items:
 *       type: object
 *       description: A return object.
 *   claims:
 *     type: array
 *     description: The claims associated with the order. Available if the relation `claims` is expanded.
 *     items:
 *       type: object
 *       description: A claim order object.
 *   refunds:
 *     type: array
 *     description: The refunds associated with the order. Available if the relation `refunds` is expanded.
 *     items:
 *       type: object
 *       description: A refund object.
 *   swaps:
 *     type: array
 *     description: The swaps associated with the order. Available if the relation `swaps` is expanded.
 *     items:
 *       type: object
 *       description: A swap object.
 *   draft_order_id:
 *     type: string
 *     description: The ID of the draft order this order is associated with.
 *     example: null
 *   draft_order:
 *     description: A draft order object. Available if the relation `draft_order` is expanded.
 *     type: object
 *   items:
 *     type: array
 *     description: The line items that belong to the order. Available if the relation `items` is expanded.
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   edits:
 *     type: array
 *     description: "[EXPERIMENTAL] Order edits done on the order. Available if the relation `edits` is expanded."
 *     items:
 *       $ref: "#/components/schemas/order_edit"
 *   gift_card_transactions:
 *     type: array
 *     description: The gift card transactions used in the order. Available if the relation `gift_card_transactions` is expanded.
 *     items:
 *       $ref: "#/components/schemas/gift_card_transaction"
 *   canceled_at:
 *     type: string
 *     description: The date the order was canceled on.
 *     format: date-time
 *   no_notification:
 *     description: "Flag for describing whether or not notifications related to this should be send."
 *     type: boolean
 *     example: false
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the processing of the order in case of failure.
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
 *   external_id:
 *     description: The ID of an external order.
 *     type: string
 *     example: null
 *   sales_channel_id:
 *     type: string
 *     description: The ID of the sales channel this order is associated with.
 *     example: null
 *   sales_channel:
 *     description: A sales channel object. Available if the relation `sales_channel` is expanded.
 *     type: object
 *   shipping_total:
 *     type: integer
 *     description: The total of shipping
 *     example: 1000
 *   discount_total:
 *     type: integer
 *     description: The total of discount
 *     example: 800
 *   tax_total:
 *     type: integer
 *     description: The total of tax
 *     example: 0
 *   refunded_total:
 *     type: integer
 *     description: The total amount refunded if the order is returned.
 *     example: 0
 *   total:
 *     type: integer
 *     description: The total amount of the order
 *     example: 8200
 *   subtotal:
 *     type: integer
 *     description: The subtotal of the order
 *     example: 8000
 *   paid_total:
 *     type: integer
 *     description: The total amount paid
 *     example: 8000
 *   refundable_amount:
 *     type: integer
 *     description: The amount that can be refunded
 *     example: 8200
 *   gift_card_total:
 *     type: integer
 *     description: The total of gift cards
 *     example: 0
 *   gift_card_tax_total:
 *     type: integer
 *     description: The total of gift cards with taxes
 *     example: 0
 */
