import {
  Entity,
  RelationId,
  BeforeInsert,
  Column,
  Index,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Order } from "./order"
import { FulfillmentProvider } from "./fulfillment-provider"
import { FulfillmentItem } from "./fulfillment-item"
import { Swap } from "./swap"
import { ClaimOrder } from "./claim-order"
import { TrackingLink } from "./tracking-link"

@Entity()
export class Fulfillment {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(
    () => ClaimOrder,
    co => co.fulfillments
  )
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(
    () => Swap,
    swap => swap.fulfillments
  )
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(
    () => Order,
    o => o.fulfillments
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column()
  provider_id: string

  @ManyToOne(() => FulfillmentProvider)
  @JoinColumn({ name: "provider_id" })
  provider: FulfillmentProvider

  @OneToMany(
    () => FulfillmentItem,
    i => i.fulfillment,
    { eager: true, cascade: true }
  )
  items: FulfillmentItem[]

  @OneToMany(
    () => TrackingLink,
    tl => tl.fulfillment,
    { cascade: ["insert"] }
  )
  tracking_links: TrackingLink[]

  @Column({ type: "jsonb", default: [] })
  tracking_numbers: string[]

  @Column({ type: "jsonb" })
  data: any

  @Column({ type: "timestamptz", nullable: true })
  shipped_at: Date

  @Column({ type: "timestamptz", nullable: true })
  canceled_at: Date

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `ful_${id}`
  }
}

/**
 * @schema fulfillment
 * title: "Fulfillment"
 * description: "Fulfillments are created once store operators can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a provider, which is typically an external shipping aggregator, shipping partner og 3PL, most plugins will have asynchronous communications with these providers through webhooks in order to automatically update and synchronize the state of Fulfillments."
 * x-resourceId: fulfillment
 * properties:
 *   id:
 *     description: "The id of the Fulfillment. This value will be prefixed by `ful_`."
 *     type: string
 *   claim_order_id:
 *     description: "The id of the Claim that the Fulfillment belongs to."
 *     type: string
 *   swap_id:
 *     description: "The id of the Swap that the Fulfillment belongs to."
 *     type: string
 *   order_id:
 *     description: "The id of the Order that the Fulfillment belongs to."
 *     type: string
 *   provider_id:
 *     description: "The id of the Fulfillment Provider responsible for handling the fulfillment"
 *     type: string
 *   items:
 *     description: "The Fulfillment Items in the Fulfillment - these hold information about how many of each Line Item has been fulfilled."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/fulfillment_item"
 *   tracking_links:
 *     description: "The Tracking Links that can be used to track the status of the Fulfillment, these will usually be provided by the Fulfillment Provider."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/tracking_link"
 *   tracking_numbers:
 *     deprecated: true
 *     description: "The tracking numbers that can be used to track the status of the fulfillment."
 *     type: array
 *     items:
 *       type: string
 *   shipped_at:
 *     description: "The date with timezone at which the Fulfillment was shipped."
 *     type: string
 *     format: date-time
 *   canceled_at:
 *     description: "The date with timezone at which the Fulfillment was canceled."
 *     type: string
 *     format: date-time
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
