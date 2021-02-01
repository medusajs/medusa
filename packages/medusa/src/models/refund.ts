import {
  Entity,
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

import { Currency } from "./currency"
import { Cart } from "./cart"
import { Order } from "./order"

export enum RefundReason {
  DISCOUNT = "discount",
  RETURN = "return",
  SWAP = "swap",
  CLAIM = "claim",
  OTHER = "other",
}

@Entity()
export class Refund {
  @PrimaryColumn()
  id: string

  @Column()
  order_id: string

  @ManyToOne(
    () => Order,
    order => order.payments
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ type: "int" })
  amount: number

  @Column({ nullable: true })
  note: string

  @Column({ type: "enum", enum: RefundReason })
  reason: string

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
    const id = ulid()
    this.id = `ref_${id}`
  }
}
