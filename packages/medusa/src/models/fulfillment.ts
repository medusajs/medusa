import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { BaseEntity } from "../interfaces/models/base-entity"
import { ClaimOrder } from "./claim-order"
import { FulfillmentItem } from "./fulfillment-item"
import { FulfillmentProvider } from "./fulfillment-provider"
import { Order } from "./order"
import { Swap } from "./swap"
import { TrackingLink } from "./tracking-link"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Fulfillment extends BaseEntity {
  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(() => ClaimOrder, (co) => co.fulfillments)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap, (swap) => swap.fulfillments)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order, (o) => o.fulfillments)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ type: "boolean", nullable: true })
  no_notification: boolean

  @Index()
  @Column()
  provider_id: string

  @Column({ nullable: true, type: "text" })
  location_id: string | null

  @ManyToOne(() => FulfillmentProvider)
  @JoinColumn({ name: "provider_id" })
  provider: FulfillmentProvider

  @OneToMany(() => FulfillmentItem, (i) => i.fulfillment, {
    eager: true,
    cascade: true,
  })
  items: FulfillmentItem[]

  @OneToMany(() => TrackingLink, (tl) => tl.fulfillment, {
    cascade: ["insert"],
  })
  tracking_links: TrackingLink[]

  @DbAwareColumn({ type: "jsonb", default: [] })
  tracking_numbers: string[]

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  shipped_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ful")
  }
}

/**
 * @schema Fulfillment
 * title: "Fulfillment"
 * description: "Fulfillments are created once store operators can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a provider, which is typically an external shipping aggregator, shipping partner og 3PL, most plugins will have asynchronous communications with these providers through webhooks in order to automatically update and synchronize the state of Fulfillments."
 * type: object
 * required:
 *   - canceled_at
 *   - claim_order_id
 *   - created_at
 *   - data
 *   - id
 *   - idempotency_key
 *   - location_id
 *   - metadata
 *   - no_notification
 *   - order_id
 *   - provider_id
 *   - shipped_at
 *   - swap_id
 *   - tracking_numbers
 *   - updated_at
 * properties:
 *   id:
 *     description: The fulfillment's ID
 *     type: string
 *     example: ful_01G8ZRTMQCA76TXNAT81KPJZRF
 *   claim_order_id:
 *     description: The id of the Claim that the Fulfillment belongs to.
 *     nullable: true
 *     type: string
 *     example: null
 *   claim_order:
 *     description: A claim order object. Available if the relation `claim_order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimOrder"
 *   swap_id:
 *     description: The id of the Swap that the Fulfillment belongs to.
 *     nullable: true
 *     type: string
 *     example: null
 *   swap:
 *     description: A swap object. Available if the relation `swap` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Swap"
 *   order_id:
 *     description: The id of the Order that the Fulfillment belongs to.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   provider_id:
 *     description: The id of the Fulfillment Provider responsible for handling the fulfillment
 *     type: string
 *     example: manual
 *   provider:
 *     description: Available if the relation `provider` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/FulfillmentProvider"
 *   location_id:
 *     description: The id of the stock location the fulfillment will be shipped from
 *     nullable: true
 *     type: string
 *     example: sloc_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   items:
 *     description: The Fulfillment Items in the Fulfillment - these hold information about how many of each Line Item has been fulfilled. Available if the relation `items` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/FulfillmentItem"
 *   tracking_links:
 *     description: The Tracking Links that can be used to track the status of the Fulfillment, these will usually be provided by the Fulfillment Provider. Available if the relation `tracking_links` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/TrackingLink"
 *   tracking_numbers:
 *     description: The tracking numbers that can be used to track the status of the fulfillment.
 *     deprecated: true
 *     type: array
 *     items:
 *       type: string
 *   data:
 *     description: This contains all the data necessary for the Fulfillment provider to handle the fulfillment.
 *     type: object
 *     example: {}
 *   shipped_at:
 *     description: The date with timezone at which the Fulfillment was shipped.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   no_notification:
 *     description: Flag for describing whether or not notifications related to this should be sent.
 *     nullable: true
 *     type: boolean
 *     example: false
 *   canceled_at:
 *     description: The date with timezone at which the Fulfillment was canceled.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of the fulfillment in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/modules/carts-and-checkout/cart.md#idempotency-key
 *       description: Learn more how to use the idempotency key.
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
