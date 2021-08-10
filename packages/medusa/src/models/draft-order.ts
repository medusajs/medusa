import {
  Entity,
  Generated,
  BeforeInsert,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"
import {
  resolveDbType,
  resolveDbGenerationStrategy,
  DbAwareColumn,
} from "../utils/db-aware-column"
import { manualAutoIncrement } from "../utils/manual-auto-increment"

import { Cart } from "./cart"
import { Order } from "./order"

enum DraftOrderStatus {
  OPEN = "open",
  COMPLETED = "completed",
}

@Entity()
export class DraftOrder {
  @PrimaryColumn()
  id: string

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

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at: Date

  @Column({ nullable: true })
  no_notification_order: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private async beforeInsert() {
    if (!this.id) {
      const id = ulid()
      this.id = `dorder_${id}`
    }

    if (process.env.NODE_ENV === "development" && !this.display_id) {
      this.display_id = await manualAutoIncrement("draft_order")
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
