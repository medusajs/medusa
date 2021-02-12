import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { Swap } from "./swap"
import { Currency } from "./currency"
import { Cart } from "./cart"
import { Order } from "./order"
import { DraftOrder } from "./draft-order"

@Entity()
export class Payment {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @OneToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(
    () => Order,
    order => order.payments
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column({ nullable: true })
  draft_order_id: string

  @OneToOne(() => DraftOrder)
  @JoinColumn({ name: "draft_order_id" })
  draft_order: DraftOrder

  @Column({ type: "int" })
  amount: number

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "int", default: 0 })
  amount_refunded: number

  @Index()
  @Column()
  provider_id: string

  @Column({ type: "jsonb" })
  data: any

  @Column({ type: "timestamptz", nullable: true })
  captured_at: Date

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
    this.id = `pay_${id}`
  }
}
