import {
  Entity,
  Index,
  RelationId,
  BeforeInsert,
  Column,
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
import { Swap } from "./swap"
import { ClaimOrder } from "./claim-order"
import { ReturnItem } from "./return-item"
import { ShippingMethod } from "./shipping-method"

export enum ReturnStatus {
  REQUESTED = "requested",
  RECEIVED = "received",
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class Return {
  @PrimaryColumn()
  id: string

  @Column({ type: "enum", enum: ReturnStatus, default: ReturnStatus.REQUESTED })
  status: ReturnStatus

  @OneToMany(
    () => ReturnItem,
    item => item.return_order,
    { eager: true, cascade: ["insert"] }
  )
  items: ReturnItem[]

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @OneToOne(
    () => Swap,
    swap => swap.return_order
  )
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @OneToOne(
    () => ClaimOrder,
    co => co.return_order
  )
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(
    () => Order,
    o => o.returns
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToOne(
    () => ShippingMethod,
    method => method.return_order,
    { eager: true, cascade: true }
  )
  shipping_method: ShippingMethod

  @Column({ type: "jsonb", nullable: true })
  shipping_data: any

  @Column({ type: "int" })
  refund_amount: number

  @Column({ type: "timestamptz", nullable: true })
  received_at: Date

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
    this.id = `ret_${id}`
  }
}
