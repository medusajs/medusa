import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToOne,
} from "typeorm"
import { BaseEntity } from "../interfaces/models/base-entity"
import {
  DbAwareColumn,
  resolveDbGenerationStrategy,
  resolveDbType,
} from "../utils/db-aware-column"
import { manualAutoIncrement } from "../utils/manual-auto-increment"
import { Cart } from "./cart"
import { Order } from "./order"
import { generateEntityId } from "../utils/generate-entity-id"

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
 * @schema draft-order
 * title: "DraftOrder"
 * description: "Represents a draft order"
 * x-resourceId: draft-order
 * properties:
 *   id:
 *     type: string
 *   status:
 *     type: string
 *     enum:
 *       - open
 *       - completed
 *   display_id:
 *     type: string
 *   cart_id:
 *     type: string
 *   cart:
 *     anyOf:
 *       - $ref: "#/components/schemas/cart"
 *   order_id:
 *     type: string
 *   order:
 *     anyOf:
 *       - $ref: "#/components/schemas/order"
 *   canceled_at:
 *     type: string
 *     format: date-time
 *   created_at:
 *     type: string
 *     format: date-time
 *   update_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   completed_at:
 *     type: string
 *     format: date-time
 *   no_notification_order:
 *     type: boolean
 *   metadata:
 *     type: object
 *   idempotency_key:
 *     type: string
 */
