import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToOne,
} from "typeorm"
import {
  DbAwareColumn,
  resolveDbGenerationStrategy,
  resolveDbType,
} from "../utils/db-aware-column"

import { BaseEntity } from "../interfaces/models/base-entity"
import { Cart } from "./cart"
import { Order } from "./order"
import { generateEntityId } from "../utils/generate-entity-id"
import { manualAutoIncrement } from "../utils/manual-auto-increment"

export enum DraftOrderStatus {
  OPEN = "open",
  COMPLETED = "completed",
}

@Entity()
export class DraftOrder extends BaseEntity {
  @DbAwareColumn({ type: "enum", enum: DraftOrderStatus, default: "open" })
  status: DraftOrderStatus

  @Index()
  @Column()
  @Generated(resolveDbGenerationStrategy("increment"))
  display_id: number

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @OneToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ nullable: true, type: resolveDbType("timestamptz") })
  canceled_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at: Date

  @Column({ nullable: true })
  no_notification_order: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "dorder")

    if (process.env.NODE_ENV === "development" && !this.display_id) {
      const disId = await manualAutoIncrement("draft_order")

      if (disId) {
        this.display_id = disId
      }
    }
  }
}

/**
 * @schema DraftOrder
 * title: "DraftOrder"
 * description: "Represents a draft order"
 * type: object
 * required:
 *   - canceled_at
 *   - cart_id
 *   - completed_at
 *   - created_at
 *   - display_id
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - no_notification_order
 *   - order_id
 *   - status
 *   - updated_at
 * properties:
 *   id:
 *     description: The draft order's ID
 *     type: string
 *     example: dorder_01G8TJFKBG38YYFQ035MSVG03C
 *   status:
 *     description: The status of the draft order
 *     type: string
 *     enum:
 *       - open
 *       - completed
 *     default: open
 *   display_id:
 *     description: The draft order's display ID
 *     type: string
 *     example: 2
 *   cart_id:
 *     description: The ID of the cart associated with the draft order.
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   order_id:
 *     description: The ID of the order associated with the draft order.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   canceled_at:
 *     description: The date the draft order was canceled at.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   completed_at:
 *     description: The date the draft order was completed at.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   no_notification_order:
 *     description: Whether to send the customer notifications regarding order updates.
 *     nullable: true
 *     type: boolean
 *     example: false
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of the cart associated with the draft order in case of failure.
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
