import {
  Entity,
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
import randomize from "randomatic"

import { Order } from "./order"
import { Swap } from "./swap"
import { ReturnItem } from "./return-item"
import { ShippingMethod } from "./shipping-method"

export enum ReturnStatus {
  REQUESTED = "requested",
  RECEIVED = "received",
  REQUIRES_ACTION = " requires_action",
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
    { cascade: true }
  )
  items: ReturnItem[]

  @Column({ nullable: true })
  swap_id: string

  @OneToOne(
    () => Swap,
    swap => swap.return_order
  )
  swap: Swap

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
    { cascade: true }
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

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `ret_${id}`
  }
}
